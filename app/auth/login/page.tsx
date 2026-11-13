"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Globe,
  GraduationCap,
  Languages,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/app/context/AuthContext";
import { SSOError } from "@/lib/sso";

const VARTALANG_URL = "https://vartalang.in";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SSOError | null>(null);

  useEffect(() => {
    if (!auth.loading && auth.isAuthenticated) router.replace("/dashboard");
  }, [auth.loading, auth.isAuthenticated, router]);

  const handleGoogleSuccess = async (result: { access_token: string }) => {
    setLoading(true);
    setError(null);
    try {
      await auth.loginWithGoogle(result.access_token);
      router.replace("/dashboard");
    } catch (caught) {
      setError(
        caught instanceof SSOError
          ? caught
          : new SSOError("Google sign-in failed.", "UNKNOWN")
      );
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: handleGoogleSuccess,
    onError: () => setError(new SSOError("Google sign-in was cancelled or failed.", "UNKNOWN")),
  });

  const errorMessage =
    error?.kind === "ACCOUNT_NOT_FOUND"
      ? "No VartaLang account for this Google email. Create a free account at vartalang.in first, then come back."
      : error?.kind === "SERVER_BUSY"
        ? "The server is waking up. This can take up to a minute."
        : error?.kind === "INACTIVE"
          ? "Your account is inactive. Please contact VartaLang support."
          : error?.message || null;

  return (
    <div className="cultural-page min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
      <main className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <section className="mx-auto w-full max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-400/10 px-3.5 py-2 text-xs font-semibold text-orange-200">
            <Sparkles className="h-4 w-4 text-amber-300" />
            Your next favorite word is waiting
          </div>
          <h1 className="mt-6 font-kalam text-4xl font-bold leading-tight text-white sm:text-5xl">
            Learn a language.
            <br />
            <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-orange-500 bg-clip-text text-transparent">
              Find a whole new voice.
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-stone-300 sm:text-lg">
            Little lessons, real conversations, and a world of culture to explore.
            Let&apos;s get you learning.
          </p>

          <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">
            {[
              { icon: Globe, label: "22+ languages", color: "text-orange-300", bg: "bg-orange-400/10" },
              { icon: BookOpen, label: "Bite-size lessons", color: "text-amber-300", bg: "bg-amber-400/10" },
              { icon: MessageCircle, label: "Speak with confidence", color: "text-rose-300", bg: "bg-rose-400/10" },
            ].map(({ icon: Icon, label, color, bg }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center backdrop-blur-sm sm:p-4"
              >
                <span className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-2 block text-[11px] font-medium leading-snug text-stone-300 sm:text-xs">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex max-w-lg items-center gap-3 rounded-2xl border border-white/10 bg-[#181511]/75 px-4 py-3.5 shadow-lg shadow-black/20">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-stone-950">
              <Languages className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone-500">A little hello goes far</p>
              <p className="mt-0.5 truncate font-kalam text-lg font-bold text-white sm:text-xl">
                Namaste <span className="text-orange-300">·</span> வணக்கம் <span className="text-orange-300">·</span> নমস্কার
              </p>
            </div>
            <Sparkles className="h-5 w-5 shrink-0 text-amber-300" />
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-[2rem] border border-white/10 bg-[#14120E]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-9">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-300/20 bg-gradient-to-br from-orange-400/20 to-amber-300/10 shadow-lg shadow-orange-950/30">
                <img src="/logo.png" alt="VartaLang Logo" className="h-11 w-auto object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-white">Welcome back!</h2>
              <p className="mt-2 text-sm text-stone-400">Sign in and pick up where your story left off.</p>
            </div>
            {errorMessage && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => googleLogin()}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3.5 text-sm font-bold text-stone-950 shadow-lg shadow-orange-950/30 transition-all hover:from-amber-300 hover:to-orange-400 hover:shadow-orange-950/50 disabled:opacity-50"
            >
              <GraduationCap className="h-5 w-5" />
              {loading ? "Signing you in..." : "Continue with Google"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-stone-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Secure sign-in with your VartaLang account
            </div>
            {error?.kind === "SERVER_BUSY" && (
              <button type="button" onClick={() => googleLogin()} className="mt-4 w-full py-2.5 text-sm text-amber-300 hover:text-amber-200">
                Try again
              </button>
            )}
            {error?.kind === "ACCOUNT_NOT_FOUND" && (
              <a href={`${VARTALANG_URL}/auth/signup`} className="mt-4 flex items-center justify-center gap-2 text-sm text-amber-300 hover:underline">
                Create a free VartaLang account <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <div className="my-6 flex items-center gap-3 text-[11px] text-stone-600">
              <span className="h-px flex-1 bg-white/10" />
              NEW TO VARTALANG?
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <a href={`${VARTALANG_URL}/auth/login`} className="flex items-center justify-center text-sm text-stone-400 transition-colors hover:text-white hover:underline">
              Log in on VartaLang first
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
