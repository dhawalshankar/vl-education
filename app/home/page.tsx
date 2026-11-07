"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Sparkles,
  Globe,
  Users,
  Award,
  Shield,
  CheckCircle2,
  Video,
  Calendar,
  Mic,
  GraduationCap,
  LayoutDashboard,
  IndianRupee,
  Eye,
  BarChart3,
  Layers,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { learnAPI } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";
import {
  LANGUAGE_CATALOG,
  canonicalLanguage,
  presentationFor,
  slugify,
} from "@/app/lib/languages";

type LanguageTab = "featured" | "scheduled22" | "world";

const FEATURED_INDIAN_NAMES = [
  "Hindi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Sanskrit",
  "Odia",
  "Assamese",
];

const learnerFeatures = [
  {
    icon: Mic,
    title: "Native Voice & Pronunciation",
    badge: "Audio-First",
    text: "Hear native speakers pronounce regional intonations, retroflex consonants, and everyday conversational cadences.",
  },
  {
    icon: Layers,
    title: "Structured Modular Curriculum",
    badge: "Step-by-Step",
    text: "Progress logically from foundational scripts and phonetics into intermediate vocabulary and real-world conversation.",
  },
  {
    icon: Award,
    title: "Verifiable Certifications",
    badge: "Accredited",
    text: "Earn digitally verifiable certificates on course completion to showcase on your professional resume and LinkedIn.",
  },
  {
    icon: GraduationCap,
    title: "Permanent Lifetime Access",
    badge: "One-Time ₹ Fee",
    text: "Enroll once with transparent Indian Rupee (₹) pricing and retain lifetime course access with zero monthly subscription traps.",
  },
];

const educatorSteps = [
  {
    step: "01",
    icon: BookOpen,
    title: "Design Your Curriculum",
    text: "Organize lessons into modules, record video masterclasses, and attach downloadable vocabulary & script guides.",
  },
  {
    step: "02",
    icon: IndianRupee,
    title: "Set Your Course Pricing",
    text: "Publish free community primers to build a loyal student following, or set a competitive one-time price in INR (₹).",
  },
  {
    step: "03",
    icon: Users,
    title: "Teach & Receive Direct Payouts",
    text: "Inspire passionate language learners across India and abroad, track student enrollments, and receive verified monthly settlements.",
  },
];

