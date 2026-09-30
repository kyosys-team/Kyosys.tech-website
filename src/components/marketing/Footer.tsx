import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { services } from "@/lib/services";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/section";
import { Parallax } from "@/components/motion/Parallax";

export function Footer() {
  return (
    <footer className="border-t border-ink/15 bg-paper text-ink">
      <Container className="pb-8 pt-14 sm:pt-20">
        {/* Oversized talk line */}
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
          06 <span aria-hidden="true" className="mx-1">—</span> Contact
        </p>
        <Link
          href="/contact"
          className="group mt-5 block"
          aria-label="Contact Kyosys — let's talk"
        >
          <span className="font-display text-[clamp(3.25rem,10vw,8.5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-brand-900">
            Let&apos;s{" "}
            <em className="font-serif font-medium italic">talk.</em>
            <ArrowUpRight
              aria-hidden="true"
              className="ml-2 inline size-[0.7em] text-brand-500 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"
            />
          </span>
        </Link>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
          Tell us about your project. We reply within 24 hours with honest
          advice — no pushy sales talk.
        </p>

        {/* Columns */}
        <div className="mt-14 grid gap-10 border-t border-ink/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3" aria-label="Kyosys home">
              <Logo size={36} />
              <span className="font-display text-lg font-extrabold tracking-tight text-brand-900">
                Kyosys
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-ink-soft">
              A small team that treats your project like our own business.
            </p>
          </div>

          <nav aria-label="Services">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">
              Services
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="link-underline font-medium text-ink transition-colors hover:text-brand-900"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {[
                { href: "/about", label: "About Us" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
                { href: "/quote", label: "Get a Quote" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="link-underline font-medium text-ink transition-colors hover:text-brand-900"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">
              Talk to us
            </h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-brand-500" aria-hidden="true" />
                <a href={`mailto:${siteConfig.email}`} className="link-underline font-medium">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-brand-500" aria-hidden="true" />
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="link-underline font-medium">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0 text-brand-500" aria-hidden="true" />
                <span className="text-ink-soft">India · working worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant wordmark — drifts against scroll */}
        <Parallax speed={0.12} className="mt-14 select-none overflow-hidden">
          <p
            aria-hidden="true"
            className="whitespace-nowrap font-display text-[clamp(4rem,17vw,15rem)] font-extrabold leading-[0.85] tracking-[-0.04em] text-brand-900/[0.07]"
          >
            Kyosys
          </p>
        </Parallax>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-ink/10 pt-6 text-sm text-ink-soft sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Kyosys. All rights reserved.</p>
          <nav aria-label="Legal" className="flex items-center gap-1">
            {[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
              { href: "/cookies", label: "Cookies" },
            ].map((l, i) => (
              <span key={l.href} className="flex items-center gap-1">
                {i > 0 && (
                  <span aria-hidden="true" className="text-ink/30">
                    ·
                  </span>
                )}
                <Link
                  href={l.href}
                  className="link-underline font-medium text-ink-soft transition-colors hover:text-brand-900"
                >
                  {l.label}
                </Link>
              </span>
            ))}
          </nav>
          <p>Built with care by the Kyosys team.</p>
        </div>
      </Container>
    </footer>
  );
}
