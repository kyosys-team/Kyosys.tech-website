"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./hooks";

/**
 * HeroVideo — cinematic dark video backdrop for the homepage hero.
 * GPU-decoded <video>, no JS per-frame work: an IntersectionObserver
 * pauses when the hero leaves the viewport and resumes on return; a
 * visibilitychange listener covers tab switches. Under
 * prefers-reduced-motion there is no autoplay — the poster frame shows.
 * No-JS → the poster <img> fallback renders instead.
 */
export function HeroVideo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video || reduced) return;

    let inView = true;
    let visible = !document.hidden;

    const sync = () => {
      if (inView && visible) {
        video.play().catch(() => {
          /* autoplay blocked — poster remains, harmless */
        });
      } else {
        video.pause();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0.05 }
    );
    io.observe(wrap);

    const onVis = () => {
      visible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);

    sync();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      data-cursor-zone="video"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/videos/hero-bg.mp4"
        poster="/videos/hero-poster.jpg"
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        tabIndex={-1}
      />
      {/* No-JS fallback: static poster frame */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/videos/hero-poster.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
      </noscript>
    </div>
  );
}
