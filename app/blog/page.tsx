// app/blog/page.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articleAPI } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";

export default function BlogPage() {
  const { data: posts, error, loading } = useApi(() => articleAPI.list());

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0908]/80 via-[#0a0908]/90 to-[#0a0908] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-20 w-full">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 mb-6">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-200">VartaLang Articles & Insights</span>
          </div>
          <h1 className="font-kalam text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Language, Culture & Learning
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto">
            Linguistic perspectives, pedagogy guides, and stories for language learners.
          </p>
        </div>

        {error && (
          <div className="mb-8 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
            Could not load articles: {error}
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : !error && (posts?.length ?? 0) === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-stone-900/60 border border-stone-700/50 text-stone-400">
            No articles published yet. Check back soon.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post) => (
              <article
                key={post.id}
                className="p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${post.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}
                  >
                    {post.emoji}
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                    {post.tag}
                  </span>
                  <h2 className="font-kalam text-xl font-bold text-white my-3 leading-snug">{post.title}</h2>
                  <p className="text-stone-400 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-stone-700/50 text-xs text-stone-500">
                  <span>{post.author_name}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}