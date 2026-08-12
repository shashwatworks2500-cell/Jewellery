'use client';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import {
  Header,
  Hero,
  Shop,
  Assurances,
  Bridal,
  Workshop,
  Appointment,
  Footer,
  MobileCta,
} from '@/components/dom/Sections';

/**
 * No canvas, no 3D. The pieces are photography now, so the whole WebGL stack
 * (three, r3f, drei, postprocessing, zustand) was removed rather than left
 * installed and unused — 78 packages gone.
 */
export function Experience() {
  useSmoothScroll(true);

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Shop />
        <Assurances />
        <Bridal />
        <Workshop />
        <Appointment />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
