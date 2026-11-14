"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Shield,
  Star,
  Award,
  Mic,
  BookOpen,
  Users,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Sparkles,
  ExternalLink,
  Lock,
  Headphones,
  Sparkle,
} from "lucide-react";
import Footer from "@/components/Footer";

// Platform Launch target: December 1, 2026 IST
const LAUNCH_DATE = new Date("2026-12-01T00:00:00+05:30");

function getTimeLeft() {
  const now = new Date().getTime();
  const distance = LAUNCH_DATE.getTime() - now;

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
    done: false,
  };
}

export default function RootTeaserPage() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    done: false,
  });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const countdownUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  const previewFeatures = [
    {
      icon: Mic,
      title: "22 Indian Languages",
      description:
        "Voice-first speech evaluation across scheduled Indian languages, regional dialects, and native scripts.",
      badge: "Voice & Speech AI",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: BookOpen,
      title: "Guided Learning Tracks",
      description:
        "Step-by-step modular curriculum authored by top linguistic educators for workplace and everyday fluency.",
      badge: "Curated Tracks",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: Users,
      title: "Certified Native Mentors",
      description:
        "Language teachers reviewing pronunciation recordings with detailed audio feedback notes.",
      badge: "Human Mentorship",
      gradient: "from-purple-500 to-pink-600",
    },
  ];

  const liveInitiatives = [
    {
      title: "The Great Indian Voice Challenge",
      tag: "Live Now • Earn Rewards",
      description:
        "Contribute voice recordings in your native mother tongue to train India's foundational speech AI models and receive verified payouts.",
      href: "https://vartalang.in/challenge",
      cta: "Join Voice Challenge",
      icon: Headphones,
      border: "border-amber-500/40 hover:border-amber-400",
      accent: "text-amber-400",
    },
    {
      title: "VartaLang Main Portal",
      tag: "Official Website",
      description:
        "Read our mission, partner announcements, whitepapers on Indian multilingual technology, and community initiatives.",
      href: "https://vartalang.in",
      cta: "Visit vartalang.in",
      icon: Globe,
      border: "border-stone-800 hover:border-stone-600",
      accent: "text-orange-400",
    },
    {
      title: "VartaLang Account & Early Access",
      tag: "Member Access",
      description:
        "Create or sign into your unified VartaLang account to receive priority onboarding notifications when LMS access unlocks.",
      href: "https://vartalang.in/auth/signup",
      cta: "Create Account",
      icon: Sparkle,
      border: "border-stone-800 hover:border-stone-600",
      accent: "text-amber-300",
    },
  ];

  return (
    <div className="cultural-page min-h-screen text-white relative overflow-hidden flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* ── HEADER ── */}
      <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-8 max-w-7xl mx-auto">
        <nav className="rounded-full px-3 sm:px-5 py-3 flex items-center justify-between shadow-2xl border border-white/10 bg-[#14110E]/85 backdrop-blur-xl">
          {/* External Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            title="VartaLang Learn"
          >
            <img
              src="/logo.png"
              alt="VartaLang"
              className="h-9 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow"
            />
            <span className="hidden sm:inline font-kalam text-xl font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
              VartaLang
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/learn"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-amber-300 transition-colors"
            >
              Courses
            </Link>
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-stone-500">
              1:1 Sessions
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-stone-500">
                Coming soon
              </span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-stone-500">
              Workshops
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-stone-500">
                Coming soon
              </span>
            </span>

            <a
              href="https://vartalang.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 hover:scale-105"
            >
              <span className="sm:hidden">VartaLang.in</span>
              <span className="hidden sm:inline">Visit vartalang.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </nav>
      </header>

      {/* ── SECTION 1: HERO WITH HERITAGE ARCHITECTURE BACKDROP ──────── */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 sm:px-6 min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Heritage Backdrop */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=85')`,
            backgroundSize: "cover",
            backgroundPosition: "center 32%",
            filter: "contrast(115%) brightness(85%)",
          }}
        />

        {/* Ambient Warm Gradient Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 90% 65% at 50% 28%, rgba(217, 119, 6, 0.18), transparent 75%),
              linear-gradient(180deg, rgba(23, 18, 13, 0.48) 0%, rgba(23, 18, 13, 0.86) 60%, #17120d 100%)
            `,
          }}
        />

        {/* Subtle Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10 text-center w-full">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-amber-500/15 border border-amber-400/30 backdrop-blur-md mb-8 shadow-lg shadow-amber-500/10">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-amber-200 tracking-wide uppercase">
              LMS Learning Platform • Launching December 2026
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-kalam text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.08] drop-shadow-2xl tracking-tight">
            Learn Indian Languages
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-400">
              Through Courses &amp; Mentorship
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-stone-200 max-w-3xl mx-auto leading-relaxed mb-4 font-normal">
            Preserving India&apos;s rich linguistic heritage through modern, AI-powered education.
          </p>
          <p className="text-sm sm:text-base text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Learn Indian languages through self-paced courses, live 1:1 sessions and interactive workshops.
            Curricula and pricing are crafted by experienced native language educators.
          </p>

          {/* Countdown Display */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-12">
            {countdownUnits.map((unit) => (
              <div
                key={unit.label}
                className="w-20 sm:w-28 py-5 sm:py-6 bg-stone-900/80 backdrop-blur-xl border border-stone-700/60 rounded-2xl shadow-2xl hover:border-amber-500/40 transition-colors"
              >
                <div
                  suppressHydrationWarning
                  className="font-kalam text-3xl sm:text-5xl font-bold text-amber-300 mb-1 tabular-nums"
                >
                  {mounted ? String(unit.value).padStart(2, "0") : "00"}
                </div>
                <div className="text-[11px] sm:text-xs text-stone-400 font-medium uppercase tracking-wider">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* Public Exploration CTAs */}
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/learn"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 rounded-xl font-bold font-kalam text-lg shadow-xl shadow-amber-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/sessions"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900/85 hover:bg-stone-800 border border-stone-700/70 text-stone-200 hover:text-white font-bold font-kalam text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Live 1:1 Sessions</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-4 border-t border-stone-800/60 max-w-3xl mx-auto">
            {[
              { icon: Shield, text: "Certified Content" },
              { icon: Star, text: "Expert-Curated" },
              { icon: Globe, text: "22 Indian Languages" },
              { icon: Award, text: "Official Credentials" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-stone-400 text-xs sm:text-sm">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                  <item.icon className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="font-medium text-stone-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: LIVE INITIATIVES ON VARTALANG.IN ─────────────── */}
      <section className="relative py-14 sm:py-20 px-4 sm:px-6 border-t border-stone-800/80 bg-stone-950/60">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
                Active Right Now
              </span>
            </div>
            <h2 className="font-kalam text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              Explore Live Initiatives on VartaLang.in
            </h2>
            <p className="text-stone-400 max-w-xl mx-auto text-sm sm:text-base">
              While the LMS platform is being perfected, participate in our speech data initiatives
              and stay connected with our core ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {liveInitiatives.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-5 sm:p-7 rounded-2xl bg-stone-900/70 border ${item.border} backdrop-blur-md transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-amber-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-kalam text-2xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-stone-400 leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full pt-4 border-t border-stone-800 text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    <span>{item.cta}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WHAT'S COMING IN DECEMBER 2026 ───────────────── */}
      <section className="relative py-14 sm:py-20 px-4 sm:px-6 border-t border-stone-800/80 overflow-hidden">
        {/* Classical Library Backdrop */}
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
              "linear-gradient(180deg, #070605 0%, rgba(7, 6, 5, 0.9) 40%, #070605 100%)",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 mb-4">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wide">
                Educational Offerings
              </span>
            </div>
            <h2 className="font-kalam text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              What We Offer
            </h2>
            <p className="text-base text-stone-400 max-w-xl mx-auto">
              A comprehensive language learning suite crafted specifically for Indian languages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {previewFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-5 sm:p-8 bg-stone-900/70 backdrop-blur-xl border border-stone-800/90 hover:border-amber-500/50 rounded-2xl transition-all shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-stone-800/80 border border-stone-700/60 text-stone-300">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="font-kalam text-2xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-stone-400 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold font-kalam">
                    <span>Explore offerings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Responsive Footer */}
      <Footer />
    </div>
  );
}
