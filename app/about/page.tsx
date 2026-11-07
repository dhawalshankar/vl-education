// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Video,
  Users,
  Compass,
  ShieldCheck,
  Award,
  Globe,
  Sparkles,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT_DETAILS } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "About Us | VartaLang Learn",
  description:
    "Learn Indian languages through expert-led courses, live 1:1 sessions, and interactive online and offline workshops on VartaLang Learn, operated by Dhawal Shukla.",
};

export default function AboutPage() {
  const offerings = [
    {
      icon: BookOpen,
      title: "Self-Paced Online Courses",
      desc: "Comprehensive video curricula covering grammar, vocabulary, pronunciation, and practical conversation across Indian languages.",
    },
    {
      icon: Video,
      title: "Live 1:1 Language Mentoring",
      desc: "Personalized, interactive speaking practice with qualified native language instructors tailored to your personal goals.",
    },
    {
      icon: Users,
      title: "Interactive Workshops (Online & Offline)",
      desc: "Immersive cohorts, script-writing bootcamps, and cultural workshops conducted both virtually and in-person with hands-on practice.",
    },
  ];

  const pillars = [
    {
      icon: Compass,
      title: "Instructor-Driven Curriculum",
      desc: "Instructors design authentic syllabi, curate lessons, and set their own pricing reflecting their pedagogical experience.",
    },
    {
      icon: ShieldCheck,
      title: "Transparent & Safe Transactions",
      desc: "All payments are processed securely in INR via Razorpay, protected by comprehensive cancellation and refund guarantees.",
    },
    {
      icon: Globe,
      title: "Linguistic Heritage Preservation",
      desc: "Dedicated to promoting Indian scheduled languages and regional dialects through structured, modern digital pedagogy.",
    },
  ];

  return (
    <div className="cultural-page min-h-screen text-stone-200 relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&q=85')`,
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

        {/* Hero Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Educational Platform</span>
          </div>
          <h1 className="font-kalam text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5">
            About VartaLang
          </h1>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            VartaLang is an Indian language learning platform offering structured online courses, live 1:1 sessions,
            and interactive workshops. We connect passionate learners with experienced language educators to make authentic
            language education accessible, practical, and engaging.
          </p>
          <p className="text-stone-400 text-sm mt-3">
            Operated by <strong className="text-white font-semibold">{CONTACT_DETAILS.OPERATING_NAME}</strong>. An initiative by Cosmo India Prakashan.
          </p>
        </div>

        {/* Mission Statement */}
        <section className="p-8 sm:p-10 rounded-3xl bg-stone-900/60 border border-stone-800 mb-16">
          <h2 className="font-kalam text-2xl sm:text-3xl font-bold text-white mb-4">Our Mission</h2>
          <div className="space-y-4 text-stone-300 leading-relaxed text-sm sm:text-base">
            <p>
              India’s linguistic diversity encompasses 22 officially scheduled languages and hundreds of regional dialects.
              Each carries centuries of literary heritage, cultural nuance, and community identity. Yet, learners seeking structured,
              high-quality language instruction—whether for career relocation, competitive examinations, academic pursuits, or family
              connection—often encounter fragmented resources.
            </p>
            <p>
              VartaLang bridges this gap by providing an open, instructor-led marketplace where educators publish their curricula,
              deliver live personalized tutoring, and organize immersive workshops.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-16">
          <h2 className="font-kalam text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {offerings.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="font-kalam text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How the Platform Works */}
        <section className="p-8 sm:p-10 rounded-3xl bg-stone-900/60 border border-stone-800 mb-16">
          <h2 className="font-kalam text-2xl sm:text-3xl font-bold text-white mb-6">
            How the Platform Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center font-mono">
                1
              </span>
              <h3 className="font-semibold text-white">Instructors Curate</h3>
              <p className="text-stone-400 leading-relaxed">
                Qualified educators create courses, design live 1:1 session syllabi, and organize workshops, establishing pricing that reflects their curriculum and effort.
              </p>
            </div>
            <div className="space-y-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center font-mono">
                2
              </span>
              <h3 className="font-semibold text-white">Learners Enroll</h3>
              <p className="text-stone-400 leading-relaxed">
                Learners browse public catalogs, review syllabi and instructor profiles, and complete secure payments in INR via Razorpay.
              </p>
            </div>
            <div className="space-y-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center font-mono">
                3
              </span>
              <h3 className="font-semibold text-white">Learn &amp; Practice</h3>
              <p className="text-stone-400 leading-relaxed">
                Students access digital coursework instantly in the LMS dashboard, join scheduled 1:1 sessions, and attend workshops with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values / Pillars */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800">
                  <Icon className="w-6 h-6 text-amber-400 mb-3" />
                  <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Operating Identity & Contact */}
        <section className="p-8 rounded-3xl bg-stone-900/60 border border-stone-800">
          <h2 className="font-kalam text-2xl font-bold text-white mb-4">Operating Details</h2>
          <p className="text-stone-300 text-sm mb-4">
            VartaLang is owned and operated by <strong>{CONTACT_DETAILS.OPERATING_NAME}</strong> with registered operating headquarters in Uttar Pradesh, India.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-xs text-stone-400 pt-2 border-t border-stone-800">
            <div>
              <span className="font-medium text-stone-300 block mb-0.5">Address:</span>
              <span>{CONTACT_DETAILS.BUSINESS_ADDRESS}</span>
            </div>
            <div>
              <span className="font-medium text-stone-300 block mb-0.5">Contact:</span>
              <p>Email: <a href={CONTACT_DETAILS.SUPPORT_EMAIL_MAILTO} className="text-amber-400 underline">{CONTACT_DETAILS.SUPPORT_EMAIL}</a></p>
              <p>Phone: <a href={CONTACT_DETAILS.PHONE_TEL} className="text-amber-400 underline">{CONTACT_DETAILS.PHONE}</a></p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
