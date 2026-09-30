import type { Metadata } from "next";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/marketing/Reveal";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About Us",
  description:
    "Meet the Kyosys team — a small, senior crew building websites, apps, and marketing that grow businesses. Honest work, plain language.",
};

// NOTE (US-050): team bios are role-based; replace with personal backgrounds when provided.
const team = [
  {
    initials: "AG",
    name: "Abhishek Gadmale",
    role: "Founder · Full-Stack Developer",
    bio: "MERN specialist who started Kyosys to do agency work the honest way — clear pricing, real deadlines, no jargon.",
    placeholder: false,
  },
  {
    initials: "SB",
    name: "Sujal Bhagat",
    role: "Co-founder · Full-Stack Developer",
    bio: "Builds fast, reliable web and mobile apps. Obsessed with clean code and details users can feel.",
    placeholder: false,
  },
  {
    initials: "MV",
    name: "Manashri Vaishampayam",
    role: "Co-founder · QA Engineer",
    bio: "Breaks everything before your customers can. Every Kyosys launch passes her checklist first.",
    placeholder: false,
  },
];

const values = [
  {
    title: "Honesty over hype",
    text: "If we're not the right fit, we'll tell you. If a cheaper option exists, we'll point to it.",
  },
  {
    title: "Clarity in everything",
    text: "Plain-language updates, written timelines, and quotes that don't need a decoder ring.",
  },
  {
    title: "Partnership, not transactions",
    text: "We succeed when your business grows. That's why support doesn't end at launch.",
  },
  {
    title: "Results you can measure",
    text: "Enquiries, sales, rankings — we talk about outcomes, not just deliverables.",
  },
];

const stack = [
  "Next.js", "React", "TypeScript", "React Native", "Node.js",
  "Tailwind CSS", "PostgreSQL", "WordPress", "Shopify", "Firebase",
];

export default function AboutPage() {
  return (
    <>
      {/* Manifesto opener */}
      <section className="wash-sun bg-paper pb-16 pt-14 sm:pb-24 sm:pt-20">
        <Container className="max-w-4xl">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
              01 <span aria-hidden="true" className="mx-1">—</span> About Kyosys
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-brand-900">
              A small team with a simple{" "}
              <em className="font-serif font-medium italic">promise.</em>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 max-w-3xl space-y-6 text-lg leading-relaxed text-ink sm:text-xl">
              <p className="dropcap">
                Kyosys started with a frustration we kept seeing: small
                businesses paying too much for websites that don&apos;t work,
                built by people who disappear after the invoice.
              </p>
              <p className="text-ink-soft">
                So we started the agency we wished existed — three people who
                build websites, mobile apps, and marketing that actually bring
                in customers. We quote honestly, we write down our deadlines,
                and we answer our messages.
              </p>
              <p className="border-l-2 border-sun-400 pl-6 font-display text-xl font-bold tracking-tight text-brand-900 sm:text-2xl">
                We&apos;re deliberately small. You&apos;ll always know who&apos;s
                working on your project, and you&apos;ll never be handed off to
                a stranger.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Team — editorial list, restraint */}
      <section className="wash-green border-t border-ink/10 bg-paper py-16 sm:py-24" aria-labelledby="team-heading">
        <Container>
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
              02 <span aria-hidden="true" className="mx-1">—</span> The team
            </p>
            <h2
              id="team-heading"
              className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl"
            >
              The people behind{" "}
              <em className="font-serif font-medium italic">your project.</em>
            </h2>
          </Reveal>
          <div className="mt-10 border-b border-ink/15">
            {team.map((m, i) => (
              <Reveal key={m.role} delay={i * 70}>
                <div className="group grid gap-4 border-t border-ink/15 py-8 transition-colors duration-300 hover:bg-ink/[0.02] sm:grid-cols-[4rem_1fr_2fr] sm:gap-8 sm:py-10">
                  <span
                    aria-hidden="true"
                    className="font-display text-sm font-bold tabular-nums text-ink-soft"
                  >
                    0{i + 1}
                  </span>
                  <div className="flex items-center gap-4 sm:block">
                    <span
                      aria-hidden="true"
                      className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-950 font-display text-xl font-extrabold text-sun-400 transition-shadow duration-500 group-hover:shadow-[0_0_0_8px_rgba(245,158,11,0.18)] sm:size-16"
                    >
                      {m.initials}
                    </span>
                    <div className="sm:mt-4">
                      <h3 className="font-display text-2xl font-extrabold tracking-tight text-brand-900">
                        {m.name}
                      </h3>
                      <p className="mt-1 text-sm font-bold uppercase tracking-[0.14em] text-brand-700">
                        {m.role}
                      </p>
                    </div>
                  </div>
                  <div className="sm:pt-1">
                    <p className="max-w-lg text-lg leading-relaxed text-ink-soft">
                      {m.bio}
                    </p>
                    {m.placeholder && (
                      <p className="mt-3 text-sm italic text-ink-soft/70">
                        Full profile coming soon
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Values — numbered, on deep green */}
      <section className="bg-brand-950 bg-dark-gradient py-16 text-paper sm:py-24" aria-labelledby="values-heading">
        <Container>
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sun-400">
              03 <span aria-hidden="true" className="mx-1">—</span> What we believe
            </p>
            <h2
              id="values-heading"
              className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Values we actually{" "}
              <em className="font-serif font-medium italic">work by.</em>
            </h2>
          </Reveal>
          <dl className="mt-10 grid gap-x-12 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <div className="row-sweep-dark border-t border-white/15 py-7">
                  <dt className="flex items-baseline gap-4">
                    <span
                      aria-hidden="true"
                      className="font-display text-sm font-bold tabular-nums text-sun-400"
                    >
                      0{i + 1}
                    </span>
                    <span className="font-display text-xl font-bold tracking-tight">
                      {v.title}
                    </span>
                  </dt>
                  <dd className="mt-2.5 max-w-md pl-9 text-[15px] leading-relaxed text-white/70">
                    {v.text}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* Stack — refined inline list */}
      <section className="border-t border-ink/10 bg-paper py-16 sm:py-20" aria-labelledby="stack-heading">
        <Container className="max-w-4xl">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
              04 <span aria-hidden="true" className="mx-1">—</span> Toolkit
            </p>
            <h2
              id="stack-heading"
              className="mt-4 font-display text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl"
            >
              The tools we{" "}
              <em className="font-serif font-medium italic">build with.</em>
            </h2>
            <p className="mt-8 font-display text-xl font-bold leading-loose tracking-tight text-brand-900 sm:text-2xl" aria-label="Our technology stack">
              {stack.map((t, i) => (
                <span key={t}>
                  {i > 0 && (
                    <span aria-hidden="true" className="mx-3 text-brand-500/50">·</span>
                  )}
                  <span className="transition-colors hover:text-brand-500">{t}</span>
                </span>
              ))}
            </p>
          </Reveal>
        </Container>
      </section>

      <CtaBand
        index="05"
        eyebrow="Say hello"
        title={
          <>
            Want to work with people{" "}
            <em className="font-serif font-medium italic">like us?</em>
          </>
        }
        description="Start with a free 30-minute call. We'll give you honest advice whether you hire us or not."
      />
    </>
  );
}
