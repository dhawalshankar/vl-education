import { cleanup, renderHook, act, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useUserStreak, recordDailyActivity, getUserStreak, getStreakStorageKey } from "./streak";
import { userAPI } from "@/app/lib/api";

vi.mock("@/app/lib/api", () => ({
  userAPI: {
    getStreak: vi.fn(),
    recordStreakHeartbeat: vi.fn(),
  },
}));

describe("User Streak cross-device sync", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("hydrates from local storage immediately then syncs from backend heartbeat", async () => {
    const userEmail = "dhawal@vartalang.in";
    const key = getStreakStorageKey(userEmail);

    // Initial local storage has streak of 3
    localStorage.setItem(
      key,
      JSON.stringify({
        currentStreak: 3,
        longestStreak: 5,
        lastVisitDate: "2026-11-21",
        totalDaysActive: 10,
        history: ["2026-11-21"],
      })
    );

    // Backend returns updated cross-device streak of 7
    vi.mocked(userAPI.recordStreakHeartbeat).mockResolvedValueOnce({
      currentStreak: 7,
      longestStreak: 7,
      lastVisitDate: "2026-11-22",
      totalDaysActive: 15,
      history: ["2026-11-21", "2026-11-22"],
    });

    const { result } = renderHook(() => useUserStreak(userEmail, true));

    // Initially matches local storage
    expect(result.current.streak.currentStreak).toBe(3);

    // After backend responds, updates state and local storage
    await waitFor(() => {
      expect(result.current.streak.currentStreak).toBe(7);
      expect(result.current.streak.longestStreak).toBe(7);
      expect(result.current.streak.totalDaysActive).toBe(15);
      expect(result.current.streak.totalActiveDays).toBe(15);
    });

    // Check localStorage was also updated for offline fallback
    const stored = JSON.parse(localStorage.getItem(key)!);
    expect(stored.currentStreak).toBe(7);
    expect(stored.totalDaysActive).toBe(15);
  });

  it("handles offline or backend errors without crashing or losing local streak", async () => {
    const userEmail = "dhawal@vartalang.in";
    const key = getStreakStorageKey(userEmail);

    localStorage.setItem(
      key,
      JSON.stringify({
        currentStreak: 4,
        longestStreak: 6,
        lastVisitDate: "2026-11-22",
        totalDaysActive: 12,
        history: ["2026-11-22"],
      })
    );

    // Backend returns null or rejects (e.g. offline)
    vi.mocked(userAPI.recordStreakHeartbeat).mockResolvedValueOnce(null);

    const { result } = renderHook(() => useUserStreak(userEmail, true));

    expect(result.current.streak.currentStreak).toBe(4);
    expect(result.current.streak.totalDaysActive).toBe(12);

    // Still intact in localStorage
    const stored = getUserStreak(userEmail);
    expect(stored.currentStreak).toBe(4);
  });

  it("syncs backend asynchronously during recordDailyActivity", async () => {
    const userEmail = "dhawal@vartalang.in";
    vi.mocked(userAPI.recordStreakHeartbeat).mockResolvedValueOnce({
      currentStreak: 2,
      longestStreak: 2,
      lastVisitDate: "2026-11-22",
      totalDaysActive: 2,
      history: ["2026-11-22"],
    });

    act(() => {
      recordDailyActivity(userEmail);
    });

    expect(userAPI.recordStreakHeartbeat).toHaveBeenCalled();
  });
});
