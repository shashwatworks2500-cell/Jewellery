'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { SAMPLE_DATA, type ShopItem } from '@/lib/sample-data';
import { img } from '@/lib/images';

/**
 * Product quick-view. A bottom sheet on mobile, a centred panel on desktop —
 * a thumb reaches the bottom of a phone, not the middle of it.
 *
 * Focus is trapped, Escape and backdrop close, and focus returns to whatever
 * opened it (handled by the caller re-focusing the trigger).
 */
export function QuickView({
  item,
  onClose,
}: {
  item: ShopItem | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { contact, shop } = SAMPLE_DATA;

  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.querySelector<HTMLElement>('button')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qv-title"
        className="relative flex max-h-[92svh] w-full max-w-3xl flex-col overflow-y-auto bg-bone md:max-h-[86vh] md:flex-row"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center bg-bone/80 text-2xl leading-none backdrop-blur-sm"
        >
          <span className="sr-only">Close</span>
          <span aria-hidden="true">×</span>
        </button>

        <div className="relative aspect-[4/3] w-full shrink-0 md:aspect-auto md:w-1/2">
          <Image
            src={img(item.image.src)}
            alt={item.image.alt}
            fill
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col p-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] md:w-1/2 md:p-10">
          <p className="eyebrow text-gold">{item.category}</p>
          <h2 id="qv-title" className="font-display mt-3 text-3xl leading-tight md:text-4xl">
            {item.name}
          </h2>
          <p className="font-numeral mt-3 text-[length:var(--step-numeral)] text-stone">
            {item.spec}
          </p>
          <hr className="my-6 border-0 border-t border-[var(--rule)]" />
          <p className="text-stone">{item.detail}</p>
          <p className="font-numeral mt-6 text-sm text-gold">{shop.priceNote}</p>

          <div className="mt-auto flex flex-col gap-3 pt-8">
            <a href={contact.whatsappHref} className="btn-primary w-full">
              Enquire about this piece
            </a>
            <a href={contact.phoneHref} className="btn-secondary w-full">
              Call {contact.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
