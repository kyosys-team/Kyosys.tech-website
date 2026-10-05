import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { Container, EditorialHeader } from "@/components/ui/section";
import { Marquee } from "@/components/marketing/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { MaskLine } from "@/components/motion/HeroIntro";
import { PageHero } from "@/components/motion/PageHero";
import { WordRotator } from "@/components/motion/WordRotator";
import { Magnetic } from "@/components/motion/Magnetic";
import { CountUp } from "@/components/motion/CountUp";
import { CursorGlow } from "@/components/motion/CursorGlow";
import { Parallax } from "@/components/motion/Parallax";
import { ServiceIndex } from "@/components/marketing/ServiceIndex";
import { ProcessTimeline } from "@/components/marketing/ProcessTimeline";
import { TestimonialCarousel } from "@/components/marketing/TestimonialCarousel";
import { CtaBand } from "@/components/marketing/CtaBand";
import { services } from "@/lib/services";
import { getFeaturedTestimonials } from "@/lib/testimonials";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Kyosys — We build websites & apps that bring you customers",
  description:
    "Kyosys builds fast websites, mobile apps, and runs SEO, social media, and video production that grow your business. Get a free quote today.",
};

// Testimonials live in the DB and change via the admin panel — revalidate so
// newly approved quotes appear without a redeploy. With no DB (build time)
// getFeaturedTestimonials() returns [] and the section stays hidden.

/**
 * Subtle narrative bridge between homepage sections — a one-line handoff so
 * the page reads as one guided walk instead of stacked sections.
 */
function SectionBridge({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <Reveal className="mt-14 sm:mt-16">
      <p
        className={`flex items-center gap-2.5 text-sm font-medium ${
          dark ? "text-white/50" : "text-ink-soft/80"
        }`}
      >
        <ArrowDown className="size-4 shrink-0" aria-hidden="true" />
        {children}
      </p>
    </Reveal>
  );
}
export const revalidate = 300;

const differentiators = [
  {
    title: "Plain language, always",
    text: "No jargon, no confusing tech talk. You'll always know what's happening with your project and why.",
  },
  {
    title: "Honest pricing",
    text: "Clear quotes before we start, no hidden costs mid-project. Try our estimator and see a range instantly.",
  },
  {
    title: "Deadlines we keep",
    text: "We give you a launch date in writing — and we've built our process around hitting it.",
  },
  {
    title: "Support after launch",
    text: "Every project includes 30 days of free support. We don't disappear once the invoice is paid.",
  },
];

const stats = [
  { to: 15, suffix: "+", label: "Projects delivered" },
  { to: 100, suffix: "%", label: "Projects on time" },
  { to: 30, suffix: " days", label: "Free post-launch support" },
  { to: 24, suffix: " hrs", label: "Response time" },
];

const steps = [
  {
    title: "Discover",
    description:
      "A free 30-minute call. We understand your business, your customers, and what success looks like.",
  },
  {
    title: "Design",
    description:
      "You see and approve the design before we build anything. No surprises, ever.",
  },
  {
    title: "Build",
    description:
      "We build with weekly updates you can actually click through and review.",
  },
  {
    title: "Grow",
    description:
      "Launch day is the start, not the end. We support you while your business grows.",
  },
];

const metaFacts = [
  { k: "Based in", v: "India" },
  { k: "Working", v: "Worldwide" },
  { k: "Response", v: "Within 24 hrs" },
  { k: "Status", v: "Booking new projects", live: true },
];

