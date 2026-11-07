// app/refund-policy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Video,
  Users,
  PackageCheck,
  Clock,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT_DETAILS } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | VartaLang Learn",
  description:
    "Official Refund & Cancellation Policy for courses, live 1:1 sessions, and workshops on VartaLang Learn.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-200 relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0908]/80 via-[#0a0908]/90 to-[#0a0908] pointer-events-none" />

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
            <RotateCcw className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold">Payment Protection</p>
            <h1 className="font-kalam text-3xl sm:text-4xl font-bold text-white">Refund &amp; Cancellation Policy</h1>
            <p className="text-stone-400 text-xs mt-1">Last updated: November 2026</p>
          </div>
        </div>

        <div className="space-y-8 leading-relaxed text-sm sm:text-base text-stone-300">
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">Policy Overview</h2>
            <p className="text-stone-300">
              At VartaLang (operated by <strong className="text-white font-semibold">{CONTACT_DETAILS.OPERATING_NAME}</strong>),
              we strive to deliver transparent, fair educational services. Because our offerings span self-paced digital courses,
              scheduled live 1:1 sessions, workshops (both online and in-person), and occasional physical study materials,
              clear rules apply to each category as set forth below.
            </p>
            <p className="mt-3 text-stone-300">
              Any instructor-specific cancellation window is shown on that listing page and never makes refunds worse than the rules set forth in this policy.
            </p>
          </section>

          {/* 1. Online Courses */}
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h2 className="font-kalam text-xl font-bold text-white">1. Self-Paced Online Courses</h2>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-stone-200">
              <p className="font-medium text-amber-300">
                Full refund if requested within 7 days of purchase and less than 20% of the course content has been accessed.
              </p>
            </div>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-stone-300">
              <li>Course progress is measured automatically by our LMS (completed lessons, viewed video runtime, and resource access).</li>
              <li>If more than 7 days have elapsed from the date of purchase, or if 20% or more of the course content has been accessed, no refund will be issued.</li>
            </ul>
          </section>

          {/* 2. Live 1:1 Sessions */}
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center gap-3 mb-3">
              <Video className="w-5 h-5 text-blue-400" />
              <h2 className="font-kalam text-xl font-bold text-white">2. Live 1:1 Language Sessions</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-stone-300">
              <li>
                <strong>Student Cancellation (At least 24 hours prior):</strong> Free reschedule or a full refund if cancelled at least 24 hours before the scheduled session start time.
              </li>
              <li>
                <strong>Student Cancellation (Within 24 hours) or No-Show:</strong> Cancellation within 24 hours of the scheduled start, or a no-show by the student, is strictly non-refundable, as the instructor has reserved their time exclusively for you.
              </li>
              <li>
                <strong>Instructor Cancellation or No-Show:</strong> If the instructor cancels or does not attend the session, the student receives a full refund or a free reschedule of their choice.
              </li>
            </ul>
          </section>

          {/* 3. Workshops */}
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-purple-400" />
              <h2 className="font-kalam text-xl font-bold text-white">3. Language Workshops (Online &amp; Offline)</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700">
                <h3 className="font-semibold text-white mb-1">Workshops (Online / Virtual):</h3>
                <p className="text-stone-300">
                  Full refund if cancelled at least 48 hours before the workshop start time. If VartaLang or the instructor cancels the workshop, the student receives a full refund.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700">
                <h3 className="font-semibold text-white mb-1">Workshops (Offline, In-Person):</h3>
                <p className="text-stone-300">
                  Full refund if cancelled at least 72 hours before the workshop start time. If VartaLang or the instructor cancels or reschedules the workshop to a date the student cannot attend, the student receives a full refund.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Physical Material */}
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center gap-3 mb-3">
              <PackageCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="font-kalam text-xl font-bold text-white">4. Physical Study Material</h2>
            </div>
            <p className="text-stone-300">
              For offline workshops or study bundles that include physical workbooks, flashcards, or printed material:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 text-stone-300">
              <li>
                Full refund or free replacement for damaged, defective, or wrong items if reported within 7 days of delivery with clear photographic evidence.
              </li>
              <li>
                Requests submitted after 7 days from delivery cannot be accommodated.
              </li>
            </ul>
          </section>

          {/* 5. Refund Timeline */}
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="font-kalam text-xl font-bold text-white">5. Refund Processing Timeline</h2>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-stone-200">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">Refund timeline: 5-7 business days</p>
                <p className="text-sm mt-1 text-stone-300">
                  Once your refund request is verified and approved by our support team, the refund is initiated immediately through Razorpay and will credit back to your original payment method (bank account, UPI, credit/debit card) within 5 to 7 business days.
                </p>
              </div>
            </div>
          </section>

          {/* 6. How to Request */}
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-3">6. How to Request a Refund or Reschedule</h2>
            <p className="text-stone-300 mb-3">
              To request a cancellation, reschedule, or refund, follow these simple steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-stone-300">
              <li>
                Send an email to <a href={CONTACT_DETAILS.SUPPORT_EMAIL_MAILTO} className="text-amber-400 underline font-medium">{CONTACT_DETAILS.SUPPORT_EMAIL}</a>.
              </li>
              <li>Use the subject line: <span className="font-mono text-amber-300">Refund Request - [Your Order ID]</span>.</li>
              <li>Send the email from your registered VartaLang LMS email address.</li>
              <li>Include your Order ID or Razorpay Payment ID, item name (course, session, or workshop), and the reason for the request.</li>
              <li>If claiming for physical material damage, attach high-resolution photos of the package and item defect.</li>
            </ol>
            <p className="mt-3 text-stone-400 text-xs">
              Our support team reviews all requests during support hours ({CONTACT_DETAILS.SUPPORT_HOURS}) and responds within 24 to 48 hours.
            </p>
          </section>

          {/* Contact Details */}
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-3">7. Contact Information</h2>
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
