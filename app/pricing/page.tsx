// app/pricing/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Tag,
  BookOpen,
  Video,
  Users,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pricing Philosophy & Details | VartaLang Learn",
  description:
    "Understand how pricing works on VartaLang Learn: instructor-set pricing in INR (₹), transparent checkout with zero hidden fees, and secure Razorpay payment processing.",
};

export default function PricingPage() {
  const modelCards = [
    {
      icon: BookOpen,
      title: "Online Courses",
      badge: "Per Course",
      desc: "Comprehensive multi-lesson video courses with structured curriculum and downloadable notes.",
      pricingRule: "Priced individually by the instructor based on curriculum depth and lesson hours.",
      link: "/learn",
      linkText: "Browse Courses",
    },
    {
      icon: Video,
      title: "Live 1:1 Sessions",
      badge: "Per Session or Package",
      desc: "Direct, personalized speaking practice and feedback with certified language mentors.",
      pricingRule: "Priced per session (or per package of sessions, as stated on the listing) reflecting the instructor's direct 1:1 teaching time.",
      link: "/sessions",
      linkText: "Browse 1:1 Sessions",
    },
    {
      icon: Users,
      title: "Workshops (Online & Offline)",
      badge: "Per Seat",
      desc: "Intensive cohort-based bootcamps and cultural immersions. Offline workshops show venue and date with the price.",
      pricingRule: "Priced per seat with venue, dates, and study materials explicitly stated on the listing.",
      link: "/workshops",
      linkText: "Browse Workshops",
    },
  ];

  return (
    <div className="cultural-page min-h-screen text-stone-200 relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1920&q=85')`,
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

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-36 pb-20 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-10 group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-4">
            <Tag className="w-3.5 h-3.5" />
            <span>Transparent Pricing</span>
          </div>
          <h1 className="font-kalam text-4xl sm:text-5xl font-bold text-white mb-4">
            How Pricing Works on VartaLang
          </h1>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            VartaLang is an educator-driven language learning platform. Rather than imposing rigid, one-size-fits-all subscription fees, our instructors set the price for their content, curriculum and effort, so prices vary by offering.
          </p>
        </div>

        {/* 3 Core Principles Banner */}
        <div className="p-8 rounded-3xl bg-stone-900/60 border border-stone-800 mb-14">
          <h2 className="font-kalam text-2xl font-bold text-white mb-6">Our Pricing Commitments</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Instructor-Set Value</span>
              </div>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                Courses, 1:1 sessions and workshops are created by instructors, and each instructor sets the price based on their content, curriculum and effort, so prices vary.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Total Amount Transparency</span>
              </div>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                The exact price is always shown in INR (₹) on the listing page before purchase and again on the checkout page before payment. No hidden charges; the amount shown at checkout is the total payable.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Secure Payments via Razorpay</span>
              </div>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                All transactions are processed securely through Razorpay in Indian Rupees (INR, ₹) with full buyer protections per our refund policy.
              </p>
            </div>
          </div>
        </div>

        {/* Format Breakdown */}
        <section className="mb-14">
          <h2 className="font-kalam text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
            Explore Offering Models
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {modelCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-amber-400" />
                      </div>
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-stone-800 text-amber-300 border border-stone-700">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="font-kalam text-xl font-bold text-white mb-2">{card.title}</h3>
                    <p className="text-stone-400 text-xs leading-relaxed mb-4">{card.desc}</p>
                    <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 text-xs text-stone-300 mb-6">
                      <span className="text-amber-400 font-semibold block mb-1">Pricing Structure:</span>
                      {card.pricingRule}
                    </div>
                  </div>

                  <Link
                    href={card.link}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-white text-xs font-semibold transition-all group"
                  >
                    <span>{card.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pricing FAQs */}
        <section className="p-8 rounded-3xl bg-stone-900/60 border border-stone-800 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h2 className="font-kalam text-2xl font-bold text-white">Pricing FAQs</h2>
          </div>

          <div className="space-y-6 text-sm">
            <div className="border-b border-stone-800 pb-5">
              <h3 className="font-semibold text-white mb-1.5">Who decides the price?</h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                Courses, 1:1 sessions and workshops are created by instructors, and each instructor sets the price based on their content, curriculum and effort, so prices vary.
              </p>
            </div>

            <div className="border-b border-stone-800 pb-5">
              <h3 className="font-semibold text-white mb-1.5">Can prices change?</h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                The price shown at checkout is the price you pay. Instructors or VartaLang may update prices for future enrollments, but any change will never impact an order you have already completed.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-1.5">What is the refund policy if I am unsatisfied?</h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                All purchases are backed by our transparent refund guidelines: online courses are eligible for a full refund within 7 days of purchase if less than 20% accessed; live 1:1 sessions offer free reschedule or full refund when cancelled at least 24 hours prior; workshops offer full refund when cancelled at least 48 hours (online) or 72 hours (offline) in advance. Read our complete{" "}
                <Link href="/refund-policy" className="text-amber-400 underline font-medium">
                  Refund &amp; Cancellation Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Security & Razorpay Notice */}
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-4 text-xs sm:text-sm text-stone-300">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Payments securely processed by Razorpay in Indian Rupees (INR, ₹).</span>
          </div>
          <Link
            href="/learn"
            className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-colors shrink-0 text-xs"
          >
            Start Exploring
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
