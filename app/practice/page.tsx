"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import {
  ArrowRight,
  Headphones,
  Mic,
  BookOpen,
  PenTool,
  Sparkles,
  Crown,
  Clock,
  Brain,
  CheckCircle,
  Zap
} from "lucide-react";

/* ── Practice Labs Suite (Placeholder Modules) ─────────────────
 * TODO: Connect to backend API: GET /api/v1/practice/labs
 * Connect voice recording evaluation endpoints (POST /api/v1/practice/evaluate)
 * to stream audio to speech models and receive phoneme scoring in real time.
 */
const labs = [
  {
    icon: Headphones,
    title: "Listening Studio",
    desc: "Curated native audio clips with comprehension exercises, interactive speed controls, and transcripts.",
    gradient: "from-blue-500 to-indigo-600",
    eta: "Q4 2026",
    highlights: ["Native Audio", "Transcripts", "Speed Control"],
  },
  {
    icon: Mic,
    title: "Pronunciation Practice",
    desc: "Record your voice and get instant AI-assisted feedback on tones, vowel lengths, and phoneme accuracy.",
    gradient: "from-orange-500 to-red-600",
    eta: "Q4 2026",
    highlights: ["Voice AI", "Accent Analysis", "Native Comparison"],
  },
  {
    icon: BookOpen,
    title: "Meaning Match",
    desc: "Hear a spoken word or read a phrase, then match the correct meaning from context clues under time pressure.",
    gradient: "from-green-500 to-teal-600",
    eta: "Q1 2027",
    highlights: ["Spaced Repetition", "Context Clues", "Vocabulary"],
  },
  {
    icon: PenTool,
    title: "Dictation Studio",
    desc: "Listen to natural sentences in full flow, type them in authentic script, and get scored on grammatical accuracy.",
    gradient: "from-purple-500 to-pink-600",
    eta: "Q1 2027",
    highlights: ["Script Typing", "Auto-grading", "Grammar Scored"],
  },
  {
    icon: Sparkles,
    title: "Subtle Sound Distinction",
    desc: "Train your ear to master nuances that trip up non-native speakers (e.g. ड vs ड़, त vs ट, retroflex sounds).",
    gradient: "from-yellow-500 to-amber-600",
    eta: "Q1 2027",
    highlights: ["Minimal Pairs", "Ear Training", "Phonetics"],
  },
  {
    icon: Crown,
    title: "Expert Mentor Review",
    desc: "Submit your recordings and essays directly to certified language educators for detailed feedback within 24 hours.",
    gradient: "from-violet-500 to-purple-700",
    eta: "Q2 2027",
    highlights: ["Certified Mentors", "Personalized Audio Notes", "Rubric Scored"],
  },
];

export default function PracticePage() {
  return (
    <RequireAuth>
      <div className="cultural-page min-h-screen relative overflow-hidden flex flex-col justify-between">
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

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-cyan-500/20 border-2 border-cyan-400/30 backdrop-blur-sm mb-8">
            <Brain className="w-4 h-4 text-cyan-300" />
            <span className="text-sm font-semibold text-cyan-100 tracking-wide">
              Coming Soon · AI-Powered Practice
            </span>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>

          <h1 className="font-kalam text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] drop-shadow-2xl">
            Practice Labs
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-amber-200 to-orange-300">
              Interactive Skill Mastery
            </span>
          </h1>

          <p className="text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed mb-6">
            Hands-on, voice-first practice labs powered by AI speech analysis and expert mentor
            review. Built for true conversational fluency, not just passive memorization.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/80 border border-stone-800 text-stone-400 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Target Launch: Starting Q4 2026 · Integrated across all 22 Indian languages</span>
          </div>
        </div>

        {/* Labs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {labs.map((lab, i) => {
            const Icon = lab.icon;
            return (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-stone-900/60 border-2 border-stone-800/80 hover:border-cyan-500/50 transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lab.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="shrink-0 flex items-center gap-1.5 text-xs text-stone-400 bg-stone-800/80 px-3 py-1 rounded-full border border-stone-700/60 font-mono">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {lab.eta}
                    </span>
                  </div>

                  <h3 className="font-kalam text-2xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">
                    {lab.title}
                  </h3>
                  <p className="text-stone-400 text-sm leading-relaxed mb-6">{lab.desc}</p>
                </div>

                <div className="pt-4 border-t border-stone-800/80">
                  <div className="flex flex-wrap gap-1.5">
                    {lab.highlights.map((h) => (
                      <span
                        key={h}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-800/60 border border-stone-700/50 text-stone-300"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="text-center p-12 sm:p-14 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-stone-900/70 to-amber-500/10 border-2 border-cyan-500/20 backdrop-blur-md">
          <Zap className="w-16 h-16 mx-auto mb-6 text-cyan-400 drop-shadow-lg" />
          <h2 className="font-kalam text-4xl font-bold text-white mb-4">
            Prepare Your Foundation Today
          </h2>
          <p className="text-stone-300 max-w-2xl mx-auto mb-8 leading-relaxed text-base">
            While our engineering team fine-tunes the AI pronunciation models and listening studio,
            you can start learning scripts, grammar, and core phrases right now through our structured Courses.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-stone-400">
            {["Real-time Speech Feedback", "22 Indian Languages", "Expert Mentor Critiques"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>{item}</span>
                </div>
              )
            )}
          </div>

          <Link
            href="/learn"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold font-kalam text-lg transition-all hover:scale-105 shadow-2xl hover:shadow-amber-500/50"
          >
            <span>Explore Language Courses</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <Footer />
      </div>
    </RequireAuth>
  );
}
