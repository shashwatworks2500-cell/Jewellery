'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { SAMPLE_DATA, type ShopItem } from '@/lib/sample-data';

const shell = 'px-[var(--shell)] mx-auto w-full max-w-[92rem]';

/* ---------------------------------------------------------------- header - */

export function Header() {
  const { brand, shop } = SAMPLE_DATA;
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid ? 'bg-bone/95 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className={`${shell} flex items-center justify-between py-5`}>
        <a href="#top" className="font-display text-xl uppercase tracking-[0.2em]">
          {brand.wordmark}
        </a>
        <nav className="flex items-center gap-8">
          <a href="#collection" className="eyebrow hidden sm:block hover:text-gold">
            Collection
          </a>
          <a href="#bridal" className="eyebrow hidden sm:block hover:text-gold">
            Bridal
          </a>
          <a href={shop.primaryCta.href} className="btn-primary !px-5 !py-2.5 !text-[0.62rem]">
            Book a viewing
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ hero - */

/**
 * Conversion-focused hero: one promise, one primary action, and the three
 * objections answered immediately beneath it. Split layout rather than a
 * text-over-photo overlay — overlaid type on jewellery photography either
 * covers the product or drops below contrast, and usually both.
 */
export function Hero() {
  const { hero } = SAMPLE_DATA;
  return (
    <section id="top" className="relative pt-28 pb-16 md:pt-32 md:pb-24">
      <div className={`${shell} grid items-center gap-12 md:grid-cols-2 md:gap-16`}>
        <div>
          <p className="eyebrow text-gold">{hero.eyebrow}</p>
          <h1 className="wordmark mt-6">{hero.headline}</h1>
          <p className="subhead mt-6 max-w-[26ch] text-ink">{hero.subhead}</p>
          <p className="mt-6 max-w-[46ch] text-stone">{hero.body}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={hero.primaryCta.href} className="btn-primary">
              {hero.primaryCta.label}
            </a>
            <a href={hero.secondaryCta.href} className="btn-secondary">
              {hero.secondaryCta.label}
            </a>
          </div>

          <ul className="mt-10 flex flex-col gap-2 border-t border-[var(--rule)] pt-6 text-sm text-stone sm:flex-row sm:gap-8">
            {hero.trust.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-gold">
                  —
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="img-frame relative aspect-[4/5] w-full">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ shop - */

function ShopCard({ item }: { item: ShopItem }) {
  const { shop } = SAMPLE_DATA;
  return (
    <article className="group flex flex-col" data-reveal>
      <div className="img-frame relative aspect-[4/5] w-full">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <p className="eyebrow mt-5 text-gold">{item.category}</p>
      <h3 className="font-display mt-2 text-2xl">{item.name}</h3>
      <p className="font-numeral mt-2 text-[length:var(--step-numeral)] text-stone">{item.spec}</p>
      <p className="mt-3 max-w-[38ch] flex-1 text-sm text-stone">{item.detail}</p>
      <div className="mt-5 flex items-center gap-4 border-t border-[var(--rule)] pt-4">
        <a
          href={shop.primaryCta.href}
          className="text-xs uppercase tracking-[0.2em] text-ink underline-offset-4 hover:underline"
        >
          Reserve
        </a>
        <a
          href={shop.secondaryCta.href}
          className="text-xs uppercase tracking-[0.2em] text-stone underline-offset-4 hover:text-ink hover:underline"
        >
          Enquire
        </a>
      </div>
    </article>
  );
}

export function Shop() {
  const { shop } = SAMPLE_DATA;
  return (
    <section id="collection" className="bg-linen py-24 md:py-32" aria-labelledby="shop-title">
      <div className={shell}>
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow text-gold">{shop.eyebrow}</p>
          <h2 id="shop-title" className="display mt-5">
            {shop.headline}
          </h2>
          <p className="mt-6 text-stone">{shop.body}</p>
          <p className="font-numeral mt-4 text-sm text-gold">{shop.priceNote}</p>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {shop.items.map((item) => (
            <ShopCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 sm:flex-row">
          <a href={shop.primaryCta.href} className="btn-primary">
            {shop.primaryCta.label}
          </a>
          <a href={shop.secondaryCta.href} className="btn-secondary">
            {shop.secondaryCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ assurances - */

export function Assurances() {
  return (
    <section className="py-24 md:py-28" aria-labelledby="assurances-title">
      <div className={shell}>
        <h2 id="assurances-title" className="display max-w-2xl" data-reveal>
          Proof, not persuasion
        </h2>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_DATA.assurances.map((a, i) => (
            <div key={a.title} className="border-t border-[var(--rule)] pt-6">
              <p className="font-numeral text-sm text-gold">0{i + 1}</p>
              <h3 className="font-display mt-3 text-2xl">{a.title}</h3>
              <p className="mt-3 text-sm text-stone">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- bridal - */

export function Bridal() {
  const { bridal } = SAMPLE_DATA;
  return (
    <section id="bridal" className="on-ink bg-ink py-24 text-bone md:py-32" aria-labelledby="bridal-title">
      <div className={`${shell} grid items-center gap-12 md:grid-cols-2 md:gap-16`}>
        <div className="img-frame relative aspect-[5/4] w-full md:order-2">
          <Image
            src={bridal.image.src}
            alt={bridal.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="md:order-1" data-reveal>
          <p className="eyebrow text-[color:var(--gold-leaf)]">{bridal.eyebrow}</p>
          <h2 id="bridal-title" className="display mt-5">
            {bridal.headline}
          </h2>
          <p className="mt-6 max-w-[46ch] text-bone/75">{bridal.body}</p>
          <a
            href={bridal.cta.href}
            className="mt-10 inline-flex border border-[color:var(--gold-leaf)] px-9 py-4 text-[0.72rem] uppercase tracking-[0.22em] text-[color:var(--gold-leaf)] transition-colors hover:bg-[color:var(--gold-leaf)] hover:text-ink"
          >
            {bridal.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- workshop - */

export function Workshop() {
  const { workshop } = SAMPLE_DATA;
  return (
    <section className="py-24 md:py-32" aria-labelledby="workshop-title">
      <div className={`${shell} grid items-center gap-12 md:grid-cols-2 md:gap-16`}>
        <div className="img-frame relative aspect-[5/4] w-full">
          <Image
            src={workshop.image.src}
            alt={workshop.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="eyebrow text-gold">{workshop.eyebrow}</p>
          <h2 id="workshop-title" className="display mt-5">
            {workshop.headline}
          </h2>
          <p className="mt-6 max-w-[46ch] text-stone">{workshop.body}</p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- appointment - */

export function Appointment() {
  const { appointment, contact, reviews, reviewsAreSample } = SAMPLE_DATA;
  return (
    <section id="appointment" className="bg-linen py-24 md:py-32" aria-labelledby="appointment-title">
      <div className={shell}>
        <div className="max-w-2xl">
          <p className="eyebrow text-gold">{appointment.eyebrow}</p>
          <h2 id="appointment-title" className="display mt-5">
            {appointment.headline}
          </h2>
          <p className="mt-6 text-stone">{appointment.body}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={appointment.primaryCta.href} className="btn-primary">
              {appointment.primaryCta.label}
            </a>
            <a href={appointment.secondaryCta.href} className="btn-secondary">
              {appointment.secondaryCta.label}
            </a>
          </div>
          <p className="mt-6 text-sm text-stone">
            {contact.addressLine1}, {contact.addressLine2}
          </p>
        </div>

        {reviewsAreSample && (
          <div className="mt-20 border-t border-[var(--rule)] pt-10">
            <p className="eyebrow mb-8 text-stone">Sample reviews — placeholder text</p>
            <div className="grid gap-8 md:grid-cols-3">
              {reviews.map((r) => (
                <figure key={r.quote}>
                  <blockquote className="font-numeral text-lg leading-relaxed">
                    “{r.quote}”
                  </blockquote>
                  <figcaption className="eyebrow mt-4 text-stone">{r.attribution}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- footer - */

export function Footer() {
  const { brand, contact } = SAMPLE_DATA;
  return (
    <footer className="on-ink bg-ink py-16 text-bone">
      <div className={`${shell} grid gap-10 md:grid-cols-3`}>
        <div>
          <p className="font-display text-2xl uppercase tracking-[0.18em]">{brand.wordmark}</p>
          <p className="mt-3 text-sm text-bone/60">
            {brand.generations} · {brand.city}, {brand.state}
          </p>
        </div>
        <address className="not-italic text-sm text-bone/60">
          {contact.addressLine1}
          <br />
          {contact.addressLine2}
          <br />
          <a href={contact.phoneHref} className="mt-2 inline-block hover:text-bone">
            {contact.phone}
          </a>
        </address>
        <div className="text-sm text-bone/60">
          {contact.hours.map((h) => (
            <p key={h.days}>
              {h.days} · {h.open}–{h.close}
            </p>
          ))}
        </div>
      </div>
      <div className={`${shell} mt-12 border-t border-[var(--rule-invert)] pt-6`}>
        <p className="text-xs text-bone/40">
          Sample site. All details are placeholder data; photography is stock and not the
          pieces described.
        </p>
      </div>
    </footer>
  );
}

/** Sticky mobile conversion bar — the highest-intent action, always reachable. */
export function MobileCta() {
  const { appointment } = SAMPLE_DATA;
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-[var(--rule)] bg-bone/95 p-3 backdrop-blur-sm md:hidden"
    >
      <a href={appointment.primaryCta.href} className="btn-primary flex-1 !px-3 !py-3">
        Book a viewing
      </a>
      <a href={appointment.secondaryCta.href} className="btn-secondary flex-1 !px-3 !py-3">
        WhatsApp
      </a>
    </div>
  );
}
