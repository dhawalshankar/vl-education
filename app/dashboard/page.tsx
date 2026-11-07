// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { enrollmentAPI } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

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
      <div className="min-h-screen bg-[#0a0908]/90 flex items-center justify-center">
        <div className="text-amber-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const list = enrollments ?? [];
  const completed = list.filter((e) => e.status === "completed").length;
  const stats = [
    { icon: GraduationCap, label: "Enrolled courses", value: list.length, color: "text-amber-400" },
    { icon: BookOpen, label: "In progress", value: list.length - completed, color: "text-blue-400" },
    { icon: CheckCircle2, label: "Completed", value: completed, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0e0c0a] text-white relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=85')`,
          filter: "contrast(110%) brightness(75%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 20%, rgba(255, 85, 0, 0.12), transparent 70%),
            linear-gradient(180deg, rgba(14, 12, 10, 0.55) 0%, rgba(14, 12, 10, 0.78) 55%, #0e0c0a 100%)
          `,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-20 w-full">
        <h1 className="text-3xl font-bold mb-1">Welcome, {user.full_name} 👋</h1>
        <p className="text-stone-500 text-sm mb-10">{user.email}</p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
            Could not load your courses: {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-stone-900/60 border border-stone-700/50 rounded-2xl p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-800/50 flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? "–" : s.value}</p>
                  <p className="text-xs text-stone-500">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="text-2xl font-bold mb-5">My Courses</h2>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : list.length === 0 && !error ? (
          <div className="bg-stone-900/40 border border-stone-700/50 rounded-2xl p-10 text-center text-stone-500">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-amber-400/30" />
            <p>You haven&apos;t enrolled in any course yet.</p>
            <Link href="/learn" className="inline-block mt-3 text-sm text-amber-400 hover:text-amber-300">
              Browse courses →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((e) => {
              const pct = Math.round(e.progress_percentage);
              const done = e.status === "completed";
              return (
                <div
                  key={e.id}
                  className="bg-stone-900/60 border border-stone-700/50 rounded-2xl p-5 flex flex-col hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                      {e.course_language}
                    </span>
                    <span className="text-stone-500 capitalize">{e.course_level}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 leading-snug flex-1">{e.course_title}</h3>

                  <div className="flex justify-between text-xs text-stone-500 mb-1.5">
                    <span>
                      {e.completed_lessons}/{e.total_lessons} lessons
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-stone-800 mb-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <Link
                    href={`/learn/${e.course_language.toLowerCase()}/${e.course_id}`}
                    className="w-full py-2.5 rounded-xl font-bold text-sm text-center bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white border border-amber-500/30 hover:border-transparent transition-all flex items-center justify-center gap-2"
                  >
                    {done ? "Review course" : "Continue learning"} <ArrowRight className="w-4 h-4" />
                  </Link>
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