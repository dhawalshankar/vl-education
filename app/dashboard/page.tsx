// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { enrollmentAPI } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";
import { slugify } from "@/app/lib/languages";

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/auth/login");
  }, [authLoading, user, router]);

  const { data: enrollments, error, loading } = useApi(
    () => enrollmentAPI.mine(),
    [user?.id],
    !!user
  );

  if (authLoading || !user) {
    return (
      <div className="cultural-page min-h-screen flex items-center justify-center">
        <div className="text-amber-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const list = enrollments ?? [];
  const completed = list.filter((e) => e.status === "completed").length;
  const inProgress = list.length - completed;

  const stats = [
    {
      icon: GraduationCap,
      label: "Enrolled courses",
      value: list.length,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: BookOpen,
      label: "In progress",
      value: inProgress,
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: completed,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="cultural-page min-h-screen text-white relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=85')`,
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-36 pb-20 w-full">
        {/* User Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/10">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {user.avatar_url && !avatarFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={user.full_name}
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shadow-lg shadow-amber-500/10"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-stone-950 shadow-lg shadow-orange-500/20">
                {user.full_name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="break-words text-2xl sm:text-3xl font-bold">Welcome, {user.full_name}! 👋</h1>
                <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
                  {user.role}
                </span>
              </div>
              <p className="break-all text-stone-400 text-sm mt-1">{user.email}</p>
            </div>
          </div>

          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-sm transition-all shadow-md shadow-amber-500/20 w-fit"
          >
            <Sparkles className="w-4 h-4" />
            <span>Browse Catalog</span>
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
            Could not load your courses: {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-[#14110E]/80 border border-stone-800 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md shadow-lg"
              >
                <div className={`w-12 h-12 rounded-xl border ${s.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold tabular-nums">{loading ? "–" : s.value}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-kalam">My Courses</h2>
          <span className="text-xs text-stone-400">
            {list.length} {list.length === 1 ? "course" : "courses"} enrolled
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-56 rounded-3xl bg-stone-900/40 border border-stone-800 animate-pulse"
              />
            ))}
          </div>
        ) : list.length === 0 && !error ? (
          /* Empty State */
          <div className="bg-[#14110E]/80 border border-stone-800 rounded-3xl p-12 text-center text-stone-400 backdrop-blur-md shadow-xl">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-amber-400/40" />
            <h3 className="text-xl font-bold text-white mb-2">You haven&apos;t enrolled in any course yet</h3>
            <p className="text-stone-400 text-sm max-w-md mx-auto mb-6">
              Explore India&apos;s 22 scheduled languages, English, and world languages to start your journey today.
            </p>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              <span>Explore courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Courses Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((e) => {
              const pct = Math.round(e.progress_percentage || 0);
              const done = e.status === "completed";
              const langSlug = slugify(e.course_language || "hindi");

              return (
                <div
                  key={e.id}
                  className="bg-[#14110E]/85 border border-stone-800 hover:border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-md shadow-xl transition-all hover:-translate-y-0.5 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 text-xs">
                      <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold tracking-wide">
                        {e.course_language}
                      </span>
                      <span className="text-stone-400 capitalize px-2.5 py-1 rounded-full bg-stone-800/60 border border-stone-700/50">
                        {e.course_level}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-4 leading-snug group-hover:text-amber-200 transition-colors">
                      {e.course_title}
                    </h3>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-stone-400 mb-2">
                      <span>
                        {e.completed_lessons} of {e.total_lessons} lessons
                      </span>
                      <span className="font-semibold text-white">{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-800 mb-5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <Link
                      href={`/learn/${langSlug}/${e.course_id}`}
                      className="w-full py-3 rounded-xl font-bold text-sm text-center bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500 hover:to-orange-500 text-amber-300 hover:text-stone-950 border border-amber-500/40 hover:border-transparent transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/10"
                    >
                      <span>{done ? "Review course" : "Continue learning"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
