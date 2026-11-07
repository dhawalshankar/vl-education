// app/learn/[language]/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Layers,
  Lock,
  MapPin,
  Search,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
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

  const [activeTab, setActiveTab] = useState<"courses" | "workshops" | "sessions">("courses");
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

  const mockWorkshops = [
    {
      id: "ws-online-spoken",
      title: `${languageName} Conversational Immersion Weekend`,
      mode: "Live Online (Google Meet / Zoom)",
      type: "Online Cohort",
      duration: "2 Days (Sat-Sun, 4 Hours/day)",
      instructor: "Senior Linguistic Faculty",
      price: 1499,
      description: `Intensive 2-day live interactive cohort focused on high-frequency ${languageName} dialogue, real-time accent correction, and small-group speaking breakout rooms.`,
      highlights: ["Live speaking breakouts", "Native mentor review", "Digital study workbook"],
    },
    {
      id: "ws-offline-script",
      title: `${languageName} Script Mastery & In-Person Cultural Lab`,
      mode: "Offline (In-Person Workshop)",
      type: "In-Person Classroom",
      duration: "Full Day (Sunday, 10:00 AM - 5:00 PM)",
      venue: "Cultural Arts Centre, New Delhi",
      instructor: "Visiting Calligraphy & Vernacular Scholar",
      price: 2499,
      description: `Hands-on in-person workshop mastering the script, orthography, and literary history of ${languageName}. Includes a printed physical study manual dispatched to your seat.`,
      highlights: ["Physical study kit included", "Direct 1:1 instructor feedback", "Lunch & networking tea"],
    },
  ];

  const mockSessions = [
    {
      id: "sess-accent",
      title: `1:1 Spoken ${languageName} Accent & Fluency Coaching`,
      duration: "45 Minutes",
      mode: "Live 1:1 Video (Google Meet)",
      instructor: "Certified Native Educator",
      price: 599,
      description: `Private one-on-one session dedicated to natural phonetics, regional pronunciation, and confidence building in ${languageName}.`,
      highlights: ["Phonetic diagnostic", "Personalized speech notes", "Session audio summary"],
    },
    {
      id: "sess-exam",
      title: `1:1 ${languageName} Grammar & Exam Preparation`,
      duration: "60 Minutes",
      mode: "Live 1:1 Video (Google Meet)",
      instructor: "Curriculum Specialist",
      price: 799,
      description: `Targeted one-on-one tutorial for competitive examination syllabi, advanced sentence structures, and essay review in ${languageName}.`,
      highlights: ["Syllabus deep-dive", "Essay structure feedback", "Practice exercises"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0e0c0a] relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=85')`,
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

      {/* Header section */}
      <section className="relative pt-36 pb-6 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-8 group text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>All Languages</span>
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-stone-800/80">
            <div className="flex items-center gap-5">
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-4xl text-white shadow-2xl shrink-0`}
              >
                {p.icon}
              </div>
              <div>
                <h1 className="font-kalam text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                  {languageName}
                </h1>
                <p className="text-2xl text-amber-300 font-medium">{p.native}</p>
              </div>
            </div>

            {/* Offering Format Tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-stone-900/80 p-1.5 rounded-2xl border border-stone-800 backdrop-blur-md">
              <button
                onClick={() => setActiveTab("courses")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "courses"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Courses</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                    activeTab === "courses" ? "bg-stone-950/25 text-stone-950" : "bg-stone-800 text-stone-400"
                  }`}
                >
                  {all.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("workshops")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "workshops"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Workshops</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Coming soon
                </span>
              </button>

              <button
                onClick={() => setActiveTab("sessions")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "sessions"
                    ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>1:1 Sessions</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Coming soon
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="relative px-6 pb-24">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* TAB 1: SELF-PACED COURSES */}
          {activeTab === "courses" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left / Main Column: Search, filters and Course Grid */}
              <div className="lg:col-span-8 space-y-6">
                {/* Search & Level Filters */}
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                    <input
                      type="text"
                      placeholder={`Search ${languageName} courses...`}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-800 bg-stone-900/90 text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500/50 text-sm"
                    />
                  </div>
                  {levels.length > 2 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {levels.map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setLevel(lvl)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                            level === lvl
                              ? "bg-amber-500 text-stone-950 font-bold"
                              : "bg-stone-800/60 text-stone-400 hover:bg-stone-700/60 border border-stone-800"
                          }`}
                        >
                          {lvl === "all" ? "All levels" : lvl}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {courses.error && (
                  <div className="px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
                    Could not load courses: {courses.error}
                  </div>
                )}

                {courses.loading ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-72 rounded-2xl bg-stone-900/40 border border-stone-800 animate-pulse" />
                    ))}
                  </div>
                ) : filtered.length === 0 && !courses.error ? (
                  <div className="text-center py-20 rounded-2xl bg-stone-900/40 border border-stone-800">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-amber-400/30" />
                    <h3 className="font-kalam text-2xl font-bold text-white mb-2">
                      {all.length === 0 ? "No courses yet" : "No courses match"}
                    </h3>
                    <p className="text-stone-400 text-sm max-w-sm mx-auto mb-6">
                      {all.length === 0
                        ? `No ${languageName} self-paced courses are published yet. Check back soon!`
                        : "Try another search keyword or level filter."}
                    </p>
                    <button
                      onClick={() => setActiveTab("workshops")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors border border-stone-700"
                    >
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>View {languageName} Workshops &amp; Cohorts</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {filtered.map((c) => {
                      const enrolled = enrolledIds.has(c.id);
                      return (
                        <div
                          key={c.id}
                          className="bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1 flex flex-col justify-between"
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

              {/* Right Column: Premium Side Tab for Workshops & Live Cohorts */}
              <div className="lg:col-span-4 space-y-6">
                {/* Side Card 1: Workshops Preview */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-stone-900/80 to-[#120F0C] border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold inline-block">
                      Workshops &amp; Cohorts
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10 text-stone-300">
                      Coming Soon
                    </span>
                  </div>

                  <div>
                    <h3 className="font-kalam text-2xl font-bold text-white mb-2 leading-snug">
                      Interactive {languageName} Workshops
                    </h3>
                    <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                      Immerse yourself in live online weekend bootcamps or in-person regional workshops with physical study kits.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-stone-300 py-2 border-y border-stone-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Live online breakout speaking groups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>In-person offline labs with physical kits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Direct Q&amp;A with verified native scholars</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-xl bg-stone-800 text-stone-400 font-bold text-xs border border-stone-700/70 cursor-not-allowed opacity-80 flex items-center justify-center gap-2"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Request Workshop Seat (Coming Soon)</span>
                    </button>
                  </div>
                </div>

                {/* Side Card 2: 1:1 Live Mentorship Preview */}
                <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold inline-block">
                      1:1 Mentorship
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10 text-stone-300">
                      Coming Soon
                    </span>
                  </div>

                  <div>
                    <h3 className="font-kalam text-xl font-bold text-white mb-1.5 leading-snug">
                      1:1 {languageName} Speaking Sessions
                    </h3>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      Practice conversation, pronunciation, and interview speaking one-on-one with native mentors.
                    </p>
                  </div>

                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-800 text-stone-400 font-bold text-xs border border-stone-700/60 cursor-not-allowed opacity-80 flex items-center justify-center gap-2"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Book 1:1 Session (Coming Soon)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORKSHOPS (ONLINE & OFFLINE) */}
          {activeTab === "workshops" && (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-stone-900/80 to-[#120F0C] border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
                    <Users className="w-3.5 h-3.5" />
                    <span>Interactive Language Cohorts</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-stone-300">
                      Coming Soon
                    </span>
                  </div>
                  <h2 className="font-kalam text-3xl font-bold text-white mb-2">
                    {languageName} Immersion Workshops
                  </h2>
                  <p className="text-stone-300 text-sm max-w-2xl leading-relaxed">
                    Designed for intensive hands-on practice. Choose between live interactive online cohorts and in-person regional classroom workshops with physical study materials.
                  </p>
                </div>

                <div className="shrink-0">
                  <span className="px-4 py-2 rounded-xl bg-amber-500/15 text-amber-200 text-xs font-semibold border border-amber-500/30">
                    Registration Opening Soon
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mockWorkshops.map((ws) => (
                  <div
                    key={ws.id}
                    className="p-7 rounded-3xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                          {ws.type}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10 text-stone-300">
                          Coming Soon
                        </span>
                      </div>

                      <h3 className="font-kalam text-2xl font-bold text-white leading-snug">
                        {ws.title}
                      </h3>

                      <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                        {ws.description}
                      </p>

                      <div className="space-y-2 py-3 border-y border-stone-800 text-xs text-stone-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{ws.duration}</span>
                        </div>
                        {ws.venue && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{ws.venue}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Mentored by {ws.instructor}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {ws.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-stone-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-800 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-xs text-stone-400">Seat Price</span>
                        <span className="text-white font-bold text-lg">₹{ws.price}</span>
                      </div>

                      <button
                        disabled
                        className="w-full py-3 rounded-xl bg-stone-800 text-stone-400 font-bold text-xs sm:text-sm border border-stone-700/60 cursor-not-allowed opacity-80 flex items-center justify-center gap-2"
                      >
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>Reserve Seat (Coming Soon)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 1:1 SESSIONS */}
          {activeTab === "sessions" && (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 via-stone-900/80 to-[#120F0C] border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
                    <Video className="w-3.5 h-3.5" />
                    <span>Live 1:1 Mentorship</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-stone-300">
                      Coming Soon
                    </span>
                  </div>
                  <h2 className="font-kalam text-3xl font-bold text-white mb-2">
                    1:1 {languageName} Speaking Coaching
                  </h2>
                  <p className="text-stone-300 text-sm max-w-2xl leading-relaxed">
                    Personalized video coaching sessions tailored to your individual goals, phonetics, and conversational pace.
                  </p>
                </div>

                <div className="shrink-0">
                  <span className="px-4 py-2 rounded-xl bg-blue-500/15 text-blue-200 text-xs font-semibold border border-blue-500/30">
                    Booking System Coming Soon
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mockSessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-7 rounded-3xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold">
                          Live 1:1 Video
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10 text-stone-300">
                          Coming Soon
                        </span>
                      </div>

                      <h3 className="font-kalam text-2xl font-bold text-white leading-snug">
                        {sess.title}
                      </h3>

                      <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                        {sess.description}
                      </p>

                      <div className="space-y-2 py-3 border-y border-stone-800 text-xs text-stone-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{sess.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>With {sess.instructor}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {sess.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-stone-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-800 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-xs text-stone-400">Per Session</span>
                        <span className="text-white font-bold text-lg">₹{sess.price}</span>
                      </div>

                      <button
                        disabled
                        className="w-full py-3 rounded-xl bg-stone-800 text-stone-400 font-bold text-xs sm:text-sm border border-stone-700/60 cursor-not-allowed opacity-80 flex items-center justify-center gap-2"
                      >
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>Book 1:1 Session (Coming Soon)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
