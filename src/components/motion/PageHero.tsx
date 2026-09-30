"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/section";
import { HeroIntro, IntroFade } from "./HeroIntro";
import { HeroVideo } from "./HeroVideo";

/**
 * PageHero — the cinematic dark video hero, generalized.
 *
 * Every public page opens with the same film language as the homepage:
 * the motion-graphic video backdrop (browser-cached, zero extra cost),
 * identical legibility scrims (paper type ≥ 4.5:1 even on the brightest
 * gold-streak frames), pause-offscreen / reduced-motion-poster /
 * no-JS-poster behavior via HeroVideo, and the mount choreography via
 * HeroIntro.
 *
 * `tone` only shifts a decorative wash layered UNDER the scrims, so
 * contrast is never affected:
 * - "ink"  — neutral, the default (service detail pages, 404/500)
 * - "sun"  — faint warm gold wash (services index)
 * - "mist" — faint cool paper wash (about)
 *
 * `melt` picks what the hero dissolves into below: "dark" for the
 * homepage band, "paper" for light editorial content.
 */
export type PageHeroTone = "ink" | "sun" | "mist";

export interface PageHeroMeta {
  k: string;
  v: string;
  live?: boolean;
}

interface PageHeroProps {
  /** Kicker line, e.g. "01 — Services" (rendered in sun yellow). */
  kicker: ReactNode;
  /** Headline — may include <em> serif accents or MaskLine/WordRotator. */
  title: ReactNode;
  /** Lead paragraph under the headline. */
  subcopy?: ReactNode;
  /** CTA row (buttons / links). */
  cta?: ReactNode;
  /** Rendered above the kicker — e.g. a breadcrumb. */
  top?: ReactNode;
  /** Frosted-glass fact column on the right (desktop). */
  meta?: PageHeroMeta[];
  tone?: PageHeroTone;
  melt?: "dark" | "paper";
  /** Animated scroll cue at the hero's bottom edge. */
  scrollCue?: boolean;
  /** "hero" = homepage-scale type, "page" = subpage-scale type. */
  size?: "hero" | "page";
}

export function PageHero({
  kicker,
  title,
  subcopy,
  cta,
  top,
  meta,
  tone = "ink",
  melt = "paper",
  scrollCue = false,
  size = "page",
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-950 text-paper">
      <div className="relative">
        <HeroVideo />
        {tone !== "ink" && (
          <div
            aria-hidden="true"
            className={cn(
              "hero-tone",
              tone === "sun" ? "hero-tone-sun" : "hero-tone-mist"
            )}
          />
        )}
        {/* Legibility scrims: strongest where the type sits (left),
            top melt for the navbar, bottom melt into what follows. */}
        <div
          aria-hidden="true"
          className={cn(
            "hero-video-scrim pointer-events-none absolute inset-0",
            melt === "paper" && "hero-video-scrim--paper"
          )}
        />
        <HeroIntro>
          <Container className="relative pb-14 pt-14 sm:pb-20 sm:pt-20 lg:pt-24">
            {top && <IntroFade delay={0}>{top}</IntroFade>}
            <div
              className={cn(
                "grid gap-12",
                meta ? "lg:grid-cols-[1fr_280px] lg:gap-16" : "max-w-4xl"
              )}
            >
              <div>
                <IntroFade delay={0}>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-sun-400">
                    {kicker}
                  </p>
                </IntroFade>
                <h1
                  className={cn(
                    "mt-6 font-display font-extrabold leading-[0.95] tracking-[-0.03em] text-paper",
                    size === "hero"
                      ? "text-[clamp(3.25rem,8vw,6.75rem)]"
                      : "text-[clamp(2.75rem,7vw,5.25rem)]"
                  )}
                >
                  {title}
                </h1>
                {subcopy && (
                  <IntroFade delay={380}>
                    <div className="mt-7 max-w-xl text-lg leading-relaxed text-paper/80 sm:text-xl">
                      {subcopy}
                    </div>
                  </IntroFade>
                )}
                {cta && (
                  <IntroFade delay={480}>
                    <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                      {cta}
                    </div>
                  </IntroFade>
                )}
              </div>

              {meta && (
                <IntroFade delay={600} y={24} className="lg:pt-2">
                  <dl className="grid grid-cols-2 gap-px overflow-hidden border border-white/15 bg-white/15 lg:grid-cols-1">
                    {meta.map((f) => (
                      <div
                        key={f.k}
                        className="bg-brand-950/60 px-5 py-4 backdrop-blur-md"
                      >
                        <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">
                          {f.k}
                        </dt>
                        <dd className="mt-1 flex items-center gap-2 font-display text-lg font-bold text-paper">
                          {f.live && (
                            <span
                              aria-hidden="true"
                              className="relative flex size-2.5"
                            >
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun-400 opacity-60" />
                              <span className="relative inline-flex size-2.5 rounded-full bg-sun-400" />
                            </span>
                          )}
                          {f.v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </IntroFade>
              )}
            </div>

            {scrollCue && (
              <IntroFade delay={820} y={8} className="mt-14">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">
                    Scroll
                  </span>
                  <span
                    aria-hidden="true"
                    className="scroll-cue scroll-cue-light"
                  />
                </div>
              </IntroFade>
            )}
          </Container>
        </HeroIntro>
      </div>
    </section>
  );
}
