"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Flame,
  Languages,
  LockKeyhole,
  Mic,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";

type UpcomingChallenge = {
  title: string;
  description: string;
  language: string;
  format: string;
  difficulty: string;
  duration: string;
  reward: string;
  icon: typeof BookOpen;
  accent: string;
};

const UPCOMING_CHALLENGES: UpcomingChallenge[] = [
  {
    title: "Script Sprint",
    description: "Recognise everyday words and build confidence with a new Indian script.",
    language: "All languages",
    format: "10 questions",
    difficulty: "Beginner",
    duration: "5 min",
    reward: "50 XP",
    icon: Languages,
    accent: "from-orange-500/25 to-amber-500/10",
  },
  {
    title: "Phrase Match",
    description: "Match useful phrases to their meaning before the clock runs out.",
    language: "Hindi",
    format: "15 questions",
    difficulty: "Beginner",
    duration: "7 min",
    reward: "75 XP",
    icon: Target,
    accent: "from-blue-500/25 to-cyan-500/10",
  },
  {
    title: "Listening Dash",
    description: "Listen for familiar words and choose the meaning from three options.",
    language: "Tamil",
    format: "Audio quiz",
    difficulty: "Intermediate",
    duration: "8 min",
    reward: "100 XP",
    icon: Mic,
    accent: "from-violet-500/25 to-fuchsia-500/10",
  },
  {
    title: "Daily Vocabulary Duel",
    description: "A quick daily round to keep your vocabulary growing one word at a time.",
    language: "Rotating languages",
    format: "Daily round",
    difficulty: "Mixed",
    duration: "3 min",
    reward: "25 XP",
    icon: Flame,
    accent: "from-red-500/25 to-orange-500/10",
  },
];

export default function UpcomingChallengesPage() {
  return (
    <RequireAuth>
      <div className="cultural-page min-h-screen text-white flex flex-col">
        <Navbar />

        <main className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_20%_10%,rgba(255,85,0,0.2),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.12),transparent_30%)]" />

          <div className="relative max-w-6xl mx-auto px-6 pt-36 pb-20">
            <Link
              href="/challenges"
              className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to challenges
            </Link>

            <section className="mt-10 max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/25 text-xs font-semibold text-amber-200">
                <Sparkles className="w-3.5 h-3.5" />
                In the works
              </span>
              <h1 className="mt-5 font-kalam text-5xl sm:text-6xl font-bold leading-tight">
                Small challenges.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-300">
                  Steady progress.
                </span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-stone-300 leading-relaxed">
                Short, focused practice rounds are coming soon. Pick up a few XP,
                test what you know, and keep your learning streak moving.
              </p>
            </section>

            <section className="mt-12 grid gap-5 sm:grid-cols-2" aria-label="Upcoming challenges">
              {UPCOMING_CHALLENGES.map((challenge) => {
                const Icon = challenge.icon;
                return (
                  <article
                    key={challenge.title}
                    className={`rounded-3xl border border-white/10 bg-gradient-to-br ${challenge.accent} bg-stone-900/70 p-6 shadow-xl`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-black/25 border border-white/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-amber-300" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] text-stone-300">
                        <LockKeyhole className="w-3 h-3" />
                        Soon
                      </span>
                    </div>

                    <h2 className="mt-6 font-kalam text-2xl font-bold">{challenge.title}</h2>
                    <p className="mt-2 min-h-12 text-sm leading-relaxed text-stone-400">
                      {challenge.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-white/5 px-3 py-1.5 text-stone-300">
                        {challenge.language}
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-1.5 text-stone-300">
                        {challenge.format}
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-1.5 text-stone-300">
                        {challenge.difficulty}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-stone-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {challenge.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
                        <Trophy className="w-3.5 h-3.5" />
                        {challenge.reward}
                      </span>
                    </div>
                  </article>
                );
              })}
            </section>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-amber-400" />
              <h2 className="mt-3 font-kalam text-2xl font-bold">Build your foundation first</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-stone-400">
                Challenges will be most useful after you have a few lessons under your belt.
                Explore the available courses while we prepare the first rounds.
              </p>
              <Link
                href="/learn"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
              >
                Explore courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </RequireAuth>
  );
}
