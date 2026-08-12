import type { StaticImageData } from 'next/image';

import hero from '@/public/images/hero.jpg';
import solitaire from '@/public/images/solitaire.jpg';
import braceletGold from '@/public/images/bracelet-gold.jpg';
import chainStone from '@/public/images/chain-stone.jpg';
import braceletDiamond from '@/public/images/bracelet-diamond.jpg';
import pearl from '@/public/images/pearl.jpg';
import ringsBook from '@/public/images/rings-book.jpg';
import bridalHands from '@/public/images/bridal-hands.jpg';
import goldChain from '@/public/images/gold-chain.jpg';
import ringsStone from '@/public/images/rings-stone.jpg';

/**
 * Static imports, not string paths.
 *
 * Importing the file gives Next the intrinsic dimensions at build time (so it
 * can reserve space and keep CLS at zero) and lets it generate a blurDataURL
 * for `placeholder="blur"`. String `src` values get neither: the browser only
 * learns the aspect ratio once bytes arrive, and the image pops in.
 *
 * Keyed by the same path used in SAMPLE_DATA so the data stays declarative and
 * components never import an asset directly.
 */
export const IMAGES: Record<string, StaticImageData> = {
  '/images/hero.jpg': hero,
  '/images/solitaire.jpg': solitaire,
  '/images/bracelet-gold.jpg': braceletGold,
  '/images/chain-stone.jpg': chainStone,
  '/images/bracelet-diamond.jpg': braceletDiamond,
  '/images/pearl.jpg': pearl,
  '/images/rings-book.jpg': ringsBook,
  '/images/bridal-hands.jpg': bridalHands,
  '/images/gold-chain.jpg': goldChain,
  '/images/rings-stone.jpg': ringsStone,
};

export function img(src: string): StaticImageData {
  const found = IMAGES[src];
  if (!found) throw new Error(`Unknown image: ${src}. Add it to lib/images.ts.`);
  return found;
}
