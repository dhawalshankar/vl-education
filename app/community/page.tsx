"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Heart, Globe, Shield, Award, Users, Target, BookOpen,
  Clock, ArrowRight, Briefcase, MapPin, ArrowLeft,
} from "lucide-react";

/* ─── DATA ───────────────────────────────────────────────────────── */

const tabs = ["About", "Blog", "Careers"] as const;
type Tab = typeof tabs[number];

const values = [
  { icon: Globe, title: "Cultural Preservation", desc: "Every language carries centuries of wisdom. We preserve and celebrate that heritage.", color: "text-amber-400" },
  { icon: Users, title: "Community First", desc: "Language is inherently social. We build connections between learners and speakers.", color: "text-blue-400" },
  { icon: Shield, title: "Quality Standards", desc: "Every resource is vetted by language experts and native speakers.", color: "text-green-400" },
  { icon: Target, title: "Exam Excellence", desc: "We prepare learners not just to speak, but to excel in certifications and careers.", color: "text-purple-400" },
];

const team = [
  {
    name: "Dhawal Shukla",
    role: "Founder",
    image: "https://thewittyswan.space/assets/img/dhawal.jpg",
    bio: "Passionate about vernacular education, linguistic preservation, and empowering native educators across India.",
    accent: "border-amber-500/40 shadow-amber-500/10",
  },
  {
    name: "Dhruv Khanna",
    role: "CTO & Co-Founder",
    image: "https://media.licdn.com/dms/image/v2/D5603AQFt86gOPMryGg/profile-displayphoto-scale_400_400/B56Z8zmAJVKgAg-/0/1783277028870?e=1795651200&v=beta&t=nvzT0dfn0eXbrspaKa0q-vZB_Q1ZzNvTVLBXD3sxHmA",
    bio: "Architecting scalable multilingual platforms, AI speech analysis, and high-performance educational systems.",
    accent: "border-orange-500/40 shadow-orange-500/10",
  },
];

const stats = [
  { value: "22+", label: "Languages", icon: Globe },
  { value: "60+", label: "Learners", icon: Users },
  { value: "150+", label: "Resources", icon: BookOpen },
  { value: "2026", label: "Founded", icon: Award },
];

/* ── Articles & Publications (Placeholder Data) ─────────────────
 * TODO: Connect to backend API: GET /api/v1/articles
 * Replace static placeholders with database articles.
 */
const posts = [
  { title: "Why Learning Hindi Opens Doors Across India", excerpt: "With over 500 million speakers, Hindi is a bridge to opportunities in government, media, and culture.", date: "Sep 2026", readTime: "5 min", tag: "Hindi", color: "from-orange-500 to-red-500", emoji: "📚" },
  { title: "Tamil: The Language That Never Stopped Evolving", excerpt: "One of the oldest classical languages with a rich literary history and contemporary relevance.", date: "Sep 2026", readTime: "6 min", tag: "Tamil", color: "from-red-500 to-pink-500", emoji: "🌴" },
  { title: "5 Proven Tips to Accelerate Your Language Learning", excerpt: "Expert strategies from polyglots — from spaced repetition to daily conversational immersion.", date: "Aug 2026", readTime: "8 min", tag: "Learning Tips", color: "from-blue-500 to-cyan-500", emoji: "🧠" },
];

/* ── Career Openings (Placeholder Data) ─────────────────────────
 * TODO: Connect to backend API: GET /api/v1/careers/jobs
 * Replace static placeholders with dynamic job openings loaded from the database.
 */
const openings = [
  { title: "Curriculum Designer (Vernacular Languages)", team: "Education", type: "Full-time", location: "Remote", emoji: "📚" },
  { title: "AI/ML Speech Engineer", team: "Engineering", type: "Full-time", location: "Remote / Bengaluru", emoji: "🤖" },
  { title: "Language Expert & Reviewer", team: "Linguistics", type: "Contract", location: "Pan-India Remote", emoji: "✍️" },
];

