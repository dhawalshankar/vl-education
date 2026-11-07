"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

type PaymentHandoff = {
  courseId?: string;
  completedAt?: number;
};

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  const courseId = searchParams.get("courseId");
  const language = searchParams.get("language");
  const title = searchParams.get("title");
  const courseHref =
    language && courseId
      ? `/learn/${encodeURIComponent(language)}/${encodeURIComponent(courseId)}`
      : "/learn";

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    let handoff: PaymentHandoff | null = null;
    try {
      handoff = JSON.parse(sessionStorage.getItem("paymentSuccess") || "null") as PaymentHandoff | null;
    } catch {
      handoff = null;
    }

    const isRecent = !!handoff?.completedAt && Date.now() - handoff.completedAt < 10 * 60 * 1000;
    if (!courseId || handoff?.courseId !== courseId || !isRecent) {
      router.replace("/learn");
      return;
    }

    sessionStorage.removeItem("paymentSuccess");
    queueMicrotask(() => setAuthorized(true));
  }, [authLoading, courseId, router, user]);

  if (authLoading || !authorized) {
    return (
      <main className="min-h-screen bg-[#0a0908]/90 flex items-center justify-center">
        <p className="text-amber-400 animate-pulse">Verifying payment status…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0e0c0a] text-white flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=85')`,
          filter: "contrast(110%) brightness(75%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 20%, rgba(255, 85, 0, 0.12), transparent 70%),
            linear-gradient(180deg, rgba(14, 12, 10, 0.55) 0%, rgba(14, 12, 10, 0.78) 55%, #0e0c0a 100%)
          `,
        }}
      />

      <section className="w-full max-w-lg rounded-3xl border border-emerald-500/25 bg-[#16130F]/90 backdrop-blur-xl p-8 text-center shadow-2xl relative z-10">
        <CheckCircle2 className="mx-auto mb-5 h-16 w-16 text-emerald-400" />
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-300">Payment successful</p>
        <h1 className="mb-3 font-kalam text-4xl font-bold">You&apos;re enrolled!</h1>
        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-stone-400">
          Your payment was verified and your course access is now active.
          {title ? ` You can start ${title} right away.` : ""}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={courseHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:from-amber-400 hover:to-orange-500"
          >
            <GraduationCap className="h-4 w-4" /> Start learning
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-stone-700 bg-stone-800 px-5 py-3 text-sm font-semibold text-stone-200 transition-colors hover:bg-stone-700"
          >
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0a0908]/90 flex items-center justify-center">
          <p className="text-amber-400 animate-pulse">Verifying payment status…</p>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
