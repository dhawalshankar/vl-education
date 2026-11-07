"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HelpCircle,
  Search,
  ChevronDown,
  CreditCard,
  Zap,
  RotateCcw,
  Calendar,
  Users,
  DollarSign,
  Mail,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT_DETAILS } from "@/app/lib/constants";

interface FAQItem {
  category: string;
  q: string;
  a: string;
}

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCat, setSelectedCat] = useState("All");

  const faqs: FAQItem[] = [
    {
      category: "Pricing & Payments",
      q: "Who decides the price of courses, 1:1 sessions, and workshops?",
      a: "Courses, 1:1 sessions and workshops are created by instructors, and each instructor sets the price based on their content, curriculum and effort, so prices vary by offering.",
    },
    {
      category: "Pricing & Payments",
      q: "Can prices change after I purchase?",
      a: "No. The exact price is always shown in INR (₹) on the listing page before purchase and again on the checkout page before payment. The amount shown at checkout is the total payable. VartaLang may update prices for future enrollments, but price changes will never affect completed purchases.",
    },
    {
      category: "Pricing & Payments",
      q: "How are payments processed?",
      a: "Payments are collected by VartaLang and processed securely via Razorpay. We accept all major Indian payment methods including UPI (Google Pay, PhonePe, Paytm), debit cards, credit cards, net banking, and digital wallets. All transactions are billed in Indian Rupees (INR, ₹).",
    },
    {
      category: "Course Access",
      q: "How quickly do I receive access to a digital course after purchase?",
      a: "Digital courses are unlocked instantly or within 24 hours in your learner dashboard upon successful payment completion. You can log in and begin watching lessons immediately.",
    },
    {
      category: "Live 1:1 Sessions",
      q: "How are live 1:1 sessions conducted and how do I receive the link?",
      a: "Live 1:1 sessions are conducted online via high-quality video conferencing. Once you book a session, the meeting link and preparation instructions are shared with you by email and displayed in your learner dashboard well before the session start time.",
    },
    {
      category: "Live 1:1 Sessions",
      q: "Can I reschedule a live 1:1 session?",
      a: "Yes. You can request a free reschedule or a full refund if requested at least 24 hours before the scheduled session. Cancellations within 24 hours, or a no-show by the student, are non-refundable. If the instructor cancels or does not attend, you receive a full refund or a free reschedule of your choice.",
    },
    {
      category: "Workshops",
      q: "How do online and offline workshops work?",
      a: "Workshops are cohort-based learning events. Online workshops are conducted virtually, and access links are emailed before the start. Offline workshops take place in-person at the specific venue and date stated on the listing page. Seats are limited to maintain high instructor interaction.",
    },
    {
      category: "Workshops",
      q: "What is the cancellation policy for workshops?",
      a: "For online workshops, you receive a full refund if cancelled at least 48 hours before the start. For offline (in-person) workshops, you receive a full refund if cancelled at least 72 hours before the start. If VartaLang or the instructor cancels or reschedules to a date you cannot attend, you receive a full refund.",
    },
    {
      category: "Refunds",
      q: "What is the refund policy for self-paced courses?",
      a: "For self-paced online courses, we offer a full refund if requested within 7 days of purchase and less than 20% of the course content has been accessed. After 7 days, or once 20% or more has been accessed, no refund is available.",
    },
    {
      category: "Refunds",
      q: "What if physical study material arrives damaged or defective?",
      a: "Physical study materials dispatched for workshops are eligible for a free replacement or refund if damaged, defective, or incorrect, provided you report it to support within 7 days of delivery with photos.",
    },
    {
      category: "Refunds",
      q: "How long does a refund take to reach my bank account?",
      a: "Once approved, refunds are processed via Razorpay back to your original payment method within 5 to 7 business days.",
    },
    {
      category: "Refunds",
      q: "How do I submit a refund or support request?",
      a: `Simply email ${CONTACT_DETAILS.SUPPORT_EMAIL} from your registered LMS email address with your order details and reason. Our support team responds during working hours (${CONTACT_DETAILS.SUPPORT_HOURS}) within 24 to 48 hours.`,
    },
  ];

  const categories = ["All", "Pricing & Payments", "Course Access", "Live 1:1 Sessions", "Workshops", "Refunds"];

  const filtered = faqs.filter((f) => {
    const matchesCat = selectedCat === "All" || f.category === selectedCat;
    const matchesSearch =
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="cultural-page min-h-screen text-stone-200 relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=1920&q=85')`,
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

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h1 className="font-kalam text-4xl sm:text-5xl font-bold text-white mb-3">
            Common Questions &amp; Answers
          </h1>
          <p className="text-stone-400 text-sm sm:text-base">
            Everything you need to know about course access, live 1:1 sessions, workshops, pricing, and refunds.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions (e.g. refund, live sessions, pricing, access)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500/60 outline-none text-sm transition-colors"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCat === c
                  ? "bg-amber-500 text-stone-950 font-bold"
                  : "bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-14">
          {filtered.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-stone-900/40 border border-stone-800 text-stone-500 text-sm">
              No questions found matching your search. Try different keywords or contact support.
            </div>
          ) : (
            filtered.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-stone-900/60 border border-stone-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-800/40 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-stone-800 text-amber-400 font-mono hidden sm:inline-block">
                        {faq.category}
                      </span>
                      <h3 className="font-kalam text-lg font-bold text-white">{faq.q}</h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-stone-300 leading-relaxed border-t border-stone-800/60">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Quick Help Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900/80 to-amber-950/20 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-kalam text-xl font-bold text-white mb-1">Still have questions?</h3>
            <p className="text-xs sm:text-sm text-stone-400">
              Our support desk is available {CONTACT_DETAILS.SUPPORT_HOURS}.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/refund-policy"
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
