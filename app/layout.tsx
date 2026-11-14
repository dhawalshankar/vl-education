import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import ApiWarmup from "./ApiWarmup";

export const metadata: Metadata = {
  title: "VartaLang | Premium Language Education Platform",
  description:
    "Master Indian languages through expert-led instruction, structured curriculum, and immersive practice. Professional certification available.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ApiWarmup />
        <Script
          id="google-tag-manager-data-layer"
          strategy="afterInteractive"
        >{`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            "gtm.start": new Date().getTime(),
            event: "gtm.js"
          });
        `}</Script>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-MQKLS7VH"
        />
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthProvider>{children}</AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}