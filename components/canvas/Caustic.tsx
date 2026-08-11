'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { readScene } from '@/lib/store';
import { HEX } from '@/lib/tokens';

/**
 * THE SIGNATURE ELEMENT (brief §2).
 *
 * Decision: PROJECTED PROCEDURAL CAUSTIC, not a real refraction pass.
 * A true caustic needs photon mapping or raymarched refraction against the
 * ground plane; both are comfortably over the 2ms/frame budget on a mid-range
 * Android. This is one extra draw call on a single plane with no post-pass,
 * and it buys the same read: light thrown by the stone onto the page.
 *
 * Two uniforms drive it:
 *   uScroll     — position of the sweep down the page, written by ScrollTrigger
 *   uDispersion — spikes toward 1 at each section seam, at which point the
 *                 shader samples the caustic at three offset UVs for R/G/B, so
 *                 the light splits into spectrum ONLY at the boundaries.
 *
 * Because the sweep marks the seams, the page needs no divider rules at all —
 * the light is the divider.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uScroll;
  uniform float uDispersion;
  uniform float uIntensity;
  uniform vec3  uWarm;
  uniform vec3  uCool;
  varying vec2  vUv;

  // Cheap 2D hash + value noise. No texture fetch, no derivatives.
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y);
  }

  // Caustic web: domain-warped noise folded with abs() to make bright
  // filaments where the "wavefronts" cross, which is what a caustic looks like.
  float caustic(vec2 uv, float t) {
    vec2 warp = vec2(noise(uv * 2.6 + t * 0.11), noise(uv * 2.6 - t * 0.09));
    vec2 p = uv * 3.4 + warp * 0.85;
    float a = abs(noise(p + t * 0.13));
    float b = abs(noise(p * 1.9 - t * 0.17));
    float web = 1.0 - smoothstep(0.0, 0.42, min(a, b));
    return pow(web, 2.6);
  }

  void main() {
    // The sweep: a soft band travelling down the plane as the page scrolls.
    float band = 1.0 - smoothstep(0.0, 0.55, abs(vUv.y - (1.0 - uScroll)));

    // Dispersion offset — zero for most of the page, opening up at seams.
    float d = uDispersion * 0.035;
    vec2 uv = vUv;

    float r = caustic(uv + vec2( d,  d * 0.5), uTime);
    float g = caustic(uv,                      uTime);
    float b = caustic(uv + vec2(-d, -d * 0.5), uTime);

    // Base colour is the warm/cool mix of the room; the spectral split only
    // shows where uDispersion has opened the channels apart.
    vec3 col = vec3(r, g, b) * mix(uWarm, uCool, vUv.y);
    col += vec3(r - b, 0.0, b - r) * uDispersion * 0.55;

    float alpha = (r + g + b) / 3.0 * band * uIntensity;

    // Radial falloff so the plane never shows its own edges.
    float vig = 1.0 - smoothstep(0.25, 0.72, distance(vUv, vec2(0.5)));
    alpha *= vig;

    if (alpha < 0.004) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

export function Caustic({ intensity = 1 }: { intensity?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uDispersion: { value: 0 },
      uIntensity: { value: intensity },
      uWarm: { value: new THREE.Color(HEX.champagne) },
      uCool: { value: new THREE.Color(HEX.ice) },
    }),
    [intensity],
  );

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    // Read the store non-reactively — a subscribed selector here would
    // re-render this component every frame (brief §5).
    const s = readScene();
    m.uniforms.uTime.value += delta;
    m.uniforms.uScroll.value = s.scroll;
    m.uniforms.uDispersion.value = s.dispersion;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]}>
      <planeGeometry args={[14, 14, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        args={[
          {
            uniforms,
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          },
        ]}
      />
    </mesh>
  );
}
