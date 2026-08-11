'use client';

import { Suspense, useEffect, useRef, type MutableRefObject, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { View, PerformanceMonitor, AdaptiveDpr, Preload } from '@react-three/drei';
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

/** Damped pointer parallax. Small amplitude — the stone should feel weighty. */
function CameraRig() {
  const target = useRef(new THREE.Vector2(0, 0));
  const current = useRef(new THREE.Vector2(0, 0));

  useFrame(({ camera, pointer }, delta) => {
    target.current.set(pointer.x, pointer.y);
    const k = 1 - Math.pow(0.0016, delta); // frame-rate independent damping
    current.current.lerp(target.current, k);
    camera.position.x = CAMERA.position[0] + current.current.x * 0.28;
    camera.position.y = CAMERA.position[1] + current.current.y * 0.18;
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

/** A product stage: scroll and inspect state drive its dolly and rotation. */
function PieceStage({ id, reduced }: { id: string; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const s = readScene();
    const focused = s.inspecting === id;
    const targetZ = focused ? 2.7 : 3.7;
    state.camera.position.z += (targetZ - state.camera.position.z) * (1 - Math.pow(0.002, delta));
    g.rotation.y += delta * (focused ? 0.28 : 0.12);
  });

  return (
    <group ref={group}>
      <PieceMesh id={id} reduced={reduced} />
    </group>
  );
}

interface SceneProps {
  reduced: boolean;
  heroRef: RefObject<HTMLElement>;
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
      className="!fixed inset-0 -z-10"
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
      <Lighting reduced={reduced} />
      <PieceStage id={id} reduced={reduced} />
    </View>
  );
}
