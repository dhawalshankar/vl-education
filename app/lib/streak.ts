"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * ── Client-side Streak Tracker ──────────────────────────────────────────
 * TODO: Connect to backend API: POST /api/v1/users/streak/heartbeat
 * Currently, streak history is maintained in browser localStorage as a fallback.
 * When the backend streak service is ready, replace/hydrate localStorage with
 * the database-backed user activity record so streaks persist across devices.
 */
export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string; // "YYYY-MM-DD"
  totalDaysActive: number;
  history: string[]; // ["YYYY-MM-DD", ...]
}

const STREAK_EVENT = "vl-streak-updated";

/** Formats a date into a clean local "YYYY-MM-DD" string */
export function formatLocalDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Computes the whole calendar day difference between dateA and dateB */
export function getCalendarDayDiff(fromDateStr: string, toDateStr: string): number {
  if (!fromDateStr || !toDateStr) return 999;
  const [y1, m1, d1] = fromDateStr.split("-").map(Number);
  const [y2, m2, d2] = toDateStr.split("-").map(Number);
  const date1 = new Date(y1, m1 - 1, d1).getTime();
  const date2 = new Date(y2, m2 - 1, d2).getTime();
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((date2 - date1) / msPerDay);
}

/** Generates a safe, user-scoped storage key */
export function getStreakStorageKey(userEmailOrId?: string | null): string {
  if (!userEmailOrId) return "vl-streak-guest";
  const safeId = userEmailOrId.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return `vl-streak-${safeId}`;
}

/** Reads streak for the given user, or initializes it if not found */
export function getUserStreak(userEmailOrId?: string | null): UserStreak {
  if (typeof window === "undefined") {
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastVisitDate: formatLocalDate(),
      totalDaysActive: 1,
      history: [formatLocalDate()],
    };
  }

  const key = getStreakStorageKey(userEmailOrId);
  const raw = localStorage.getItem(key);

  if (!raw) {
    const today = formatLocalDate();
    const initial: UserStreak = {
      currentStreak: 1,
      longestStreak: 1,
      lastVisitDate: today,
      totalDaysActive: 1,
      history: [today],
    };
    try {
      localStorage.setItem(key, JSON.stringify(initial));
    } catch {
      // ignore storage errors
    }
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      currentStreak: Math.max(1, parsed.currentStreak || 1),
      longestStreak: Math.max(1, parsed.longestStreak || 1),
      lastVisitDate: parsed.lastVisitDate || formatLocalDate(),
      totalDaysActive: Math.max(1, parsed.totalDaysActive || 1),
      history: Array.isArray(parsed.history) ? parsed.history : [formatLocalDate()],
    };
  } catch {
    const today = formatLocalDate();
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastVisitDate: today,
      totalDaysActive: 1,
      history: [today],
    };
  }
}

/** Records activity for today, updating the streak if a day has passed */
export function recordDailyActivity(userEmailOrId?: string | null): UserStreak {
  if (typeof window === "undefined") {
    return getUserStreak(userEmailOrId);
  }

  const key = getStreakStorageKey(userEmailOrId);
  const current = getUserStreak(userEmailOrId);
  const today = formatLocalDate();
  const diff = getCalendarDayDiff(current.lastVisitDate, today);

  let updated: UserStreak = { ...current };

  if (diff === 0) {
    // Already logged in today: preserve current streak
    updated = {
      ...current,
      lastVisitDate: today,
      history: current.history.includes(today) ? current.history : [...current.history, today],
    };
  } else if (diff === 1) {
    // Visited yesterday: streak continues!
    const newStreak = current.currentStreak + 1;
    updated = {
      currentStreak: newStreak,
      longestStreak: Math.max(current.longestStreak, newStreak),
      lastVisitDate: today,
      totalDaysActive: current.totalDaysActive + 1,
      history: [...current.history, today].slice(-30), // keep last 30 days
    };
  } else if (diff > 1) {
    // Missed a day or more: reset streak to 1, start new streak today
    updated = {
      currentStreak: 1,
      longestStreak: current.longestStreak,
      lastVisitDate: today,
      totalDaysActive: current.totalDaysActive + 1,
      history: [...current.history, today].slice(-30),
    };
  }

  try {
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(STREAK_EVENT, { detail: { key, streak: updated } }));
  } catch {
    // ignore
  }

  return updated;
}

/** React hook for managing and observing user streak */
export function useUserStreak(userEmailOrId?: string | null, enabled = true) {
  const [streak, setStreak] = useState<UserStreak>(() =>
    enabled && userEmailOrId
      ? getUserStreak(userEmailOrId)
      : {
          currentStreak: 0,
          longestStreak: 0,
          lastVisitDate: "",
          totalDaysActive: 0,
          history: [],
        }
  );

  const refreshStreak = useCallback(() => {
    if (!enabled || !userEmailOrId) return;
    const updated = recordDailyActivity(userEmailOrId);
    setStreak(updated);
  }, [enabled, userEmailOrId]);

  useEffect(() => {
    if (!enabled || !userEmailOrId) {
      return;
    }

    refreshStreak();

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (!custom.detail?.key || custom.detail.key === getStreakStorageKey(userEmailOrId)) {
        if (custom.detail?.streak) {
          setStreak(custom.detail.streak);
        } else {
          setStreak(getUserStreak(userEmailOrId));
        }
      }
    };

    window.addEventListener(STREAK_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(STREAK_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [enabled, userEmailOrId, refreshStreak]);

  return { streak, recordActivity: refreshStreak };
}
