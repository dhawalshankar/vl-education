"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/app/context/AuthContext";
import Footer from "@/components/Footer";

const VARTALANG_URL = process.env.NEXT_PUBLIC_VARTALANG_URL || "https://vartalang.in";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth?.isAuthenticated) router.replace("/dashboard");
  }, [auth?.isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    setError(null);
    try {
      await auth.login(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (t) => {
      setLoading(true);
      setError(null);
      try {
        const info = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${t.access_token}` },
        }).then((r) => r.json());
        await auth.loginWithGoogle(t.access_token, info.email, info.name);
        router.replace("/dashboard");
      } catch (err: any) {
        if (err?.notFound) {
          // No VartaLang account yet -> send to signup
          window.location.href = `${VARTALANG_URL}/auth/signup`;
          return;
        }
        setError(err instanceof Error ? err.message : "Google sign-in failed.");
        setLoading(false);
      }
    },
    onError: () => setError("Google sign-in was cancelled or failed."),
  });

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/25 text-sm outline-none focus:border-[#FF5500]";

  return (
    <div className="cultural-page min-h-screen relative overflow-hidden flex flex-col justify-between">
      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=85')`,
          filter: "contrast(110%) brightness(75%)",
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

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-[#14120E]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/80">
          <div className="flex flex-col items-center text-center mb-8">
            <img src="/logo.png" alt="VartaLang Logo" className="h-14 w-auto object-contain mb-3 drop-shadow-lg" />
            <h1 className="text-2xl font-bold text-white">VartaLang LMS</h1>
            <p className="text-xs text-white/50 mt-1">Sign in with your VartaLang account</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl text-xs flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={loading}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-5 text-xs text-white/30">
            <div className="flex-1 h-px bg-white/10" />
            or use email
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={inputCls}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs text-white/50">Password</label>
                <a href={`${VARTALANG_URL}/auth/forgot-password`} className="text-xs text-[#FF7700] hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={inputCls}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#FF5500] to-[#E64A00] hover:from-[#FF6600] hover:to-[#FF5500] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Signing in… (first login can take up to a minute)"
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
