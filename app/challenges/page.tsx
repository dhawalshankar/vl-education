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

  // User streak & session XP
  const [userStreak, setUserStreak] = useState(1);
  const [sessionXP, setSessionXP] = useState(0);

  // Load user streak on mount
  useEffect(() => {
    try {
      const s = getUserStreak(user?.email);
      setUserStreak(s.currentStreak || 1);
    } catch {
      setUserStreak(1);
    }
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

  // Distinct language list from catalog and challenges
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
        setSessionXP((prev) => prev + res.xp_earned);
        if (res.streak_count) {
          setUserStreak(res.streak_count);
        }
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
      <div className="cultural-page min-h-screen relative overflow-hidden flex flex-col justify-between">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16">
          {/* Header & Stats Banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold text-amber-200">
                Multilingual Arena • 31 Languages • 740+ Live Challenges
              </span>
            </div>
            <h1 className="font-kalam text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
              Multilingual Challenges
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-amber-300">
                Learn, Transliterate &amp; Conquer
              </span>
            </h1>
            <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Test your vocabulary, script recognition, and transliteration skills across
              all 22 Scheduled Indian languages, English, and in-demand world languages.
            </p>

            {/* Learner Dashboard Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900/80 border border-amber-500/30 text-xs sm:text-sm text-stone-200 shadow-md">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span>Daily Streak:</span>
                <span className="font-bold text-amber-400">{userStreak} Day{userStreak > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900/80 border border-red-500/30 text-xs sm:text-sm text-stone-200 shadow-md">
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Session XP:</span>
                <span className="font-bold text-amber-300">+{sessionXP} XP</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900/80 border border-stone-700/60 text-xs sm:text-sm text-stone-300 shadow-md">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>Coverage:</span>
                <span className="font-bold text-white">31 Languages</span>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1.5 rounded-2xl bg-stone-900/80 border border-stone-700/60 backdrop-blur-md max-w-full overflow-x-auto">
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
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                    selectedCategory === tab.id
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20"
                      : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      selectedCategory === tab.id ? "bg-black/30 text-white" : "bg-stone-800 text-stone-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Filters: Language Chips, Type, Difficulty & Search */}
          <div className="p-4 sm:p-6 rounded-2xl bg-stone-900/70 border border-stone-700/60 backdrop-blur-md mb-8">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by language, script (e.g. বাংলা, தமிழ்), or challenge..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchChallenges()}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950/70 border border-stone-700/70 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Challenge Type Dropdown */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-stone-950/70 border border-stone-700/70 text-xs sm:text-sm text-stone-300 focus:outline-none focus:border-orange-500"
                >
                  <option value="all">All Challenge Types</option>
                  <option value="translation_match">Translation &amp; Meaning Match</option>
                  <option value="transliteration">Transliteration &amp; Script</option>
                  <option value="script_identification">Script Identification</option>
                  <option value="contextual_cloze">Contextual Cloze / Blanks</option>
                </select>

                {/* Difficulty Dropdown */}
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-stone-950/70 border border-stone-700/70 text-xs sm:text-sm text-stone-300 focus:outline-none focus:border-orange-500"
                >
                  <option value="all">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                <button
                  onClick={fetchChallenges}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all"
                  title="Refresh challenges"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Language Selection Chips with Native Scripts */}
            <div className="pt-2 border-t border-stone-800/80">
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-medium">
                <span>Select Language ({filteredLanguages.length} available):</span>
                {selectedLanguage !== "all" && (
                  <button
                    onClick={() => setSelectedLanguage("all")}
                    className="text-amber-400 hover:underline text-[11px]"
                  >
                    Reset to All Languages
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                <button
                  onClick={() => setSelectedLanguage("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedLanguage === "all"
                      ? "bg-amber-500 text-black font-bold shadow-sm"
                      : "bg-stone-800/70 text-stone-300 hover:bg-stone-800"
                  }`}
                >
                  All Languages
                </button>
                {filteredLanguages.map((l) => (
                  <button
                    key={l.name}
                    onClick={() => setSelectedLanguage(l.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 font-script ${
                      selectedLanguage === l.name
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md"
                        : "bg-stone-800/70 text-stone-300 hover:bg-stone-800 hover:text-white"
                    }`}
                  >
                    <span>{l.name}</span>
                    <span className="opacity-70 text-[11px] font-normal">({l.native})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
              {error}
            </div>
          )}

          {/* Challenge Cards Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-stone-900/60 border border-stone-800 animate-pulse" />
              ))}
            </div>
          ) : challenges.length === 0 ? (
            <div className="p-8 sm:p-14 text-center rounded-3xl bg-stone-900/60 border border-stone-700/50 text-stone-400 mb-16">
              <HelpCircle className="w-12 h-12 text-stone-500 mx-auto mb-3" />
              <p className="text-base text-stone-300 font-medium mb-1">No challenges match your filter.</p>
              <p className="text-xs text-stone-500 mb-4">Try clearing filters or selecting another language category.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedLanguage("all");
                  setSelectedType("all");
                  setSelectedDifficulty("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-16">
              {challenges.map((c) => {
                const Icon = ICONS[c.type] || Target;
                const isRtl = RTL_LANGUAGES.has(c.language || "");
                return (
                  <div
                    key={c.id}
                    className="group relative p-5 rounded-2xl bg-stone-900/80 border border-stone-700/50 hover:border-orange-500/50 transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-orange-500/10"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-stone-800 border border-stone-700/80 text-amber-300">
                          <Icon className="w-3.5 h-3.5 text-amber-400" />
                          <span className="capitalize">{c.type.replace(/_/g, " ")}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              c.difficulty === "advanced"
                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                : c.difficulty === "intermediate"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {c.difficulty || "Beginner"}
                          </span>
                          <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                            +{c.xp_reward} XP
                          </span>
                        </div>
                      </div>

                      {/* Language Title & Native label */}
                      <div className="mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-orange-400">{c.language}</span>
                          {c.language_native && (
                            <span className="text-xs text-stone-400 font-script font-normal">
                              ({c.language_native})
                            </span>
                          )}
                        </div>
                        <h3 className="font-kalam text-lg sm:text-xl font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-1">
                          {c.title}
                        </h3>
                      </div>

                      {/* Question / Prompt preview */}
                      {c.prompt && (
                        <div
                          dir={isRtl ? "rtl" : "ltr"}
                          className={`p-3 rounded-xl bg-stone-950/70 border border-stone-800 text-xs text-stone-200 mb-3 font-script leading-relaxed ${
                            isRtl ? "text-right font-serif" : ""
                          }`}
                        >
                          {c.prompt}
                        </div>
                      )}

                      <p className="text-stone-400 text-xs line-clamp-2 leading-relaxed mb-4">
                        {c.desc}
                      </p>
                    </div>

                    {/* Solve Action Button */}
                    <button
                      onClick={() => handleOpenChallenge(c)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                    >
                      <span>Play Challenge</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Weekly Leaderboard Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-500/10 via-stone-900/80 to-orange-500/10 border border-red-500/20 max-w-3xl mx-auto mb-16 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <Trophy className="w-7 h-7 text-amber-400" />
                <div>
                  <h2 className="font-kalam text-2xl sm:text-3xl font-bold text-white leading-none">
                    Weekly Multilingual Leaderboard
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Top XP achievers competing across Indic and global languages
                  </p>
                </div>
              </div>

              {/* Leaderboard language filter */}
              <select
                value={boardLang}
                onChange={(e) => setBoardLang(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-300 focus:outline-none"
              >
                <option value="all">Global (All)</option>
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
              <div className="h-32 rounded-xl bg-white/5 animate-pulse" />
            ) : board.length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-6">
                No scores recorded for this filter yet. Be the first on the leaderboard!
              </p>
            ) : (
              <ol className="space-y-2.5">
                {board.map((row) => (
                  <li
                    key={row.rank + row.user_name}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all text-sm"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <span
                        className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-bold text-xs ${
                          row.rank === 1
                            ? "bg-amber-400 text-black"
                            : row.rank === 2
                            ? "bg-stone-300 text-black"
                            : row.rank === 3
                            ? "bg-amber-700 text-white"
                            : "text-stone-500 bg-stone-800"
                        }`}
                      >
                        {row.rank <= 3 ? <Medal className="w-3.5 h-3.5" /> : `#${row.rank}`}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-white font-medium">{row.user_name}</p>
                        <span className="text-[11px] text-stone-400">{row.language}</span>
                      </div>
                    </div>
                    <span className="text-amber-300 font-bold text-sm tracking-wide">
                      {row.xp} XP
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Start Learning / Explore CTA */}
          <div className="text-center">
            <Link
              href="/learn"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold font-kalam text-lg transition-all shadow-xl hover:shadow-orange-500/20"
            >
              Explore Full Courses <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* ── INTERACTIVE CHALLENGE ARENA MODAL ── */}
        {activeChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl rounded-3xl bg-stone-900 border-2 border-stone-700/80 shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-y-auto">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold font-script">
                    {activeChallenge.language} {activeChallenge.language_native ? `(${activeChallenge.language_native})` : ""}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-stone-800 text-stone-400 text-xs font-medium uppercase">
                    {activeChallenge.type.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    +{activeChallenge.xp_reward} XP
                  </span>
                  <button
                    onClick={() => setActiveChallenge(null)}
                    className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Challenge Title & Prompt */}
              <div className="mb-6">
                <h3 className="font-kalam text-xl sm:text-2xl font-bold text-white mb-2">
                  {activeChallenge.title}
                </h3>

                {activeChallenge.prompt && (
                  <div
                    dir={RTL_LANGUAGES.has(activeChallenge.language || "") ? "rtl" : "ltr"}
                    className={`p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-white font-script text-base sm:text-lg font-medium leading-relaxed my-3 shadow-inner ${
                      RTL_LANGUAGES.has(activeChallenge.language || "") ? "text-right font-serif" : ""
                    }`}
                  >
                    {activeChallenge.prompt}
                  </div>
                )}

                {/* Optional Hint Toggle */}
                {activeChallenge.hint && (
                  <div className="mt-2">
                    {showHint ? (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                        💡 <span className="font-bold">Hint:</span> {activeChallenge.hint}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowHint(true)}
                        className="text-xs text-stone-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                      >
                        💡 Need a hint?
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Input Area: Multiple Choice OR Free-text Input */}
              <div className="mb-6">
                {activeChallenge.options && activeChallenge.options.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {activeChallenge.options.map((opt, idx) => {
                      const isSelected = selectedAnswer === opt;
                      return (
                        <button
                          key={idx}
                          disabled={evaluating || evalResult !== null}
                          onClick={() => setSelectedAnswer(opt)}
                          dir={RTL_LANGUAGES.has(activeChallenge.language || "") && /[\u0600-\u06FF]/.test(opt) ? "rtl" : "ltr"}
                          className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all font-script ${
                            isSelected
                              ? "bg-orange-500/20 border-orange-500 text-white ring-2 ring-orange-500/40"
                              : "bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800/80 hover:border-stone-700"
                          } ${evalResult !== null ? "cursor-default" : ""}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span>{opt}</span>
                            <span
                              className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                                isSelected ? "border-orange-400 bg-orange-500 text-white font-bold" : "border-stone-700 text-stone-500"
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-2">
                      Type your answer (Unicode &amp; fuzzy evaluation supported):
                    </label>
                    <input
                      type="text"
                      disabled={evaluating || evalResult !== null}
                      placeholder="Type your answer in native script or transliteration..."
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !evaluating && !evalResult && handleEvaluate()}
                      className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white text-base font-script focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}
              </div>

              {/* Evaluation Result Feedback Banner */}
              {evalResult && (
                <div
                  className={`p-4 rounded-2xl border mb-6 animate-in zoom-in-95 duration-150 ${
                    evalResult.is_correct
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
                      : "bg-rose-500/15 border-rose-500/40 text-rose-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {evalResult.is_correct ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base">
                          {evalResult.is_correct ? "Correct! Well Done!" : "Not Quite Right"}
                        </h4>
                        {evalResult.xp_earned > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-black font-extrabold">
                            +{evalResult.xp_earned} XP
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-300">{evalResult.feedback}</p>
                      {evalResult.explanation && (
                        <p className="text-xs text-stone-400 mt-2 pt-2 border-t border-white/10 font-script">
                          📖 <span className="font-semibold text-stone-200">Explanation:</span> {evalResult.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                {!evalResult ? (
                  <>
                    <button
                      onClick={() => setActiveChallenge(null)}
                      className="px-4 py-2.5 rounded-xl text-stone-400 hover:text-white text-xs sm:text-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!selectedAnswer.trim() || evaluating}
                      onClick={handleEvaluate}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
                    >
                      {evaluating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Checking...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Answer</span>
                          <CheckCircle2 className="w-4 h-4" />
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
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs sm:text-sm font-semibold transition-all"
                    >
                      Retry
                    </button>
                    <button
                      onClick={handleNextChallenge}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
                    >
                      <span>Next Challenge</span>
                      <ArrowRight className="w-4 h-4" />
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
