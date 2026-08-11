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
  /** Which piece is open in the focused inspect state. */
  inspecting: string | null;
  /** Render tier, resolved once on mount from capability + user preference. */
  tier: Tier;
  /** True once the intro timeline has finished. */
  introComplete: boolean;

  setScroll: (v: number) => void;
  setDispersion: (v: number) => void;
  setActivePiece: (id: string | null) => void;
  setInspecting: (id: string | null) => void;
  setTier: (t: Tier) => void;
  setIntroComplete: (v: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  scroll: 0,
  dispersion: 0,
  activePiece: null,
  inspecting: null,
  tier: 'full',
  introComplete: false,

  setScroll: (scroll) => set({ scroll }),
  setDispersion: (dispersion) => set({ dispersion }),
  setActivePiece: (activePiece) => set({ activePiece }),
  setInspecting: (inspecting) => set({ inspecting }),
  setTier: (tier) => set({ tier }),
  setIntroComplete: (introComplete) => set({ introComplete }),
}));

/** Non-reactive read for use inside useFrame. */
export const readScene = () => useSceneStore.getState();
