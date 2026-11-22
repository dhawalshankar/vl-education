"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  Globe,
  Languages,
  Sparkles,
  Sword,
  Trophy,
} from "lucide-react";
import { ChallengeProgressStats, challengeAPI } from "@/app/lib/api";
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

  const totalCompleted = progress?.total_completed ?? 0;
  const totalChallenges = progress?.total_challenges ?? 744;
  const totalXp = progress?.total_xp ?? 0;
  const currentStreak = progress?.current_streak ?? 1;
  const activeDays = progress?.total_active_days ?? 1;
  const languagesCount = progress?.languages_explored_count ?? 0;
  const indianCompleted = progress?.indian_completed ?? 0;
  const foreignCompleted = progress?.foreign_completed ?? 0;
  const englishCompleted = progress?.english_completed ?? 0;
  const recentCompleted = progress?.recent_completed ?? [];

  const completionPercent = Math.min(
    100,
    totalChallenges > 0 ? (totalCompleted / totalChallenges) * 100 : 0
  );

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

        {recentCompleted.length > 0 ? (
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white font-mono">
                        {item.challenge_id}
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
                    {item.completed_at && (
                      <span className="text-[11px] text-stone-500 mt-0.5 block">
                        Solved on {item.completed_at}
                      </span>
                    )}
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
