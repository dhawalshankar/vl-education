// app/certifications/page.tsx
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Award, Clock, Search, ShieldCheck, ShieldX } from "lucide-react";
import { certificationAPI, CertificationVerifyResponse } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";

export default function CertificationsPage() {
  const { data: certs, error, loading } = useApi(() => certificationAPI.list());

  const [certId, setCertId] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CertificationVerifyResponse | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setChecking(true);
    setResult(null);
    setVerifyError(null);
    try {
      setResult(await certificationAPI.verify(certId.trim()));
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "Could not verify this certificate.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="cultural-page min-h-screen relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=1920&q=85')`,
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

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-400/30 mb-5">
            <Clock className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-semibold text-amber-200">Coming soon</span>
          </div>
          <h1 className="font-kalam text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
            Certifications
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-200 to-cyan-300">
              Prove Your Mastery
            </span>
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Credentials earned by completing structured learning tracks and assessments. Certification
            tracks will be available soon.
          </p>
        </div>

        {error && (
          <div className="mb-8 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
            Could not load certification tracks: {error}
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : !error && (certs?.length ?? 0) === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-stone-900/60 border border-stone-700/50 text-stone-400 mb-16">
            No certification tracks are published yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {certs?.map((cert) => (
              <div
                key={cert.id}
                className="p-8 rounded-2xl bg-stone-900/60 border-2 border-stone-700/50 hover:border-purple-500/40 transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-kalam text-xl font-bold text-white leading-snug">{cert.title}</h3>
                  {cert.eta && (
                    <span className="shrink-0 flex items-center gap-1.5 text-xs text-stone-500 bg-stone-800/60 px-3 py-1.5 rounded-full border border-stone-700/50">
                      <Clock className="w-3 h-3" /> {cert.eta}
                    </span>
                  )}
                </div>
                <p className="text-stone-400 text-sm leading-relaxed mb-4">{cert.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {cert.levels.map((l) => (
                    <span
                      key={l}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-stone-400"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Verify a certificate */}
        <div className="p-10 rounded-3xl bg-gradient-to-br from-purple-500/10 via-stone-900/60 to-blue-500/10 border-2 border-purple-500/20 max-w-2xl mx-auto">
          <h2 className="font-kalam text-3xl font-bold text-white mb-2 text-center">Verify a Certificate</h2>
          <p className="text-stone-400 text-sm mb-6 text-center">Enter a certificate ID to check that it is genuine.</p>

          <form onSubmit={handleVerify} className="flex gap-3">
            <input
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="Certificate ID"
              className="flex-1 px-4 py-3 rounded-xl bg-stone-950/80 border border-stone-700/50 text-white placeholder-stone-500 focus:outline-none focus:border-purple-400 text-sm"
            />
            <button
              type="submit"
              disabled={checking || !certId.trim()}
              className="px-5 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-40 text-white font-semibold text-sm flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {checking ? "Checking…" : "Verify"}
            </button>
          </form>

          {verifyError && <p className="mt-4 text-sm text-rose-300">{verifyError}</p>}

          {result && (
            <div
              className={`mt-5 p-4 rounded-xl text-sm border ${
                result.valid
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-200"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold mb-1">
                {result.valid ? <ShieldCheck className="w-4 h-4" /> : <ShieldX className="w-4 h-4" />}
                {result.valid ? "Valid certificate" : "Certificate not found"}
              </div>
              {result.valid && (
                <ul className="text-xs space-y-0.5 opacity-90">
                  {result.recipient_name && <li>Recipient: {result.recipient_name}</li>}
                  {result.certification_title && <li>Certification: {result.certification_title}</li>}
                  {result.language && <li>Language: {result.language}</li>}
                  {result.proficiency_level && <li>Level: {result.proficiency_level}</li>}
                  {result.issue_date && <li>Issued: {new Date(result.issue_date).toLocaleDateString()}</li>}
                  <li>Issuer: {result.issuer}</li>
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/learn"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 text-white rounded-xl font-bold font-kalam text-lg transition-all"
          >
            Explore Courses <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}