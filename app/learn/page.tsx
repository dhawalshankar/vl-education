// app/learn/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { learnAPI } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";
import {
  LANGUAGE_CATALOG,
  canonicalLanguage,
  isCataloged,
  presentationFor,
  slugify,
} from "@/app/lib/languages";

type Section = "indian" | "english" | "foreign" | "other";

interface Row {
  name: string;
  native: string;
  group: Section;
  count: number;
}

const SECTIONS: { key: Section; title: string; sub?: string }[] = [
  { key: "indian", title: "Indian languages", sub: "The 22 scheduled languages of India" },
  { key: "english", title: "English" },
  { key: "foreign", title: "Foreign languages", sub: "In-demand languages for study, work and travel" },
  { key: "other", title: "More languages" },
];

export default function LearnPage() {
  const [query, setQuery] = useState("");
  const { data, error, loading } = useApi(() => learnAPI.languages());

  // Real course counts from the backend (aliases merged into one canonical name)
  const counts = new Map<string, number>();
  (data ?? []).forEach((l) => {
    const key = canonicalLanguage(l.language);
    counts.set(key, (counts.get(key) ?? 0) + l.course_count);
  });

  // Languages that have courses but are not in the catalog are still shown
  const extras = Array.from(counts.keys()).filter((n) => !isCataloged(n));

  const rows: Row[] = [
    ...LANGUAGE_CATALOG.map((l) => ({ name: l.name, native: l.native, group: l.group as Section, count: counts.get(l.name) ?? 0 })),
    ...extras.map((n) => ({ name: n, native: presentationFor(n).native, group: "other" as Section, count: counts.get(n) ?? 0 })),
  ];

  const q = query.trim().toLowerCase();
  const visible = rows.filter((r) => q === "" || r.name.toLowerCase().includes(q) || r.native.toLowerCase().includes(q));
  const withCourses = rows.filter((r) => r.count > 0).length;

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0908]/80 via-[#0a0908]/90 to-[#0a0908] pointer-events-none" />

      <section className="relative pt-36 pb-10 px-6">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/20 border-2 border-amber-400/30 mb-10">
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-semibold text-amber-100 tracking-wide">Courses</span>
          </div>
          <h1 className="font-kalam text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
            Choose Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300">
              Linguistic Journey
            </span>
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto">
            India&apos;s 22 scheduled languages, English and in-demand foreign languages.
          </p>
          {!loading && !error && (
            <p className="text-sm text-stone-500 mt-3">
              {withCourses} of {rows.length} languages have courses so far.
            </p>
          )}
        </div>
      </section>

      <section className="relative px-6 pb-8">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
            <input
              type="text"
              placeholder="Search languages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-700/50 bg-stone-900/80 text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500/50 text-base"
            />
          </div>
        </div>
      </section>

      <section className="relative py-8 px-6 pb-24">
        <div className="max-w-7xl mx-auto relative z-10 space-y-14">
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
              Could not load courses: {error}
            </div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-36 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
              ))}
            </div>
          ) : error ? null : visible.length === 0 ? (
            <div className="text-center py-20 rounded-3xl bg-stone-900/60 border border-stone-700/50">
              <Search className="w-14 h-14 mx-auto mb-4 text-amber-400/40" />
              <h3 className="font-kalam text-2xl font-bold text-white mb-2">No languages found</h3>
              <p className="text-stone-400 text-sm">Try a different search.</p>
            </div>
          ) : (
            SECTIONS.map((section) => {
              // languages with courses first, then the rest in catalog order
              const list = visible.filter((r) => r.group === section.key).sort((a, b) => b.count - a.count);
              if (list.length === 0) return null;
              return (
                <div key={section.key}>
                  <div className="mb-5">
                    <h2 className="font-kalam text-3xl font-bold text-white">{section.title}</h2>
                    {section.sub && <p className="text-sm text-stone-500 mt-1">{section.sub}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {list.map((r) => {
                      const p = presentationFor(r.name);
                      const tile = (
                        <>
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl text-white mb-3 shadow-lg ${
                              r.count === 0 ? "opacity-50" : ""
                            }`}
                          >
                            {p.icon}
                          </div>
                          <h3 className="font-kalam text-xl font-bold text-white leading-tight">{r.name}</h3>
                          <p className="text-amber-300 mb-3">{p.native}</p>
                          <div className="flex items-center justify-between pt-3 border-t border-stone-700/50">
                            <span className={`text-sm ${r.count > 0 ? "text-stone-300" : "text-stone-600"}`}>
                              {r.count > 0 ? `${r.count} course${r.count !== 1 ? "s" : ""}` : "Coming soon"}
                            </span>
                            {r.count > 0 && (
                              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                            )}
                          </div>
                        </>
                      );

                      return r.count > 0 ? (
                        <Link
                          key={r.name}
                          href={`/learn/${slugify(r.name)}`}
                          className="group p-5 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/50 transition-all hover:-translate-y-1"
                        >
                          {tile}
                        </Link>
                      ) : (
                        <div key={r.name} className="p-5 rounded-2xl bg-stone-900/30 border border-stone-800/60">
                          {tile}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}