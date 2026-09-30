"use client";

import { usePathname } from "next/navigation";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieConsent } from "@/components/CookieConsent";
import { MobileCtaBar } from "@/components/marketing/MobileCtaBar";
import { BackToTop } from "@/components/marketing/BackToTop";

/** Pages where the sticky mobile CTA bar is hidden. */
const NO_CTA = ["/quote", "/contact"];

/**
 * Owns every fixed bottom element on public pages so they never fight:
 * - MobileCtaBar sits at the very bottom (mobile only).
 * - WhatsApp lifts above the bar on mobile when the bar is visible.
 * - Cookie banner lifts above both on mobile when the bar is visible.
 * - A spacer keeps the fixed bar from covering footer content on mobile.
 * Nothing renders on /admin/*.
 */
export function FloatingCluster() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const ctaVisible = !NO_CTA.includes(pathname);

  return (
    <>
      <WhatsAppButton lifted={ctaVisible} />
      <CookieConsent lifted={ctaVisible} />
      <MobileCtaBar />
      <BackToTop />
      {ctaVisible && <div aria-hidden="true" className="h-[76px] md:hidden" />}
    </>
  );
}
