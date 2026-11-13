"use client";
import Link from 'next/link';
import { ArrowLeft, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="cultural-page min-h-screen text-white relative overflow-hidden flex items-center justify-center px-6">
      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-40 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=85')`,
          filter: "contrast(110%) brightness(80%)",
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

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="font-kalam text-8xl sm:text-[10rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-br from-amber-400/30 to-orange-600/30 mb-4 select-none">
          404
        </div>

        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="VartaLang Logo" className="h-12 w-auto object-contain drop-shadow-lg" />
        </div>

        <h1 className="font-kalam text-4xl md:text-5xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-stone-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track!
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl font-kalam text-lg transition-all hover:scale-105 shadow-xl hover:shadow-amber-500/40"
          >
            <Home className="w-5 h-5" /> Go Home
          </Link>
          <Link
            href="/learn"
            className="flex items-center gap-2 px-8 py-4 border-2 border-stone-700 hover:border-amber-500 bg-stone-900/50 text-stone-200 font-bold rounded-xl font-kalam text-lg transition-all hover:scale-105"
          >
            Browse Courses <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
