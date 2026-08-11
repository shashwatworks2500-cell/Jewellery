'use client';

import { useEffect } from 'react';
import { useSceneStore, type Tier } from '@/lib/store';

/**
 * Resolves the render tier once on mount (brief §6).
 *
 *   full    — desktop, WebGL available, motion allowed: everything.
 *   reduced — mobile / low core count: no post, fewer lightformers, cheaper
 *             diamond material.
 *   static  — no WebGL, or prefers-reduced-motion: the canvas never mounts and
 *             the CSS hero stands alone.
 *
 * All three must look intentional. `static` is not an error state.
 */
function detectTier(): Tier {
  if (typeof window === 'undefined') return 'static';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';

  // WebGL capability probe. The context is released immediately.
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    if (!gl) return 'static';
    const lose = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
    lose?.loseContext();
  } catch {
    return 'static';
  }

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 900;
  const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowMemory = typeof deviceMemory === 'number' && deviceMemory <= 4;

  if (coarse || narrow || fewCores || lowMemory) return 'reduced';
  return 'full';
}

export function useTier(): Tier {
  const tier = useSceneStore((s) => s.tier);
  const setTier = useSceneStore((s) => s.setTier);

  useEffect(() => {
    setTier(detectTier());

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setTier(detectTier());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [setTier]);

  return tier;
}
