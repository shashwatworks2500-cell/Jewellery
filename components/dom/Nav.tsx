'use client';

import { useEffect, useRef, useState } from 'react';
import { SAMPLE_DATA } from '@/lib/sample-data';

const LINKS = [
  { label: 'Collection', href: '#collection' },
  { label: 'Bridal', href: '#bridal' },
  { label: 'How it works', href: '#process' },
  { label: 'Questions', href: '#faq' },
  { label: 'Visit', href: '#visit' },
];

/**
 * Header with a real mobile drawer.
 *
 * The previous version hid the nav links behind `hidden sm:block`, which meant
 * that on a phone — the majority of this audience — Collection and Bridal were
 * simply unreachable. A luxury site cannot lose its own navigation on mobile.
 *
 * The drawer traps focus, closes on Escape and on backdrop press, restores
 * focus to the trigger, and locks body scroll while open.
 */
export function Nav() {
  const { brand, contact } = SAMPLE_DATA;
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <header
        /* Over the full-bleed hero the header must be light; once the page
           scrolls onto the bone ground it flips to ink. Without this the
           wordmark and burger are invisible against the photograph. */
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid ? 'bg-bone/95 text-ink backdrop-blur-md' : 'bg-transparent text-bone'
        }`}
      >
        <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between px-[var(--shell)] py-4 md:py-5">
          <a href="#top" className="font-display text-lg uppercase tracking-[0.2em] md:text-xl">
            {brand.wordmark}
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="eyebrow transition-colors hover:opacity-70">
                {l.label}
              </a>
            ))}
            <a
              href="#visit"
              className={`inline-flex items-center justify-center px-5 py-2.5 text-[0.62rem] uppercase tracking-[0.22em] transition-colors ${
                solid
                  ? 'bg-ink text-bone hover:bg-transparent hover:text-ink border border-ink'
                  : 'border border-bone/50 text-bone hover:bg-bone hover:text-ink'
              }`}
            >
              Book a viewing
            </a>
          </nav>

          {/* 44px minimum touch target. */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span className="sr-only">Open menu</span>
            <span aria-hidden="true" className="flex flex-col gap-[5px]">
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-4 bg-current" />
            </span>
          </button>
        </div>
      </header>

      {/* Drawer */}
      <div
        /* `invisible` (visibility:hidden), not just aria-hidden: a hidden
           subtree that is still focusable trips Lighthouse's aria-hidden-focus
           and strands keyboard users on invisible links. visibility:hidden
           removes it from both the a11y tree and the tab order. */
        className={`fixed inset-0 z-[60] transition-[visibility] duration-300 lg:hidden ${
          open ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-bone text-ink px-7 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-lg uppercase tracking-[0.2em]">{brand.wordmark}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-mr-2 flex h-11 w-11 items-center justify-center text-2xl leading-none"
            >
              <span className="sr-only">Close menu</span>
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <nav className="mt-10 flex flex-col" aria-label="Mobile">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display border-b border-[var(--rule)] py-4 text-3xl"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="mt-auto pt-10">
            <a href={contact.whatsappHref} className="btn-primary w-full">
              Message on WhatsApp
            </a>
            <a
              href={contact.phoneHref}
              className="font-numeral mt-4 block text-center text-lg text-gold"
            >
              {contact.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
