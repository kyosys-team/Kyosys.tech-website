"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * Floating WhatsApp chat button — fixed bottom-right on all public pages.
 * Hidden on /admin/* so it never covers admin UI. z-40 keeps it under
 * modals/toasters but above page content.
 * `lifted` moves it above the sticky mobile CTA bar (see FloatingCluster).
 */
export function WhatsAppButton({ lifted = false }: { lifted?: boolean }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const href = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappMessage
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={cn(
        "fixed bottom-5 right-5 z-40 flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-110 active:scale-95 sm:bottom-6 sm:right-6",
        lifted && "max-md:bottom-[84px]"
      )}
      style={{ width: 52, height: 52 }}
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  );
}
