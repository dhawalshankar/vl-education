"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Languages,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";

type Question = {
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

type Challenge = {
  title: string;
  description: string;
  language: string;
  icon: typeof Languages;
  accent: string;
  questions: Question[];
};

const CHALLENGES: Challenge[] = [
  {
    title: "Script Sprint",
    description: "Recognise everyday words and build confidence with a new Indian script.",
    language: "All languages",
    icon: Languages,
    accent: "from-orange-500/25 to-amber-500/10",
    questions: [
      {
        prompt: "What does “नमस्ते” mean?",
        options: ["Thank you", "Hello / greetings", "Good night", "Please"],
        answer: "Hello / greetings",
        explanation: "“नमस्ते” is a common Hindi greeting.",
      },
      {
        prompt: "Which script is used for “வணக்கம்”?",
        options: ["Tamil", "Bengali", "Gujarati", "Punjabi"],
        answer: "Tamil",
        explanation: "“வணக்கம்” is the Tamil greeting vanakkam.",
      },
      {
        prompt: "What does “ধন্যবাদ” mean in Bengali?",
        options: ["Welcome", "Good morning", "Thank you", "Friend"],
        answer: "Thank you",
        explanation: "“ধন্যবাদ” means thank you in Bengali.",
      },
    ],
  },
  {
    title: "Phrase Match",
    description: "Match useful phrases to their meaning before the clock runs out.",
    language: "Hindi",
    icon: Target,
    accent: "from-blue-500/25 to-cyan-500/10",
    questions: [
      {
        prompt: "“आप कैसे हैं?” means:",
        options: ["Where are you?", "How are you?", "What is your name?", "See you tomorrow"],
        answer: "How are you?",
        explanation: "“आप कैसे हैं?” is the polite way to ask how someone is.",
      },
      {
        prompt: "Choose the Hindi phrase for “I want water.”",
        options: ["मुझे पानी चाहिए।", "मुझे खाना चाहिए।", "आप कहाँ हैं?", "फिर मिलेंगे।"],
        answer: "मुझे पानी चाहिए।",
        explanation: "“पानी” means water and “चाहिए” means want/need.",
      },
      {
        prompt: "“धन्यवाद” is used to say:",
        options: ["Sorry", "Please", "Thank you", "Excuse me"],
        answer: "Thank you",
        explanation: "“धन्यवाद” is a formal Hindi way to say thank you.",
      },
    ],
  },
  {
    title: "Everyday Telugu",
    description: "Build a small Telugu vocabulary for everyday conversations.",
    language: "Telugu",
    icon: Target,
    accent: "from-violet-500/25 to-fuchsia-500/10",
    questions: [
      {
        prompt: "What does “నమస్కారం” mean?",
        options: ["Hello / greetings", "Water", "Food", "Goodbye"],
        answer: "Hello / greetings",
        explanation: "“నమస్కారం” is a respectful Telugu greeting.",
      },
      {
        prompt: "“ధన్యవాదాలు” means:",
        options: ["Please", "Thank you", "How are you?", "Welcome"],
        answer: "Thank you",
        explanation: "“ధన్యవాదాలు” means thank you in Telugu.",
      },
      {
        prompt: "Which word means “water” in Telugu?",
        options: ["నీరు", "ఇల్లు", "పుస్తకం", "స్నేహితుడు"],
        answer: "నీరు",
        explanation: "“నీరు” means water.",
      },
    ],
  },
];

const CHALLENGE_LANGUAGES = [
  "Assamese",
  "Bengali",
  "Bodo",
  "Dogri",
  "English",
  "Gujarati",
  "Hindi",
  "Kannada",
  "Kashmiri",
  "Konkani",
  "Maithili",
  "Malayalam",
  "Manipuri",
  "Marathi",
  "Nepali",
  "Odia",
  "Punjabi",
  "Sanskrit",
  "Santali",
  "Sindhi",
  "Tamil",
  "Telugu",
  "Urdu",
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Korean",
  "Mandarin Chinese",
  "Arabic",
];

export default function UpcomingChallengesPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("Hindi");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = selectedChallenge?.questions[questionIndex];
  const availableChallenges = CHALLENGES.filter(
    (challenge) => challenge.language === "All languages" || challenge.language === selectedLanguage
  );

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  };

  const submitAnswer = () => {
    if (!question || !selectedAnswer) return;
    const nextScore = score + (selectedAnswer === question.answer ? 1 : 0);
    setScore(nextScore);
    if (questionIndex === selectedChallenge!.questions.length - 1) {
      setFinished(true);
    } else {
      setQuestionIndex((current) => current + 1);
      setSelectedAnswer(null);
    }
  };

  const resetChallenge = () => {
    setSelectedChallenge(null);
    setSelectedAnswer(null);
    setFinished(false);
  };

  return (
    <RequireAuth>
      <div className="cultural-page min-h-screen text-white flex flex-col">
        <Navbar />

        <main className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_20%_10%,rgba(255,85,0,0.2),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.12),transparent_30%)]" />

          <div className="relative max-w-6xl mx-auto px-6 pt-36 pb-20">
            <Link
              href="/challenges"
              className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to challenges
            </Link>

            <section className="mt-10 max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/25 text-xs font-semibold text-amber-200">
                <Sparkles className="w-3.5 h-3.5" />
                Playable preview
              </span>
              <h1 className="mt-5 font-kalam text-5xl sm:text-6xl font-bold leading-tight">
                Small challenges.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-300">
                  Steady progress.
                </span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-stone-300 leading-relaxed">
                Choose a challenge and solve a few real questions. These are local
                previews for now; scores can be connected to the backend later.
              </p>
            </section>

            {!selectedChallenge && (
              <section className="mt-10 rounded-3xl border border-white/10 bg-stone-900/60 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-kalam text-2xl font-bold">Choose a language</h2>
                    <p className="mt-1 text-sm text-stone-400">
                      Pick the language you want to practise.
                    </p>
                  </div>
                  <Languages className="h-6 w-6 shrink-0 text-amber-400" />
                </div>
                <div className="mt-5 flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1">
                  {CHALLENGE_LANGUAGES.map((language) => (
                    <button
                      key={language}
                      onClick={() => setSelectedLanguage(language)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        selectedLanguage === language
                          ? "border-amber-400 bg-amber-500 text-stone-950 font-semibold"
                          : "border-white/10 bg-white/[0.03] text-stone-300 hover:border-amber-400/50 hover:text-white"
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {selectedChallenge ? (
              <section className="mt-12 max-w-3xl rounded-3xl border border-white/10 bg-stone-900/80 p-6 sm:p-8 shadow-2xl">
                {finished ? (
                  <div className="text-center">
                    <Trophy className="mx-auto h-12 w-12 text-amber-400" />
                    <h2 className="mt-4 font-kalam text-3xl font-bold">Challenge complete</h2>
                    <p className="mt-2 text-stone-400">
                      You scored {score} out of {selectedChallenge.questions.length}.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <button
                        onClick={() => startChallenge(selectedChallenge)}
                        className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 hover:bg-amber-400"
                      >
                        Try again
                      </button>
                      <button
                        onClick={resetChallenge}
                        className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                      >
                        Pick another
                      </button>
                    </div>
                  </div>
                ) : question ? (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-amber-400">{selectedChallenge.language}</p>
                        <h2 className="mt-1 font-kalam text-3xl font-bold">{selectedChallenge.title}</h2>
                      </div>
                      <span className="text-xs text-stone-400">
                        {questionIndex + 1}/{selectedChallenge.questions.length}
                      </span>
                    </div>
                    <div className="mt-5 h-1.5 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all"
                        style={{ width: `${((questionIndex + 1) / selectedChallenge.questions.length) * 100}%` }}
                      />
                    </div>
                    <h3 className="mt-8 text-xl font-semibold text-white">{question.prompt}</h3>
                    <div className="mt-5 grid gap-3">
                      {question.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => setSelectedAnswer(option)}
                          className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                            selectedAnswer === option
                              ? "border-amber-400 bg-amber-500/20 text-amber-100"
                              : "border-white/10 bg-white/[0.03] text-stone-300 hover:border-white/30"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {selectedAnswer && (
                      <p className="mt-5 text-sm text-stone-400">
                        {selectedAnswer === question.answer ? "Correct!" : `Answer: ${question.answer}.`}{" "}
                        {question.explanation}
                      </p>
                    )}
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <button onClick={resetChallenge} className="text-sm text-stone-400 hover:text-white">
                        Exit
                      </button>
                      <button
                        onClick={submitAnswer}
                        disabled={!selectedAnswer}
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {questionIndex === selectedChallenge.questions.length - 1 ? "Finish" : "Next"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : null}
              </section>
            ) : (
            <section className="mt-12 grid gap-5 sm:grid-cols-2" aria-label={`${selectedLanguage} challenges`}>
              {availableChallenges.map((challenge) => {
                const Icon = challenge.icon;
                return (
                  <article
                    key={challenge.title}
                    className={`rounded-3xl border border-white/10 bg-gradient-to-br ${challenge.accent} bg-stone-900/70 p-6 shadow-xl`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-black/25 border border-white/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-amber-300" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200">
                        Ready to play
                      </span>
                    </div>

                    <h2 className="mt-6 font-kalam text-2xl font-bold">{challenge.title}</h2>
                    <p className="mt-2 min-h-12 text-sm leading-relaxed text-stone-400">
                      {challenge.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-white/5 px-3 py-1.5 text-stone-300">
                        {challenge.language === "All languages" ? selectedLanguage : challenge.language}
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-1.5 text-stone-300">
                        {challenge.questions.length} questions
                      </span>
                    </div>

                    <button
                      onClick={() => startChallenge(challenge)}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-stone-950 hover:bg-amber-400"
                    >
                      Start challenge
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </article>
                );
              })}
            </section>
            )}

            {!selectedChallenge && (
              <div className="mt-10 text-center text-sm text-stone-400">
                {availableChallenges.length === 1
                  ? `More ${selectedLanguage} challenge types can be connected when the backend is ready.`
                  : `${availableChallenges.length} ${selectedLanguage} challenges available to play.`}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </RequireAuth>
  );
}
