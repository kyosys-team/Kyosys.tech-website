import { Container } from "@/components/ui/section";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-ink/10 ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

export default function Loading() {
  return (
    <section className="bg-paper py-14" aria-label="Loading">
      <Container className="max-w-3xl">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="mt-4 h-5 w-full" />
        <Skeleton className="mt-2 h-5 w-11/12" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <span className="sr-only">Loading content…</span>
      </Container>
    </section>
  );
}
