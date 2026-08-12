'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSceneStore } from '@/lib/store';

/**
 * One master timeline per section (brief §5).
 *
 * Each product section owns a single scrubbed trigger that writes its progress
 * into the store; the 3D stage reads that inside useFrame. No setState per
 * scroll event beyond this one throttled write, and every trigger is killed on
 * unmount. `invalidateOnRefresh` so the numbers survive a resize.
 */
export function usePieceTimeline(
  id: string,
  ref: RefObject<HTMLElement>,
  enabled: boolean,
) {
  const setPieceProgress = useSceneStore((s) => s.setPieceProgress);
  const setActivePiece = useSceneStore((s) => s.setActivePiece);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: (self) => setPieceProgress(id, self.progress),
      onToggle: (self) => setActivePiece(self.isActive ? id : null),
    });

    return () => {
      trigger.kill();
    };
  }, [id, ref, enabled, setPieceProgress, setActivePiece]);
}
