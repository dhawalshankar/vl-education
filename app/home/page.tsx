"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Layers,
  Gift,
  ShoppingCart,
  PenLine,
  Tag,
  Store,
  Eye,
  IndianRupee,
  BarChart3,
  LayoutDashboard,
  Sparkles,
  Mic,
  Award,
  Globe,
  CheckCircle2,
  Users,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";

/* ── Multilingual Directory (Placeholder Tracks) ─────────────────
 * TODO: Connect to backend API: GET /api/v1/courses/languages
 * Fetch live language list and course counts directly from the backend database.
 */
const languages = [
  { id: "hindi", name: "Hindi", native: "हिंदी", count: "Curated Track", region: "Northern & Central India" },
  { id: "english", name: "English", native: "English", count: "Curated Track", region: "Global & Professional" },
  { id: "tamil", name: "Tamil", native: "தமிழ்", count: "Curated Track", region: "Tamil Nadu & Diaspora" },
  { id: "telugu", name: "Telugu", native: "తెలుగు", count: "Curated Track", region: "Andhra & Telangana" },
  { id: "bengali", name: "Bengali", native: "বাংলা", count: "Curated Track", region: "West Bengal & Tripura" },
  { id: "marathi", name: "Marathi", native: "मराठी", count: "Curated Track", region: "Maharashtra" },
  { id: "gujarati", name: "Gujarati", native: "ગુજરાતી", count: "Curated Track", region: "Gujarat" },
  { id: "kannada", name: "Kannada", native: "ಕನ್ನಡ", count: "Curated Track", region: "Karnataka" },
  { id: "malayalam", name: "Malayalam", native: "മലയാളം", count: "Curated Track", region: "Kerala" },
];

const learnerFeatures = [
  {
    icon: Gift,
    title: "Free Starter Courses",
    badge: "Zero Cost",
    text: "Begin learning right away. Every language has free foundation modules with no credit card required.",
  },
  {
    icon: Layers,
    title: "Structured Curriculum",
    badge: "Step-by-Step",
    text: "Every course is organized into progressive modules, script introductions, and practical conversation units.",
  },
  {
    icon: Mic,
    title: "Speech & Pronunciation",
    badge: "Voice-First",
    text: "Practice speaking with AI speech analysis tuned specifically for Indian regional accents and phonemes.",
  },
  {
    icon: ShoppingCart,
    title: "Permanent Ownership",
    badge: "Lifetime Access",
    text: "Purchase premium masterclasses once and retain lifetime access across all your devices.",
  },
];

const educatorSteps = [
  {
    step: "01",
    icon: PenLine,
    title: "Draft Your Curriculum",
    text: "Build your course using our structured editor with rich audio lessons, vocabulary drills, and module quizzes.",
  },
  {
    step: "02",
    icon: Tag,
    title: "Choose Pricing or Free",
    text: "Publish free community primers to gain followers, or set a competitive one-time price in INR (₹).",
  },
  {
    step: "03",
    icon: Store,
    title: "Monetize & Mentor",
    text: "Reach thousands of passionate students across India, review student recordings, and receive direct monthly payouts.",
  },
];

