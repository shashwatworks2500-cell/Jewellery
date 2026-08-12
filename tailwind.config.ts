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
        bone: 'rgb(var(--bone-rgb) / <alpha-value>)',
        linen: 'rgb(var(--linen-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        stone: 'rgb(var(--stone-rgb) / <alpha-value>)',
        gold: 'rgb(var(--gold-rgb) / <alpha-value>)',
        'gold-leaf': 'rgb(var(--gold-leaf-rgb) / <alpha-value>)',
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
