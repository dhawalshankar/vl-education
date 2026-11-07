// app/shipping-policy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Truck,
  Zap,
  Video,
  MapPin,
  Package,
  Clock,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT_DETAILS } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | VartaLang Learn",
  description:
    "Details on instant digital course access, live session link deliveries, and physical material shipping timelines across India.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0908]/90 text-stone-200 relative overflow-hidden flex flex-col justify-between">
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
            <Truck className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold">Service Fulfillment</p>
            <h1 className="font-kalam text-3xl sm:text-4xl font-bold text-white">Shipping &amp; Delivery Policy</h1>
            <p className="text-stone-400 text-xs mt-1">Last updated: November 2026</p>
          </div>
        </div>

        <div className="space-y-8 leading-relaxed text-sm sm:text-base text-stone-300">
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">Fulfillment Scope</h2>
            <p className="text-stone-300">
              VartaLang (operated by <strong className="text-white font-semibold">{CONTACT_DETAILS.OPERATING_NAME}</strong>)
              delivers educational services primarily in digital formats (online courses, live 1:1 sessions, virtual workshops),
              in-person events (offline workshops at designated venues), and physical study materials dispatched across India.
            </p>
          </section>

          {/* 1. Digital Courses */}
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="font-kalam text-xl font-bold text-white">1. Digital Courses Delivery</h2>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-stone-200">
              <p className="font-medium text-amber-300">
                Digital courses unlocked instantly or within 24 hours in the dashboard.
              </p>
            </div>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-stone-300">
              <li>Immediately upon successful payment via Razorpay, your course enrollment is activated on your learner account.</li>
              <li>You can access the video lessons, structured notes, and practice exercises anytime by visiting <Link href="/dashboard" className="text-amber-400 underline">My Learning Dashboard</Link>.</li>
              <li>An automated email receipt confirming your enrollment and dashboard access is sent to your registered email address.</li>
            </ul>
          </section>

          {/* 2. Live Sessions & Online Workshops */}
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center gap-3 mb-3">
              <Video className="w-5 h-5 text-blue-400" />
              <h2 className="font-kalam text-xl font-bold text-white">2. Live 1:1 Sessions &amp; Online Workshops Delivery</h2>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-stone-200">
              <p className="font-medium text-blue-300">
                Live session and workshop links shared by email and dashboard before the session.
              </p>
            </div>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-stone-300">
              <li>Once your booking is confirmed, the schedule details appear in your learner dashboard.</li>
              <li>Video conferencing links (e.g. Google Meet or Zoom), preparation notes, and calendar invites are sent to your registered email address well in advance of the scheduled start time.</li>
              <li>If you do not receive your access link at least 2 hours before the session, please reach out to <a href={CONTACT_DETAILS.SUPPORT_EMAIL_MAILTO} className="text-amber-400 underline">{CONTACT_DETAILS.SUPPORT_EMAIL}</a> for immediate assistance.</li>
            </ul>
          </section>

          {/* 3. Offline Workshops */}
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-rose-400" />
              <h2 className="font-kalam text-xl font-bold text-white">3. Offline In-Person Workshops</h2>
            </div>
            <p className="text-stone-300">
              Offline workshops are conducted in-person at the stated venue, date, and time published on the workshop listing page.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 text-stone-300">
              <li>Your confirmed booking serves as your entry ticket. Entry passes and venue directions are emailed upon registration.</li>
              <li>Please arrive 15 minutes prior to the start time with a valid photo ID matching the registered learner name.</li>
            </ul>
          </section>

          {/* 4. Physical Material Shipping */}
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-emerald-400" />
              <h2 className="font-kalam text-xl font-bold text-white">4. Physical Study Material Shipping &amp; Delivery</h2>
            </div>
            <p className="text-stone-300">
              When an offline workshop or specialized course includes physical materials (printed workbooks, flashcards, scripts):
            </p>
            <div className="grid sm:grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-xl bg-stone-800/70 border border-stone-700">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-1">Dispatch Timeline</span>
                <p className="text-white font-medium">Dispatched within 3–5 business days</p>
                <p className="text-xs text-stone-400 mt-1">From order confirmation and address verification.</p>
              </div>
              <div className="p-4 rounded-xl bg-stone-800/70 border border-stone-700">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-1">Delivery Timeline</span>
                <p className="text-white font-medium">Delivered within 5–10 business days</p>
                <p className="text-xs text-stone-400 mt-1">Across serviceable pincodes in India.</p>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-stone-300">
              <li>Shipping charges (if applicable) are always shown at checkout prior to payment. The amount displayed is the total payable.</li>
              <li>A tracking link and consignment number will be sent to your registered email as soon as the package is handed over to the courier partner.</li>
              <li>Deliveries are fulfilled through reputable Indian courier partners (e.g., India Post Speed Post, Blue Dart, Delhivery).</li>
            </ul>
          </section>

          {/* 5. Delivery Issues & Damage */}
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-2">5. Delivery Delays or Transit Damage</h2>
            <p className="text-stone-300">
              If your physical parcel appears delayed beyond 10 business days or arrives damaged/tampered, please contact our support desk immediately:
            </p>
            <p className="mt-2 text-stone-300">
              As stated in our <Link href="/refund-policy" className="text-amber-400 underline">Refund &amp; Cancellation Policy</Link>, physical material is eligible for free replacement or refund if damaged, defective, or incorrect, provided it is reported within 7 days of delivery with photos.
            </p>
          </section>

          {/* Contact Details */}
          <section className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h2 className="font-kalam text-xl font-bold text-white mb-3">6. Shipping &amp; Delivery Support</h2>
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