/* ─── COMPONENT ──────────────────────────────────────────────────── */

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>("About");

  return (
    <div className="min-h-screen bg-[#0e0c0a] text-white relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-50 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=85')`,
          filter: "contrast(115%) brightness(95%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 15%, rgba(255, 85, 0, 0.18), transparent 70%),
            linear-gradient(180deg, rgba(14, 12, 10, 0.45) 0%, rgba(14, 12, 10, 0.70) 50%, #0e0c0a 100%)
          `,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-20 w-full">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 mb-6">
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-amber-200">Our Community</span>
          </div>
          <h1 className="font-kalam text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            VartaLang Community
          </h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Meet the people behind VartaLang, read our stories, and join our growing team.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex justify-center mb-14">
          <div className="flex gap-1 p-1.5 rounded-2xl bg-stone-900/60 border border-stone-700/50 backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                id={`community-tab-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className={`px-7 py-2.5 rounded-xl text-sm font-semibold font-kalam transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── ABOUT ────────────────────────────────────────────────── */}
        {activeTab === "About" && (
          <div className="space-y-16">
            {/* Story */}
            <div id="story" className="p-10 rounded-3xl bg-stone-900/60 border border-stone-700/50">
              <h2 className="font-kalam text-4xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-stone-300 leading-relaxed">
                <p>
                  VartaLang was born in 2026 from a simple frustration: despite India having 22
                  scheduled languages and hundreds of dialects, quality language learning resources
                  were fragmented, expensive, or simply unavailable for most learners.
                </p>
                <p>
                  Our founders — passionate linguists, educators, and technologists — set out to
                  build a platform that combines the structure of formal education with the
                  flexibility of modern technology.
                </p>
                <p>
                  Today, VartaLang serves 60+ learners across 22+ languages, along with specialized
                  exam preparation programs for IELTS, teacher certifications, and government competitive examinations.
                </p>
              </div>
            </div>

            {/* Values */}
            <div>
              <h2 className="font-kalam text-4xl font-bold text-white mb-10 text-center">What We Stand For</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((val, i) => {
                  const Icon = val.icon;
                  return (
                    <div key={i} className="p-7 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/30 transition-all">
                      <Icon className={`w-8 h-8 ${val.color} mb-4`} />
                      <h3 className="font-kalam text-xl font-bold text-white mb-2">{val.title}</h3>
                      <p className="text-stone-400 text-sm leading-relaxed">{val.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team */}
            <div>
              <h2 className="font-kalam text-3xl sm:text-4xl font-bold text-white mb-8 text-center">The Team</h2>
              <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {team.map((member, i) => (
                  <div
                    key={i}
                    className={`p-7 rounded-3xl bg-[#14110E]/85 border ${member.accent} backdrop-blur-md text-center hover:scale-[1.02] transition-all shadow-xl flex flex-col items-center`}
                  >
                    <div className="relative w-28 h-28 mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.image}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-28 h-28 rounded-2xl object-cover border-2 border-amber-500/40 shadow-lg"
                      />
                    </div>
                    <h3 className="font-kalam text-2xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-amber-400 text-xs uppercase tracking-wider font-bold mb-3">{member.role}</p>
                    <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="text-center p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50">
                    <Icon className="w-6 h-6 text-amber-400 mx-auto mb-3" />
                    <div className="font-kalam text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-stone-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/learn"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold font-kalam text-lg transition-all hover:scale-105 shadow-2xl hover:shadow-amber-500/50"
              >
                Start Learning Today
              </Link>
            </div>
          </div>
        )}

        {/* ── BLOG ─────────────────────────────────────────────────── */}
        {activeTab === "Blog" && (
          <div>
            <div className="text-center mb-12">
              <h2 className="font-kalam text-5xl font-bold text-white mb-4">Language, Culture &amp; Learning</h2>
              <p className="text-xl text-stone-400 max-w-2xl mx-auto">
                Insights, guides, and stories for passionate language learners
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {posts.map((post, i) => (
                <article
                  key={i}
                  className="group p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/40 transition-all hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${post.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition-transform shadow-lg`}>
                      {post.emoji}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold">
                        {post.tag}
                      </span>
                    </div>
                    <h3 className="font-kalam text-xl font-bold text-white mb-3 leading-snug group-hover:text-amber-200 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-stone-400 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-700/50">
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{post.readTime} read
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </article>
              ))}
            </div>

            {/* Newsletter */}
            <div className="text-center p-10 rounded-3xl bg-stone-900/60 border border-stone-700/50 max-w-3xl mx-auto">
              <h2 className="font-kalam text-3xl font-bold text-white mb-3">Stay Updated</h2>
              <p className="text-stone-400 text-sm mb-6">Get new articles delivered to your inbox every week</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-5 py-3 rounded-xl bg-stone-950/80 border border-stone-700/50 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold rounded-xl transition-all font-kalam text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CAREERS ──────────────────────────────────────────────── */}
        {activeTab === "Careers" && (
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 mb-6">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-amber-200">We&apos;re Hiring</span>
              </div>
              <h2 className="font-kalam text-5xl font-bold text-white mb-4">Join Our Team</h2>
              <p className="text-lg text-stone-400 max-w-2xl mx-auto">
                Help us preserve India&apos;s linguistic heritage. We&apos;re a remote-first team passionate
                about education, technology, and languages.
              </p>
            </div>

            <div className="space-y-4 mb-14">
              {openings.map((job, i) => (
                <div
                  key={i}
                  className="group p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-stone-800/80 shrink-0">{job.emoji}</div>
                    <div>
                      <h3 className="font-kalam text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-stone-400" />{job.team}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />{job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />{job.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a
                    href="mailto:support@cosmoindiaprakashan.in"
                    className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-semibold font-kalam transition-all"
                  >
                    <span>Apply via Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>

            <div className="text-center p-10 rounded-3xl bg-stone-900/60 border border-stone-700/50 max-w-3xl mx-auto">
              <h2 className="font-kalam text-3xl font-bold text-white mb-2">Don&apos;t See Your Role?</h2>
              <p className="text-stone-400 text-sm mb-6 max-w-xl mx-auto">
                We&apos;re always looking for talented people. Send us your CV and tell us how you&apos;d contribute.
              </p>
              <a
                href="mailto:support@cosmoindiaprakashan.in"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold rounded-xl font-kalam transition-all hover:scale-105 text-sm"
              >
                <span>Send Open Application</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
