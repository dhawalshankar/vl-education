// app/lib/constants.ts
/**
 * Single source of truth for business, contact, and social details across VartaLang Learn.
 * All details strictly conform to merchant onboarding and operational requirements.
 */

export const CONTACT_DETAILS = {
  BUSINESS_NAME: "VartaLang (operated by Dhawal Shukla)",
  OPERATING_NAME: "Dhawal Shukla",
  BRAND_NAME: "VartaLang",
  BUSINESS_ADDRESS: "Sector A, 24 Gujaini, Kanpur, Uttar Pradesh, India",
  PHONE: "+91 7388270331",
  PHONE_DISPLAY: "+91 73882 70331",
  PHONE_TEL: "tel:+917388270331",
  SUPPORT_EMAIL: "support@cosmoindiaprakashan.in",
  SUPPORT_EMAIL_MAILTO: "mailto:support@cosmoindiaprakashan.in",
  SUPPORT_HOURS: "Monday to Saturday, 10:00 AM to 6:00 PM IST",
  MAIN_WEBSITE: "https://vartalang.in",
  LMS_WEBSITE: "https://learn.vartalang.in",
  PAYMENT_NOTE: "Payments securely processed by Razorpay",
  COPYRIGHT_LINE: "© 2026 VartaLang. Operated by Dhawal Shukla. All rights reserved.",
} as const;

export const SOCIAL_LINKS = {
  FACEBOOK: "https://www.facebook.com/profile.php?id=61562467420068",
  INSTAGRAM: "https://www.instagram.com/cosmoindiaprakashan/",
  TWITTER: "https://x.com/IndiaCosmo",
  YOUTUBE: "https://www.youtube.com/@cosmoindiaprakashan",
  WHATSAPP: "https://whatsapp.com/channel/0029VbC1rr59MF8yb3dpXh0g",
} as const;

export type ContactDetails = typeof CONTACT_DETAILS;
export type SocialLinks = typeof SOCIAL_LINKS;
