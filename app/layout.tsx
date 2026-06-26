import type { Metadata, Viewport } from "next";
import { Public_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "./components/Header";
import { CommandPalette } from "./components/CommandPalette";
import { Footer } from "./components/Footer";
import { Analytics } from "./components/Analytics";
import { MonetizationScripts } from "./components/MonetizationScripts";
import { JsonLd } from "./components/JsonLd";
import { organizationJsonLd } from "./lib/seo/organization";

const inter = Public_Sans({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PayDocHub - Employee Login, Pay Stubs & W-2 Access",
    template: "%s - PayDocHub",
  },
  description:
    "Find any US employer's employee portal login, pay stub access, and W-2 tax forms. Plain-English guides, no account required.",
  metadataBase: new URL("https://paydochub.com"),
  openGraph: {
    type: "website",
    siteName: "PayDocHub",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    title: "PayDocHub",
    statusBarStyle: "default",
  },
  other: {
    // AdSense site verification (soccerstreamstop pub) - meta in <head> is the
    // most reliable verifier; the adsbygoogle.js script below serves ads.
    "google-adsense-account": "ca-pub-9893054287799556",
  },
};

export const viewport: Viewport = {
  themeColor: "#005EA2",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={organizationJsonLd()} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CommandPalette />
        <Analytics />
        <MonetizationScripts />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9893054287799556"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