const stats = [
  { value: "22", label: "Scheduled Indian Languages", hint: "From Kashmiri to Tamil" },
  { value: "100%", label: "Cultural Pedagogy", hint: "Script, idiom & dialect roots" },
  { value: "₹0", label: "Free Foundation Modules", hint: "Start at zero cost" },
  { value: "Native", label: "Instructor-Led", hint: "Authentic vernacular reviews" },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isInstructor, loading: authLoading } = useAuth();
  const [langTab, setLangTab] = useState<LanguageTab>("featured");

  // Fetch real counts from the backend API
  const { data: apiLanguages } = useApi(() => learnAPI.languages());

  const courseCounts = useMemo(() => {
    const map = new Map<string, number>();
    (apiLanguages ?? []).forEach((l) => {
      const key = canonicalLanguage(l.language);
      map.set(key, (map.get(key) ?? 0) + l.course_count);
    });
    return map;
  }, [apiLanguages]);

  const goLearn = () => router.push(isAuthenticated ? "/dashboard" : "/learn");
  const goTeach = () =>
    router.push(isAuthenticated && isInstructor ? "/dashboard/instructor" : "/auth/login");

  // Filter languages according to the active tab
  const displayedLanguages = useMemo(() => {
    if (langTab === "featured") {
      return LANGUAGE_CATALOG.filter((l) => FEATURED_INDIAN_NAMES.includes(l.name));
    }
    if (langTab === "scheduled22") {
      return LANGUAGE_CATALOG.filter((l) => l.group === "indian");
    }
    // "world" includes English and Foreign languages
    return LANGUAGE_CATALOG.filter((l) => l.group === "english" || l.group === "foreign");
  }, [langTab]);

  return (
    <div className="min-h-screen bg-[#0e0c0a] text-white selection:bg-[#FF5500] selection:text-white relative overflow-hidden flex flex-col justify-between">
      {/* Global Navbar */}
      <Navbar />

      {/* ── BACKGROUND INDIAN MONUMENT BACKDROP (VISIBLE & WARM) ───────── */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-50 bg-cover bg-center scale-105 transition-opacity duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=85')`,
          filter: "contrast(112%) brightness(95%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 15%, rgba(255, 85, 0, 0.18), transparent 70%),
            linear-gradient(180deg, rgba(14, 12, 10, 0.45) 0%, rgba(14, 12, 10, 0.72) 45%, #0e0c0a 100%)
          `,
        }}
      />

      {/* ── SECTION 1: HERO (REFINED SIZING & PRESTIGIOUS BRANDING) ────── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 text-center">
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-400/30 backdrop-blur-md mb-8 shadow-lg shadow-amber-500/10">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-amber-200 tracking-wide uppercase">
              India&apos;s Cultural &amp; Vernacular Learning Gateway
            </span>
          </div>

          {/* Sized & Balanced Headline */}
          <h1 className="font-kalam text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.12] tracking-tight max-w-4xl mx-auto drop-shadow-2xl">
            Learn an Indian language.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500">
              Or teach one and earn.
            </span>
          </h1>

          {/* Sized Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Master India&apos;s 22 scheduled languages, English, and in-demand world languages through
            structured video courses, script training, speech intonation, and native mentorship.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={goLearn}
              disabled={authLoading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-base shadow-xl shadow-orange-500/25 transition-all hover:scale-105 flex items-center gap-2.5 disabled:opacity-50"
            >
              <span>{isAuthenticated ? "Go to my dashboard" : "Start learning free"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={goTeach}
              disabled={authLoading}
              className="px-8 py-3.5 rounded-2xl bg-[#16130F]/90 hover:bg-[#201B15] border border-amber-500/30 hover:border-amber-500/60 text-stone-200 hover:text-white font-bold text-base transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50"
            >
              <span>{isAuthenticated && isInstructor ? "Open instructor studio" : "Teach on VartaLang"}</span>
            </button>

            <Link
              href="/learn"
              className="px-5 py-3.5 text-stone-400 hover:text-amber-300 font-medium text-base flex items-center gap-1.5 transition-colors group"
            >
              <span>Explore catalog</span>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-amber-400 transition-colors" />
            </Link>
          </div>

          {/* Value Stats Grid */}
          <div className="mt-16 pt-10 border-t border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i} className="space-y-1">
                <p className="font-kalam text-3xl sm:text-4xl font-bold text-amber-300 tabular-nums">
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-stone-200">
                  {s.label}
                </p>
                <p className="text-[11px] text-stone-400">
                  {s.hint}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: 3 CORE OFFERINGS (COURSES, WORKSHOPS & 1:1 SESSIONS) ── */}
      <section className="relative px-4 sm:px-6 py-20 border-t border-stone-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Complete Learning Ecosystem</span>
            </div>
            <h2 className="font-kalam text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Three Ways to Master Any Language
            </h2>
            <p className="mt-3 text-stone-400 text-sm sm:text-base leading-relaxed">
              Whether you prefer self-paced video modules, live group workshops, or private 1:1 native mentoring,
              VartaLang provides the ideal environment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Offering 1: Courses (Live) */}
            <div className="p-8 rounded-3xl bg-[#14110E]/85 border border-amber-500/40 backdrop-blur-md shadow-xl flex flex-col justify-between group hover:border-amber-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    Active &amp; Enrolling
                  </span>
                </div>
                <h3 className="font-kalam text-2xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                  Structured Video Courses
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed mb-6">
                  Self-paced video modules with complete grammar frameworks, script introductions, and downloadable lesson materials.
                </p>
                <ul className="space-y-2 text-xs text-stone-400 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Permanent lifetime course access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Verified completion certificate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Zero recurring subscriptions</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/learn"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-sm text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <span>Browse courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Offering 2: Workshops (Online & Offline Mock) */}
            <div className="p-8 rounded-3xl bg-[#14110E]/85 border border-stone-800 backdrop-blur-md shadow-xl flex flex-col justify-between group hover:border-orange-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-stone-400">
                    Coming Soon
                  </span>
                </div>
                <h3 className="font-kalam text-2xl font-bold text-white mb-2">
                  Interactive Workshops
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed mb-6">
                  Immersive online cohorts and in-person weekend bootcamps for regional calligraphy, accent reduction, and cultural storytelling.
                </p>
                <ul className="space-y-2 text-xs text-stone-400 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>Virtual and physical city workshops</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>Hands-on group conversation circles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>Guest sessions by vernacular authors</span>
                  </li>
                </ul>
              </div>
              <button
                disabled
                className="w-full py-3 rounded-xl bg-stone-800/80 border border-stone-700/60 text-stone-400 font-semibold text-sm cursor-not-allowed text-center"
              >
                Request Workshop Seat · Coming Soon
              </button>
            </div>

            {/* Offering 3: 1:1 Live Sessions (Mock) */}
            <div className="p-8 rounded-3xl bg-[#14110E]/85 border border-stone-800 backdrop-blur-md shadow-xl flex flex-col justify-between group hover:border-amber-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                    <Video className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-stone-400">
                    Coming Soon
                  </span>
                </div>
                <h3 className="font-kalam text-2xl font-bold text-white mb-2">
                  1:1 Live Sessions
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed mb-6">
                  Private, dedicated speaking sessions with verified native language educators focused on your specific professional or travel needs.
                </p>
                <ul className="space-y-2 text-xs text-stone-400 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Tailored 30 &amp; 60 minute speaking slots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Immediate accent &amp; grammar feedback</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Flexible reschedule policy</span>
                  </li>
                </ul>
              </div>
              <button
                disabled
                className="w-full py-3 rounded-xl bg-stone-800/80 border border-stone-700/60 text-stone-400 font-semibold text-sm cursor-not-allowed text-center"
              >
                Book 1:1 Session · Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: MULTILINGUAL DIRECTORY (PICK YOUR TARGET LANGUAGE) ── */}
      <section className="relative px-4 sm:px-6 py-20 border-t border-stone-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Globe className="w-3.5 h-3.5" />
                <span>Multilingual Directory</span>
              </div>
              <h2 className="font-kalam text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Pick Your Target Language
              </h2>
              <p className="mt-2 text-stone-400 text-sm sm:text-base max-w-xl">
                Explore dedicated courses in native scripts with pronunciation audio and certified syllabus.
              </p>
            </div>

            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#14110E] border border-stone-700 hover:border-amber-500 text-amber-300 text-sm font-semibold transition-all hover:scale-105"
            >
              <span>View full catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Segmented Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 rounded-2xl bg-stone-900/80 border border-stone-800 w-fit">
            <button
              onClick={() => setLangTab("featured")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                langTab === "featured"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Featured Indian Languages
            </button>
            <button
              onClick={() => setLangTab("scheduled22")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                langTab === "scheduled22"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              All 22 Scheduled Languages
            </button>
            <button
              onClick={() => setLangTab("world")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                langTab === "world"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              English &amp; World Languages
            </button>
          </div>

          {/* Language Grid with real routing & real counts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedLanguages.map((l) => {
              const pres = presentationFor(l.name);
              const count = courseCounts.get(l.name) ?? 0;
              const hasCourses = count > 0;
              const targetHref = `/learn/${slugify(l.name)}`;

              return (
                <Link
                  key={l.name}
                  href={targetHref}
                  className="group p-5 rounded-2xl border border-stone-800 hover:border-amber-500/60 bg-[#14110E]/85 backdrop-blur-md transition-all hover:-translate-y-1 shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-lg shrink-0">
                        {pres.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-white group-hover:text-amber-200 transition-colors truncate">
                          {l.name}
                        </p>
                        <p className="text-xs text-stone-400 truncate">
                          {l.native}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                    {hasCourses ? (
                      <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {count} {count === 1 ? "course" : "courses"}
                      </span>
                    ) : (
                      <span className="text-stone-500 font-medium">Coming soon</span>
                    )}
                    <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] font-semibold">
                      Explore <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: FOR LEARNERS (PEDAGOGY & FLUENCY) ──────────────── */}
      <section className="relative px-4 sm:px-6 py-20 border-t border-stone-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Learner Experience</span>
            </div>
            <h2 className="font-kalam text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Built for Genuine Conversational Fluency
            </h2>
            <p className="mt-3 text-stone-400 text-base leading-relaxed">
              We go beyond isolated flashcards. Master authentic regional scripts, natural sentence structures,
              and culturally nuanced expressions with native educators.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {learnerFeatures.map(({ icon: Icon, title, badge, text }) => (
              <div
                key={title}
                className="p-7 rounded-3xl bg-[#14110E]/85 border border-amber-500/20 hover:border-amber-500/50 backdrop-blur-md transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700/60">
                      {badge}
                    </span>
                  </div>
                  <h3 className="font-kalam text-2xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-stone-400 leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: FOR EDUCATORS (TEACH & EARN) ──────────────────── */}
      <section className="relative px-4 sm:px-6 py-20 border-t border-stone-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>For Language Educators</span>
            </div>
            <h2 className="font-kalam text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Teach Your Mother Tongue. Get Rewarded.
            </h2>
            <p className="mt-3 text-stone-400 text-base leading-relaxed">
              Are you fluent in an Indian language or dialect? Create structured courses, set your price in INR (₹),
              and build a dedicated nationwide following.
            </p>
          </div>

          {/* 3 Step Sequence */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {educatorSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="p-7 rounded-3xl bg-[#14110E]/85 border border-stone-800 hover:border-orange-500/40 backdrop-blur-md flex flex-col justify-between transition-all shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-xs font-bold text-stone-500">
                        STEP {step.step}
                      </span>
                    </div>

                    <h3 className="font-kalam text-2xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-stone-400 leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Instructor Studio Teaser Card */}
          <div className="p-8 md:p-12 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-[#14110E] to-[#14110E] shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <LayoutDashboard className="w-6 h-6 text-amber-400" />
                <h3 className="font-kalam text-3xl font-bold text-white">
                  Instructor Studio &amp; Analytics
                </h3>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  Dedicated Creator Suite
                </span>
              </div>
              <p className="text-stone-300 text-sm sm:text-base mb-8 leading-relaxed">
                One unified portal to monitor student enrollments, course reviews, direct INR settlements,
                and lesson materials.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Eye, label: "Content Control", desc: "Toggle free vs paid previews anytime" },
                  { icon: BarChart3, label: "Student Metrics", desc: "Live enrollment & completion stats" },
                  { icon: IndianRupee, label: "Direct INR Payouts", desc: "Monthly settlements to your bank" },
                ].map((item, i) => {
                  const SubIcon = item.icon;
                  return (
                    <div key={i} className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
                      <SubIcon className="w-5 h-5 text-amber-400 mb-2" />
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-stone-400 mt-1">{item.desc}</p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={goTeach}
                disabled={authLoading}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-sm transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <span>{isAuthenticated && isInstructor ? "Open Instructor Studio" : "Apply as an Instructor"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FINAL INVITATION CTA ──────────────────────────── */}
      {!isAuthenticated && (
        <section className="px-4 sm:px-6 py-20 border-t border-stone-800/80 bg-gradient-to-b from-[#0e0c0a] to-[#14110E]">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6 text-amber-400">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="font-kalam text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Begin Your Linguistic Journey Today
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
              Create your account in under a minute. Start exploring free foundation modules across
              every major Indian language.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-base shadow-xl shadow-orange-500/25 transition-all hover:scale-105"
            >
              <span>Get started for free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* Global Minimalist Footer */}
      <Footer />
    </div>
  );
}
