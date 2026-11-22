"use client";

import { useEffect, useState, useCallback } from "react";
import { userAPI } from "@/app/lib/api";

/**
 * ── Client & Backend Synchronized Streak Tracker ────────────────────────
 * Tracks learner presence, consecutive daily visits, and streaks.
 * Synchronizes across devices via the backend /api/v1/users/streak/heartbeat API,
 * while maintaining responsive offline/localStorage caching as a fallback.
 */
export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string; // "YYYY-MM-DD"
  totalDaysActive: number;
  totalActiveDays?: number; // alias for totalDaysActive to support UI consumers
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

/** Normalizes raw or server streak data into a safe UserStreak record */
export function normalizeStreak(data: {
  currentStreak?: number;
  longestStreak?: number;
  lastVisitDate?: string;
  totalDaysActive?: number;
  totalActiveDays?: number;
  history?: string[];
}): UserStreak {
  const activeDays = data.totalDaysActive ?? data.totalActiveDays ?? 1;
  const today = formatLocalDate();
  return {
    currentStreak: Math.max(1, data.currentStreak || 1),
    longestStreak: Math.max(1, data.longestStreak || 1),
    lastVisitDate: data.lastVisitDate || today,
    totalDaysActive: activeDays,
    totalActiveDays: activeDays,
    history: Array.isArray(data.history) && data.history.length > 0 ? data.history : [today],
  };
}

/** Reads streak for the given user, or initializes it if not found */
export function getUserStreak(userEmailOrId?: string | null): UserStreak {
  if (typeof window === "undefined") {
    const today = formatLocalDate();
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastVisitDate: today,
      totalDaysActive: 1,
      totalActiveDays: 1,
      history: [today],
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
      totalActiveDays: 1,
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
    return normalizeStreak(parsed);
  } catch {
    const today = formatLocalDate();
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastVisitDate: today,
      totalDaysActive: 1,
      totalActiveDays: 1,
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
    updated = normalizeStreak({
      ...current,
      lastVisitDate: today,
      history: current.history.includes(today) ? current.history : [...current.history, today],
    });
  } else if (diff === 1) {
    // Visited yesterday: streak continues!
    const newStreak = current.currentStreak + 1;
    updated = normalizeStreak({
      currentStreak: newStreak,
      longestStreak: Math.max(current.longestStreak, newStreak),
      lastVisitDate: today,
      totalDaysActive: current.totalDaysActive + 1,
      history: [...current.history, today].slice(-30), // keep last 30 days
    });
  } else if (diff > 1) {
    // Missed a day or more: reset streak to 1, start new streak today
    updated = normalizeStreak({
      currentStreak: 1,
      longestStreak: current.longestStreak,
      lastVisitDate: today,
      totalDaysActive: current.totalDaysActive + 1,
      history: [...current.history, today].slice(-30),
    });
  }

  try {
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(STREAK_EVENT, { detail: { key, streak: updated } }));
  } catch {
    // ignore
  }

  // Asynchronously record heartbeat with backend when online to sync across devices
  if (typeof window !== "undefined" && userEmailOrId) {
    userAPI
      .recordStreakHeartbeat(today)
      .then((serverStreak) => {
        if (!serverStreak) return;
        const synced = normalizeStreak(serverStreak);
        try {
          localStorage.setItem(key, JSON.stringify(synced));
          window.dispatchEvent(new CustomEvent(STREAK_EVENT, { detail: { key, streak: synced } }));
        } catch {
          // ignore
        }
      })
      .catch(() => {
        // network failure, local state remains
      });
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
          totalActiveDays: 0,
          history: [],
        }
  );

  const syncBackend = useCallback(async () => {
    if (!enabled || !userEmailOrId) return;
    try {
      const today = formatLocalDate();
      const serverStreak = await userAPI.recordStreakHeartbeat(today);
      if (serverStreak) {
        const synced = normalizeStreak(serverStreak);
        const key = getStreakStorageKey(userEmailOrId);
        try {
          localStorage.setItem(key, JSON.stringify(synced));
        } catch {
          // ignore
        }
        setStreak(synced);
        window.dispatchEvent(new CustomEvent(STREAK_EVENT, { detail: { key, streak: synced } }));
      }
    } catch {
      // ignore
    }
  }, [enabled, userEmailOrId]);

  const refreshStreak = useCallback(() => {
    if (!enabled || !userEmailOrId) return;
    const updated = recordDailyActivity(userEmailOrId);
    setStreak(updated);
  }, [enabled, userEmailOrId]);

  useEffect(() => {
    if (!enabled || !userEmailOrId) {
      return;
    }

    // Hydrate immediately from local cache
    setStreak(getUserStreak(userEmailOrId));

    // Sync across devices via backend heartbeat
    syncBackend();

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
  }, [enabled, userEmailOrId, syncBackend]);

  return { streak, recordActivity: refreshStreak, syncBackend };
}
