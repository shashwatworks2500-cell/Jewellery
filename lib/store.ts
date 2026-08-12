import { create } from 'zustand';

/**
 * Scroll + interaction state shared between the DOM and the 3D scene.
 *
 * Critical performance contract (brief §5, §6): ScrollTrigger writes into this
 * store via setState at most once per rAF, and `useFrame` reads it through
 * `useSceneStore.getState()` — never via a subscribed selector inside the frame
 * loop. That keeps scrolling off React's render path entirely; a subscribed
 * component would re-render every frame and blow the budget.
 */

export type Tier = 'full' | 'reduced' | 'static';

interface SceneState {
  /** 0..1 progress through the whole document. */
  scroll: number;
  /** Spikes toward 1 as the caustic crosses a section seam; drives the
   *  spectral split in the caustic shader. */
  dispersion: number;
  /** Which piece is centre-stage, or null in the hero. */
  activePiece: string | null;
  /** Per-section scrub progress, 0..1, written by that section's master
   *  timeline. Read inside useFrame to drive each stage's dolly and rotation. */
  pieceProgress: Record<string, number>;
  /** Which piece is open in the focused inspect state. */
  inspecting: string | null;
  /** Render tier, resolved once on mount from capability + user preference. */
  tier: Tier;
  /** False until useTier has actually run. Nothing may animate before this is
   *  true: the default tier is a guess, and starting an intro timeline against
   *  a guess then killing it leaves DOM properties stuck at their FROM values. */
  tierResolved: boolean;
  /** True once the intro timeline has finished. */
  introComplete: boolean;

  setScroll: (v: number) => void;
  setDispersion: (v: number) => void;
  setActivePiece: (id: string | null) => void;
  setPieceProgress: (id: string, v: number) => void;
  setInspecting: (id: string | null) => void;
  setTier: (t: Tier) => void;
  setIntroComplete: (v: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  scroll: 0,
  dispersion: 0,
  activePiece: null,
  pieceProgress: {},
  inspecting: null,
  tier: 'full',
  tierResolved: false,
  introComplete: false,

  setScroll: (scroll) => set({ scroll }),
  setDispersion: (dispersion) => set({ dispersion }),
  setActivePiece: (activePiece) => set({ activePiece }),
  // Mutates a shallow copy so useFrame readers always see the latest value
  // without any component subscribing to it.
  setPieceProgress: (id, v) =>
    set((s) => ({ pieceProgress: { ...s.pieceProgress, [id]: v } })),
  setInspecting: (inspecting) => set({ inspecting }),
  setTier: (tier) => set({ tier, tierResolved: true }),
  setIntroComplete: (introComplete) => set({ introComplete }),
}));

/** Non-reactive read for use inside useFrame. */
export const readScene = () => useSceneStore.getState();
