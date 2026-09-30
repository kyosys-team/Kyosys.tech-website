import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

export default function NotFound() {
  return (
    <section className="wash-sun bg-paper py-20 sm:py-28">
      <Container className="max-w-xl text-center">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-xl2 bg-mist text-brand-700">
          <Compass className="size-8" aria-hidden="true" />
        </span>
        <p className="mt-6 font-display text-6xl font-extrabold text-brand-900">404</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-brand-900">
          This page wandered off.
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
          Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className={buttonVariants({ variant: "primary", size: "lg" })}>
            Back to Home
          </Link>
          <Link
            href="/services"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            View Services
          </Link>
        </div>
      </Container>
    </section>
  );
}
