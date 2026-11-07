// app/terms/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, Mail, Phone, MapPin, Clock, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT_DETAILS } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions | VartaLang Learn",
  description:
    "Review the Terms and Conditions for accessing courses, live 1:1 sessions, and language workshops on VartaLang Learn.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0908]/90 text-stone-200 relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1609137144822-0d12792c3065?w=1920&q=80')`,
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
            <FileText className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold">Legal Agreement</p>
            <h1 className="font-kalam text-3xl sm:text-4xl font-bold text-white">Terms &amp; Conditions</h1>
            <p className="text-stone-400 text-xs mt-1">Last updated: November 2026</p>
          </div>
        </div>

        <div className="space-y-8 leading-relaxed text-sm sm:text-base text-stone-300">
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">1. Introduction &amp; Operating Identity</h2>
            <p className="text-stone-300">
              Welcome to VartaLang Learn (accessible at <span className="text-amber-300 font-mono">learn.vartalang.in</span>).
              These Terms &amp; Conditions govern your access to and use of our website, services, digital language courses,
              live 1:1 sessions, and workshops (both online and offline).
            </p>
            <p className="mt-3 text-stone-300">
              VartaLang is operated by <strong className="text-white font-semibold">{CONTACT_DETAILS.OPERATING_NAME}</strong>.
              By registering an account, browsing our offerings, or completing a purchase, you agree to comply with and be bound
              by these Terms. If you do not agree with any part of these Terms, you must discontinue using the platform.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">2. Eligibility</h2>
            <p className="text-stone-300">
              You must be at least 18 years of age to create an account and make purchases on VartaLang. If you are under
              18 years of age (a minor), you may use the platform only with the involvement, consent, and supervision of a parent
              or legal guardian who agrees to be bound by these Terms.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">3. Account Registration &amp; Single-User License</h2>
            <p className="text-stone-300">
              To enroll in courses, book live sessions, or reserve workshop seats, you must register a personal LMS account.
              You agree to provide accurate, current, and complete information during registration.
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-stone-300">
              <li>Each LMS account is strictly for individual, single-user use.</li>
              <li>Account sharing, credential lending, or collaborative access to a single account is strictly prohibited.</li>
              <li>You are responsible for safeguarding your login credentials and for all activities conducted under your account.</li>
              <li>Notify us immediately at <a href={CONTACT_DETAILS.SUPPORT_EMAIL_MAILTO} className="text-amber-400 underline">{CONTACT_DETAILS.SUPPORT_EMAIL}</a> if you suspect unauthorized access.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">4. Offerings &amp; Course Access</h2>
            <p className="text-stone-300">
              VartaLang operates an educational platform where independent language educators and instructors offer:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 text-stone-300">
              <li><strong>Self-Paced Online Courses:</strong> Structured video lessons, written notes, and exercises accessible through the learner dashboard.</li>
              <li><strong>Live 1:1 Language Sessions:</strong> Real-time interactive sessions conducted via video conferencing with certified instructors.</li>
              <li><strong>Language Workshops (Online &amp; Offline):</strong> Interactive cohort-based workshops, hosted either virtually or in-person at designated venues, which may include physical study material.</li>
            </ul>
            <p className="mt-3 text-stone-300">
              Upon successful payment, course access is granted under a limited, non-exclusive, non-transferable, revocable license for personal, non-commercial educational study only.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">5. Live Session &amp; Workshop Conduct</h2>
            <p className="text-stone-300">
              Participants in live 1:1 sessions and workshops must maintain professional, respectful decorum toward instructors and fellow students.
              Disruptive behaviour, abusive language, harassment, unauthorized recording, and commercial solicitation are strictly prohibited.
              Instructors and VartaLang reserve the right to remove any participant violating these standards without refund.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">6. Intellectual Property &amp; Restrictions</h2>
            <p className="text-stone-300">
              All learning materials, including videos, scripts, worksheets, audio clips, graphics, trademarks, and documentation provided on VartaLang,
              are the intellectual property of VartaLang or its contributing instructors.
            </p>
            <p className="mt-2 text-stone-300">
              You agree not to copy, reproduce, distribute, republish, download, stream record, publicly perform, broadcast, sell, resell, or exploit any portion of the content without prior express written permission from VartaLang.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">7. Pricing &amp; Payments in INR</h2>
            <p className="text-stone-300">
              All prices on VartaLang are stated in Indian Rupees (INR, ₹).
            </p>
            <div className="mt-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-stone-200">
              <p className="font-medium text-amber-300">
                Prices are set by instructors; payments are collected by VartaLang.
              </p>
              <p className="text-sm mt-1 text-stone-300">
                Because each instructor independently determines the fee for their content, curriculum, expertise, and teaching effort, pricing varies by course, session, and workshop.
              </p>
            </div>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-stone-300">
              <li>The price displayed at checkout is final. You will pay the total payable amount shown before confirming your transaction.</li>
              <li>VartaLang may change prices for future purchases at any time, but price updates will never affect completed transactions or previously purchased access.</li>
              <li>Payments are processed securely via our payment gateway partner, Razorpay. VartaLang does not store your credit/debit card numbers, CVV, UPI PINs, or net banking passwords.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">8. Cancellations &amp; Refunds</h2>
            <p className="text-stone-300">
              All cancellations, rescheduling requests, and refunds are governed strictly by our{" "}
              <Link href="/refund-policy" className="text-amber-400 underline font-medium hover:text-amber-300">
                Refund &amp; Cancellation Policy
              </Link>
              , which forms an integral part of these Terms. Please review that policy before making any purchase.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">9. No Guaranteed Learning Outcomes</h2>
            <p className="text-stone-300">
              Language acquisition requires consistent personal dedication, regular practice, and individual effort. While our instructors strive to provide high-quality educational guidance, VartaLang does not guarantee specific linguistic fluency, exam scores, employment, or career outcomes.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">10. Limitation of Liability</h2>
            <p className="text-stone-300">
              To the maximum extent permitted by applicable law, VartaLang and its operator Dhawal Shukla shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising out of your access to or inability to use the platform.
              In no event shall our total aggregate liability exceed the total amount paid by you for the specific course, session, or workshop giving rise to the claim.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">11. Governing Law &amp; Jurisdiction</h2>
            <p className="text-stone-300">
              These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in Uttar Pradesh, India.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-3">12. Contact Information</h2>
            <p className="text-stone-300 mb-4">
              For any questions, legal notices, or clarifications regarding these Terms &amp; Conditions, please contact us:
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
