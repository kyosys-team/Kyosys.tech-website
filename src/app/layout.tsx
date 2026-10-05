import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Newsreader } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Navbar } from "@/components/marketing/Navbar";
import { AnnouncementBar } from "@/components/marketing/AnnouncementBar";
import { Footer } from "@/components/marketing/Footer";
import { FloatingCluster } from "@/components/marketing/FloatingCluster";
import { SiteChrome } from "@/components/marketing/SiteChrome";
import { Cursor } from "@/components/motion/Cursor";
import { siteConfig } from "@/lib/site";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// Editorial accent — italic serif for single words inside headlines only.
const serifAccent = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: "italic",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Kyosys — We build websites & apps that bring you customers",
    template: "%s | Kyosys",
  },
  description:
    "Kyosys is a web & app development agency. We build fast websites, mobile apps, and run SEO, social media, and video that grow your business.",
  openGraph: {
    type: "website",
    siteName: "Kyosys",
    images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "Kyosys" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-cover.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kyosys",
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  description:
    "Web & app development agency — websites, mobile apps, SEO, social media marketing, and video production.",
  email: siteConfig.email,
  telephone: siteConfig.phone,
  sameAs: Object.values(siteConfig.socials).filter(Boolean),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} ${serifAccent.variable} font-sans antialiased`}
      >
        {/* Print grain — subtle paper texture over everything */}
        <div className="grain-overlay" aria-hidden="true" />
        {/* No-JS fallback: motion wrappers start hidden, so reveal them */}
        <noscript>
          <style>{`.reveal,.intro-fade{opacity:1!important;transform:none!important}.intro-mask-inner,.reveal-mask-inner{transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-950 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-paper focus:outline focus:outline-2 focus:outline-sun-400"
        >
          Skip to content
        </a>
        <SiteChrome>
          <AnnouncementBar />
          <Navbar />
        </SiteChrome>
        <main id="main-content">{children}</main>
        <SiteChrome>
          <Footer />
          <FloatingCluster />
        </SiteChrome>
        <Cursor />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
