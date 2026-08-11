'use client';

import { forwardRef, useEffect } from 'react';
import { SAMPLE_DATA } from '@/lib/sample-data';
import { useSceneStore } from '@/lib/store';

/**
 * All copy comes from SAMPLE_DATA — no hardcoded user-facing strings (§1).
 * Voice: quiet, specific, confident. CTAs name their action.
 */

const shell = 'px-shell mx-auto w-full max-w-wide';

export function Header() {
  return (
    <header className={`${shell} fixed top-0 left-0 right-0 z-40 py-5`}>
      <div className="flex items-baseline justify-between border-b border-[var(--rule)] pb-4">
        <span className="font-display text-lg tracking-[0.18em] uppercase">
          {SAMPLE_DATA.brand.wordmark}
        </span>
        <a href="#appointment" className="eyebrow hover:text-platinum transition-colors">
          Appointments
        </a>
      </div>
    </header>
  );
}

/**
 * The hero. The wordmark is real DOM text sitting BEHIND the canvas, so the
 * diamond has something recognisable to refract — and so the LCP element is
 * text, not the canvas (§6).
 */
export const Hero = forwardRef<HTMLElement>(function Hero(_props, ref) {
  const { hero } = SAMPLE_DATA;
  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-center text-center"
    >
      <div className={`${shell} relative z-10 flex flex-col items-center`}>
        <p className="eyebrow mb-8">{hero.eyebrow}</p>
        <h1 className="wordmark text-platinum">{hero.headline}</h1>
        <p className="mt-10 max-w-measure text-muted">{hero.subhead}</p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href={hero.primaryCta.href}
            className="border border-champagne px-8 py-4 text-champagne text-xs uppercase tracking-[0.24em] transition-colors hover:bg-champagne hover:text-vitrine"
          >
            {hero.primaryCta.label}
          </a>
          <a
            href={hero.secondaryCta.href}
            className="px-8 py-4 text-xs uppercase tracking-[0.24em] text-muted transition-colors hover:text-platinum"
          >
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>
    </section>
  );
});

export function PieceSection({
  piece,
  index,
  setRef,
}: {
  piece: (typeof SAMPLE_DATA)['pieces'][number];
  index: number;
  setRef: (el: HTMLElement | null) => void;
}) {
  const setInspecting = useSceneStore((s) => s.setInspecting);
  // Alternate sides so the eye zigzags instead of scanning a row.
  const flip = index % 2 === 1;

  return (
    <section
      id={`piece-${piece.id}`}
      className={`${shell} flex min-h-[100svh] flex-col items-center gap-10 py-24 md:flex-row md:gap-16 ${
        flip ? 'md:flex-row-reverse' : ''
      }`}
      aria-labelledby={`piece-${piece.id}-title`}
    >
      <div className="w-full md:w-1/2">
        <p className="eyebrow mb-6">
          {piece.index} — {piece.material}
        </p>
        <h2 id={`piece-${piece.id}-title`} className="display text-platinum">
          {piece.name}
        </h2>
        <p className="font-numeral mt-8 text-[length:var(--step-numeral)] text-ice">{piece.spec}</p>
        <hr className="my-8 w-24 border-0 border-t border-[var(--rule)]" />
        <p className="max-w-measure text-muted">{piece.craftNote}</p>
        <button
          type="button"
          onClick={() => setInspecting(piece.id)}
          className="mt-10 border border-champagne px-7 py-3.5 text-xs uppercase tracking-[0.24em] text-champagne transition-colors hover:bg-champagne hover:text-vitrine"
        >
          {piece.cta.label}
        </button>
      </div>

      {/* Canvas anchor. aria-hidden: the real content is the DOM above. */}
      <div
        ref={setRef}
        aria-hidden="true"
        className="h-[46svh] w-full md:h-[70svh] md:w-1/2"
      />
    </section>
  );
}

