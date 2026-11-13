"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Clock, Tag, User, X, XCircle } from "lucide-react";

const DOC_ID = "1igWFNv0_MuSktQxJVCYu6jCaZEUIXMyS_4RrF7B3lqg";

type Post = {
  title: string;
  author: string;
  tags: string[];
  content: string;
};

type CommunityPostsProps = {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
};

function readMinutes(content: string) {
  return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}

function parsePosts(text: string): Post[] {
  const chunks = text
    .split(/(?=Author:)/i)
    .filter((chunk) => /^Author:/i.test(chunk.trim()));

  return chunks
    .map((chunk): Post => {
      let working = chunk;
      let tags: string[] = [];
      const tagsMatch = working.match(/Tags:\s*(.*)/i);

      if (tagsMatch) {
        tags = tagsMatch[1]
          .split("\n")[0]
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
        working = working.replace(/Tags:\s*.*(\r?\n|$)/i, "");
      } else {
        const categoryMatch = working.match(/Category:\s*(.*)/i);
        if (categoryMatch) {
          const category = categoryMatch[1].split("\n")[0].trim();
          if (category) tags = [category];
          working = working.replace(/Category:\s*.*(\r?\n|$)/i, "");
        }
      }

      const contentMatch = working.match(/Content:\s*([\s\S]*)/i);
      const content = contentMatch?.[1].trim() ?? "";
      const authorMatch = working.match(/Author:\s*([\s\S]*?)\s*(?:Content:|$)/i);
      const rawAuthor = authorMatch?.[1].trim() ?? "";
      const dashIndex = rawAuthor.lastIndexOf(" - ");

      return {
        title: dashIndex === -1 ? rawAuthor : rawAuthor.slice(0, dashIndex).trim(),
        author: dashIndex === -1 ? "अज्ञात" : rawAuthor.slice(dashIndex + 3).trim(),
        tags: tags.length > 0 ? tags : ["General"],
        content,
      };
    })
    .filter((post) => post.content)
    .reverse();
}

export default function CommunityPosts({
  selectedTags,
  onToggleTag,
  onClearTags,
}: CommunityPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    let active = true;

    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `https://docs.google.com/document/d/${DOC_ID}/export?format=txt`,
        );
        if (!response.ok) throw new Error(`Blog source returned ${response.status}`);
        const text = await response.text();
        if (active) setPosts(parsePosts(text));
      } catch (error) {
        console.error("Could not load community blog posts.", error);
        if (active) setPosts([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchPosts();
    const interval = window.setInterval(fetchPosts, 60000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPost(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    setSelectedPost(null);
  }, [selectedTags]);

  useEffect(() => {
    document.body.style.overflow = selectedPost ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPost]);

  const allTags = useMemo(() => {
    const seen = new Set<string>();
    return posts.flatMap((post) =>
      post.tags.filter((tag) => {
        const key = tag.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }),
    );
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return posts;
    const wanted = new Set(selectedTags.map((tag) => tag.toLowerCase()));
    return posts.filter((post) =>
      post.tags.some((tag) => wanted.has(tag.toLowerCase())),
    );
  }, [posts, selectedTags]);

  const isSelected = (tag: string) =>
    selectedTags.some((selectedTag) => selectedTag.toLowerCase() === tag.toLowerCase());

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-64 rounded-2xl bg-stone-900/60 border border-stone-700/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-7">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onToggleTag(tag)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isSelected(tag)
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                  : "bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
              }`}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={onClearTags}
              className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs text-stone-400 hover:text-white"
            >
              <XCircle className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <p className="text-stone-300 font-semibold">
            {posts.length === 0
              ? "No blog posts are available yet."
              : "No posts match this filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <button
              key={`${post.title}-${index}`}
              type="button"
              onClick={() => setSelectedPost(post)}
              className="group text-left p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/40 transition-all hover:-translate-y-1 flex flex-col"
            >
              {index === 0 && (
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold mb-3">
                  Latest
                </span>
              )}
              <h3 className="font-kalam text-xl font-bold text-white mb-3 leading-snug group-hover:text-amber-200 transition-colors">
                {post.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-4">
                <span className="flex items-center gap-1 text-amber-300">
                  <User className="w-3 h-3" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readMinutes(post.content)} min read
                </span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed line-clamp-4 mb-5">
                {post.content}
              </p>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-700/50">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleTag(tag);
                      }}
                      className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <ArrowRight className="w-4 h-4 shrink-0 text-stone-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center px-5 pt-28 pb-6 sm:pt-32"
          onClick={() => setSelectedPost(null)}
        >
          <article
            className="relative w-full max-w-2xl max-h-[calc(100vh-9rem)] overflow-y-auto rounded-2xl bg-stone-950 border border-amber-500/30 shadow-2xl p-7 sm:p-10"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              aria-label="Close article"
              className="absolute top-4 right-4 p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-kalam text-3xl sm:text-4xl font-bold text-white pr-8 mb-4">
              {selectedPost.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-400 mb-7">
              <span className="flex items-center gap-1.5 text-amber-300">
                <User className="w-4 h-4" />
                {selectedPost.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readMinutes(selectedPost.content)} min read
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-7">
              {selectedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="break-words whitespace-pre-line text-stone-300 leading-8 text-sm sm:text-base">
              {selectedPost.content}
            </div>
          </article>
        </div>
      )}
    </>
  );
}
