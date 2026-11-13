// app/sso/page.tsx
"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { SSOError } from "@/lib/sso";

function SSOContent() {
  const params = useSearchParams();
  const router = useRouter();
  const auth = useAuth();
  const started = useRef(false);
  const [initialCode] = useState(() => params.get("code"));
  const [error, setError] = useState<SSOError | null>(null);
  const [slow, setSlow] = useState(false);
  const missingCode = !initialCode;

  useEffect(() => {
    const code = initialCode;
    if (!code || started.current) {
      return;
    }
    started.current = true;
    router.replace("/sso");
    const timer = window.setTimeout(() => setSlow(true), 5000);
    auth.loginWithCode(code)
      .then(() => router.replace("/dashboard"))
      .catch((caught) => setError(caught instanceof SSOError ? caught : new SSOError("Could not complete sign-in.", "UNKNOWN")))
      .finally(() => window.clearTimeout(timer));
  }, [auth, initialCode, router]);

  return (
    <main className="cultural-page min-h-screen flex items-center justify-center px-6 text-center text-white">
      {(error || missingCode) ? (
        <div>
          <h1 className="text-2xl font-bold mb-3">We couldn&apos;t sign you in</h1>
          <p className="text-white/70 mb-6">{error?.kind === "CODE_EXPIRED" ? "Your login link expired, please try again" : error?.message || "This sign-in link is missing its code."}</p>
          <button onClick={() => router.replace("/auth/login")} className="rounded-xl bg-amber-500 px-5 py-3 font-semibold text-stone-950">Back to login</button>
        </div>
      ) : (
        <div>
          <p className="text-xl font-semibold">Signing you in...</p>
          {slow && <p className="mt-3 text-sm text-white/60">Waking up the server, this can take up to a minute</p>}
        </div>
      )}
    </main>
  );
}

export default function SSOPage() {
  return <Suspense fallback={<main className="cultural-page min-h-screen flex items-center justify-center text-white">Signing you in...</main>}><SSOContent /></Suspense>;
}
