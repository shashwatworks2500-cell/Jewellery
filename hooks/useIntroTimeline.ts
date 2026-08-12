'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { useSceneStore } from '@/lib/store';

/**
 * The load sequence, orchestrated once (brief §3):
 *   wordmark letter-spacing settles
 *     -> diamond fades in and turns into its rest angle (store flag; the scene
 *        eases its own opacity/rotation off `introComplete`)
 *     -> caustic sweeps once across the ground
 *     -> subhead
 *     -> CTAs
 *
 * One timeline, killed on unmount. Nothing here runs on the static tier.
 */
export function useIntroTimeline(
  refs: {
    eyebrow: RefObject<HTMLElement>;
    wordmark: RefObject<HTMLElement>;
    subhead: RefObject<HTMLElement>;
    ctas: RefObject<HTMLElement>;
  },
  enabled: boolean,
) {
  const setIntroComplete = useSceneStore((s) => s.setIntroComplete);
  const setDispersion = useSceneStore((s) => s.setDispersion);

  useEffect(() => {
    if (!enabled) return;
    const { eyebrow, wordmark, subhead, ctas } = refs;
    if (!wordmark.current) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => setIntroComplete(true),
    });

    tl.fromTo(
      eyebrow.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.7 },
    )
      // The wordmark settles rather than fades: tracking closes to its rest
      // value, which reads as type finding its position, not a div appearing.
      .fromTo(
        wordmark.current,
        { opacity: 0, letterSpacing: '0.22em' },
        { opacity: 1, letterSpacing: '-0.03em', duration: 1.5, ease: 'expo.out' },
        '-=0.35',
      )
      // One caustic sweep across the ground, driven through the same uniform
      // ScrollTrigger uses later.
      .to(
        { v: 0 },
        {
          v: 1,
          duration: 1.1,
          ease: 'sine.inOut',
          onUpdate() {
            const t = this.targets()[0] as { v: number };
            setDispersion(Math.sin(t.v * Math.PI));
          },
          onComplete: () => setDispersion(0),
        },
        '-=0.9',
      )
      .fromTo(
        subhead.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6',
      )
      .fromTo(
        ctas.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.45',
      );

    return () => {
      tl.kill();
      // Killing a timeline does NOT restore what it already set. Without this,
      // a timeline that starts and is then cancelled leaves the hero stuck at
      // opacity 0 — an invisible page.
      gsap.set(
        [eyebrow.current, wordmark.current, subhead.current, ctas.current].filter(Boolean),
        { clearProps: 'all' },
      );
    };
  }, [enabled, refs, setIntroComplete, setDispersion]);
}
