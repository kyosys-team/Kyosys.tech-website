"use client";

import { useEffect, useState } from "react";

/**
 * WordRotator — kinetic headline slot. Cycles through what Kyosys builds
 * with a smooth vertical roll every 3s. Transform-only (GPU-cheap).
 * Reduced motion → first word rendered statically. Screen readers get a
 * single static phrase (aria-hidden on the animated slot + sr-only text).
 */

const WORDS = ["websites", "mobile apps", "brands", "campaigns"];
const SLOT_EM = 1.18; // slot height — clears descenders ("campaigns")

export function WordRotator() {
  const [index, setIndex] = useState(0);
  // SSR-safe default: static until we know motion is allowed.
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setReduced(false);
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % WORDS.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <span className="sr-only">
        websites, mobile apps, brands, and campaigns
      </span>
      <span aria-hidden="true" className="rotator">
        <span
          className="rotator-track"
          style={
            reduced
              ? undefined
              : { transform: `translateY(-${index * SLOT_EM}em)` }
          }
        >
          {WORDS.map((w) => (
            <span key={w} className="rotator-word">
              {w}
            </span>
          ))}
        </span>
      </span>
    </>
  );
}
