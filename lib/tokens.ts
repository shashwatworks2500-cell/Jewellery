/**
 * Design tokens — single source of truth, mirrored into CSS custom properties
 * in styles/globals.css. Never write a hex literal in a component.
 *
 * Theme: warm editorial ivory. The house style of the maisons on a light
 * ground — bone paper, ink type, gold used as punctuation rather than fill.
 * Replaced the dark "vitrine" theme, which suited a 3D set piece but fights
 * photography: jewellery shot on dark grounds needs light around it to read.
 *
 * Measured WCAG contrast (computed, not guessed):
 *   on --bone (#F6F3EE)   ink 16.73  stone 6.27  gold 6.38
 *   on --linen (#EDE8DF)  ink 15.17  stone 5.68  gold 5.79
 *   on --ink  (#16130F)   bone 16.73  gold-leaf 7.65
 * All text pairs pass AA. #8C6D3F was rejected at 4.34 — it failed.
 */

export const COLORS = {
  /** Primary ground — warm bone paper, never pure white. */
  bone: '#F6F3EE',
  /** Raised surfaces, cards, alternating bands. */
  linen: '#EDE8DF',
  /** Primary text, and the ground for inverted sections. */
  ink: '#16130F',
  /** Secondary text. 6.27:1 on bone. */
  stone: '#5F594F',
  /** Gold for TEXT on light grounds. AA-safe at 6.38:1. */
  gold: '#6F5426',
  /** Brighter gold — decorative only, or text on --ink (7.65:1).
   *  Do not use for text on --bone; it fails AA there. */
  goldLeaf: '#C9A227',
  /** Hairlines. Non-text, so not contrast-bound. */
  rule: 'rgba(22, 19, 15, 0.14)',
} as const;
