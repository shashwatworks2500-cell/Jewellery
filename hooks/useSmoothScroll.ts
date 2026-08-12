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
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 22,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
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