export function InspectPanel() {
  const inspecting = useSceneStore((s) => s.inspecting);
  const setInspecting = useSceneStore((s) => s.setInspecting);
  const piece = SAMPLE_DATA.pieces.find((p) => p.id === inspecting);

  useEffect(() => {
    if (!inspecting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInspecting(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [inspecting, setInspecting]);

  if (!piece) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspect-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-vitrine/80 backdrop-blur-sm md:items-center"
      onClick={() => setInspecting(null)}
    >
      <div
        className="w-full max-w-xl border border-[var(--rule)] bg-vitrine-2 p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="eyebrow mb-5">{piece.material}</p>
        <h3 id="inspect-title" className="display text-platinum">
          {piece.name}
        </h3>
        <ul className="font-numeral mt-7 flex flex-wrap gap-x-6 gap-y-2 text-ice">
          {piece.specParts.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-7 text-muted">{piece.craftNote}</p>
        <div className="mt-10 flex items-center gap-6">
          <a
            href={SAMPLE_DATA.appointment.cta.href}
            className="border border-champagne px-7 py-3.5 text-xs uppercase tracking-[0.24em] text-champagne transition-colors hover:bg-champagne hover:text-vitrine"
          >
            {SAMPLE_DATA.appointment.cta.label}
          </a>
          <button
            type="button"
            autoFocus
            onClick={() => setInspecting(null)}
            className="text-xs uppercase tracking-[0.24em] text-muted transition-colors hover:text-platinum"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function Assurances() {
  return (
    <section className={`${shell} py-28`} aria-labelledby="assurances-title">
      <h2 id="assurances-title" className="display mb-16 text-platinum">
        Proof, not persuasion
      </h2>
      <div className="grid gap-12 md:grid-cols-3">
        {SAMPLE_DATA.assurances.map((a) => (
          <div key={a.title}>
            <h3 className="font-display text-2xl text-champagne">{a.title}</h3>
            <p className="mt-4 text-muted">{a.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Workshop() {
  const { workshop } = SAMPLE_DATA;
  return (
    <section id="workshop" className={`${shell} py-28`} aria-labelledby="workshop-title">
      <p className="eyebrow mb-6">{workshop.eyebrow}</p>
      <h2 id="workshop-title" className="display max-w-3xl text-platinum">
        {workshop.headline}
      </h2>
      <p className="mt-8 max-w-measure text-muted">{workshop.body}</p>
    </section>
  );
}

export function Appointment() {
  const { appointment, contact, reviews, reviewsAreSample } = SAMPLE_DATA;
  return (
    <section id="appointment" className={`${shell} py-28`} aria-labelledby="appointment-title">
      <p className="eyebrow mb-6">{appointment.eyebrow}</p>
      <h2 id="appointment-title" className="display max-w-3xl text-platinum">
        {appointment.headline}
      </h2>
      <p className="mt-8 max-w-measure text-muted">{appointment.body}</p>
      <a
        href={contact.phoneHref}
        className="mt-10 inline-block border border-champagne px-8 py-4 text-xs uppercase tracking-[0.24em] text-champagne transition-colors hover:bg-champagne hover:text-vitrine"
      >
        {appointment.cta.label}
      </a>

      {reviewsAreSample && (
        <div className="mt-24 border-t border-[var(--rule)] pt-10">
          <p className="eyebrow mb-8">Sample reviews — placeholder text</p>
          <div className="grid gap-8 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.quote}>
                <blockquote className="text-muted">{r.quote}</blockquote>
                <figcaption className="eyebrow mt-4">{r.attribution}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function Footer() {
  const { brand, contact } = SAMPLE_DATA;
  return (
    <footer className={`${shell} border-t border-[var(--rule)] py-16`}>
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-xl tracking-[0.18em] uppercase">{brand.wordmark}</p>
          <p className="mt-3 text-sm text-muted">
            {brand.generations} · {brand.city}, {brand.state}
          </p>
        </div>
        <address className="not-italic text-sm text-muted">
          {contact.addressLine1}
          <br />
          {contact.addressLine2}
          <br />
          <a href={contact.phoneHref} className="mt-2 inline-block hover:text-platinum">
            {contact.phone}
          </a>
        </address>
        <div className="text-sm text-muted">
          {contact.hours.map((h) => (
            <p key={h.days}>
              {h.days} · {h.open}–{h.close}
            </p>
          ))}
        </div>
      </div>
      <p className="mt-12 text-xs text-muted/70">
        Sample site. All details are placeholder data for demonstration.
      </p>
    </footer>
  );
}
