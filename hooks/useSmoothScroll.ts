'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Scroll + motion layer.
 *
 * One owner of the scroll: Lenis smooths, GSAP ScrollTrigger choreographs, and
 * GSAP's ticker drives Lenis so there is exactly one rAF loop on the page.
 * Locomotive is deliberately not installed — two smooth-scroll libraries
 * fighting over wheel events is how this kind of build turns to jank.
 *
 * Every effect is opt-in per element via data attributes and skipped wholesale
 * under prefers-reduced-motion. Elements render visible in the HTML and are
 * animated FROM a hidden state, so nothing disappears if JS fails.
 */

/**
 * Splits an element's text into lines wrapped in overflow-hidden masks, so the
 * type rises from behind its own baseline — the signature editorial reveal.
 *
 * Words are wrapped, grouped by measured offsetTop, then rebuilt. It runs only
 * after fonts are ready: splitting against a fallback face measures the wrong
 * line breaks, and the lines re-wrap when the real font swaps in.
 */
function splitLines(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? '';
  if (!text.trim()) return [];

  const words = text.trim().split(/\s+/);
  el.textContent = '';
  const spans = words.map((w, i) => {
    const s = document.createElement('span');
    s.textContent = i === words.length - 1 ? w : `${w} `;
    s.style.display = 'inline-block';
    s.style.whiteSpace = 'pre';
    el.appendChild(s);
    return s;
  });

  // Group words into lines by vertical position.
  const rows = new Map<number, HTMLElement[]>();
  spans.forEach((s) => {
    const top = Math.round(s.offsetTop);
    const bucket = rows.get(top);
    if (bucket) bucket.push(s);
    else rows.set(top, [s]);
  });

  el.textContent = '';
  const inners: HTMLElement[] = [];
  [...rows.keys()]
    .sort((a, b) => a - b)
    .forEach((top) => {
      const mask = document.createElement('span');
      mask.style.display = 'block';
      mask.style.overflow = 'hidden';
      // Descenders clip against a tight mask; give them room and pull it back
      // so the visual rhythm is unchanged.
      mask.style.paddingBottom = '0.12em';
      mask.style.marginBottom = '-0.12em';

      const inner = document.createElement('span');
      inner.style.display = 'block';
      inner.style.willChange = 'transform';
      rows.get(top)!.forEach((s) => inner.appendChild(s));

      mask.appendChild(inner);
      el.appendChild(mask);
      inners.push(inner);
    });

  return inners;
}

export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;
    let onAnchorClick: ((e: MouseEvent) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
      });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      /* In-page anchors must go through Lenis. A native jump teleports the page
         while Lenis still believes it is elsewhere, which lands you mid-section
         and leaves ScrollTrigger out of sync. */
      onAnchorClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
        if (!a) return;
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis?.scrollTo(target as HTMLElement, { offset: -8, duration: 1.15 });
      };
      document.addEventListener('click', onAnchorClick);

      /* Scroll velocity drives a slight skew on marked elements and the
         marquee's speed. Capped hard — past a couple of degrees it stops
         reading as momentum and starts reading as a rendering bug. */
      let velTween: gsap.core.Tween | null = null;
      lenis.on('scroll', ({ velocity }: { velocity: number }) => {
        const skew = gsap.utils.clamp(-1.6, 1.6, velocity * 0.09);
        velTween?.kill();
        velTween = gsap.to('[data-skew]', {
          skewY: skew,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: true,
        });
      });
    }

    const ctx = gsap.context(() => {
      if (reduced) return;

      // --- masked line reveals on section headings ------------------------
      document.fonts.ready.then(() => {
        gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
          let lines: HTMLElement[] = [];
          try {
            lines = splitLines(el);
          } catch {
            return; // never let a split failure hide a heading
          }
          if (!lines.length) return;
          gsap.from(lines, {
            yPercent: 115,
            duration: 1.05,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });
        ScrollTrigger.refresh();
      });

      // --- block reveals ---------------------------------------------------
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      // --- staggered groups -------------------------------------------------
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        const kids = gsap.utils.toArray<HTMLElement>(':scope > *', group);
        if (!kids.length) return;
        gsap.from(kids, {
          opacity: 0,
          y: 30,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        });
      });

      // --- image curtain wipe -----------------------------------------------
      gsap.utils.toArray<HTMLElement>('[data-img-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.25,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });

      // --- hero line stagger -------------------------------------------------
      const heroLines = gsap.utils.toArray<HTMLElement>('[data-line]');
      if (heroLines.length) {
        gsap.from(heroLines, {
          opacity: 0,
          y: 20,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 0.2,
        });
      }

      /* --- parallax ----------------------------------------------------------
         Runs at every breakpoint EXCEPT the hero image on mobile, which is the
         LCP element there — promoting it to its own layer delays first paint.
         Below-the-fold images are free to move. */
      const wide = window.matchMedia('(min-width: 768px)').matches;
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        if (!wide && el.closest('#top')) return;
        gsap.fromTo(
          el,
          { yPercent: -3.5 },
          {
            yPercent: 3.5,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        );
      });

      // --- scroll progress rule -----------------------------------------------
      const bar = document.querySelector('[data-progress]');
      if (bar) {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            transformOrigin: 'left center',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.25,
            },
          },
        );
      }
    });

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (onAnchorClick) document.removeEventListener('click', onAnchorClick);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, [enabled]);
}
