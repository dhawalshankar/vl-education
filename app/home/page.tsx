// app/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Bot,
  Check,
  Flame,
  Globe,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Video,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { learnAPI } from "@/app/lib/api";
import type { CourseCard, LanguageSummary } from "@/app/lib/api";
import { slugify } from "@/app/lib/languages";

/* ── images ──
   Unsplash IDs: open each once to confirm it shows what you want.
   For Freepik (or any licensed photo): download to /public/images and use "/images/name.jpg". */
const unsplash = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const IMAGES = {
  hero: unsplash("photo-1548013146-72479768bada", 1920), // Taj Mahal, iconic Indian cultural monument
  path: {
    learn: unsplash("photo-1582510003544-4d00b7f74220", 900), // Mehrangarh Fort grand architectural heritage
    practice: unsplash("photo-1598324789736-4861f89564a0", 900), // Traditional Indian palace courtyard
    compete: unsplash("photo-1587474260584-136574528ed5", 900), // Historic Qutub Minar heritage
    certify: unsplash("photo-1585135497273-1a86b09fe70e", 900), // Humayun's Tomb regal landmark
  },
  courseCovers: [
    unsplash("photo-1548013146-72479768bada", 900), // Taj Mahal
    unsplash("photo-1582510003544-4d00b7f74220", 900), // Mehrangarh Fort
    unsplash("photo-1599661046289-e31897846e41", 900), // Golden Indian palace
  ],
  labs: unsplash("photo-1564507592333-c60657eea523", 1200), // Golden Temple Amritsar spiritual cultural heritage
  sessions: unsplash("photo-1582510003544-4d00b7f74220", 1200), // Jodhpur heritage palace
  workshops: unsplash("photo-1605649487212-47bdab064df8", 1200), // Indian cultural festive gathering
  challenges: unsplash("photo-1587474260584-136574528ed5", 1200), // Historic landmark
  teach: unsplash("photo-1609137144822-0d12792c3065", 1800), // Hawa Mahal Jaipur royal heritage
  cta: unsplash("photo-1524492412937-b28074a5d7da", 1920), // Grand Taj Mahal
};

/* ── content ── */
const GREETINGS = [
  { lang: "Hindi", code: "hi", text: "नमस्ते" },
  { lang: "Tamil", code: "ta", text: "வணக்கம்" },
  { lang: "Bengali", code: "bn", text: "নমস্কার" },
  { lang: "Telugu", code: "te", text: "నమస్కారం" },
  { lang: "Kannada", code: "kn", text: "ನಮಸ್ಕಾರ" },
  { lang: "Malayalam", code: "ml", text: "നമസ്കാരം" },
  { lang: "Gujarati", code: "gu", text: "નમસ્તે" },
  { lang: "Punjabi", code: "pa", text: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ" },
  { lang: "Marathi", code: "mr", text: "नमस्कार" },
];

// Faint letters floating in the hero background
const FLOATING_GLYPHS = [
  { ch: "अ", code: "hi", top: "14%", left: "3%", size: "text-7xl", delay: 0 },
  { ch: "த", code: "ta", top: "62%", left: "6%", size: "text-6xl", delay: 1.2 },
  { ch: "ক", code: "bn", top: "10%", left: "46%", size: "text-5xl", delay: 2.1 },
  { ch: "ક", code: "gu", top: "74%", left: "48%", size: "text-6xl", delay: 0.6 },
  { ch: "ఋ", code: "te", top: "20%", left: "90%", size: "text-7xl", delay: 1.8 },
  { ch: "ਸ", code: "pa", top: "70%", left: "92%", size: "text-5xl", delay: 2.6 },
];

// Shown only if the languages API is unreachable
const FALLBACK_LANGUAGES = [
  "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", "Hindi", "Kannada",
  "Kashmiri", "Konkani", "Maithili", "Malayalam", "Manipuri", "Marathi",
  "Nepali", "Odia", "Punjabi", "Sanskrit", "Santali", "Sindhi", "Tamil",
  "Telugu", "Urdu", "English", "Spanish", "French", "German", "Japanese",
  "Korean", "Mandarin Chinese", "Arabic",
];

type Status = "live" | "soon";

// Flip a status to "live" here as each feature ships
const STATUS: Record<
  "courses" | "labs" | "challenges" | "certificates" | "sessions" | "workshops",
  Status
> = {
  courses: "live",
  labs: "soon",
  challenges: "soon",
  certificates: "soon",
  sessions: "soon",
  workshops: "soon",
};

const LEVELS = [
  { name: "Foundation", note: "Read, write and handle everyday greetings." },
  { name: "Intermediate", note: "Hold a conversation on familiar topics." },
  { name: "Professional", note: "Use the language confidently at work." },
  { name: "Mastery", note: "Nuance, idiom and fluent, formal writing." },
];

const focusCls =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5500]";

