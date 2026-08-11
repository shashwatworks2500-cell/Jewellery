'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { SAMPLE_DATA } from '@/lib/sample-data';
import { useTier } from '@/hooks/useTier';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import {
  Header,
  Hero,
  PieceSection,
  InspectPanel,
  Assurances,
  Workshop,
  Appointment,
  Footer,
} from '@/components/dom/Sections';

/**
 * The 3D chunk is lazy-loaded and code-split, with ssr:false — an R3F build
 * that works in dev and dies on SSR is the classic failure here (brief §6, §9).
 */
const Scene = dynamic(() => import('@/components/canvas/Scene').then((m) => m.Scene), {
  ssr: false,
  loading: () => null,
});

export function Experience() {
  const heroRef = useRef<HTMLElement>(null);
  const pieceRefs = useRef<Record<string, HTMLElement | null>>({});

  const tier = useTier();
  const is3D = tier !== 'static';

  // Lenis only runs where motion is wanted. On the static tier the page uses
  // plain native scrolling, which is the correct behaviour for
  // prefers-reduced-motion, not a degraded one.
  useSmoothScroll(is3D);

  return (
    <>
      {is3D && (
        <Scene reduced={tier === 'reduced'} heroRef={heroRef} pieceRefs={pieceRefs} />
      )}

      {/* Tier 3 static hero: a real composition, not an empty box. A radial
          wash stands in for the stone's light so the page still reads as a
          lit vitrine. */}
      {!is3D && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              'radial-gradient(60% 45% at 50% 38%, rgba(127,182,214,0.16), transparent 70%), radial-gradient(40% 30% at 50% 60%, rgba(216,183,120,0.10), transparent 70%)',
          }}
        />
      )}

      <Header />

      <main id="main">
        <Hero ref={heroRef} />

        {SAMPLE_DATA.pieces.map((piece, i) => (
          <PieceSection
            key={piece.id}
            piece={piece}
            index={i}
            setRef={(el) => {
              pieceRefs.current[piece.id] = el;
            }}
          />
        ))}

        <Assurances />
        <Workshop />
        <Appointment />
      </main>

      <Footer />
      <InspectPanel />
    </>
  );
}
