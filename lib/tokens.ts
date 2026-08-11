/**
 * Single source of truth for design tokens.
 *
 * These values are mirrored into CSS custom properties in styles/globals.css.
 * The 3D scene reads them from here so a colour is never written twice, and
 * never as a hex literal inside a component (brief §2, §7).
 *
 * Measured WCAG AA contrast on --vitrine (#0B0E14):
 *   platinum  16.29:1   champagne 10.09:1   ice 8.80:1   muted 7.66:1
 * On --vitrine-2 (#141925):
 *   platinum  14.82:1   champagne  9.17:1   ice 8.00:1
 * All pass AA for body text; champagne and platinum also pass AAA.
 */

export const COLORS = {
  /** Primary ground — cold ink. Deliberately not #000: pure black kills the
   *  bloom falloff and makes the vignette read as a hard edge. */
  vitrine: '#0B0E14',
  /** Raised surfaces, inspect panels. */
  vitrine2: '#141925',
  /** Gold. Restrained: hairlines, small caps, active states. */
  champagne: '#D8B778',
  /** Primary text on dark, white-metal cues. */
  platinum: '#E8ECF2',
  /** Diamond / certification accent. Used sparingly. */
  ice: '#7FB6D6',
  /** Secondary body text. 7.66:1 on vitrine. */
  muted: '#9AA4B2',
} as const;

/** Numeric mirrors for three.js, which wants 0xRRGGBB not '#RRGGBB'. */
export const HEX = {
  vitrine: 0x0b0e14,
  vitrine2: 0x141925,
  champagne: 0xd8b778,
  platinum: 0xe8ecf2,
  ice: 0x7fb6d6,
} as const;

/**
 * Material constants for the three stones/metals.
 * Gold and silver must read as two distinguishable metals (checklist §11),
 * so they differ in roughness, tint AND envMapIntensity — not just colour.
 */
export const MATERIALS = {
  diamond: {
    ior: 2.42,
    roughness: 0.02,
    thickness: 1.6,
    /** Chromatic split. This is what stops it reading as grey glass. */
    dispersion: 0.42,
    transmission: 1,
    envMapIntensity: 2.4,
  },
  gold: {
    color: HEX.champagne,
    metalness: 1,
    roughness: 0.19,
    envMapIntensity: 1.5,
  },
  silver: {
    /** Cooler and lighter than champagne, and rougher — 999 fine silver has a
     *  softer, more diffuse specular than 22K gold. */
    color: 0xd6dbe2,
    metalness: 1,
    roughness: 0.31,
    envMapIntensity: 1.15,
  },
} as const;

/** Camera rest state for the hero. */
export const CAMERA = {
  position: [0, 0.15, 4.2] as const,
  fov: 32,
  near: 0.1,
  far: 40,
};
