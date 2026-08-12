'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * One owner of the scroll: Lenis smooths, GSAP ScrollTrigger choreographs.
 * Locomotive is deliberately not installed — two smooth-scroll libraries
 * fighting over wheel events is how this kind of build turns to jank.
 * GSAP's ticker drives Lenis, so there is exactly one rAF loop on the page.
 *
 * Reveals are opt-in per element via [data-reveal]. Elements render visible in
 * the HTML and are animated FROM a hidden state at runtime, so nothing is
 * invisible if JS fails or the user prefers reduced motion.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false, // page scroll stays native on touch
      });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      if (reduced) return;

      // Block reveals.
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 22,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      // Hero line stagger — set once on load, not scroll-driven.
      const lines = gsap.utils.toArray<HTMLElement>('[data-line]');
      if (lines.length) {
        gsap.from(lines, {
          opacity: 0,
          y: 18,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.09,
          delay: 0.15,
        });
      }

      /* Image parallax. Deliberately small (6%) and applied to the <img> inside
         an overflow-hidden frame, so nothing ever detaches from its caption or
         leaves a gap at the frame edge. */
      // Skipped below 768px: parallax on the hero image promotes the LCP
      // element to its own layer and delays first paint on phones.
      const wide = window.matchMedia('(min-width: 768px)').matches;
      if (wide) gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -3, scale: 1.06 },
          {
            yPercent: 3,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        );
      });
    });

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, [enabled]);
}
