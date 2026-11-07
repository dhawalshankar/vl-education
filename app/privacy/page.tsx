// app/privacy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Mail, Phone, MapPin, Clock, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT_DETAILS } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | VartaLang Learn",
  description:
    "Learn how VartaLang Learn collects, uses, and safeguards your personal data, and how Razorpay handles payment security.",
};

export default function PrivacyPage() {
  return (
    <div className="cultural-page min-h-screen text-stone-200 relative overflow-hidden flex flex-col justify-between">
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

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-36 pb-20 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-10 group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold">User Privacy &amp; Trust</p>
            <h1 className="font-kalam text-3xl sm:text-4xl font-bold text-white">Privacy Policy</h1>
            <p className="text-stone-400 text-xs mt-1">Last updated: November 2026</p>
          </div>
        </div>

        <div className="space-y-8 leading-relaxed text-sm sm:text-base text-stone-300">
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">1. Overview</h2>
            <p className="text-stone-300">
              VartaLang (accessible at <span className="text-amber-300 font-mono">learn.vartalang.in</span> and operated by{" "}
              <strong className="text-white font-semibold">{CONTACT_DETAILS.OPERATING_NAME}</strong>) values your privacy.
              This Privacy Policy explains what personal information we collect, why we collect it, how it is used, and the choices
              available to you regarding your data.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">2. Information We Collect</h2>
            <p className="text-stone-300">
              We collect information that is strictly necessary to deliver our educational services:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-stone-300">
              <li>
                <strong>Account Credentials &amp; Profile Details:</strong> Your full name, email address, password hash, and avatar (if provided).
              </li>
              <li>
                <strong>Google Single Sign-On (OAuth):</strong> When you sign in using Google, we receive your verified email address, profile name, and OAuth token from Google to create and authenticate your account.
              </li>
              <li>
                <strong>Learning Progress &amp; Activity:</strong> Courses you enroll in, lesson completion markers, quiz scores, streak records, notes saved, and session attendance records.
              </li>
              <li>
                <strong>Communications:</strong> Inquiries, support messages, or feedback sent to our support desk.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">3. Payment Information Handled by Razorpay</h2>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-stone-200">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-300">We do not store your payment credentials.</p>
                <p className="text-sm mt-1 text-stone-300">
                  All online financial transactions are processed securely through our trusted payment gateway partner, <strong>Razorpay</strong>.
                  Your credit card numbers, debit card details, net banking credentials, and UPI security codes are handled directly by Razorpay in compliance with PCI-DSS standards and Reserve Bank of India (RBI) guidelines.
                  VartaLang only receives transaction identifiers (e.g., Order ID, Payment ID) and payment status to fulfill your enrollment.
                </p>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">4. How We Use Your Information</h2>
            <p className="text-stone-300">We utilize collected data solely for the following legitimate educational purposes:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-stone-300">
              <li>Authenticating your account and granting access to purchased courses, live sessions, and workshops.</li>
              <li>Recording your learning milestones, streaks, and progress markers.</li>
              <li>Sending essential transactional notifications, including order confirmations, class schedule updates, and refund updates.</li>
              <li>Responding to support tickets, inquiries, and customer service requests.</li>
              <li>Maintaining system security, preventing unauthorized access, and detecting fraud.</li>
            </ul>
            <p className="mt-3 text-stone-300">
              We never sell, rent, or trade your personal data to advertisers or third-party marketing companies.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">5. Cookies &amp; Local Storage</h2>
            <p className="text-stone-300">
              We use standard browser cookies and <span className="font-mono text-amber-300">localStorage</span> exclusively for essential platform functionality:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 text-stone-300">
              <li>Keeping you signed in across browser sessions securely via JSON Web Tokens (JWT).</li>
              <li>Remembering your interface preferences and course playback state.</li>
            </ul>
            <p className="mt-2 text-stone-300">We do not use invasive third-party tracking or behavioral advertising cookies.</p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">6. Third-Party Service Providers</h2>
            <p className="text-stone-300">
              We collaborate with vetted service providers who process data strictly under our instruction:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 text-stone-300">
              <li><strong>Razorpay:</strong> Secure payment checkout and verification.</li>
              <li><strong>Google OAuth:</strong> Optional single sign-on authentication.</li>
              <li><strong>Cloud Infrastructure:</strong> Secure cloud servers with encrypted data storage.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">7. Data Retention</h2>
            <p className="text-stone-300">
              We retain your personal data for as long as your LMS account remains active to provide uninterrupted access to your learning history.
              Transaction identifiers are retained as required by Indian accounting and financial record-keeping laws. You may request account deletion at any time.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">8. Your Rights</h2>
            <p className="text-stone-300">Under applicable Indian data protection principles, you possess the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 text-stone-300">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction or updating of inaccurate profile information.</li>
              <li>Request the permanent deletion of your account and personal details (subject to statutory retention obligations).</li>
            </ul>
            <p className="mt-3 text-stone-300">
              To exercise any of these rights, please email us from your registered email address at{" "}
              <a href={CONTACT_DETAILS.SUPPORT_EMAIL_MAILTO} className="text-amber-400 underline">
                {CONTACT_DETAILS.SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-3">9. Contact Us</h2>
            <p className="text-stone-300 mb-4">
              If you have any questions, privacy concerns, or data requests, please contact:
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="text-white font-medium">{CONTACT_DETAILS.BUSINESS_NAME}</div>
              <div className="flex items-start gap-2.5 text-stone-300">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span>{CONTACT_DETAILS.BUSINESS_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={CONTACT_DETAILS.PHONE_TEL} className="hover:text-amber-400 underline">
                  {CONTACT_DETAILS.PHONE}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-stone-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={CONTACT_DETAILS.SUPPORT_EMAIL_MAILTO} className="hover:text-amber-400 underline">
                  {CONTACT_DETAILS.SUPPORT_EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-stone-400 text-xs">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Support Hours: {CONTACT_DETAILS.SUPPORT_HOURS}</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
