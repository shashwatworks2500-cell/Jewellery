import type { Config } from 'tailwindcss';

/**
 * Colours resolve to the CSS custom properties defined in styles/globals.css,
 * which are themselves mirrored from lib/tokens.ts. One source of truth.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: 'var(--bone)',
        linen: 'var(--linen)',
        ink: 'var(--ink)',
        stone: 'var(--stone)',
        gold: 'var(--gold)',
        'gold-leaf': 'var(--gold-leaf)',
      },
      fontFamily: {
        display: ['var(--font-italiana)', 'ui-serif', 'Georgia', 'serif'],
        numeral: ['var(--font-bodoni)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-jost)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: { shell: 'var(--shell)' },
      maxWidth: { measure: '38ch', wide: '92rem' },
    },
  },
  plugins: [],
};

export default config;
