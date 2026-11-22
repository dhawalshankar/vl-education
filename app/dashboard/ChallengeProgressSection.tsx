"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
  HelpCircle,
  Lock,
  Medal,
  Shield,
  Sparkles,
  Sword,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { ChallengeProgressStats, challengeAPI } from "@/app/lib/api";
import { getUserStreak } from "@/app/lib/streak";
import { useAuth } from "@/app/context/AuthContext";

export function ChallengeProgressSection() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ChallengeProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    challengeAPI
      .progress()
      .then((data) => {
        if (isMounted) setProgress(data);
      })
      .catch(() => {
        // Fallback progress state if API is offline
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Read local streak & local completed challenges as hydration fallback
  const localStats = useMemo(() => {
    try {
      const s = getUserStreak(user?.email);
      const raw = localStorage.getItem("vl_completed_challenges");
      const completed: string[] = raw ? JSON.parse(raw) : [];
      return {
        activeStreak: s.currentStreak || 1,
        longestStreak: s.longestStreak || 1,
        totalActiveDays: s.totalDaysActive || 1,
        completedCount: completed.length,
        history: s.history || [],
      };
    } catch {
      return {
        activeStreak: 1,
        longestStreak: 1,
        totalActiveDays: 1,
        completedCount: 0,
        history: [],
      };
    }
  }, [user]);

  const totalCompleted = Math.max(progress?.total_completed || 0, localStats.completedCount);
  const activeStreak = Math.max(progress?.active_streak || 1, localStats.activeStreak);
  const maxStreak = Math.max(progress?.max_streak || 1, localStats.longestStreak);
  const activeDays = Math.max(progress?.total_active_days || 1, localStats.totalActiveDays);
  const totalChallenges = progress?.total_challenges || 744;

  const beginner = progress?.beginner_completed || Math.min(totalCompleted, 5);
  const intermediate = progress?.intermediate_completed || Math.max(0, totalCompleted - beginner);
  const advanced = progress?.advanced_completed || 0;

  // Build 52-week activity grid (364 days)
  const activityTiles = useMemo(() => {
    if (progress?.activity_grid && progress.activity_grid.length > 0) {
      return progress.activity_grid;
    }
    // Generate synthetic past year grid based on history
    const historySet = new Set(localStats.history);
    const tiles = [];
    const today = new Date();
    for (let i = 363; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dStr = `${y}-${m}-${day}`;
      const isActive = historySet.has(dStr) || (i === 0 && totalCompleted > 0);
      tiles.push({
        date: dStr,
        count: isActive ? 2 : 0,
        level: isActive ? 2 : 0,
      });
    }
    return tiles;
  }, [progress, localStats, totalCompleted]);

  // Months labels for heatmap
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

  return (
    <div className="space-y-6 mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sword className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-bold font-kalam text-white">Challenge Progress &amp; Awards</h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400">
            Track your daily duels, script mastery, and multilingual submission history.
          </p>
        </div>

        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-500/20 w-fit"
        >
          <span>Play Challenges</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── TOP AWARDS & BADGES ROW (LeetCode Style) ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#14110E]/90 border border-stone-800 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800/80">
          <div className="flex items-center gap-6 text-xs font-semibold">
            <span className="text-stone-400 uppercase tracking-wider">Locked Badges</span>
            <span className="text-amber-400 uppercase tracking-wider">History Awards</span>
          </div>
          <span className="text-xs text-stone-500 hidden sm:inline">Badges update with consecutive activity</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Badge 1: Daily Challenge */}
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-stone-900/50 border border-stone-800/60 hover:border-amber-500/30 transition-all group">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-2 border-amber-500/40 flex items-center justify-center mb-2 shadow-inner group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400/30" />
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-stone-900 border border-amber-500 text-[9px] font-bold text-amber-300">
                {totalCompleted > 0 ? "100%" : "0%"}
              </div>
            </div>
            <h4 className="text-xs font-bold text-stone-200">Daily Challenge</h4>
            <span className="text-[10px] text-amber-400/80 mt-0.5">
              {totalCompleted > 0 ? "Active Today" : "0% Solved"}
            </span>
          </div>

          {/* Badge 2: 7 Days Streak */}
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-stone-900/50 border border-stone-800/60 hover:border-emerald-500/30 transition-all group">
            <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-inner group-hover:scale-105 transition-transform ${
              activeStreak >= 7
                ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/50"
                : "bg-stone-800/40 border border-stone-700/50"
            }`}>
              <Flame className={`w-6 h-6 ${activeStreak >= 7 ? "text-emerald-400 fill-emerald-400/40" : "text-stone-500"}`} />
              {activeStreak < 7 && <Lock className="w-3.5 h-3.5 text-stone-500 absolute top-1 right-1" />}
            </div>
            <h4 className="text-xs font-bold text-stone-200">7 Days Streak</h4>
            <span className="text-[10px] text-stone-400 mt-0.5">
              {activeStreak >= 7 ? "Unlocked" : `${activeStreak}/7 Days`}
            </span>
          </div>

          {/* Badge 3: 50 Days Badge */}
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-stone-900/50 border border-stone-800/60 hover:border-lime-500/30 transition-all group">
            <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-inner group-hover:scale-105 transition-transform ${
              maxStreak >= 50
                ? "bg-gradient-to-br from-lime-500/20 to-emerald-500/10 border-2 border-lime-500/50"
                : "bg-stone-800/40 border border-stone-700/50"
            }`}>
              <Shield className={`w-6 h-6 ${maxStreak >= 50 ? "text-lime-400 fill-lime-400/40" : "text-stone-500"}`} />
              {maxStreak < 50 && <Lock className="w-3.5 h-3.5 text-stone-500 absolute top-1 right-1" />}
            </div>
            <h4 className="text-xs font-bold text-stone-200">50 Days Badge</h4>
            <span className="text-[10px] text-stone-400 mt-0.5">
              {maxStreak >= 50 ? "Unlocked" : `${maxStreak}/50 Days`}
            </span>
          </div>

          {/* Badge 4: Indic 22 Explorer */}
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-stone-900/50 border border-stone-800/60 hover:border-red-500/30 transition-all group">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/10 border-2 border-red-500/40 flex items-center justify-center mb-2 shadow-inner group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6 text-red-400 fill-red-400/30" />
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-stone-900 border border-red-500 text-[9px] font-bold text-red-300">
                22
              </div>
            </div>
            <h4 className="text-xs font-bold text-stone-200">Indic 22 Explorer</h4>
            <span className="text-[10px] text-red-300/80 mt-0.5">
              {totalCompleted >= 5 ? "In Progress" : "Active Pathway"}
            </span>
          </div>

          {/* Badge 5: Polyglot 75 */}
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-stone-900/50 border border-stone-800/60 hover:border-cyan-500/30 transition-all group col-span-2 sm:col-span-1">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border-2 border-cyan-500/40 flex items-center justify-center mb-2 shadow-inner group-hover:scale-105 transition-transform">
              <Target className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="text-xs font-bold text-stone-200">Polyglot 75</h4>
            <span className="text-[10px] text-cyan-400 mt-0.5 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-pulse" />
              Active Path
            </span>
          </div>
        </div>
      </div>

      {/* ── SUBMISSIONS & HEATMAP GRID SECTION (LeetCode Heatmap) ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#14110E]/90 border border-stone-800 backdrop-blur-md shadow-xl">
        {/* Heatmap Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">
              {totalCompleted}
            </span>
            <span className="text-xs sm:text-sm text-stone-400 font-medium">
              challenges completed in the past year
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-400 font-medium flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">Total active days:</span>
              <span className="font-bold text-white tabular-nums">{activeDays}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">Max streak:</span>
              <span className="font-bold text-amber-400 tabular-nums">{maxStreak}</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 text-[11px]">
              Current
            </span>
          </div>
        </div>

        {/* Heatmap Matrix Display */}
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="min-w-[680px]">
            {/* Grid of 52 columns x 7 rows */}
            <div className="grid grid-flow-col grid-rows-7 gap-1 w-fit mb-2">
              {activityTiles.map((tile, idx) => {
                let colorClass = "bg-stone-800/70 border border-stone-800/40";
                if (tile.level === 1) {
                  colorClass = "bg-emerald-950 border border-emerald-900";
                } else if (tile.level === 2) {
                  colorClass = "bg-emerald-600 border border-emerald-500 shadow-sm shadow-emerald-500/20";
                } else if (tile.level >= 3) {
                  colorClass = "bg-emerald-400 border border-emerald-300 shadow-sm shadow-emerald-400/40";
                }

                return (
                  <div
                    key={idx}
                    title={`${tile.date}: ${tile.count} challenges solved`}
                    className={`w-3 h-3 rounded-[2.5px] transition-colors cursor-pointer hover:ring-1 hover:ring-white ${colorClass}`}
                  />
                );
              })}
            </div>

            {/* Months Row */}
            <div className="flex justify-between text-[11px] text-stone-500 px-1 font-medium select-none">
              {months.map((m, idx) => (
                <span key={idx}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap Legend & Difficulty Breakdown Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-5 border-t border-stone-800/80">
          {/* Difficulty breakdown pills */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs">
            <span className="text-stone-500 font-medium">Difficulty Breakdown:</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
              Easy: {beginner}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
              Medium: {intermediate}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 font-bold">
              Hard: {advanced}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 font-bold">
              Total: {totalCompleted} / {totalChallenges}
            </span>
          </div>

          {/* Activity Intensity Scale */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-stone-800/80 border border-stone-800" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-950 border border-emerald-900" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600 border border-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 border border-emerald-300" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
