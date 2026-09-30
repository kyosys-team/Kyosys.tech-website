import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/quote" },
  title: "Instant quote",
  description:
    "Get a rough price range for your project in under a minute. Exact quote after a free 30-min discovery call.",
};

export { default } from "./QuoteClient";
