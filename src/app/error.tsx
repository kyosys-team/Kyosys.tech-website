"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="wash-sun bg-paper py-20 sm:py-28">
      <Container className="max-w-xl text-center">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-xl2 bg-danger/10 text-danger">
          <TriangleAlert className="size-8" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold text-brand-900 sm:text-3xl">
          Something went wrong.
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          We hit an unexpected error. Try again — and if it keeps happening,
          contact us and we&apos;ll sort it out.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            Try Again
          </button>
          <Link href="/" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Back to Home
          </Link>
        </div>
      </Container>
    </section>
  );
}