const dotGrid: CSSProperties = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

const paperTexture: CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(120,80,30,0.10) 1px, transparent 1px), radial-gradient(rgba(120,80,30,0.06) 1px, transparent 1px)",
  backgroundSize: "22px 22px, 11px 11px",
  backgroundPosition: "0 0, 5px 5px",
};

/* ── small pieces ── */
// Plain <img>, so no next.config remotePatterns needed. Falls back to a gradient if the URL fails.
function Photo({ src, alt = "", className = "" }: { src: string; alt?: string; className?: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return <div aria-hidden className={`bg-gradient-to-br from-[#3a2412] via-[#22160d] to-[#14110e] ${className}`} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} className={`object-cover ${className}`} />
  );
}

function Glow({ className }: { className: string }) {
  return <div aria-hidden className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />;
}

function StatusChip({ status }: { status: Status }) {
  return status === "live" ? (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
      Live
    </span>
  ) : (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/40 text-stone-300 border border-white/15 backdrop-blur-sm">
      Coming soon
    </span>
  );
}

function Check4({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-stone-200">
      <Check className="w-4 h-4 mt-1 text-[#FF7700] shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`inline-flex w-full sm:w-auto items-center justify-center px-4 sm:px-6 py-3 rounded-full bg-[#FF5500] hover:bg-[#FF6A1F] text-white text-center font-semibold text-sm shadow-lg shadow-[#FF5500]/25 transition-colors ${focusCls}`}
    >
      {children}
    </Link>
  );
}

function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`inline-flex w-full sm:w-auto items-center justify-center px-4 sm:px-6 py-3 rounded-full border border-white/25 bg-black/20 backdrop-blur-sm hover:border-white/60 text-white text-center font-semibold text-sm transition-colors ${focusCls}`}
    >
      {children}
    </Link>
  );
}

function Pill({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/15 bg-black/40 backdrop-blur-md px-4 py-2 text-sm text-stone-200">
      <Icon className="w-4 h-4 text-[#FF7700]" />
      {children}
    </span>
  );
}

