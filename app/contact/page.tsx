"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Globe,
  ArrowUpRight,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  MessageCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT_DETAILS, SOCIAL_LINKS } from "@/app/lib/constants";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      "",
      form.message,
    ].join("\n");
    const mailto = `${CONTACT_DETAILS.SUPPORT_EMAIL_MAILTO}?subject=${encodeURIComponent(
      form.subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="cultural-page min-h-screen text-stone-200 relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Background Indian Monument Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-35 bg-cover bg-center scale-105 transition-opacity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1598324789736-4861f89564a0?w=1920&q=85')`,
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

        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>Support Desk</span>
          </div>
          <h1 className="font-kalam text-4xl sm:text-5xl font-bold text-white mb-3">
            Contact Us
          </h1>
          <p className="text-stone-400 text-sm sm:text-base">
            Have questions about courses, live 1:1 sessions, workshops, or your account?
            We are here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-2 space-y-6 p-5 sm:p-7 rounded-3xl bg-stone-900/60 border border-stone-800">
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-1">
                Operating Name
              </p>
              <h2 className="text-lg font-bold text-white">
                {CONTACT_DETAILS.BUSINESS_NAME}
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="block text-xs text-stone-400 font-medium">Postal Address</span>
                  <p className="text-stone-200 mt-0.5 leading-snug">{CONTACT_DETAILS.BUSINESS_ADDRESS}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="block text-xs text-stone-400 font-medium">Phone Number</span>
                  <a
                    href={CONTACT_DETAILS.PHONE_TEL}
                    className="text-amber-400 hover:text-amber-300 font-semibold underline mt-0.5 inline-block"
                  >
                    {CONTACT_DETAILS.PHONE}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="block text-xs text-stone-400 font-medium">Customer Support Email</span>
                  <a
                    href={CONTACT_DETAILS.SUPPORT_EMAIL_MAILTO}
                    className="text-amber-400 hover:text-amber-300 font-semibold underline mt-0.5 inline-block break-all"
                  >
                    {CONTACT_DETAILS.SUPPORT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="block text-xs text-stone-400 font-medium">Operating Hours</span>
                  <p className="text-stone-200 mt-0.5">{CONTACT_DETAILS.SUPPORT_HOURS}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-stone-800">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="block text-xs text-stone-400 font-medium">Main Portal</span>
                  <a
                    href={CONTACT_DETAILS.MAIN_WEBSITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-300 hover:text-amber-400 inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>vartalang.in</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-3 border-t border-stone-800">
                <span className="block text-xs text-stone-400 font-medium mb-2.5">Official Social Channels</span>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={SOCIAL_LINKS.TWITTER}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="X (Twitter)"
                    aria-label="X (Twitter)"
                    className="w-9 h-9 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-800 text-stone-400 hover:text-amber-400 flex items-center justify-center transition-all hover:scale-105"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.INSTAGRAM}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-800 text-stone-400 hover:text-amber-400 flex items-center justify-center transition-all hover:scale-105"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.YOUTUBE}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="YouTube"
                    aria-label="YouTube"
                    className="w-9 h-9 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-800 text-stone-400 hover:text-amber-400 flex items-center justify-center transition-all hover:scale-105"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.FACEBOOK}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-800 text-stone-400 hover:text-amber-400 flex items-center justify-center transition-all hover:scale-105"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="WhatsApp Channel"
                    aria-label="WhatsApp Channel"
                    className="w-9 h-9 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-800 text-stone-400 hover:text-amber-400 flex items-center justify-center transition-all hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-3 p-5 sm:p-8 rounded-3xl bg-stone-900/60 border border-stone-800">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-kalam text-2xl font-bold text-white">Thank You, {form.name}!</h3>
                <p className="text-stone-300 text-sm max-w-md mx-auto">
                  Your email app should now be open with your message addressed to our support team. Please send it to complete your inquiry. Our team responds during support hours ({CONTACT_DETAILS.SUPPORT_HOURS}) within 24 to 48 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", subject: "General Inquiry", message: "" });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-kalam text-2xl font-bold text-white mb-2">
                  Send a Message
                </h3>

                <div>
                  <label className="block text-xs text-stone-400 font-medium mb-1.5">
                    Your Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-stone-950/70 border border-stone-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-400 font-medium mb-1.5">
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-stone-950/70 border border-stone-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-400 font-medium mb-1.5">
                    Subject / Category
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-stone-950/70 border border-stone-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Course Access Question">Course Access Question</option>
                    <option value="Live 1:1 Session Booking">Live 1:1 Session Booking</option>
                    <option value="Workshop Registration">Workshop Registration</option>
                    <option value="Payment or Invoice Query">Payment or Invoice Query</option>
                    <option value="Refund Request">Refund Request</option>
                    <option value="Instructor Partnership">Instructor Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 font-medium mb-1.5">
                    Message <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Please include relevant order numbers or details..."
                    className="w-full bg-stone-950/70 border border-stone-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Sending…" : "Submit Inquiry"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
