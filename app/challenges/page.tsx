// app/challenges/page.tsx
"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import { ArrowRight, Trophy, Sword, Target, Zap, Clock, Medal } from "lucide-react";
import { challengeAPI } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";

const ICONS: Record<string, React.ElementType> = {
  daily_duel: Sword,
  script_sprint: Target,
  flashcard_blitz: Zap,
  leaderboard: Medal,
};

export default function ChallengesPage() {
  const { data: challenges, error, loading } = useApi(() => challengeAPI.list());
  const { data: board, error: boardError, loading: boardLoading } = useApi(() => challengeAPI.leaderboard());

  return (
    <RequireAuth>
      <div className="cultural-page min-h-screen relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=85')`,
          filter: "contrast(110%) brightness(75%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 20%, rgba(255, 85, 0, 0.12), transparent 70%),
            linear-gradient(180deg, rgba(14, 12, 10, 0.55) 0%, rgba(14, 12, 10, 0.78) 55%, #0e0c0a 100%)
          `,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-400/30 mb-5">
            <Clock className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-semibold text-amber-200">Coming soon</span>
          </div>
          <h1 className="font-kalam text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
            Challenges
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-orange-200 to-amber-300">
              Compete &amp; Conquer
            </span>
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Language mastery meets competitive spirit. Challenges will be available soon.
          </p>
        </div>

        {error && (
          <div className="mb-8 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
            Could not load challenges: {error}
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : !error && (challenges?.length ?? 0) === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-stone-900/60 border border-stone-700/50 text-stone-400 mb-16">
            No challenges are available yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {challenges?.map((c) => {
              const Icon = ICONS[c.type] || Trophy;
              return (
                <div
                  key={c.id}
                  className="p-8 rounded-2xl bg-stone-900/60 border-2 border-stone-700/50 hover:border-red-500/40 transition-all"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-kalam text-2xl font-bold text-white">{c.title}</h3>
                    {c.eta && (
                      <span className="shrink-0 flex items-center gap-1.5 text-xs text-stone-500 bg-stone-800/60 px-3 py-1.5 rounded-full border border-stone-700/50">
                        <Clock className="w-3 h-3" /> {c.eta}
                      </span>
                    )}
                  </div>
                  <p className="text-stone-400 text-sm leading-relaxed mb-3">{c.desc}</p>
                  <span className="text-xs text-amber-300">{c.xp_reward} XP</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Leaderboard */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-red-500/10 via-stone-900/60 to-orange-500/10 border-2 border-red-500/20 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-7 h-7 text-amber-400" />
            <h2 className="font-kalam text-3xl font-bold text-white">Weekly Leaderboard</h2>
          </div>

          {boardError ? (
            <p className="text-sm text-rose-300">Could not load leaderboard: {boardError}</p>
          ) : boardLoading ? (
            <div className="h-24 rounded-xl bg-white/5 animate-pulse" />
          ) : (board?.length ?? 0) === 0 ? (
            <p className="text-stone-400 text-sm">No scores yet this week. Be the first on the board.</p>
          ) : (
            <ol className="space-y-2">
              {board?.map((row) => (
                <li
                  key={row.rank + row.user_name}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm"
                >
                  <span className="flex items-center gap-4">
                    <span className="w-6 text-stone-500 font-bold">#{row.rank}</span>
                    <span className="text-white font-medium">{row.user_name}</span>
                    <span className="text-xs text-stone-500">{row.language}</span>
                  </span>
                  <span className="text-amber-300 font-semibold">{row.xp} XP</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/learn"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold font-kalam text-lg transition-all"
          >
            Start Learning Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <Footer />
      </div>
    </RequireAuth>
  );
}