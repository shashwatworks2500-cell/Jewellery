'use client';

import Image from 'next/image';
import { useState } from 'react';
import { SAMPLE_DATA, type ShopItem } from '@/lib/sample-data';
import { img } from '@/lib/images';
import { QuickView } from './QuickView';

const shell = 'mx-auto w-full max-w-[92rem] px-[var(--shell)]';

/* ------------------------------------------------------------------ hero - */

export function Hero() {
  const { hero } = SAMPLE_DATA;
  return (
    <section id="top" className="relative isolate min-h-[100svh] w-full overflow-hidden">
      {/* Full-bleed photograph. On a phone the product has to be the first
          thing you see — the previous split layout buried it under a screen of
          type, which is what made this feel lifeless. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={img(hero.image.src)}
          alt={hero.image.alt}
          fill
          priority
          quality={70}
          sizes="100vw"
          className="hero-drift object-cover object-center"
        />
        {/* Scrim, not a flat overlay: type stays legible at the bottom while
            the stones keep their highlights up top. */}
        <div className="hero-scrim absolute inset-0" />
      </div>

      <div className="relative flex min-h-[100svh] flex-col justify-end pb-28 pt-28 md:justify-center md:pb-24">
        <div className={shell}>
          <div className="max-w-3xl">
            {/* bone, not gold: gold-on-gold over the photograph was
                unreadable. The gold survives as the rule beside it. */}
            <p className="eyebrow flex items-center gap-3 text-bone/90" data-line>
              <span aria-hidden="true" className="block h-px w-6 bg-[color:var(--gold-leaf)]" />
              {hero.eyebrow}
            </p>
            <h1 className="wordmark mt-4 text-bone" data-line>
              {hero.headline}
            </h1>
            <p className="subhead mt-4 max-w-[22ch] text-bone md:max-w-[26ch]" data-line>
              {hero.subhead}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row" data-line>
              <a
                href="#visit"
                className="inline-flex w-full items-center justify-center bg-bone px-9 py-4 text-[0.72rem] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-[color:var(--gold-leaf)] sm:w-auto"
              >
                {hero.primaryCta.label}
              </a>
              <a
                href={hero.secondaryCta.href}
                className="inline-flex w-full items-center justify-center border border-bone/40 px-9 py-4 text-[0.72rem] uppercase tracking-[0.22em] text-bone transition-colors hover:border-bone sm:w-auto"
              >
                {hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

/* --------------------------------------------------------------- marquee - */

/** Quiet running band of proofs. Duplicated once so the loop is seamless. */
export function Marquee() {
  const items = [
    'IGI & GIA certified',
    'BIS 916 hallmarked',
    'Finished in-house',
    'Lifetime buyback',
    'Free first resize',
    'Since 1961',
  ];
  const run = [...items, ...items];
  return (
    <div
      className="mt-16 overflow-hidden border-y border-[var(--rule)] py-4 md:mt-24"
      aria-hidden="true"
    >
      <div className="marquee flex w-max gap-10 pr-10">
        {run.map((t, i) => (
          <span key={i} className="eyebrow whitespace-nowrap text-stone">
            {t} <span className="ml-10 text-gold">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ collection - */

function Card({ item, onOpen }: { item: ShopItem; onOpen: () => void }) {
  return (
    <article className="group flex w-[78vw] shrink-0 flex-col snap-start sm:w-auto" data-reveal>
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="img-frame relative aspect-[4/5] w-full">
          <Image
            src={img(item.image.src)}
            alt={item.image.alt}
            fill
            placeholder="blur"
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <p className="eyebrow mt-4 text-gold">{item.category}</p>
        <h3 className="font-display mt-1.5 text-2xl">{item.name}</h3>
        <p className="font-numeral mt-1.5 text-sm text-stone">{item.spec}</p>
      </button>
      <p className="mt-2.5 hidden max-w-[38ch] flex-1 text-sm text-stone sm:block">{item.detail}</p>
      <div className="mt-4 flex items-center gap-5 border-t border-[var(--rule)] pt-3.5">
        <button
          type="button"
          onClick={onOpen}
          className="text-xs uppercase tracking-[0.2em] underline-offset-4 hover:underline"
        >
          View details
        </button>
        <a
          href={SAMPLE_DATA.contact.whatsappHref}
          className="text-xs uppercase tracking-[0.2em] text-stone underline-offset-4 hover:text-ink hover:underline"
        >
          Enquire
        </a>
      </div>
    </article>
  );
}

export function Collection() {
  const { shop } = SAMPLE_DATA;
  const [active, setActive] = useState<ShopItem | null>(null);

  return (
    <section id="collection" className="bg-linen py-20 md:py-32" aria-labelledby="shop-title">
      <div className={shell}>
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow text-gold">{shop.eyebrow}</p>
          <h2 id="shop-title" className="display mt-4">
            {shop.headline}
          </h2>
          <p className="mt-5 text-stone">{shop.body}</p>
          <p className="font-numeral mt-3 text-sm text-gold">{shop.priceNote}</p>
        </div>
      </div>

      {/* Mobile: a horizontal snap rail — thumb-driven, one piece at a time,
          the way a phone actually gets browsed. Desktop: a grid. */}
      <div className="mt-10 md:mt-14">
        <div
          className={`flex snap-x snap-mandatory scroll-px-[var(--shell)] gap-5 overflow-x-auto px-[var(--shell)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-auto sm:grid sm:max-w-[92rem] sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 sm:overflow-visible lg:grid-cols-3`}
        >
          {shop.items.map((item) => (
            <Card key={item.id} item={item} onOpen={() => setActive(item)} />
          ))}
        </div>
        <p className="mt-4 px-[var(--shell)] text-xs text-stone sm:hidden">Swipe to browse →</p>
      </div>

      <div className={`${shell} mt-12 flex flex-col gap-3 sm:flex-row md:mt-16`}>
        <a href="#visit" className="btn-primary w-full sm:w-auto">
          {shop.primaryCta.label}
        </a>
        <a href={shop.secondaryCta.href} className="btn-secondary w-full sm:w-auto">
          {shop.secondaryCta.label}
        </a>
      </div>

      <QuickView item={active} onClose={() => setActive(null)} />
    </section>
  );
}

/* --------------------------------------------------------------- process - */

export function Process() {
  const { process } = SAMPLE_DATA;
  return (
    <section id="process" className="py-20 md:py-32" aria-labelledby="process-title">
      <div className={shell}>
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow text-gold">{process.eyebrow}</p>
          <h2 id="process-title" className="display mt-4">
            {process.headline}
          </h2>
        </div>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {process.steps.map((s) => (
            <li key={s.n} className="border-t border-[var(--rule)] pt-5" data-reveal>
              <p className="font-numeral text-sm text-gold">{s.n}</p>
              <h3 className="font-display mt-2 text-2xl">{s.title}</h3>
              <p className="mt-2.5 text-sm text-stone">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- bridal - */

export function Bridal() {
  const { bridal } = SAMPLE_DATA;
  return (
    <section id="bridal" className="on-ink bg-ink py-20 text-bone md:py-32" aria-labelledby="bridal-title">
      <div className={`${shell} grid items-center gap-10 md:grid-cols-2 md:gap-16`}>
        <div className="img-frame relative aspect-[5/4] w-full md:order-2">
          <Image
            src={img(bridal.image.src)}
            alt={bridal.image.alt}
            fill
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            data-parallax
          />
        </div>
        <div className="md:order-1" data-reveal>
          <p className="eyebrow text-[color:var(--gold-leaf)]">{bridal.eyebrow}</p>
          <h2 id="bridal-title" className="display mt-4">
            {bridal.headline}
          </h2>
          <p className="mt-5 max-w-[46ch] text-bone/75">{bridal.body}</p>
          <a
            href="#visit"
            className="mt-8 inline-flex w-full justify-center border border-[color:var(--gold-leaf)] px-9 py-4 text-[0.72rem] uppercase tracking-[0.22em] text-[color:var(--gold-leaf)] transition-colors hover:bg-[color:var(--gold-leaf)] hover:text-ink sm:w-auto"
          >
            {bridal.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- assurance - */

export function Assurances() {
  return (
    <section className="py-20 md:py-28" aria-labelledby="assurances-title">
      <div className={shell}>
        <h2 id="assurances-title" className="display max-w-2xl" data-reveal>
          Proof, not persuasion
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_DATA.assurances.map((a, i) => (
            <div key={a.title} className="border-t border-[var(--rule)] pt-5" data-reveal>
              <p className="font-numeral text-sm text-gold">0{i + 1}</p>
              <h3 className="font-display mt-2 text-2xl">{a.title}</h3>
              <p className="mt-2.5 text-sm text-stone">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- gifting - */

export function Gifting() {
  const { gifting } = SAMPLE_DATA;
  return (
    <section className="py-20 md:py-32" aria-labelledby="gifting-title">
      <div className={`${shell} grid items-center gap-10 md:grid-cols-2 md:gap-16`}>
        <div className="img-frame relative aspect-[5/4] w-full">
          <Image
            src={img(gifting.image.src)}
            alt={gifting.image.alt}
            fill
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            data-parallax
          />
        </div>
        <div data-reveal>
          <p className="eyebrow text-gold">{gifting.eyebrow}</p>
          <h2 id="gifting-title" className="display mt-4">
            {gifting.headline}
          </h2>
          <p className="mt-5 max-w-[46ch] text-stone">{gifting.body}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- faq - */

export function Faq() {
  const { faq } = SAMPLE_DATA;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-linen py-20 md:py-32" aria-labelledby="faq-title">
      <div className={`${shell} grid gap-10 md:grid-cols-12 md:gap-16`}>
        <div className="md:col-span-4" data-reveal>
          <p className="eyebrow text-gold">{faq.eyebrow}</p>
          <h2 id="faq-title" className="display mt-4">
            {faq.headline}
          </h2>
        </div>
        <div className="md:col-span-8">
          <dl>
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q} className="border-b border-[var(--rule)]">
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-6 py-5 text-left"
                    >
                      <span className="font-display text-xl md:text-2xl">{item.q}</span>
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 shrink-0 text-gold transition-transform duration-300 ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                      >
                        +
                      </span>
                    </button>
                  </dt>
                  <dd
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[60ch] pb-6 text-stone">{item.a}</p>
                    </div>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- visit - */

export function Visit() {
  const { appointment, contact, reviews, reviewsAreSample } = SAMPLE_DATA;
  return (
    <section id="visit" className="py-20 md:py-32" aria-labelledby="visit-title">
      <div className={shell}>
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7" data-reveal>
            <p className="eyebrow text-gold">{appointment.eyebrow}</p>
            <h2 id="visit-title" className="display mt-4">
              {appointment.headline}
            </h2>
            <p className="mt-5 max-w-[46ch] text-stone">{appointment.body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={contact.phoneHref} className="btn-primary w-full sm:w-auto">
                {appointment.primaryCta.label}
              </a>
              <a href={contact.whatsappHref} className="btn-secondary w-full sm:w-auto">
                {appointment.secondaryCta.label}
              </a>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="border-t border-[var(--rule)] pt-5">
              <p className="eyebrow text-stone">Showroom</p>
              <address className="font-numeral mt-2 not-italic text-lg leading-relaxed">
                {contact.addressLine1}
                <br />
                {contact.addressLine2}
              </address>
            </div>
            <div className="mt-7 border-t border-[var(--rule)] pt-5">
              <p className="eyebrow text-stone">Hours</p>
              <ul className="mt-2 text-sm text-stone">
                {contact.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4 py-0.5">
                    <span>{h.days}</span>
                    <span className="font-numeral">
                      {h.open}–{h.close}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {reviewsAreSample && (
          <div className="mt-16 border-t border-[var(--rule)] pt-10 md:mt-20">
            <p className="eyebrow mb-8 text-stone">Sample reviews — placeholder text</p>
            <div className="grid gap-8 md:grid-cols-3">
              {reviews.map((r) => (
                <figure key={r.quote} data-reveal>
                  <blockquote className="font-numeral text-lg leading-relaxed">
                    “{r.quote}”
                  </blockquote>
                  <figcaption className="eyebrow mt-3 text-stone">{r.attribution}</figcaption>
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
    <footer className="on-ink bg-ink pb-[max(2rem,env(safe-area-inset-bottom))] pt-16 text-bone">
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
          Sample site. All details are placeholder data; photography is stock and not the pieces
          described.
        </p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------ sticky cta - */

export function MobileCta() {
  const { contact } = SAMPLE_DATA;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-[var(--rule)] bg-bone/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
      <a href="#visit" className="btn-primary flex-1 !px-3 !py-3.5">
        Book a viewing
      </a>
      <a href={contact.whatsappHref} className="btn-secondary flex-1 !px-3 !py-3.5">
        WhatsApp
      </a>
    </div>
  );
}
