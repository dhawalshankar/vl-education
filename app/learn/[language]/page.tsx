// app/learn/[language]/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Layers, Lock, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { enrollmentAPI, learnAPI } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";
import { languageNameFromSlug, presentationFor } from "@/app/lib/languages";

export default function LanguagePage() {
  const params = useParams();
  const slug = String(params?.language ?? "");
  const { isAuthenticated } = useAuth();

  const [level, setLevel] = useState("all");
  const [query, setQuery] = useState("");

  // Resolve the exact language name (catalog first, then names returned by the backend)
  const langs = useApi(() => learnAPI.languages(), [slug]);
  const languageName = useMemo(
    () => languageNameFromSlug(slug, (langs.data ?? []).map((l) => l.language)),
    [slug, langs.data]
  );

  const courses = useApi(() => learnAPI.courses({ language: languageName }), [languageName], !langs.loading);
  const mine = useApi(() => enrollmentAPI.mine(), [isAuthenticated], isAuthenticated);

  const enrolledIds = new Set((mine.data ?? []).map((e) => e.course_id));
  const p = presentationFor(languageName);

  const all = courses.data ?? [];
  const levels = ["all", ...Array.from(new Set(all.map((c) => c.level)))];
  const q = query.trim().toLowerCase();
  const filtered = all.filter(
    (c) =>
      (level === "all" || c.level === level) &&
      (q === "" || c.title.toLowerCase().includes(q) || (c.description ?? "").toLowerCase().includes(q))
  );

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden flex flex-col justify-between">
      <Navbar />
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      <section className="relative pt-32 pb-10 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">All Languages</span>
          </Link>

          <div className="flex items-center gap-5">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-4xl text-white shadow-2xl`}
            >
              {p.icon}
            </div>
            <div>
              <h1 className="font-kalam text-5xl md:text-6xl font-bold text-white leading-tight">{languageName}</h1>
              <p className="text-2xl text-amber-300 font-medium">{p.native}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
              <input
                type="text"
                placeholder="Search courses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-700/50 bg-stone-900/80 text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500/50 text-sm"
              />
            </div>
            {levels.length > 2 && (
              <div className="flex items-center gap-2 flex-wrap">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                      level === lvl
                        ? "bg-amber-500 text-white"
                        : "bg-stone-800/50 text-stone-400 hover:bg-stone-700/50 border border-stone-700/50"
                    }`}
                  >
                    {lvl === "all" ? "All levels" : lvl}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-24">
        <div className="max-w-7xl mx-auto relative z-10">
          {courses.error && (
            <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
              Could not load courses: {courses.error}
            </div>
          )}

          {courses.loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-stone-900/40 border border-stone-700/50 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 && !courses.error ? (
            <div className="text-center py-20 rounded-2xl bg-stone-900/40 border border-stone-700/50">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-amber-400/30" />
              <h3 className="font-kalam text-2xl font-bold text-white mb-2">
                {all.length === 0 ? "No courses yet" : "No courses match"}
              </h3>
              <p className="text-stone-400 text-sm">
                {all.length === 0 ? `No ${languageName} courses are published yet.` : "Try another search or level."}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c) => {
                const enrolled = enrolledIds.has(c.id);
                return (
                  <div
                    key={c.id}
                    className="bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-xs px-2.5 py-1 rounded-full border font-semibold capitalize bg-amber-500/15 border-amber-500/30 text-amber-300">
                          {c.level}
                        </span>
                        {enrolled && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold">
                            Enrolled
                          </span>
                        )}
                      </div>

                      <h3 className="font-kalam text-xl font-bold text-white mb-2 leading-snug">{c.title}</h3>
                      <p className="text-stone-400 text-sm leading-relaxed mb-4 line-clamp-2">{c.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mb-4">
                        {c.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {c.duration}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3" /> {c.modules_count} modules · {c.lessons_count} lessons
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-stone-300">{c.instructor?.full_name}</span>
                        <span className={c.is_free ? "text-emerald-400 font-bold" : "text-white font-bold"}>
                          {c.is_free ? "Free" : `₹${c.price}`}
                        </span>
                      </div>
                    </div>

                    {isAuthenticated ? (
                      <Link
                        href={`/learn/${slug}/${c.id}`}
                        className="w-full py-3 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white"
                      >
                        {enrolled ? "Continue learning" : "View course"} <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        href="/auth/login"
                        className="w-full py-3 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700/50"
                      >
                        <Lock className="w-4 h-4" /> Login to access
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}