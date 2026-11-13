"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ExternalLink } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/app/context/AuthContext";
import { SSOError } from "@/lib/sso";
import Footer from "@/components/Footer";

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
    <div className="cultural-page min-h-screen relative overflow-hidden flex flex-col justify-between">
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-35 bg-cover bg-center scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=85')", filter: "contrast(110%) brightness(75%)" }} />
      <div className="fixed inset-0 pointer-events-none -z-10" style={{ background: "linear-gradient(180deg, rgba(14, 12, 10, 0.55) 0%, rgba(14, 12, 10, 0.78) 55%, #0e0c0a 100%)" }} />
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-[#14120E]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/80">
          <div className="flex flex-col items-center text-center mb-8">
            <img src="/logo.png" alt="VartaLang Logo" className="h-14 w-auto object-contain mb-3" />
            <h1 className="text-2xl font-bold text-white">VartaLang LMS</h1>
            <p className="text-xs text-white/50 mt-1">Sign in with your VartaLang account</p>
          </div>
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl text-xs flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          <button type="button" onClick={() => googleLogin()} disabled={loading} className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-50">
            {loading ? "Signing you in..." : "Continue with Google"}
          </button>
          {error?.kind === "SERVER_BUSY" && (
            <button type="button" onClick={() => googleLogin()} className="w-full mt-3 py-2.5 text-sm text-amber-300 hover:text-amber-200">
              Retry
            </button>
          )}
          {error?.kind === "ACCOUNT_NOT_FOUND" && (
            <a href={`${VARTALANG_URL}/auth/signup`} className="mt-4 flex items-center justify-center gap-2 text-sm text-amber-300 hover:underline">
              Create a free VartaLang account <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <a href={`${VARTALANG_URL}/auth/login`} className="mt-6 flex items-center justify-center text-sm text-white/60 hover:text-white hover:underline">
            Log in on VartaLang first
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
