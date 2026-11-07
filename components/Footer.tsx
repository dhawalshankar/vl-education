"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
} from "lucide-react";
import { CONTACT_DETAILS, SOCIAL_LINKS } from "@/app/lib/constants";

export default function Footer() {
  const exploreLinks = [
    { label: "Courses", href: "/learn" },
    { label: "Live 1:1 Sessions", href: "/sessions" },
    { label: "Workshops (Online & Offline)", href: "/workshops" },
    { label: "Pricing", href: "/pricing" },
    { label: "About Us", href: "/about" },
    {
      label: "Main Website (vartalang.in)",
      href: CONTACT_DETAILS.MAIN_WEBSITE,
      external: true,
    },
  ];

  const supportLinks = [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ];

  const legalLinks = [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Refund & Cancellation Policy", href: "/refund-policy" },
    { label: "Shipping & Delivery Policy", href: "/shipping-policy" },
    { label: "Instructor Terms", href: "/instructor-terms" },
  ];

  const socialButtons = [
    {
      name: "X (Twitter)",
      href: SOCIAL_LINKS.TWITTER,
      icon: Twitter,
    },
    {
      name: "Instagram",
      href: SOCIAL_LINKS.INSTAGRAM,
      icon: Instagram,
    },
    {
      name: "YouTube",
      href: SOCIAL_LINKS.YOUTUBE,
      icon: Youtube,
    },
    {
      name: "Facebook",
      href: SOCIAL_LINKS.FACEBOOK,
      icon: Facebook,
    },
  ];

  return (
    <footer className="relative bg-[#070605]/90 border-t border-stone-800/80 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-stone-800/70">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="VartaLang Logo"
                className="h-10 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="font-kalam text-2xl font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                {CONTACT_DETAILS.BRAND_NAME}
              </span>
            </Link>

            <p className="text-sm text-stone-400 leading-relaxed">
              Learn Indian languages through courses, live 1:1 sessions and workshops.
            </p>

            {/* Social Icons */}
            <div className="pt-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500 block mb-2">
                Follow Us
              </span>
              <div className="flex items-center gap-2.5">
                {socialButtons.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.name}
                      aria-label={s.name}
                      className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-800 text-stone-400 hover:text-amber-400 flex items-center justify-center transition-all hover:scale-105"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{CONTACT_DETAILS.PAYMENT_NOTE}</span>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="font-kalam text-lg font-bold text-white mb-4 tracking-wide">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-stone-400 hover:text-amber-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal Links */}
          <div>
            <h4 className="font-kalam text-lg font-bold text-white mb-4 tracking-wide">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm mb-6">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-kalam text-lg font-bold text-white mb-3 tracking-wide">
              Legal
            </h4>
            <ul className="space-y-2 text-xs">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Block */}
          <div>
            <h4 className="font-kalam text-lg font-bold text-white mb-4 tracking-wide">
              Contact
            </h4>
            <div className="space-y-3 text-sm">
              <div className="text-stone-300 font-medium">
                {CONTACT_DETAILS.BUSINESS_NAME}
              </div>

              <div className="text-stone-400 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                <span className="leading-snug">{CONTACT_DETAILS.BUSINESS_ADDRESS}</span>
              </div>

              <div>
                <a
                  href={CONTACT_DETAILS.PHONE_TEL}
                  className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-2.5"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{CONTACT_DETAILS.PHONE}</span>
                </a>
              </div>

              <div>
                <a
                  href={CONTACT_DETAILS.SUPPORT_EMAIL_MAILTO}
                  className="text-stone-400 hover:text-amber-400 transition-colors flex items-start gap-2.5 group"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                  <span className="break-all">{CONTACT_DETAILS.SUPPORT_EMAIL}</span>
                </a>
              </div>

              <div className="text-stone-400 flex items-start gap-2.5 text-xs">
                <Clock className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                <span>{CONTACT_DETAILS.SUPPORT_HOURS}</span>
              </div>

              <div className="pt-1">
                <a
                  href={CONTACT_DETAILS.MAIN_WEBSITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-2.5 group text-xs"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>vartalang.in</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            {CONTACT_DETAILS.COPYRIGHT_LINE}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-500">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-amber-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
