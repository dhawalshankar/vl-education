// app/challenges/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Globe2,
  HelpCircle,
  Languages,
  Medal,
  RefreshCw,
  Search,
  Sparkles,
  Sword,
  Target,
  Trophy,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import {
  ChallengeEvaluateResponse,
  ChallengeOut,
  challengeAPI,
} from "@/app/lib/api";
import { getUserStreak } from "@/app/lib/streak";
import { useAuth } from "@/app/context/AuthContext";

type CategoryFilter = "all" | "indian" | "english" | "foreign";

const ICONS: Record<string, React.ElementType> = {
  translation_match: Languages,
  transliteration: Target,
  script_identification: BookOpen,
  contextual_cloze: Zap,
  daily_duel: Sword,
};

const RTL_LANGUAGES = new Set(["Urdu", "Arabic", "Sindhi", "Kashmiri"]);

export default function ChallengesPage() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<ChallengeOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Leaderboard state
  const [board, setBoard] = useState<any[]>([]);
  const [boardLoading, setBoardLoading] = useState(false);
  const [boardLang, setBoardLang] = useState<string>("all");

  // Active Play Arena State
  const [activeChallenge, setActiveChallenge] = useState<ChallengeOut | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showHint, setShowHint] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<ChallengeEvaluateResponse | null>(null);

  // User streak & Total XP (persisted)
  const [userStreak, setUserStreak] = useState(1);
  const [totalXP, setTotalXP] = useState(0);

  // Load user streak & Total XP
  useEffect(() => {
    try {
      const s = getUserStreak(user?.email);
      setUserStreak(s.currentStreak || 1);
    } catch {
      setUserStreak(1);
    }

    challengeAPI
      .progress()
      .then((p) => {
        if (p?.total_xp) setTotalXP(p.total_xp);
        if (p?.active_streak) setUserStreak(p.active_streak);
      })
      .catch(() => {
        // Fallback to local stored XP if available
        try {
          const stored = localStorage.getItem("vl_user_total_xp");
          if (stored) setTotalXP(parseInt(stored, 10));
        } catch {}
      });
  }, [user]);

  // Fetch challenges
  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await challengeAPI.list({
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        language: selectedLanguage !== "all" ? selectedLanguage : undefined,
        challenge_type: selectedType !== "all" ? selectedType : undefined,
        difficulty: selectedDifficulty !== "all" ? selectedDifficulty : undefined,
        search: searchQuery.trim() || undefined,
        limit: 150,
      });
      setChallenges(data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [selectedCategory, selectedLanguage, selectedType, selectedDifficulty]);

  // Fetch leaderboard
  useEffect(() => {
    setBoardLoading(true);
    challengeAPI
      .leaderboard(boardLang !== "all" ? boardLang : undefined)
      .then((data) => setBoard(data || []))
      .catch(() => setBoard([]))
      .finally(() => setBoardLoading(false));
  }, [boardLang]);

  // Available languages metadata
  const availableLanguages = useMemo(() => {
    const map = new Map<string, { name: string; native: string; category: string }>();

    // 22 Scheduled Indic
    const indic: [string, string][] = [
      ["Assamese", "অসমীয়া"], ["Bengali", "বাংলা"], ["Bodo", "बड़ो"], ["Dogri", "डोगरी"],
      ["Gujarati", "ગુજરાતી"], ["Hindi", "हिंदी"], ["Kannada", "ಕನ್ನಡ"], ["Kashmiri", "कॉशुर / كٲشُر"],
      ["Konkani", "कोंकणी"], ["Maithili", "मैथिली"], ["Malayalam", "മലയാളം"], ["Manipuri", "মৈতৈলোন্"],
      ["Marathi", "मराठी"], ["Nepali", "नेपाली"], ["Odia", "ଓଡ଼ିଆ"], ["Punjabi", "ਪੰਜਾਬੀ"],
      ["Sanskrit", "संस्कृतम्"], ["Santali", "ᱥᱟᱱᱛᱟᱲᱤ"], ["Sindhi", "سنڌي"], ["Tamil", "தமிழ்"],
      ["Telugu", "తెలుగు"], ["Urdu", "اردو"]
    ];
    indic.forEach(([n, nat]) => map.set(n, { name: n, native: nat, category: "indian" }));

    // English
    map.set("English", { name: "English", native: "English", category: "english" });

    // Foreign
    const foreign: [string, string][] = [
      ["Spanish", "Español"], ["French", "Français"], ["German", "Deutsch"],
      ["Japanese", "日本語"], ["Korean", "한국어"], ["Mandarin Chinese", "普通话"],
      ["Arabic", "العربية"], ["Russian", "Русский"]
    ];
    foreign.forEach(([n, nat]) => map.set(n, { name: n, native: nat, category: "foreign" }));

    return Array.from(map.values());
  }, []);

  const filteredLanguages = useMemo(() => {
    return availableLanguages.filter((l) => {
      if (selectedCategory !== "all" && l.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return l.name.toLowerCase().includes(q) || l.native.toLowerCase().includes(q);
      }
      return true;
    });
  }, [availableLanguages, selectedCategory, searchQuery]);

  // Open Challenge Runner
  const handleOpenChallenge = (c: ChallengeOut) => {
    setActiveChallenge(c);
    setSelectedAnswer("");
    setShowHint(false);
    setEvalResult(null);
  };

  // Submit Answer for evaluation
  const handleEvaluate = async () => {
    if (!activeChallenge || !selectedAnswer.trim()) return;
    setEvaluating(true);
    try {
      const res = await challengeAPI.evaluate({
        challenge_id: activeChallenge.id,
        user_answer: selectedAnswer.trim(),
      });
      setEvalResult(res);
      if (res.is_correct && res.xp_earned > 0) {
        setTotalXP((prev) => {
          const next = prev + res.xp_earned;
          try {
            localStorage.setItem("vl_user_total_xp", String(next));
          } catch {}
          return next;
        });
        if (res.streak_count) {
          setUserStreak(res.streak_count);
        }
        try {
          const raw = localStorage.getItem("vl_completed_challenges");
          const arr: string[] = raw ? JSON.parse(raw) : [];
          if (!arr.includes(activeChallenge.id)) {
            arr.push(activeChallenge.id);
            localStorage.setItem("vl_completed_challenges", JSON.stringify(arr));
          }
        } catch {}
      }
    } catch (err: any) {
      alert("Evaluation failed: " + (err.message || "Unknown error"));
    } finally {
      setEvaluating(false);
    }
  };

  // Move to next challenge
  const handleNextChallenge = () => {
    if (!activeChallenge || challenges.length <= 1) return;
    const currentIdx = challenges.findIndex((c) => c.id === activeChallenge.id);
    const nextIdx = (currentIdx + 1) % challenges.length;
    handleOpenChallenge(challenges[nextIdx]);
  };

  return (
    <RequireAuth>
      <div className="cultural-page min-h-screen relative overflow-x-hidden flex flex-col justify-between">
        <Navbar />

        {/* Background Indian Monument Backdrop */}
        <div
          className="fixed inset-0 pointer-events-none -z-10 opacity-30 bg-cover bg-center scale-105 transition-opacity"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=85')`,
            filter: "contrast(110%) brightness(75%)",
          }}
        />
        <div
          className="fixed inset-0 pointer-events-none -z-10"
          style={{
            background: `
              radial-gradient(ellipse 90% 70% at 50% 20%, rgba(255, 85, 0, 0.14), transparent 70%),
              linear-gradient(180deg, rgba(14, 12, 10, 0.6) 0%, rgba(14, 12, 10, 0.85) 55%, #0e0c0a 100%)
            `,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 pt-20 sm:pt-28 pb-14 w-full">
          {/* Header & Stats Strip */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold text-amber-200">
                31 Languages • 740+ Live Challenges
              </span>
            </div>
            <h1 className="font-kalam text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
              Multilingual Challenges
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-amber-300">
                Compete &amp; Master Scripts
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed px-2">
              Practice vocabulary, transliteration, and script recognition across 22 Scheduled Indian languages, English, and world languages.
            </p>

            {/* Mobile-First Learner Stats Strip (3 Columns on Mobile) */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 mt-4 max-w-md sm:max-w-none mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-2 rounded-xl bg-stone-900/80 border border-amber-500/30 text-stone-200 shadow-md">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400 shrink-0" />
                <div className="text-center sm:text-left">
                  <span className="text-[10px] sm:text-xs text-stone-400 block sm:inline sm:mr-1">Streak:</span>
                  <span className="font-bold text-amber-400 text-xs sm:text-sm">{userStreak}d</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-2 rounded-xl bg-stone-900/80 border border-red-500/30 text-stone-200 shadow-md">
                <Trophy className="w-4 h-4 text-amber-300 shrink-0" />
                <div className="text-center sm:text-left">
                  <span className="text-[10px] sm:text-xs text-stone-400 block sm:inline sm:mr-1">Total XP:</span>
                  <span className="font-bold text-amber-300 text-xs sm:text-sm">{totalXP}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-2 rounded-xl bg-stone-900/80 border border-stone-700/60 text-stone-300 shadow-md">
                <Globe2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="text-center sm:text-left">
                  <span className="text-[10px] sm:text-xs text-stone-400 block sm:inline sm:mr-1">Covered:</span>
                  <span className="font-bold text-white text-xs sm:text-sm">31 Langs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs: Mobile-First 2x2 Grid or Flex */}
          <div className="mb-5 max-w-lg sm:max-w-none mx-auto">
            <div className="grid grid-cols-2 sm:flex sm:justify-center gap-1.5 p-1.5 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-md">
              {[
                { id: "all", label: "All Languages", count: "31" },
                { id: "indian", label: "22 Scheduled Indian", count: "22" },
                { id: "english", label: "English", count: "1" },
                { id: "foreign", label: "Foreign Languages", count: "8" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedCategory(tab.id as CategoryFilter);
                    setSelectedLanguage("all");
                  }}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
                    selectedCategory === tab.id
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                      : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full shrink-0 ${
                      selectedCategory === tab.id ? "bg-black/30 text-white" : "bg-stone-800 text-stone-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile-First Controls: Search, Type, Difficulty & Language Swipe Strip */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-md mb-6">
            <div className="space-y-3">
              {/* Search Bar with Clear Button */}
              <div className="relative w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search language, script (e.g. বাংলা, தமிழ்)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Side-by-Side Type & Difficulty Dropdowns */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full sm:w-auto px-2.5 py-2 rounded-xl bg-stone-950/80 border border-stone-800 text-[11px] sm:text-xs text-stone-300 focus:outline-none focus:border-orange-500 truncate"
                >
                  <option value="all">All Types</option>
                  <option value="translation_match">Translation &amp; Meaning</option>
                  <option value="transliteration">Transliteration &amp; Script</option>
                  <option value="script_identification">Script Identification</option>
                  <option value="contextual_cloze">Contextual Cloze</option>
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full sm:w-auto px-2.5 py-2 rounded-xl bg-stone-950/80 border border-stone-800 text-[11px] sm:text-xs text-stone-300 focus:outline-none focus:border-orange-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                <button
                  onClick={fetchChallenges}
                  className="col-span-2 sm:col-span-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-h-[36px]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Apply Filters</span>
                </button>
              </div>
            </div>

            {/* Mobile-First Language Swipeable Chips (Horizontal on mobile, wraps on desktop) */}
            <div className="mt-3.5 pt-3 border-t border-stone-800/80">
              <div className="flex items-center justify-between text-[11px] text-stone-400 mb-2 font-medium">
                <span>Select Language ({filteredLanguages.length}):</span>
                {selectedLanguage !== "all" && (
                  <button
                    onClick={() => setSelectedLanguage("all")}
                    className="text-amber-400 hover:underline text-[10px]"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0 sm:flex-wrap sm:max-h-36 sm:overflow-y-auto">
                <button
                  onClick={() => setSelectedLanguage("all")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                    selectedLanguage === "all"
                      ? "bg-amber-500 text-black font-bold shadow-sm"
                      : "bg-stone-800/80 text-stone-300 hover:bg-stone-700"
                  }`}
                >
                  All
                </button>
                {filteredLanguages.map((l) => (
                  <button
                    key={l.name}
                    onClick={() => setSelectedLanguage(l.name)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all flex items-center gap-1 font-script ${
                      selectedLanguage === l.name
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-sm"
                        : "bg-stone-800/70 text-stone-300 hover:bg-stone-700"
                    }`}
                  >
                    <span>{l.name}</span>
                    <span className="opacity-70 text-[10px]">({l.native})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl text-xs sm:text-sm bg-red-500/10 border border-red-500/20 text-red-300">
              {error}
            </div>
          )}

          {/* Challenge Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-44 rounded-2xl bg-stone-900/60 border border-stone-800 animate-pulse" />
              ))}
            </div>
          ) : challenges.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-2xl bg-stone-900/60 border border-stone-800 text-stone-400 mb-12">
              <HelpCircle className="w-10 h-10 text-stone-500 mx-auto mb-2" />
              <p className="text-sm text-stone-300 font-medium mb-1">No challenges match your filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedLanguage("all");
                  setSelectedType("all");
                  setSelectedDifficulty("all");
                  setSearchQuery("");
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 mb-14">
              {challenges.map((c) => {
                const Icon = ICONS[c.type] || Target;
                const isRtl = RTL_LANGUAGES.has(c.language || "");
                return (
                  <div
                    key={c.id}
                    className="group relative p-4 sm:p-5 rounded-2xl bg-stone-900/85 border border-stone-800 hover:border-orange-500/50 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1.5 mb-2.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-800 text-amber-300">
                          <Icon className="w-3 h-3 text-amber-400" />
                          <span className="capitalize">{c.type.replace(/_/g, " ")}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              c.difficulty === "advanced"
                                ? "bg-red-500/20 text-red-300"
                                : c.difficulty === "intermediate"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            {c.difficulty || "Beginner"}
                          </span>
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            +{c.xp_reward} XP
                          </span>
                        </div>
                      </div>

                      {/* Language Title & Native label */}
                      <div className="mb-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-bold text-orange-400">{c.language}</span>
                          {c.language_native && (
                            <span className="text-[11px] text-stone-400 font-script">
                              ({c.language_native})
                            </span>
                          )}
                        </div>
                        <h3 className="font-kalam text-base sm:text-lg font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-1">
                          {c.title}
                        </h3>
                      </div>

                      {/* Question / Prompt preview */}
                      {c.prompt && (
                        <div
                          dir={isRtl ? "rtl" : "ltr"}
                          className={`p-2.5 rounded-xl bg-stone-950/80 border border-stone-800/80 text-xs text-stone-200 mb-2.5 font-script leading-relaxed ${
                            isRtl ? "text-right font-serif" : ""
                          }`}
                        >
                          {c.prompt}
                        </div>
                      )}

                      <p className="text-stone-400 text-[11px] line-clamp-2 leading-relaxed mb-3">
                        {c.desc}
                      </p>
                    </div>

                    {/* Solve Action Button - Touch friendly */}
                    <button
                      onClick={() => handleOpenChallenge(c)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 min-h-[42px]"
                    >
                      <span>Play Challenge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Weekly Leaderboard Section */}
          <div className="p-4 sm:p-7 rounded-3xl bg-gradient-to-br from-red-500/10 via-stone-900/85 to-orange-500/10 border border-red-500/20 max-w-3xl mx-auto mb-14 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h2 className="font-kalam text-xl sm:text-2xl font-bold text-white leading-none">
                    Weekly Leaderboard
                  </h2>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Top XP achievers competing across Indic and global languages
                  </p>
                </div>
              </div>

              <select
                value={boardLang}
                onChange={(e) => setBoardLang(e.target.value)}
                className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-300 focus:outline-none"
              >
                <option value="all">Global (All Languages)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="Urdu">Urdu (اردو)</option>
                <option value="Russian">Russian (Русский)</option>
                <option value="Japanese">Japanese (日本語)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="Arabic">Arabic (العربية)</option>
              </select>
            </div>

            {boardLoading ? (
              <div className="h-28 rounded-xl bg-white/5 animate-pulse" />
            ) : board.length === 0 ? (
              <p className="text-stone-400 text-xs text-center py-4">
                No scores recorded for this filter yet.
              </p>
            ) : (
              <ol className="space-y-2">
                {board.map((row) => (
                  <li
                    key={row.rank + row.user_name}
                    className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm"
                  >
                    <div className="min-w-0 flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-bold text-xs ${
                          row.rank === 1
                            ? "bg-amber-400 text-black"
                            : row.rank === 2
                            ? "bg-stone-300 text-black"
                            : row.rank === 3
                            ? "bg-amber-700 text-white"
                            : "text-stone-500 bg-stone-800"
                        }`}
                      >
                        {row.rank <= 3 ? <Medal className="w-3 h-3" /> : `#${row.rank}`}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-white font-medium">{row.user_name}</p>
                        <span className="text-[10px] text-stone-400">{row.language}</span>
                      </div>
                    </div>
                    <span className="text-amber-300 font-bold text-xs sm:text-sm">
                      {row.xp} XP
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold font-kalam text-base transition-all shadow-lg"
            >
              Explore Full Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── MOBILE-FIRST INTERACTIVE ARENA MODAL (Bottom Sheet on Mobile, Centered on Tablet/Desktop) ── */}
        {activeChallenge && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full sm:max-w-xl md:max-w-2xl rounded-t-3xl sm:rounded-3xl bg-stone-900 border-t-2 sm:border-2 border-stone-700 p-4 sm:p-7 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-stone-800">
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className="px-2.5 py-0.5 rounded-md bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[11px] font-bold font-script">
                    {activeChallenge.language} {activeChallenge.language_native ? `(${activeChallenge.language_native})` : ""}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-400 text-[10px] font-medium uppercase truncate">
                    {activeChallenge.type.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    +{activeChallenge.xp_reward} XP
                  </span>
                  <button
                    onClick={() => setActiveChallenge(null)}
                    className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                  >
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              {/* Challenge Title & Prompt */}
              <div className="mb-4">
                <h3 className="font-kalam text-lg sm:text-xl font-bold text-white mb-1.5 leading-snug">
                  {activeChallenge.title}
                </h3>

                {activeChallenge.prompt && (
                  <div
                    dir={RTL_LANGUAGES.has(activeChallenge.language || "") ? "rtl" : "ltr"}
                    className={`p-3 sm:p-4 rounded-xl bg-stone-950/80 border border-stone-800 text-white font-script text-sm sm:text-base font-medium leading-relaxed my-2 shadow-inner ${
                      RTL_LANGUAGES.has(activeChallenge.language || "") ? "text-right font-serif" : ""
                    }`}
                  >
                    {activeChallenge.prompt}
                  </div>
                )}

                {/* Hint Toggle */}
                {activeChallenge.hint && (
                  <div className="mt-1.5">
                    {showHint ? (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                        💡 <span className="font-bold">Hint:</span> {activeChallenge.hint}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowHint(true)}
                        className="text-[11px] text-stone-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                      >
                        💡 Need a hint?
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Input Area: Touch-Friendly Options */}
              <div className="mb-4">
                {activeChallenge.options && activeChallenge.options.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                    {activeChallenge.options.map((opt, idx) => {
                      const isSelected = selectedAnswer === opt;
                      return (
                        <button
                          key={idx}
                          disabled={evaluating || evalResult !== null}
                          onClick={() => setSelectedAnswer(opt)}
                          dir={RTL_LANGUAGES.has(activeChallenge.language || "") && /[\u0600-\u06FF]/.test(opt) ? "rtl" : "ltr"}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all font-script min-h-[46px] flex items-center justify-between gap-2 ${
                            isSelected
                              ? "bg-orange-500/20 border-orange-500 text-white ring-2 ring-orange-500/40"
                              : "bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800"
                          } ${evalResult !== null ? "cursor-default" : ""}`}
                        >
                          <span className="truncate">{opt}</span>
                          <span
                            className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-[10px] ${
                              isSelected ? "border-orange-400 bg-orange-500 text-white font-bold" : "border-stone-700 text-stone-500"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      Type your answer:
                    </label>
                    <input
                      type="text"
                      disabled={evaluating || evalResult !== null}
                      placeholder="Type in native script or transliteration..."
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !evaluating && !evalResult && handleEvaluate()}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm font-script focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}
              </div>

              {/* Evaluation Result Feedback Banner */}
              {evalResult && (
                <div
                  className={`p-3 sm:p-4 rounded-xl border mb-4 animate-in zoom-in-95 duration-150 ${
                    evalResult.is_correct
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
                      : "bg-rose-500/15 border-rose-500/40 text-rose-200"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {evalResult.is_correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base">
                          {evalResult.is_correct ? "Correct! Well Done!" : "Not Quite Right"}
                        </h4>
                        {evalResult.xp_earned > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-extrabold">
                            +{evalResult.xp_earned} XP
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">{evalResult.feedback}</p>
                      {evalResult.explanation && (
                        <p className="text-xs text-stone-400 mt-1.5 pt-1.5 border-t border-white/10 font-script leading-relaxed">
                          📖 <span className="font-semibold text-stone-200">Explanation:</span> {evalResult.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2.5 border-t border-stone-800">
                {!evalResult ? (
                  <>
                    <button
                      onClick={() => setActiveChallenge(null)}
                      className="px-3.5 py-2 rounded-xl text-stone-400 hover:text-white text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!selectedAnswer.trim() || evaluating}
                      onClick={handleEvaluate}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 min-h-[42px]"
                    >
                      {evaluating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Checking...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Answer</span>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setSelectedAnswer("");
                        setEvalResult(null);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-all min-h-[40px]"
                    >
                      Retry
                    </button>
                    <button
                      onClick={handleNextChallenge}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 min-h-[42px]"
                    >
                      <span>Next Challenge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </RequireAuth>
  );
}