const stats = [
  { value: "22", label: "Scheduled Indian Languages", hint: "From Kashmiri to Tamil" },
  { value: "100%", label: "Free Foundation Tracks", hint: "Start at zero cost" },
  { value: "AI + Human", label: "Speech & Mentor Reviews", hint: "Accurate native feedback" },
  { value: "Verified", label: "Course Certificates", hint: "Share on LinkedIn & resume" },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isInstructor, loading } = useAuth();

  const goLearn = () => router.push(isAuthenticated ? "/dashboard" : "/learn");
  const goTeach = () =>
    router.push(isAuthenticated && isInstructor ? "/dashboard/instructor" : "/auth/login");

  return (
    <div className="min-h-screen bg-[#090807] text-white selection:bg-[#FF5500] selection:text-black">
      {/* Global Navbar */}
      <Navbar />

      {/* ── HERO SECTION WITH HERITAGE ARCHITECTURE BACKDROP ─────────── */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background Unsplash Image: Indian Heritage Architecture & Warmth */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=85')`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            filter: "contrast(115%) brightness(80%)",
          }}
        />

        {/* Ambient Warm Gradient Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 90% 70% at 50% 20%, rgba(255, 85, 0, 0.16), transparent 70%),
              linear-gradient(180deg, rgba(9, 8, 7, 0.4) 0%, rgba(9, 8, 7, 0.85) 60%, #090807 100%)
            `,
          }}
        />

        {/* Subtle Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10 text-center md:text-left">
          {/* Positioning Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FF5500]/15 border border-[#FF5500]/30 backdrop-blur-md mb-8 shadow-lg shadow-[#FF5500]/10">
            <Sparkles className="w-4 h-4 text-[#FF8800] animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-orange-200 tracking-wide uppercase">
              India&apos;s Language Bridge
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-kalam text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.06] tracking-tight max-w-4xl drop-shadow-2xl">
            Learn an Indian language.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA066] via-[#FF7700] to-[#E64A00]">
              Or teach one and earn.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-8 text-lg sm:text-xl md:text-2xl text-stone-300 max-w-2xl leading-relaxed font-normal">
            VartaLang connects India&apos;s native language educators with eager learners through
            structured modules, speech evaluation, and community mentorship.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <button
              onClick={goLearn}
              disabled={loading}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E64A00] hover:from-[#FF6600] hover:to-[#FF5500] font-bold text-white text-base shadow-xl shadow-[#FF5500]/25 transition-all hover:scale-105 flex items-center gap-2.5 disabled:opacity-50"
            >
              <span>{isAuthenticated ? "Go to my dashboard" : "Start learning free"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={goTeach}
              disabled={loading}
              className="px-8 py-4 rounded-xl bg-[#171410]/90 hover:bg-[#201B15] border border-stone-700 hover:border-[#FF5500]/60 text-stone-200 hover:text-white font-bold text-base transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50"
            >
              <span>{isAuthenticated && isInstructor ? "Open instructor dashboard" : "Teach on VartaLang"}</span>
            </button>

            <Link
              href="/learn"
              className="px-5 py-4 text-stone-400 hover:text-white font-medium text-base flex items-center gap-1.5 transition-colors group"
            >
              <span>Browse catalog</span>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#FF8800] transition-colors" />
            </Link>
          </div>

          {/* Value Stats Grid */}
          <div className="mt-16 pt-10 border-t border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="space-y-1">
                <p className="font-kalam text-3xl sm:text-4xl font-bold text-[#FFA066] tabular-nums">
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-stone-200">
                  {s.label}
                </p>
                <p className="text-[11px] text-stone-500">
                  {s.hint}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PICK A LANGUAGE (VERNACULAR GRID) ─────────────── */}
      <section className="relative px-6 py-20 border-t border-stone-800/80 bg-[#0E0C0A]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/25 text-[#FF8800] text-xs font-semibold uppercase tracking-wider mb-3">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#FF5500]/50 text-[#FFA066] text-sm font-semibold transition-all hover:scale-105"
            >
              <span>View all languages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {languages.map((l) => (
              <Link
                key={l.id}
                href={`/learn?lang=${l.id}`}
                className="group p-6 rounded-2xl border border-stone-800/90 hover:border-[#FF5500]/60 bg-[#14110E]/80 backdrop-blur-md transition-all hover:-translate-y-1 shadow-lg hover:shadow-[#FF5500]/10 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-white group-hover:text-[#FFA066] transition-colors">
                      {l.native}
                    </p>
                    <p className="text-base font-semibold text-stone-300 mt-1">
                      {l.name}
                    </p>
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-stone-800/90 text-stone-300 border border-stone-700/60">
                    {l.count}
                  </span>
                </div>

                <div className="pt-4 border-t border-stone-800/70 flex items-center justify-between text-xs text-stone-500">
                  <span>{l.region}</span>
                  <ArrowRight className="w-4 h-4 text-[#FF8800] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FOR LEARNERS WITH KNOWLEDGE LIBRARY BACKDROP ──── */}
      <section className="relative px-6 py-24 border-t border-stone-800/80 overflow-hidden">
        {/* Classical Knowledge Vault Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-luminosity"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507842229451-79b1be8838d6?w=1920&q=85')`,
            backgroundSize: "cover",
            backgroundPosition: "center 45%",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, #090807 0%, rgba(9, 8, 7, 0.92) 50%, #090807 100%)",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Learner Experience</span>
            </div>
            <h2 className="font-kalam text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Built for Real Conversational Fluency
            </h2>
            <p className="mt-3 text-stone-400 text-base leading-relaxed">
              We move beyond generic flashcards. Follow authentic regional scripts, listen to native
              intonations, and gain confidence speaking from lesson one.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {learnerFeatures.map(({ icon: Icon, title, badge, text }) => (
              <div
                key={title}
                className="p-8 rounded-2xl bg-[#14110E]/80 border border-stone-800/90 hover:border-amber-500/40 backdrop-blur-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#FF5500]/15 flex items-center justify-center text-[#FF8800] group-hover:scale-105 transition-transform">
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

      {/* ── SECTION 4: FOR EDUCATORS WITH STUDIO BACKDROP ───────────── */}
      <section className="relative px-6 py-24 border-t border-stone-800/80 overflow-hidden">
        {/* Creator / Studio Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-15 mix-blend-screen"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1920&q=85')`,
            backgroundSize: "cover",
            backgroundPosition: "center 35%",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, #090807 0%, rgba(255, 85, 0, 0.08) 50%, #090807 100%)",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>For Language Educators</span>
            </div>
            <h2 className="font-kalam text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Teach Your Mother Tongue. Get Rewarded.
            </h2>
            <p className="mt-3 text-stone-400 text-base leading-relaxed">
              Are you fluent in an Indian language or dialect? Create courses, set your price, and
              build a dedicated following across the nation.
            </p>
          </div>

          {/* 3 Step Sequence */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {educatorSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="p-8 rounded-2xl bg-[#14110E]/85 border border-stone-800/90 hover:border-orange-500/40 backdrop-blur-md flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-400">
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
          <div className="p-8 md:p-12 rounded-3xl border border-[#FF5500]/30 bg-gradient-to-br from-[#FF5500]/12 via-[#14110E] to-[#14110E] shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <LayoutDashboard className="w-6 h-6 text-[#FF8800]" />
                <h3 className="font-kalam text-3xl font-bold text-white">
                  Instructor Studio & Analytics
                </h3>
                <span className="text-xs px-3 py-1 rounded-full bg-[#FF5500]/20 text-orange-300 font-semibold">
                  Dedicated Creator Suite
                </span>
              </div>
              <p className="text-stone-300 text-base mb-8 leading-relaxed">
                One unified portal to monitor student enrollments, course reviews, direct INR earnings,
                and video/audio storage quotas.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Eye, label: "Content Control", desc: "Toggle free vs paid previews anytime" },
                  { icon: BarChart3, label: "Student Metrics", desc: "Live enrollment & completion stats" },
                  { icon: IndianRupee, label: "Direct INR Payouts", desc: "Monthly settlement to your bank" },
                ].map((item, i) => {
                  const SubIcon = item.icon;
                  return (
                    <div key={i} className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                      <SubIcon className="w-5 h-5 text-[#FF8800] mb-2" />
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-stone-400 mt-1">{item.desc}</p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={goTeach}
                disabled={loading}
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-[#090807] font-bold text-sm transition-all hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <span>{isAuthenticated && isInstructor ? "Open Instructor Studio" : "Apply as an Instructor"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: FINAL CALL TO ACTION ─────────────────────────── */}
      {!isAuthenticated && (
        <section className="px-6 py-24 border-t border-stone-800/80 bg-gradient-to-b from-[#090807] to-[#120F0C]">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FF5500]/20 flex items-center justify-center mx-auto mb-6 text-[#FF8800]">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="font-kalam text-4xl sm:text-5xl font-bold text-white mb-4">
              Begin Your Learning Journey Today
            </h2>
            <p className="text-stone-300 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Create your account in under a minute. Start free courses or explore educator tracks
              across every major Indian language.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E64A00] hover:from-[#FF6600] hover:to-[#FF5500] font-bold text-white text-base shadow-xl shadow-[#FF5500]/25 transition-all hover:scale-105"
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
