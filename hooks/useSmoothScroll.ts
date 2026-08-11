'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSceneStore } from '@/lib/store';

/**
 * ONE owner of the scroll (brief §5).
 *
 * Lenis smooths, GSAP ScrollTrigger choreographs. Locomotive Scroll is
 * deliberately NOT installed — running two smooth-scroll libraries is the
 * single most common way this kind of build turns to jank, because both patch
 * wheel events and fight over the scroll position. The locomotive-scroll skill
 * was consulted for the scrollerProxy pattern; that pattern is implemented here
 * against Lenis instead.
 *
 * Lenis drives ScrollTrigger.update directly, and GSAP's ticker drives Lenis's
 * rAF, so there is exactly one rAF loop for scrolling on the page.
 */
export function useSmoothScroll(enabled: boolean) {
  const setScroll = useSceneStore((s) => s.setScroll);
  const setDispersion = useSceneStore((s) => s.setDispersion);

  useEffect(() => {
    if (!enabled) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch is left native: page scroll must always win over orbit on
      // vertical gestures, and hijacking touch is how that promise gets broken.
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && typeof value === 'number') {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    // Global progress -> store. One write per rAF, read non-reactively inside
    // useFrame; never setState per scroll event.
    const progress = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setScroll(self.progress);
        // Dispersion spikes as the sweep crosses a section seam. Seams are at
        // even fractions of the page; distance to the nearest one drives it.
        const seams = [0.25, 0.5, 0.75];
        const nearest = seams.reduce(
          (acc, s) => Math.min(acc, Math.abs(self.progress - s)),
          1,
        );
        setDispersion(Math.max(0, 1 - nearest / 0.06));
      },
    });

    ScrollTrigger.refresh();

    return () => {
      progress.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ScrollTrigger.scrollerProxy(document.documentElement, undefined);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [enabled, setScroll, setDispersion]);
}
