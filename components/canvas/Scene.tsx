'use client';

import { Suspense, useEffect, useRef, type MutableRefObject, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { View, PerformanceMonitor, AdaptiveDpr, Preload, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Lighting } from './Lighting';
import { Caustic } from './Caustic';
import { PieceMesh } from './Pieces';
import { CAMERA } from '@/lib/tokens';
import { readScene, useSceneStore } from '@/lib/store';
import { SAMPLE_DATA } from '@/lib/sample-data';

/**
 * EXACTLY ONE <Canvas> ON THE PAGE (brief §4, checklist §11).
 *
 * Rejected alternative: a separate <Canvas> per product. That gives each
 * product its own WebGLRenderer, its own environment map and its own rAF loop —
 * three renderers competing for the GPU, three copies of the same env map in
 * VRAM, and a hard ceiling on mobile, where browsers cap live WebGL contexts
 * (commonly 8–16) and silently kill the oldest one past the limit.
 *
 * Instead: one Canvas fixed behind the document, and drei <View> with tracked
 * DOM anchors. Each stage renders into its own scissored viewport of the single
 * renderer. Note that each View is its own scene graph, so the lighting rig is
 * instantiated per view — that is how View works, not an oversight; the
 * Environment texture itself is cached and shared by drei.
 */

/**
 * Damped pointer parallax plus clamped drag-to-orbit (brief §3).
 *
 * Never a full free orbit and never a horizon flip: the azimuth is clamped to
 * ±0.42 rad and the elevation to ±0.22 rad, so the stone can be turned to catch
 * the light but the composition cannot be broken.
 *
 * Touch rule: a gesture only orbits once it is clearly horizontal
 * (|dx| > |dy|). Vertical drags are left alone so page scroll always wins.
 */
function CameraRig() {
  const target = useRef(new THREE.Vector2(0, 0));
  const current = useRef(new THREE.Vector2(0, 0));
  const orbit = useRef(new THREE.Vector2(0, 0));
  const drag = useRef({ active: false, id: -1, x: 0, y: 0, decided: false, horizontal: false });

  useEffect(() => {
    const MAX_AZ = 0.42;
    const MAX_EL = 0.22;

    const down = (e: PointerEvent) => {
      drag.current = {
        active: true,
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        decided: e.pointerType === 'mouse',
        horizontal: e.pointerType === 'mouse',
      };
    };

    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;

      // Touch: decide gesture intent once, after a small threshold.
      if (!d.decided) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        d.decided = true;
        d.horizontal = Math.abs(dx) > Math.abs(dy);
        if (!d.horizontal) {
          d.active = false; // hand it back to the page: scroll wins
          return;
        }
      }
      if (!d.horizontal) return;

      orbit.current.x = THREE.MathUtils.clamp(orbit.current.x + dx * 0.0022, -MAX_AZ, MAX_AZ);
      orbit.current.y = THREE.MathUtils.clamp(orbit.current.y - dy * 0.0016, -MAX_EL, MAX_EL);
      d.x = e.clientX;
      d.y = e.clientY;
    };

    const up = () => {
      drag.current.active = false;
    };

    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('pointercancel', up, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);

  useFrame(({ camera, pointer }, delta) => {
    target.current.set(pointer.x, pointer.y);
    const k = 1 - Math.pow(0.0016, delta); // frame-rate independent damping
    current.current.lerp(target.current, k);

    const radius = CAMERA.position[2];
    const az = current.current.x * 0.07 + orbit.current.x;
    const el = current.current.y * 0.05 + orbit.current.y;

    camera.position.x = Math.sin(az) * radius;
    camera.position.z = Math.cos(az) * radius;
    camera.position.y = CAMERA.position[1] + Math.sin(el) * radius * 0.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/** Pauses the frame loop when the tab is hidden (brief §6). */
function VisibilityGuard() {
  const setFrameloop = useThree((s) => s.setFrameloop);

  useEffect(() => {
    const onVisibility = () => setFrameloop(document.hidden ? 'never' : 'always');
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [setFrameloop]);

  return null;
}

/**
 * A product stage: its own section timeline drives the dolly and rotation.
 *
 * The dolly moves the GROUP, not the camera. Every drei <View> shares the
 * canvas camera unless it declares its own, so three stages writing
 * camera.position.z would fight each other and the hero rig. Each product view
 * declares its own PerspectiveCamera below, and the stage still translates the
 * group so the two never interact.
 */
function PieceStage({ id, reduced }: { id: string; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const s = readScene();
    const focused = s.inspecting === id;
    // 0..1 through the section; centre of the section is 0.5.
    const p = s.pieceProgress[id] ?? 0;

    // Push the piece toward the viewer as it crosses the middle of its section,
    // and further when inspected.
    const dolly = Math.sin(Math.min(Math.max(p, 0), 1) * Math.PI) * 0.35;
    const targetZ = (focused ? 0.75 : 0) + dolly;
    g.position.z += (targetZ - g.position.z) * (1 - Math.pow(0.002, delta));

    // Scroll drives orientation; the idle spin keeps it alive when parked.
    g.rotation.y += delta * (focused ? 0.28 : 0.1) + (p - 0.5) * delta * 0.6;
  });

  return (
    <group ref={group}>
      <PieceMesh id={id} reduced={reduced} />
    </group>
  );
}

interface SceneProps {
  reduced: boolean;
  heroRef: RefObject<HTMLElement | null>;
  pieceRefs: MutableRefObject<Record<string, HTMLElement | null>>;
}

export function Scene({ reduced, heroRef, pieceRefs }: SceneProps) {
  const setIntroComplete = useSceneStore((s) => s.setIntroComplete);

  useEffect(() => {
    const t = window.setTimeout(() => setIntroComplete(true), 2200);
    return () => window.clearTimeout(t);
  }, [setIntroComplete]);

  return (
    <Canvas
      // z-0, not -z-10: a negative index puts the canvas behind the document
      // background box and it disappears. Content sits at z-10 above it.
      className="!fixed !inset-0 !z-0"
      dpr={[1, 2]}
      gl={{
        antialias: !reduced,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      camera={{
        position: [CAMERA.position[0], CAMERA.position[1], CAMERA.position[2]],
        fov: CAMERA.fov,
        near: CAMERA.near,
        far: CAMERA.far,
      }}
      eventPrefix="client"
    >
      <VisibilityGuard />
      <PerformanceMonitor
        onDecline={() => {
          document.documentElement.dataset.perf = 'degraded';
        }}
      />
      <AdaptiveDpr pixelated={false} />

      <Suspense fallback={null}>
        {/* Hero stage */}
        <View track={heroRef as MutableRefObject<HTMLElement>}>
          <CameraRig />
          <Lighting reduced={reduced} />
          <Caustic intensity={reduced ? 0.7 : 1} />
          <PieceMesh id="diamond" reduced={reduced} />
          {/* Post lives inside the hero view only. Running a composer per view
              would triple the fullscreen passes for no visual gain — the product
              stages are small viewports where bloom is barely legible. */}
          {!reduced && (
            <EffectComposer multisampling={0} enableNormalPass={false}>
              <Bloom mipmapBlur intensity={0.42} luminanceThreshold={0.82} luminanceSmoothing={0.22} />
              <Vignette eskil={false} offset={0.24} darkness={0.7} />
              <Noise premultiply opacity={0.14} />
            </EffectComposer>
          )}
        </View>

        {/* One tracked viewport per product — same renderer, same frame loop. */}
        {SAMPLE_DATA.pieces.map((piece) => (
          <ProductView key={piece.id} id={piece.id} reduced={reduced} pieceRefs={pieceRefs} />
        ))}

        <Preload all />
      </Suspense>
    </Canvas>
  );
}

function ProductView({
  id,
  reduced,
  pieceRefs,
}: {
  id: string;
  reduced: boolean;
  pieceRefs: MutableRefObject<Record<string, HTMLElement | null>>;
}) {
  const ref = useRef<HTMLElement | null>(null);
  ref.current = pieceRefs.current[id] ?? null;
  if (!ref.current) return null;

  return (
    <View track={ref as MutableRefObject<HTMLElement>}>
      {/* Own camera per view, so stages never fight over a shared one. */}
      <PerspectiveCamera makeDefault position={[0, 0, 3.7]} fov={CAMERA.fov} />
      <Lighting reduced={reduced} />
      <PieceStage id={id} reduced={reduced} />
    </View>
  );
}
