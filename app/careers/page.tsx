// app/careers/page.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { careerAPI } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";

export default function CareersPage() {
  const { data: jobs, error, loading } = useApi(() => careerAPI.jobs());

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1598324789736-4861f89564a0?w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0908]/80 via-[#0a0908]/90 to-[#0a0908] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-36 pb-20 w-full">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 mb-6">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-200">We&apos;re Hiring</span>
          </div>
          <h1 className="font-kalam text-5xl md:text-6xl font-bold text-white mb-4">
            Join the VartaLang Mission
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto">
            Help preserve India&apos;s linguistic heritage through modern educational technology.
          </p>
        </div>

        {error && (
          <div className="mb-8 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
            Could not load openings: {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : !error && (jobs?.length ?? 0) === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-stone-900/60 border border-stone-700/50 text-stone-400 mb-16">
            No open positions right now.
          </div>
        ) : (
          <div className="space-y-4 mb-16">
            {jobs?.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-stone-800/80 shrink-0">
                    {job.emoji}
                  </div>
                  <div>
                    <h3 className="font-kalam text-lg font-bold text-white">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-stone-400" />
                        {job.team}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                </div>
                <a
                  href={`mailto:${job.apply_email}?subject=${encodeURIComponent("Application for " + job.title)}`}
                  className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-semibold font-kalam transition-all"
                >
                  <span>Apply via Email</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="text-center p-10 rounded-3xl bg-stone-900/60 border border-stone-700/50 max-w-3xl mx-auto">
          <h2 className="font-kalam text-3xl font-bold text-white mb-2">Don&apos;t See Your Role?</h2>
          <p className="text-stone-400 text-sm mb-6 max-w-xl mx-auto">
            We are always seeking passionate linguists, voice AI engineers, and educators.
          </p>
          <a
            href="mailto:support@cosmoindiaprakashan.in?subject=General%20Application%20-%20VartaLang"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold rounded-xl font-kalam transition-all text-sm"
          >
            <span>Send Open Application</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}