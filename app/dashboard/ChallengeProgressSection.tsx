"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  Languages,
  Sparkles,
  Sword,
} from "lucide-react";
import { ActivityTile, ChallengeProgressStats, challengeAPI } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { getUserStreak } from "@/app/lib/streak";

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

  const totalCompleted = Math.max(progress?.total_completed ?? 0, localStats.completedCount);
  const totalChallenges = progress?.total_challenges ?? 744;
  const totalXp = progress?.total_xp ?? 0;
  const currentStreak = Math.max(progress?.current_streak ?? 1, localStats.activeStreak);
  const maxStreak = Math.max(progress?.max_streak ?? 1, localStats.longestStreak);
  const activeDays = Math.max(progress?.total_active_days ?? 1, localStats.totalActiveDays);
  const languagesCount = progress?.languages_explored_count ?? 0;
  const indianCompleted = progress?.indian_completed ?? 0;
  const foreignCompleted = progress?.foreign_completed ?? 0;
  const englishCompleted = progress?.english_completed ?? 0;
  const easyCompleted = progress?.easy_completed ?? Math.min(totalCompleted, 5);
  const mediumCompleted = progress?.medium_completed ?? 0;
  const hardCompleted = progress?.hard_completed ?? 0;
  const recentCompleted = progress?.recent_completed ?? [];

  const completionPercent = Math.min(
    100,
    totalChallenges > 0 ? (totalCompleted / totalChallenges) * 100 : 0
  );

  // Build 52-week activity grid (364 days) based on real database records
  const activityTiles: ActivityTile[] = useMemo(() => {
    if (progress?.activity_grid && progress.activity_grid.length > 0) {
      return progress.activity_grid;
    }
    // Fallback: build grid based on verified local history
    const historySet = new Set(localStats.history);
    const tiles: ActivityTile[] = [];
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

  // Group the 364 tiles into 52 weekly columns (7 days each) for pixel-perfect month alignment
  const weekColumns = useMemo(() => {
    const cols: { weekIndex: number; monthLabel: string; days: ActivityTile[] }[] = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let lastMonth = -1;

    for (let w = 0; w < 52; w++) {
      const days = activityTiles.slice(w * 7, (w + 1) * 7);
      let monthLabel = "";
      if (days.length > 0) {
        const firstDay = new Date(days[0].date + "T00:00:00");
        const m = firstDay.getMonth();
        if (m !== lastMonth) {
          monthLabel = monthNames[m];
          lastMonth = m;
        }
      }
      cols.push({ weekIndex: w, monthLabel, days });
    }
    return cols;
  }, [activityTiles]);

  return (
    <div className="space-y-6 mb-12">
      {/* ── SECTION HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sword className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-bold font-kalam text-white">
              Language Challenges Progress
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400">
            Real-time track of your completed challenges across 31 Indian and global languages.
          </p>
        </div>

        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-500/20 w-fit"
        >
          <span>Open Challenges Arena</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── REAL METRICS OVERVIEW (4-Card Strip) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Completed Challenges */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#14110E]/90 border border-stone-800 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Completed
            </span>
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
              {totalCompleted}
            </span>
            <span className="text-xs text-stone-500 font-medium">/ {totalChallenges}</span>
          </div>
          <div className="mt-2.5">
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(completionPercent, totalCompleted > 0 ? 2 : 0)}%` }}
              />
            </div>
            <span className="text-[10px] text-stone-400 mt-1 inline-block">
              {completionPercent.toFixed(1)}% of all challenges
            </span>
          </div>
        </div>

        {/* Metric 2: Challenge XP */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#14110E]/90 border border-stone-800 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Challenge XP
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums">
              {totalXp}
            </span>
            <span className="text-xs text-stone-500 font-medium">XP</span>
          </div>
          <span className="text-[10px] text-stone-400 mt-2.5 inline-block">
            Verified submissions score
          </span>
        </div>

        {/* Metric 3: Languages Explored */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#14110E]/90 border border-stone-800 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Languages
            </span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Languages className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
              {languagesCount}
            </span>
            <span className="text-xs text-stone-500 font-medium">/ 31</span>
          </div>
          <span className="text-[10px] text-stone-400 mt-2.5 inline-block">
            Across Indic, English &amp; Foreign
          </span>
        </div>

        {/* Metric 4: Streak & Days */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#14110E]/90 border border-stone-800 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Active Streak
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums">
              {currentStreak}
            </span>
            <span className="text-xs text-stone-500 font-medium">days</span>
          </div>
          <span className="text-[10px] text-stone-400 mt-2.5 inline-block">
            {activeDays} total active learning day{activeDays === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* ── REAL 365-DAY ACTIVITY HEATMAP ── */}
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
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">Current:</span>
              <span className="font-bold text-emerald-400 tabular-nums">{currentStreak}</span>
            </div>
          </div>
        </div>

        {/* Heatmap Matrix Display */}
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="w-fit">
            {/* 52 Weekly Columns */}
            <div className="flex gap-1 mb-2">
              {weekColumns.map((col) => (
                <div key={col.weekIndex} className="flex flex-col gap-1">
                  {col.days.map((tile, dayIdx) => {
                    let colorClass = "bg-stone-800/60 border border-stone-800/40";
                    if (tile.level === 1) {
                      colorClass = "bg-emerald-950 border border-emerald-900";
                    } else if (tile.level === 2) {
                      colorClass = "bg-emerald-600 border border-emerald-500 shadow-sm shadow-emerald-500/20";
                    } else if (tile.level >= 3) {
                      colorClass = "bg-emerald-400 border border-emerald-300 shadow-sm shadow-emerald-400/40";
                    }

                    return (
                      <div
                        key={dayIdx}
                        title={`${tile.date}: ${tile.count} challenges & activities`}
                        className={`w-3 h-3 rounded-[2.5px] transition-colors cursor-pointer hover:ring-1 hover:ring-white ${colorClass}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Months Row Aligned Column-by-Column */}
            <div className="flex gap-1 select-none">
              {weekColumns.map((col) => (
                <div
                  key={col.weekIndex}
                  className="w-3 text-[10px] text-stone-500 font-medium relative h-4 overflow-visible"
                >
                  {col.monthLabel && (
                    <span className="absolute left-0 top-0 whitespace-nowrap">
                      {col.monthLabel}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap Legend & Difficulty Breakdown Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-5 border-t border-stone-800/80">
          {/* Real Difficulty breakdown pills */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs">
            <span className="text-stone-500 font-medium">Difficulty Breakdown:</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
              Easy: {easyCompleted}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
              Medium: {mediumCompleted}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 font-bold">
              Hard: {hardCompleted}
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

      {/* ── CATEGORY PROGRESS BREAKDOWN ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#14110E]/90 border border-stone-800 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800/80">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-200">
              Category Completion Breakdown
            </h3>
          </div>
          <span className="text-xs text-stone-500 hidden sm:inline">
            744 total challenges across 31 languages
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category 1: Scheduled Indic */}
          <div className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-orange-300 flex items-center gap-1.5">
                <span>🇮🇳</span> 22 Scheduled Indian
              </span>
              <span className="text-xs font-bold text-white tabular-nums">
                {indianCompleted} / 528
              </span>
            </div>
            <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, 528 > 0 ? (indianCompleted / 528) * 100 : 0)}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-2">
              Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, Urdu
            </p>
          </div>

          {/* Category 2: Foreign Languages */}
          <div className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <span>🌍</span> 8 Foreign Languages
              </span>
              <span className="text-xs font-bold text-white tabular-nums">
                {foreignCompleted} / 192
              </span>
            </div>
            <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, 192 > 0 ? (foreignCompleted / 192) * 100 : 0)}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-2">
              Spanish, French, German, Japanese, Korean, Mandarin Chinese, Arabic, Russian
            </p>
          </div>

          {/* Category 3: English */}
          <div className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <span>🌐</span> English Mastery
              </span>
              <span className="text-xs font-bold text-white tabular-nums">
                {englishCompleted} / 24
              </span>
            </div>
            <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, 24 > 0 ? (englishCompleted / 24) * 100 : 0)}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-2">
              Vocabulary, grammar contexts, idioms, and linguistic comprehension
            </p>
          </div>
        </div>
      </div>

      {/* ── RECENTLY COMPLETED CHALLENGES (REAL ACTIVITY) ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#14110E]/90 border border-stone-800 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800/80">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-200">
              Recently Solved Challenges
            </h3>
          </div>
          {recentCompleted.length > 0 && (
            <span className="text-xs text-stone-400">
              Showing {recentCompleted.length} recent submission{recentCompleted.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-stone-400">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading challenge history...</span>
          </div>
        ) : recentCompleted.length > 0 ? (
          <div className="space-y-2.5">
            {recentCompleted.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-2xl bg-stone-900/40 border border-stone-800/70 hover:border-amber-500/30 transition-all gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-bold text-white font-kalam">
                        {item.title || item.challenge_id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-[10px] text-amber-300 font-semibold">
                        {item.language}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-stone-800/60 text-[10px] text-stone-400 capitalize">
                        {item.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-stone-800/60 text-[10px] text-stone-400 capitalize">
                        {item.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <span className="font-mono text-[10px] text-stone-400">{item.challenge_id}</span>
                      {item.completed_at && <span>• Solved on {item.completed_at}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                    +{item.xp_earned} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 sm:py-12 flex flex-col items-center text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center mb-3 text-stone-500">
              <Sword className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-stone-200 mb-1">
              No challenges completed yet
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md mb-4">
              Practice translation, transliteration, script identification, and contextual cloze across 31 languages in the Challenge Arena.
            </p>
            <Link
              href="/challenges"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-500/20"
            >
              Solve Your First Challenge
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
