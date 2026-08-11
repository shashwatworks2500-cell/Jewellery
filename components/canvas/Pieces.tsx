'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { createBrilliantGeometry, createKadaGeometry, createAnkletGeometry } from './geometry';
import { MATERIALS, HEX } from '@/lib/tokens';
import { readScene } from '@/lib/store';

/**
 * The three pieces. Geometry and materials are created ONCE via useMemo and
 * never inside useFrame; no Vector3 is allocated per frame (brief §6).
 */

interface PieceProps {
  /** Rotation speed multiplier; hover nudges this up slightly. */
  spin?: number;
  reduced?: boolean;
}

export function Diamond({ spin = 1, reduced = false }: PieceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const geometry = useMemo(() => createBrilliantGeometry(), []);

  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;
    // Weighty, not springy: a slow constant yaw with a small scroll coupling.
    const s = readScene();
    m.rotation.y += delta * 0.18 * spin * (hovered ? 1.45 : 1);
    m.rotation.x = -0.09 + Math.sin(s.scroll * Math.PI * 2) * 0.05;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      scale={0.92}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = '';
      }}
    >
      {reduced ? (
        // Reduced tier: transmission is the single most expensive thing in the
        // scene. A physical material with high envMapIntensity keeps the facet
        // sparkle without the render-target round trip.
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0.03}
          transmission={0.72}
          thickness={1.1}
          ior={MATERIALS.diamond.ior}
          envMapIntensity={3.1}
          flatShading
        />
      ) : (
        <MeshTransmissionMaterial
          backside
          samples={8}
          resolution={512}
          transmission={MATERIALS.diamond.transmission}
          roughness={MATERIALS.diamond.roughness}
          thickness={MATERIALS.diamond.thickness}
          ior={MATERIALS.diamond.ior}
          /* drei exposes the spectral split as chromaticAberration, not the
             `dispersion` prop on three's MeshPhysicalMaterial. This value is
             what stops the stone reading as grey glass. */
          chromaticAberration={MATERIALS.diamond.dispersion}
          anisotropy={0.22}
          distortion={0.0}
          temporalDistortion={0.0}
          envMapIntensity={MATERIALS.diamond.envMapIntensity}
          clearcoat={1}
          attenuationDistance={2.4}
          attenuationColor="#ffffff"
          color="#ffffff"
        />
      )}
    </mesh>
  );
}

export function Kada({ spin = 1 }: PieceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => createKadaGeometry(), []);

  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;
    m.rotation.y += delta * 0.14 * spin;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[0.42, 0, 0.18]} scale={1.15}>
      <meshStandardMaterial
        color={MATERIALS.gold.color}
        metalness={MATERIALS.gold.metalness}
        roughness={MATERIALS.gold.roughness}
        envMapIntensity={MATERIALS.gold.envMapIntensity}
      />
    </mesh>
  );
}

export function Anklet({ spin = 1 }: PieceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => createAnkletGeometry(), []);

  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;
    m.rotation.y += delta * 0.16 * spin;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[0.1, 0, 0]} scale={0.95}>
      {/* Silver differs from gold in THREE ways, not just colour: cooler tint,
          higher roughness (0.31 vs 0.19) and lower envMapIntensity. That is
          what makes them read as two distinguishable metals. */}
      <meshStandardMaterial
        color={MATERIALS.silver.color}
        metalness={MATERIALS.silver.metalness}
        roughness={MATERIALS.silver.roughness}
        envMapIntensity={MATERIALS.silver.envMapIntensity}
      />
    </mesh>
  );
}

/** Maps a piece id from SAMPLE_DATA to its mesh. */
export function PieceMesh({ id, reduced }: { id: string; reduced?: boolean }) {
  if (id === 'diamond') return <Diamond reduced={reduced} />;
  if (id === 'gold') return <Kada />;
  return <Anklet />;
}

export const PIECE_ACCENT: Record<string, number> = {
  diamond: HEX.ice,
  gold: HEX.champagne,
  silver: HEX.platinum,
};
