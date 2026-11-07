// app/instructor-terms/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  DollarSign,
  CalendarCheck,
  ShieldCheck,
  FileCheck,
  Mail,
  Phone,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT_DETAILS } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "Instructor Terms & Payout Agreement | VartaLang Learn",
  description:
    "Official terms, pricing autonomy, KYC requirements, and payout schedules for language educators and instructors on VartaLang Learn.",
};

export default function InstructorTermsPage() {
  return (
    <div className="cultural-page min-h-screen text-stone-200 relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1622396481304-4b53e839e944?w=1920&q=85')`,
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
            <GraduationCap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold">Educator Agreement</p>
            <h1 className="font-kalam text-3xl sm:text-4xl font-bold text-white">Instructor Terms &amp; Conditions</h1>
            <p className="text-stone-400 text-xs mt-1">Last updated: November 2026</p>
          </div>
        </div>

        <div className="space-y-8 leading-relaxed text-sm sm:text-base text-stone-300">
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">1. Partnership Overview</h2>
            <p className="text-stone-300">
              These Instructor Terms govern the relationship between language educators (&quot;Instructors&quot;) and VartaLang (operated by{" "}
              <strong className="text-white font-semibold">{CONTACT_DETAILS.OPERATING_NAME}</strong>).
              By submitting courses, hosting 1:1 sessions, or conducting language workshops on VartaLang, you agree to comply with these terms in conjunction with our general{" "}
              <Link href="/terms" className="text-amber-400 underline font-medium">Terms &amp; Conditions</Link>.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">2. Pricing Autonomy</h2>
            <p className="text-stone-300">
              Instructors set their own prices for their courses, sessions and workshops.
            </p>
            <p className="mt-2 text-stone-300">
              Each instructor determines the price of their offering based on the scope of curriculum, instructional materials, preparation, and pedagogical effort. All prices must be quoted and billed in Indian Rupees (INR, ₹).
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">3. Payment Collection &amp; Payout Mechanics</h2>
            <p className="text-stone-300">
              VartaLang collects payments from students via Razorpay and pays instructors their share after deducting the platform fee, within 15 days of the order being completed.
            </p>
            <div className="mt-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-stone-200">
              <span className="font-semibold text-amber-300 block mb-1">When is an order completed?</span>
              <p className="text-xs sm:text-sm text-stone-300">
                An order is completed when the course is purchased and the refund window has passed, or when the session/workshop has taken place.
              </p>
            </div>
            <ul className="list-disc list-inside mt-3 space-y-2 text-stone-300">
              <li>
                <strong>Platform Fee:</strong> The platform fee varies by instructor and is agreed with each instructor in writing before listing.
              </li>
              <li>
                <strong>Payout Timing:</strong> Qualified earnings are disbursed directly via bank transfer within 15 days of order completion.
              </li>
              <li>
                <strong>Refund Adjustments:</strong> If an order is refunded, the corresponding instructor payout is adjusted or reversed per the Refund &amp; Cancellation Policy.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">4. Mandatory KYC &amp; Verification Details</h2>
            <p className="text-stone-300">
              Instructors must provide valid KYC details (PAN and bank account) to receive payouts.
            </p>
            <p className="mt-2 text-stone-300">
              To ensure compliance with Indian financial regulations, payouts will be withheld until verified KYC documents are submitted and confirmed by our finance desk.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">5. Content Ownership, Originality &amp; Warranties</h2>
            <p className="text-stone-300">
              Instructors must own or have rights to the content they publish, and must not upload plagiarised or unlawful content.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 text-stone-300">
              <li>You represent and warrant that your lessons, audio clips, videos, and worksheets do not infringe upon any third-party intellectual property or privacy rights.</li>
              <li>You grant VartaLang a non-exclusive license to host, display, stream, and promote your content to registered students across our website and mobile platforms.</li>
              <li>VartaLang reserves the right to immediately remove any content flagged for copyright infringement or violation of Indian law without prior notice.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">6. Instructor Responsibilities &amp; Conduct</h2>
            <ul className="list-disc list-inside space-y-2 text-stone-300">
              <li>
                <strong>Punctuality:</strong> Attend scheduled live 1:1 sessions and workshops promptly at the agreed time. As detailed in our refund terms, instructor no-shows mandate a full refund or free reschedule for the student.
              </li>
              <li>
                <strong>Quality Standards:</strong> Deliver authentic instruction with clear audio, reliable internet connectivity, and accurate course descriptions.
              </li>
              <li>
                <strong>Offline Workshop Facilitation:</strong> For offline in-person workshops, facilitate the session at the published venue and ensure all promised printed study materials are made available.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-3">7. Instructor Support &amp; Queries</h2>
            <p className="text-stone-300 mb-4">
              For onboarding assistance, written fee agreements, KYC verification, or payout inquiries, please contact our educator support desk:
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
