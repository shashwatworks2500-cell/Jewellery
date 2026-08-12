'use client';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { Nav } from '@/components/dom/Nav';
import {
  Hero,
  Marquee,
  Collection,
  Process,
  Bridal,
  Assurances,
  Gifting,
  Faq,
  Visit,
  Footer,
  MobileCta,
} from '@/components/dom/Sections';

export function Experience() {
  useSmoothScroll(true);

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Collection />
        <Process />
        <Bridal />
        <Assurances />
        <Gifting />
        <Faq />
        <Visit />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
