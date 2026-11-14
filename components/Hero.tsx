"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, MessageCircle, Briefcase } from "lucide-react";

export default function Hero({ onExploreClick }: { onExploreClick: () => void }) {
  return (
    <section className="relative pt-28 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto bg-ambient-glow">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
        
        {/* Left Column: Heading & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#D97706] text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]"></span>
            Varta (Communication) + Lang (Language)
          </div>

          {/* Main Display Headline */}
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.08] tracking-tight font-display">
            Learn Languages.<br />
            Build Communication<br />
            Skills.<br />
            <span className="bg-gradient-to-r from-[#FF5500] via-[#FF7700] to-[#FFAA00] bg-clip-text text-transparent">
              Discover Real Jobs
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/70 max-w-xl font-normal leading-relaxed">
            One place to learn, practise and use Indian languages—structured courses, 
            AI practice scenarios, real conversations with language partners, and language-focused jobs.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={onExploreClick}
              className="btn-primary px-6 sm:px-8 py-3.5 rounded-full flex items-center justify-center gap-3 text-sm font-semibold tracking-wide group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={onExploreClick}
              className="btn-secondary px-6 sm:px-7 py-3.5 rounded-full text-sm tracking-wide"
            >
              Browse Courses
            </button>
          </div>

          {/* Micro Footer Note */}
          <p className="text-xs text-white/40 pt-2 font-medium tracking-wide">
            22+ Languages • ISL & Braille supported
          </p>
        </div>

        {/* Right Column: Hero Stats Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-3xl p-5 sm:p-7 glass-panel bg-gradient-to-b from-[#1E1A15]/90 to-[#13110E]/90 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Top Stat Counters */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pb-6 sm:pb-8 border-b border-white/10 text-center">
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#FF6600] font-display">22</p>
                <p className="text-xs text-white/60 font-medium mt-1">Languages</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#FF6600] font-display">74%</p>
                <p className="text-xs text-white/60 font-medium mt-1">Non-English</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#FF6600] font-display">3x</p>
                <p className="text-xs text-white/60 font-medium mt-1">Jobs Growth</p>
              </div>
            </div>

            {/* Stepper Pipeline: Learn -> Practise -> Connect -> Work */}
            <div className="pt-8">
              <div className="flex items-center justify-between text-center">
                
                {/* Step 1: Learn */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center text-[#FF6600]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/90">Learn</span>
                </div>

                <span className="text-white/20 text-xs font-bold">→</span>

                {/* Step 2: Practise */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/90">Practise</span>
                </div>

                <span className="text-white/20 text-xs font-bold">→</span>

                {/* Step 3: Connect */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/90">Connect</span>
                </div>

                <span className="text-white/20 text-xs font-bold">→</span>

                {/* Step 4: Work */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/90">Work</span>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
