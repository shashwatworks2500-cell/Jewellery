import type { Metadata, Viewport } from 'next';
import { Italiana, Bodoni_Moda, Jost } from 'next/font/google';
import { SAMPLE_DATA } from '@/lib/sample-data';
import { COLORS } from '@/lib/tokens';
import '@/styles/globals.css';

/**
 * Fonts via next/font: latin subset only, display swap, real fallbacks.
 * Self-hosted at build time, so there is no render-blocking request to a font
 * CDN and no layout shift from a late swap (brief §2, §6 zero CLS).
 */
const italiana = Italiana({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-italiana',
  fallback: ['ui-serif', 'Georgia', 'serif'],
});

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bodoni',
  fallback: ['ui-serif', 'Georgia', 'serif'],
});

const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

const { brand, contact, seo } = SAMPLE_DATA;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.title,
    description: seo.description,
    type: 'website',
    locale: 'en_IN',
    siteName: brand.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  robots: { index: false, follow: false }, // sample site — not for indexing
};

export const viewport: Viewport = {
  themeColor: COLORS.bone,
  colorScheme: 'light',
};

/** JewelryStore JSON-LD, built from SAMPLE_DATA — no duplicated literals. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'JewelryStore',
  name: brand.name,
  description: seo.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: contact.addressLine1,
    addressLocality: brand.city,
    addressRegion: brand.state,
    addressCountry: brand.country,
  },
  telephone: contact.phone,
  foundingDate: String(brand.established),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${italiana.variable} ${bodoni.variable} ${jost.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-champagne focus:bg-vitrine focus:px-4 focus:py-2 focus:text-champagne"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
