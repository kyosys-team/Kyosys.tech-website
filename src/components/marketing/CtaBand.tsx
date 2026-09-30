import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { CursorGlow } from "@/components/motion/CursorGlow";
import { Parallax } from "@/components/motion/Parallax";

export function CtaBand({
  title = (
    <>
      Have a project in <em className="font-serif font-medium italic">mind?</em>
    </>
  ),
  description = "Tell us what you need. We'll reply within 24 hours with honest advice — no pushy sales talk.",
  index = "05",
  eyebrow = "Start a project",
}: {
  title?: React.ReactNode;
  description?: string;
  index?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-dark-gradient py-24 sm:py-32" aria-labelledby="cta-heading">
      <div aria-hidden="true" className="hairline-glow absolute inset-x-0 top-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 size-[520px] rounded-full bg-brand-500/25 blur-3xl"
      />
      <CursorGlow />
      {/* faint oversized backdrop word, drifting against scroll */}
      <Parallax
        speed={0.06}
        className="pointer-events-none absolute inset-y-0 right-0 hidden select-none overflow-hidden lg:block"
      >
        <p
          aria-hidden="true"
          className="whitespace-nowrap pt-10 font-display text-[16rem] font-extrabold leading-none text-white/[0.05]"
        >
          Kyosys
        </p>
      </Parallax>
      <Container className="relative z-10">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sun-400">
            {index} <span aria-hidden="true" className="mx-1">—</span> {eyebrow}
          </p>
          <h2
            id="cta-heading"
            className="mt-5 max-w-4xl font-display text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.025em] text-paper"
          >
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            {description}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Magnetic>
              <Link
                href="/quote"
                className="btn-emerald group inline-flex h-16 items-center justify-center gap-3 rounded-full px-10 text-lg font-bold"
              >
                Get a Quote
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Link
              href="/contact"
              className="link-underline self-center px-2 text-lg font-semibold text-paper"
            >
              or just say hello
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
