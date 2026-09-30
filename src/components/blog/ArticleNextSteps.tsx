import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/motion/Reveal";
import { PostCard, type BlogCardPost } from "@/components/blog/PostCard";
import { buttonVariants } from "@/components/ui/button";

/**
 * End-of-article guidance block.
 *
 * Rendered at the end of every blog article so a first-time reader always
 * knows what to do next: a conversion nudge (quote / contact) plus related
 * reading. The nudge always renders; the related-reading row hides gracefully
 * when fewer than 2 other published posts exist (no empty boxes).
 */
export function ArticleNextSteps({ related }: { related: BlogCardPost[] }) {
  const showRelated = related.length >= 2;

  return (
    <section
      aria-labelledby="next-steps-heading"
      className="border-t border-ink/10 bg-mist py-16 sm:py-20"
    >
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
              Your next step
            </p>
            <h2
              id="next-steps-heading"
              className="mt-3 font-display text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl"
            >
              Want this{" "}
              <em className="font-serif font-medium italic">
                for your business?
              </em>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              If this article helped, imagine what we can do with your project.
              Get an instant rough estimate — no email required.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                Get a quote
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Talk to us
              </Link>
            </div>
          </div>
        </Reveal>

        {showRelated && (
          <div className="mt-16 sm:mt-20">
            <Reveal>
              <div className="border-t border-ink/15 pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
                  Keep reading
                </p>
                <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-brand-950 sm:text-3xl">
                  More to{" "}
                  <em className="font-serif font-medium italic">explore.</em>
                </h3>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((r, i) => (
                <Reveal key={r.slug} delay={(i % 3) * 80} className="h-full">
                  <PostCard post={r} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