export default async function HomePage() {
  // US-044: only real, approved, non-sample testimonials ever reach the
  // homepage. Empty → the whole section is omitted (no fake social proof).
  const testimonials = await getFeaturedTestimonials();
  return (
    <>
      {/* ── US-010: Hero — cinematic dark video moment ── */}
      <PageHero
        size="hero"
        melt="dark"
        scrollCue
        kicker={
          <>
            Web · Apps · Marketing
          </>
        }
        title={
          <>
            <MaskLine delay={80}>We build</MaskLine>
            <MaskLine delay={170}>
              <WordRotator />
            </MaskLine>
            <MaskLine delay={260}>that bring you</MaskLine>
            <MaskLine delay={350}>
              <em className="font-serif font-medium italic">customers.</em>
            </MaskLine>
          </>
        }
        subcopy={
          <>
            Kyosys is a small, senior team that designs, builds, and
            markets digital products for growing businesses — with honest
            pricing and deadlines in writing.
          </>
        }
        cta={
          <>
            <Magnetic>
              <Link
                href="/quote"
                className="btn-emerald group inline-flex h-14 items-center gap-2.5 rounded-full px-9 text-base font-bold"
              >
                Get a Quote
                <ArrowRight
                  className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Magnetic>
            <Link
              href="/services"
              className="link-underline text-base font-semibold text-paper"
            >
              View Services
            </Link>
          </>
        }
        meta={metaFacts}
      />

      {/* Full-bleed visual band — outline words draw in on scroll, parallax drift */}
      <section className="relative overflow-hidden border-y border-white/10 bg-dark-gradient" aria-hidden="true">
        <div className="py-10 sm:py-14">
          <div className="pointer-events-none absolute -left-24 top-0 hidden size-[440px] rounded-full bg-brand-500/25 blur-3xl md:block motion-safe:animate-aurora" />
          <div className="pointer-events-none absolute right-[8%] top-1/3 hidden size-[300px] rounded-full bg-sun-400/15 blur-3xl md:block motion-safe:animate-aurora" />
          <Parallax speed={0.09} className="relative">
            <div className="whitespace-nowrap text-center font-display text-[clamp(3.5rem,11vw,9rem)] font-extrabold leading-none tracking-[-0.02em]">
              <Reveal variant="mask" delay={40} className="inline-block align-bottom">
                <span className="text-outline-paper">Design</span>
              </Reveal>
              <span className="text-sun-400" style={{ WebkitTextStroke: "0" }}> · </span>
              <Reveal variant="mask" delay={170} className="inline-block align-bottom">
                <span className="text-outline-paper">Build</span>
              </Reveal>
              <span className="text-sun-400" style={{ WebkitTextStroke: "0" }}> · </span>
              <Reveal variant="mask" delay={300} className="inline-block align-bottom">
                <span className="text-outline-paper">Grow</span>
              </Reveal>
            </div>
          </Parallax>
        </div>
      </section>

      {/* ── Marquee ticker ───────────────────────────────────────── */}
      <div className="bg-paper py-8 sm:py-10">
        <Marquee
          items={[
            "Web Development",
            "App Development",
            "SEO",
            "Social Media",
            "Video Production",
          ]}
        />
      </div>

      {/* ── US-011: Services index ───────────────────────────────── */}
      <section className="bg-paper py-16 sm:py-24" aria-labelledby="services-heading">
        <Container>
          <Reveal>
            <EditorialHeader
              id="services-heading"
              index="01"
              eyebrow="Services"
              title={
                <>
                  Everything your business needs to{" "}
                  <em className="font-serif font-medium italic">grow.</em>
                </>
              }
              description="Five services, one team, zero handoffs lost in translation."
            />
          </Reveal>
          <div className="mt-10 sm:mt-14">
            <ServiceIndex services={services} />
          </div>
          <Reveal className="mt-8">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-base font-semibold text-brand-900"
            >
              <span className="link-underline">
                Not sure what you need? Ask us free
              </span>
              <ArrowUpRight
                className="size-5 text-brand-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
          <SectionBridge>
            You&apos;ve seen what we do — here&apos;s what working with us is like.
          </SectionBridge>
        </Container>
      </section>

      {/* ── US-011: Manifesto (replaces why-cards) ───────────────── */}
      <section className="relative overflow-hidden bg-dark-gradient py-20 text-paper sm:py-28" aria-labelledby="why-heading">
        <div aria-hidden="true" className="hairline-glow absolute inset-x-0 top-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-1/3 size-[560px] rounded-full bg-brand-500/25 blur-3xl"
        />
        <CursorGlow />
        <Container className="relative z-10">
          <Reveal>
            <EditorialHeader
              id="why-heading"
              index="02"
              eyebrow="Why Kyosys"
              dark
              title={
                <>
                  An agency that acts like{" "}
                  <em className="font-serif font-medium italic">your own team.</em>
                </>
              }
            />
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-10 max-w-4xl font-display text-[clamp(1.45rem,4.2vw,3.5rem)] font-extrabold leading-[1.18] tracking-tight sm:leading-[1.08]">
              Most agencies sell you <span className="marker text-brand-950">hours</span> and
              hand you <span className="marker text-brand-950">jargon</span>. We sell
              you <span className="marker text-brand-950">outcomes</span> — in plain
              language, on a written deadline, with support that doesn&apos;t end
              at launch.
            </p>
          </Reveal>

          <dl className="mt-14 grid gap-x-12 sm:grid-cols-2">
            {differentiators.map((d, i) => (
              <Reveal key={d.title} delay={i * 80}>
                <div className="border-t border-white/15 py-7">
                  <dt className="flex items-baseline gap-4">
                    <span
                      aria-hidden="true"
                      className="font-display text-sm font-bold tabular-nums text-sun-400"
                    >
                      0{i + 1}
                    </span>
                    <span className="font-display text-xl font-bold tracking-tight">
                      {d.title}
                    </span>
                  </dt>
                  <dd className="mt-2.5 max-w-md pl-9 text-[15px] leading-relaxed text-white/70">
                    {d.text}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          {/* Stats as typography, not boxes — counting up on entry */}
          <div className="mt-6 flex flex-wrap gap-x-14 gap-y-8 border-t border-white/15 pt-10">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-4xl font-extrabold tabular-nums tracking-tight text-paper sm:text-5xl">
                  <CountUp to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <SectionBridge dark>
            That&apos;s the why — here&apos;s the how.
          </SectionBridge>
        </Container>
      </section>

      {/* ── US-011: Process timeline ─────────────────────────────── */}
      <section className="bg-paper py-16 sm:py-24" aria-labelledby="process-heading">
        <Container>
          <Reveal>
            <EditorialHeader
              id="process-heading"
              index="03"
              eyebrow="How we work"
              title={
                <>
                  A simple process,{" "}
                  <em className="font-serif font-medium italic">no surprises.</em>
                </>
              }
              description="The same four steps for every project — you'll always know what happens next."
            />
          </Reveal>
          <ProcessTimeline steps={steps} />
          <SectionBridge>
            That&apos;s the process — your project is the next step.
          </SectionBridge>
        </Container>
      </section>

      {/* ── US-011 + US-044: Testimonials — oversized type, minimal chrome.
           Hidden entirely when there are no real approved testimonials. ── */}
      {testimonials.length > 0 && (
        <section
          className="border-y border-ink/10 bg-mist py-16 sm:py-24"
          aria-labelledby="testimonials-heading"
        >
          <Container>
            <Reveal>
              <EditorialHeader
                id="testimonials-heading"
                index="04"
                eyebrow="Client love"
                title={
                  <>
                    Don&apos;t take{" "}
                    <em className="font-serif font-medium italic">our</em> word for it.
                  </>
                }
              />
            </Reveal>
            <Reveal delay={120} className="mt-10 sm:mt-12">
              <TestimonialCarousel testimonials={testimonials} />
            </Reveal>
          </Container>
        </section>
      )}

      {/* ── US-011: Final CTA band ───────────────────────────────── */}
      {/* Numbering stays sequential: 05 when testimonials render, 04 when hidden. */}
      <CtaBand index={testimonials.length > 0 ? "05" : "04"} eyebrow="Start a project" />
    </>
  );
}
