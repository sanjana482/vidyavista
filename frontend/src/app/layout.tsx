import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_NAME, SITE_URL, abs, jsonLd } from "./lib/seo";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A5C91",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VidyaVista | Find the Best Day & Boarding Schools in India",
    template: "%s | VidyaVista",
  },
  description:
    "Discover, compare and choose the right school for your child. Explore day, boarding and day-cum-boarding schools across India by fees, board, facilities and parent reviews.",
  applicationName: SITE_NAME,
  keywords: [
    "best schools in India",
    "boarding schools in India",
    "day schools",
    "CBSE schools",
    "ICSE schools",
    "IB schools",
    "school fees",
    "school admission 2027-28",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: "/",
    title: "VidyaVista | Find the Best Day & Boarding Schools in India",
    description:
      "Compare school fees, boards, facilities and reviews. Find the right day or boarding school for your child.",
    images: [{ url: "/logo.png", alt: "VidyaVista" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VidyaVista | Find the Best Day & Boarding Schools in India",
    description: "Compare school fees, boards, facilities and reviews on VidyaVista.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // verification: { google: "PASTE_GOOGLE_SEARCH_CONSOLE_TOKEN" },
};

const siteSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": abs("/#organization"),
    name: SITE_NAME,
    url: SITE_URL,
    logo: abs("/logo.png"),
    // sameAs: ["https://www.facebook.com/...", "https://www.instagram.com/..."],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "en-IN",
    publisher: { "@id": abs("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/schools?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(siteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