function GreetingMarquee() {
  const loop = [...GREETINGS, ...GREETINGS];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-[#0d0b09] py-5" aria-hidden>
      <div className="vl-marquee flex w-max items-center gap-12 whitespace-nowrap">
        {loop.map((g, i) => (
          <span key={`${g.lang}-${i}`} className="flex items-center gap-12">
            <span lang={g.code} className="font-kalam text-xl sm:text-2xl font-bold leading-tight">
              {g.text}
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500">{g.lang}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0d0b09] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0d0b09] to-transparent" />
    </div>
  );
}

/* ═══════════════════════════ PAGE ═══════════════════════════ */
export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [languages, setLanguages] = useState<LanguageSummary[]>([]);
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [active, setActive] = useState(0);

  // The highlighted greeting rotates (skipped for reduced motion)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % GREETINGS.length), 2600);
    return () => clearInterval(id);
  }, []);

  // Real catalog data. If the API is down the page still renders with the static list.
  useEffect(() => {
    let alive = true;
    learnAPI
      .languages()
      .then((l) => alive && setLanguages(l))
      .catch(() => {});
    learnAPI
      .courses()
      .then((list) => {
        if (!alive) return;
        const picked = [...list].sort((a, b) => Number(b.is_featured) - Number(a.is_featured)).slice(0, 3);
        setCourses(picked);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const languageList: LanguageSummary[] = languages.length
    ? languages
    : FALLBACK_LANGUAGES.map((language) => ({ language, course_count: 0 }));

  const primary = isAuthenticated
    ? { href: "/dashboard", label: "Go to My Learning" }
    : { href: "/auth/login", label: "Sign in with VartaLang" };
  const isTeacher = isAuthenticated && (user?.role === "instructor" || user?.role === "admin");

  const pathSteps = [
    { icon: BookOpen, title: "Learn", img: IMAGES.path.learn, text: "Structured courses with video lessons and notes, taught by instructors who teach the language.", status: STATUS.courses },
    { icon: Bot, title: "Practice", img: IMAGES.path.practice, text: "Speak or write with an AI partner and get your mistakes explained on the spot.", status: STATUS.labs },
    { icon: Trophy, title: "Compete", img: IMAGES.path.compete, text: "Timed challenges that earn XP and put you on a leaderboard.", status: STATUS.challenges },
    { icon: Award, title: "Certify", img: IMAGES.path.certify, text: "Level-based certificates with an ID that anyone can verify.", status: STATUS.certificates },
  ];

  return (
    <div className="cultural-page min-h-screen text-white flex flex-col justify-between">
      <style>{`
        @keyframes vl-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes vl-float { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-18px) rotate(4deg); } }
        .vl-marquee { animation: vl-marquee 45s linear infinite; }
        .vl-float { animation: vl-float 9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .vl-marquee, .vl-float { animation: none; } }
      `}</style>

      <Navbar />

      <main>
        {/* ── HERO ── */}
        <section className="relative overflow-hidden pt-32 sm:pt-36 pb-16 sm:pb-20 lg:pb-24">
          <div className="absolute inset-0" aria-hidden>
            <Photo src={IMAGES.hero} className="w-full h-full opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/30 via-[#0a0908]/50 to-[#0a0908]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908]/80 via-[#0a0908]/30 to-transparent" />
            <div className="absolute inset-0" style={dotGrid} />
          </div>
          <Glow className="w-[28rem] h-[28rem] bg-[#FF5500]/25 -top-32 -left-32" />
          <Glow className="w-[24rem] h-[24rem] bg-amber-500/15 bottom-0 right-0" />

          {/* floating scripts */}
          <div className="absolute inset-0 hidden md:block pointer-events-none select-none" aria-hidden>
            {FLOATING_GLYPHS.map((g) => (
              <span
                key={g.ch}
                lang={g.code}
                className={`vl-float absolute font-kalam font-bold text-[#FF7700]/20 ${g.size}`}
                style={{ top: g.top, left: g.left, animationDelay: `${g.delay}s` }}
              >
                {g.ch}
              </span>
            ))}
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#FF5500]/40 bg-[#FF5500]/10 px-3 py-1 text-xs font-semibold text-[#FF9955]">
                  <Sparkles className="w-3.5 h-3.5" /> Built for Indian languages
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                  <Award className="w-3.5 h-3.5" /> Accepted into Sarvam Startup Program
                </span>
              </div>
              <h1 className="mt-5 font-kalam text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight drop-shadow-lg">
                Learn an Indian language.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA066] via-[#FF7700] to-[#E64A00]">
                  Rooted in culture, spoken with pride.
                </span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-stone-200 max-w-xl leading-relaxed">
                Take courses in India&apos;s 22 scheduled languages, practice speech intonations with an AI partner, compete in challenges, and earn verified certificates.
              </p>
              <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row gap-3">
                <PrimaryButton href={primary.href}>{primary.label}</PrimaryButton>
                <GhostButton href="/learn">Browse courses</GhostButton>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
                <Pill icon={Globe}>22 Indian languages + English + in-demand foreign languages</Pill>
                <Pill icon={Video}>Video + notes</Pill>
                <Pill icon={Check}>Free preview lessons</Pill>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-3 sm:p-5 shadow-2xl">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {GREETINGS.map((g, i) => (
                    <Link
                      key={g.lang}
                      href={`/learn/${slugify(g.lang)}`}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className={`min-w-0 rounded-xl border px-2 py-4 sm:px-3 sm:py-8 text-center transition-all duration-500 ${focusCls} ${
                        active === i
                          ? "bg-[#FF5500] border-[#FF5500] text-white shadow-lg shadow-[#FF5500]/30 scale-[1.03]"
                          : "bg-white/[0.04] border-white/10 text-stone-200 hover:border-white/40"
                      }`}
                    >
                      <span lang={g.code} className="block text-xl sm:text-3xl font-bold leading-tight break-words">
                        {g.text}
                      </span>
                      <span className={`block mt-2 text-xs leading-tight break-words ${active === i ? "text-white/85" : "text-stone-400"}`}>
                        {g.lang}
                      </span>
                    </Link>
                  ))}
                </div>
                <p className="mt-4 text-center text-sm text-stone-300">Hello, in nine scripts. Open one to see its courses.</p>
              </div>
            </div>
          </div>
        </section>

        <GreetingMarquee />

        {/* ── THE PATH ── */}
        <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
          <div className="absolute inset-0" style={dotGrid} aria-hidden />
          <Glow className="w-96 h-96 bg-[#FF5500]/10 top-10 -right-24" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-kalam text-3xl sm:text-4xl font-bold max-w-2xl">From first lesson to verifiable mastery</h2>
            <p className="mt-3 text-stone-400 max-w-2xl">
              VartaLang guides you every step of the way: learn foundational scripts, practice native speech intonations, compete on leaderboards, and earn verifiable credentials.
            </p>

            <ol className="mt-8 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {pathSteps.map((s, i) => (
                <li
                  key={s.title}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-white/30 transition-colors"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Photo src={s.img} className="w-full h-full transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/40 to-transparent" />
                    <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/25 flex items-center justify-center text-sm font-semibold">
                      {i + 1}
                    </span>
                    <span className="absolute top-3 right-3">
                      <StatusChip status={s.status} />
                    </span>
                    <span className="absolute bottom-3 left-4 w-11 h-11 rounded-xl bg-[#FF5500] shadow-lg shadow-[#FF5500]/30 flex items-center justify-center">
                      <s.icon className="w-5 h-5 text-white" />
                    </span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-kalam text-2xl font-bold">{s.title}</h3>
                    <p className="mt-2 text-sm text-stone-400 leading-relaxed">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── COURSES ── */}
        <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24 border-t border-white/10 bg-gradient-to-b from-[#0d0a08] to-[#0a0908]">
          <Glow className="w-[26rem] h-[26rem] bg-amber-500/10 -top-20 -left-20" />
          <Glow className="w-[22rem] h-[22rem] bg-[#FF5500]/10 bottom-0 right-0" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-kalam text-3xl sm:text-4xl font-bold">Courses in your language</h2>
                <p className="mt-3 text-stone-400 max-w-xl">
                  Modules and lessons with video and study notes. Start with a free preview lesson before you commit.
                </p>
              </div>
              <GhostButton href="/learn">See all courses</GhostButton>
            </div>

            <div className="mt-6 sm:mt-8 -mx-4 px-4 flex flex-nowrap gap-2 overflow-x-auto pb-2 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {languageList.map((l) => (
                <Link
                  key={l.language}
                  href={`/learn/${slugify(l.language)}`}
                  className={`shrink-0 max-w-[85vw] whitespace-nowrap px-4 py-2 rounded-full border border-white/15 bg-white/[0.03] hover:border-[#FF5500] hover:bg-[#FF5500]/10 text-sm text-stone-200 transition-colors ${focusCls}`}
                >
                  {l.language}
                  {l.course_count > 0 && (
                    <span className="ml-2 text-xs text-stone-500">
                      {l.course_count} {l.course_count === 1 ? "course" : "courses"}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {courses.length > 0 && (
              <div className="mt-10 grid md:grid-cols-3 gap-6">
                {courses.map((c, i) => (
                  <Link
                    key={c.id}
                    href={`/learn/${slugify(c.language)}/${c.id}`}
                    className={`group rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/30 hover:-translate-y-1 overflow-hidden flex flex-col transition-all duration-300 ${focusCls}`}
                  >
                    <div className="relative h-44 overflow-hidden">
                      <Photo
                        src={IMAGES.courseCovers[i % IMAGES.courseCovers.length]}
                        className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908]/90 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-4 flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-stone-100">{c.language}</span>
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-stone-200 capitalize">{c.level}</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-kalam text-2xl font-bold leading-snug">{c.title}</h3>
                        <p className="mt-2 text-sm text-stone-400">by {c.instructor.full_name}</p>
                      </div>
                      <p className="mt-6 text-sm font-semibold text-amber-300">{c.is_free ? "Free" : `₹${Number(c.price)}`}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── AI PRACTICE LABS ── */}
        <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24 border-t border-white/10">
          <div className="absolute inset-0" aria-hidden>
            <Photo src={IMAGES.labs} className="w-full h-full opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908] via-[#0a0908]/85 to-[#0a0908]/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-transparent to-[#0a0908]" />
          </div>
          <Glow className="w-96 h-96 bg-[#FF5500]/20 top-1/3 right-10" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#FF7700]" />
                </span>
                <StatusChip status={STATUS.labs} />
              </div>
              <h2 className="mt-4 font-kalam text-3xl sm:text-4xl font-bold">Practice with an AI partner that corrects you</h2>
              <p className="mt-4 text-stone-300 leading-relaxed max-w-xl">
                Lessons teach you the language. Labs make you use it. Pick a real-life scenario, speak or type, and get
                each mistake explained so it sticks.
              </p>
              <ul className="mt-6 space-y-3 max-w-xl">
                <Check4>Scenarios from daily life: markets, offices, travel, phone calls.</Check4>
                <Check4>Corrections come with the reason, not just the right answer.</Check4>
                <Check4>Practice any time, as many times as you like.</Check4>
              </ul>
            </div>

            <div className="relative">
              <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-[#FF5500]/40 via-transparent to-amber-400/30 blur-xl" aria-hidden />
              <div className="relative rounded-3xl bg-[#14110e]/90 backdrop-blur-xl border border-white/15 p-4 sm:p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-stone-400">Sample session: ordering chai, Hindi</p>
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3">
                    <span lang="hi" className="break-words">आप क्या लेंगे?</span>
                    <span className="block text-xs text-stone-400 mt-1">What will you have?</span>
                  </div>
                  <div className="max-w-[85%] ml-auto rounded-2xl rounded-br-sm bg-[#FF5500] px-4 py-3">
                    Mujhe ek chai chahiye
                  </div>
                  <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3">
                    <p className="text-amber-200 font-semibold text-xs">Correction</p>
                    <p className="mt-1">
                      Try: <span lang="hi" className="font-semibold break-words">मुझे एक चाय चाहिए।</span>
                    </p>
                    <p className="mt-1 text-xs text-stone-300">
                      Your sentence is right. Practice writing it in Devanagari: <span lang="hi">चाय</span> has a long
                      &ldquo;aa&rdquo; sound.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LIVE, WITH PEOPLE ── */}
        <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24 border-t border-white/10 bg-[#0c0a08]">
          <div className="absolute inset-0" style={dotGrid} aria-hidden />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-kalam text-3xl sm:text-4xl font-bold max-w-2xl">Learn live with your instructor</h2>
            <p className="mt-3 text-stone-400 max-w-2xl">
              Some things need a person: pronunciation, confidence, a conversation that goes off script.
            </p>

            <div className="mt-8 sm:mt-10 grid md:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  icon: Video,
                  img: IMAGES.sessions,
                  status: STATUS.sessions,
                  title: "1:1 live sessions",
                  text: "Book a private session with an instructor and spend the time on what you need.",
                  points: [
                    "Fix pronunciation with direct feedback.",
                    "Rehearse an interview or an important conversation.",
                    "Get stuck points from a course cleared up.",
                  ],
                },
                {
                  icon: Users,
                  img: IMAGES.workshops,
                  status: STATUS.workshops,
                  title: "Workshops",
                  text: "Small-group, single-topic sessions that end with you able to do something new.",
                  points: [
                    "Conversation circles to speak with other learners.",
                    "Script weekends: learn to read a new script fast.",
                    "Exam preparation and cultural deep-dives.",
                  ],
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="group relative rounded-3xl overflow-hidden border border-white/10 min-h-[400px] sm:min-h-[480px] flex flex-col justify-end"
                >
                  <Photo
                    src={card.img}
                    className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/80 to-[#0a0908]/10" />
                  <div className="relative p-5 sm:p-8">
                    <div className="flex items-center justify-between">
                      <span className="w-11 h-11 rounded-xl bg-[#FF5500] shadow-lg shadow-[#FF5500]/30 flex items-center justify-center">
                        <card.icon className="w-5 h-5 text-white" />
                      </span>
                      <StatusChip status={card.status} />
                    </div>
                    <h3 className="mt-5 font-kalam text-3xl font-bold">{card.title}</h3>
                    <p className="mt-3 text-stone-200 leading-relaxed">{card.text}</p>
                    <ul className="mt-5 space-y-3">
                      {card.points.map((p) => (
                        <Check4 key={p}>{p}</Check4>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CHALLENGES ── */}
        <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24 border-t border-white/10">
          <Glow className="w-[28rem] h-[28rem] bg-[#FF5500]/15 top-0 -left-24" />
          <Glow className="w-80 h-80 bg-amber-500/10 bottom-0 right-0" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
            <div className="order-2 lg:order-1 relative rounded-3xl overflow-hidden border border-white/10 min-h-[360px] sm:min-h-[460px] flex items-end">
              <Photo src={IMAGES.challenges} className="absolute inset-0 w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/50 to-[#0a0908]/10" />

              <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1.5 text-xs font-semibold text-amber-300">
                <Flame className="w-4 h-4" /> 7-day streak
              </span>
              <span className="absolute top-5 right-5 inline-flex items-center gap-2 rounded-full bg-[#FF5500] px-3 py-1.5 text-xs font-semibold shadow-lg shadow-[#FF5500]/30">
                <Zap className="w-4 h-4" /> +120 XP
              </span>

              <div className="relative w-full m-4 rounded-2xl bg-[#14110e]/85 backdrop-blur-xl border border-white/15 p-5">
                <p className="text-xs text-stone-400 mb-2">Sample challenges</p>
                <ul className="divide-y divide-white/10">
                  {[
                    { name: "Match the script", type: "Vocabulary", level: "Easy", xp: 50 },
                    { name: "Fix the sentence", type: "Grammar", level: "Medium", xp: 120 },
                    { name: "Say it out loud", type: "Speaking", level: "Hard", xp: 250 },
                  ].map((c) => (
                    <li key={c.name} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{c.type}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm text-amber-300 font-semibold">{c.xp} XP</p>
                        <p className="text-xs text-stone-500 mt-0.5">{c.level}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#FF7700]" />
                </span>
                <StatusChip status={STATUS.challenges} />
              </div>
              <h2 className="mt-4 font-kalam text-3xl sm:text-4xl font-bold">Challenges that make practice a habit</h2>
              <p className="mt-4 text-stone-300 leading-relaxed max-w-xl">
                Contest-style rounds for vocabulary, grammar and speaking. Beat the clock, earn XP, climb the leaderboard
                and keep your daily streak alive.
              </p>
              <ul className="mt-6 space-y-3 max-w-xl">
                <Check4>Short rounds you can finish in a few minutes.</Check4>
                <Check4>Difficulty from easy warm-ups to hard speaking rounds.</Check4>
                <Check4>A leaderboard per language.</Check4>
              </ul>
            </div>
          </div>
        </section>

        {/* ── CERTIFICATIONS (light band) ── */}
        <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24 bg-[#F1E7D6] text-stone-900">
          <div className="absolute inset-0" style={paperTexture} aria-hidden />
          <div className="absolute -top-10 -left-10 w-80 h-80 rounded-full bg-[#FF7700]/15 blur-3xl" aria-hidden />
          <div className="absolute -bottom-16 right-0 w-96 h-96 rounded-full bg-[#C2410C]/15 blur-3xl" aria-hidden />
          {/* faint scripts */}
          <div className="absolute inset-0 pointer-events-none select-none font-kalam font-bold text-[#C2410C]/[0.07]" aria-hidden>
            <span lang="hi" className="absolute top-6 right-[8%] text-[9rem] leading-none">अ</span>
            <span lang="ta" className="absolute bottom-4 left-[4%] text-[8rem] leading-none">த</span>
            <span lang="bn" className="absolute top-1/2 left-[46%] text-[7rem] leading-none">ক</span>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
            <div>
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-[#C2410C]" />
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-900/10 text-stone-700 border border-stone-900/15">
                  {STATUS.certificates === "live" ? "Live" : "Coming soon"}
                </span>
              </div>
              <h2 className="mt-4 font-kalam text-3xl sm:text-4xl font-bold">Certificates you can prove</h2>
              <p className="mt-4 text-stone-700 leading-relaxed max-w-xl">
                Pass a level and get a certificate with its own ID. Share the ID and anyone can check that it is real.
              </p>

              <ul className="mt-6 sm:mt-8 divide-y divide-stone-900/15 max-w-xl border-y border-stone-900/15">
                {LEVELS.map((l, i) => (
                  <li key={l.name} className="py-3 flex items-start sm:items-center justify-between gap-3 sm:gap-6">
                    <span className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-stone-900 text-[#F1E7D6] text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-kalam text-lg sm:text-xl font-bold">{l.name}</span>
                    </span>
                    <span className="flex-1 text-xs sm:text-sm text-stone-700 text-right">{l.note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mx-auto w-full max-w-md">
              <div className="relative rotate-[-1.5deg]">
                <div className="relative bg-[#FBF6EC] border-4 border-double border-stone-800 p-5 sm:p-8 text-center shadow-2xl">
                  <span className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#C2410C]" aria-hidden />
                  <span className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#C2410C]" aria-hidden />
                  <span className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#C2410C]" aria-hidden />
                  <span className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#C2410C]" aria-hidden />

                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500">VartaLang</p>
                  <p className="mt-1 text-sm text-stone-600">Certificate of proficiency</p>
                  <div className="mx-auto mt-5 h-px w-24 bg-[#C2410C]/50" />
                  <p className="mt-5 font-kalam text-3xl font-bold">Your name here</p>
                  <p className="mt-2 text-stone-700">has reached the Intermediate level in</p>
                  <p lang="hi" className="mt-2 font-kalam text-4xl sm:text-5xl leading-tight break-words font-bold text-[#C2410C]">
                    हिन्दी
                  </p>
                  <p className="mt-6 text-xs text-stone-500">Sample. Real certificates carry a unique ID you can verify.</p>
                </div>
                <div className="absolute -bottom-6 -right-2 sm:-bottom-7 sm:-right-5 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C2410C] ring-4 ring-[#F1E7D6] outline outline-2 outline-[#C2410C]/50 flex items-center justify-center shadow-xl rotate-12">
                  <ShieldCheck className="w-7 h-7 sm:w-9 sm:h-9 text-[#FBF6EC]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TEACH ── */}
        <section className="py-14 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <Photo src={IMAGES.teach} className="absolute inset-0 w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908] via-[#0a0908]/85 to-[#0a0908]/50" />
              <Glow className="w-80 h-80 bg-[#FF5500]/20 -top-20 -left-10" />

              <div className="relative p-5 sm:p-8 lg:p-14 grid lg:grid-cols-2 gap-8 sm:gap-10 items-center">
                <div>
                  <h2 className="font-kalam text-3xl sm:text-4xl font-bold">Teach your language on VartaLang</h2>
                  <p className="mt-4 text-stone-200 leading-relaxed max-w-xl">
                    Build a course from modules and lessons, set your own price and reach learners across India and the
                    diaspora.
                  </p>
                  <div className="mt-7">
                    <PrimaryButton href={isTeacher ? "/dashboard/instructor" : "/auth/login"}>
                      {isTeacher ? "Open Instructor Studio" : "Sign in to start teaching"}
                    </PrimaryButton>
                  </div>
                </div>
                <ul className="space-y-4 rounded-2xl border border-white/15 bg-black/40 backdrop-blur-md p-4 sm:p-6">
                  <Check4>Add lessons with YouTube videos and study notes.</Check4>
                  <Check4>Every course is reviewed before it goes live, so learners can trust what they find.</Check4>
                  <Check4>You get a public instructor profile once your first course is approved.</Check4>
                  <Check4>Teachers sign up as a teacher on VartaLang, and the studio opens here.</Check4>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32 border-t border-white/10">
          <div className="absolute inset-0" aria-hidden>
            <Photo src={IMAGES.cta} className="w-full h-full opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908] via-[#0a0908]/75 to-[#0a0908]/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-transparent to-[#0a0908]/60" />
          </div>
          <Glow className="w-[30rem] h-[30rem] bg-[#FF5500]/25 -bottom-40 left-1/4" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-kalam text-3xl sm:text-5xl font-bold max-w-3xl leading-tight drop-shadow-lg">
              Pick a language and take your first lesson today.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <PrimaryButton href={primary.href}>{primary.label}</PrimaryButton>
              <GhostButton href="/learn">Browse courses</GhostButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}