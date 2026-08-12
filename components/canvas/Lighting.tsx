'use client';

import { Environment, Lightformer } from '@react-three/drei';
import { HEX } from '@/lib/tokens';

/**
 * The whole illusion is the environment map (brief §3).
 *
 * No HDRI is downloaded — this is a procedural studio built from Lightformer
 * rects, which is both lighter and more controllable. Deliberately NO
 * ambientLight: an ambient term at 0.5 is exactly what makes metal look like
 * grey plastic, because it fills the areas that should be reading reflected
 * environment instead.
 *
 * Rig: one large key softbox, two narrow rim strips, one warm bounce card.
 */
export function Lighting({ reduced = false }: { reduced?: boolean }) {
  return (
    <>
      <Environment resolution={reduced ? 128 : 256} frames={1}>
        {/* Ground of the environment itself — cold, dark, so reflections have
            somewhere dark to fall off into. */}
        <color attach="background" args={[HEX.vitrine]} />

        {/* Key: large soft box, high and slightly camera-left.
            Intensity is deliberately high against the near-black environment
            ground: a transmissive stone can only refract CONTRAST. A flatly lit
            environment is what makes a diamond read as grey plastic — there is
            nothing bright for the facets to bend into the eye. */}
        <Lightformer
          form="rect"
          intensity={14}
          position={[-2.4, 3.2, 2.2]}
          rotation={[-Math.PI / 3.2, 0, 0]}
          scale={[7, 5, 1]}
          color="#ffffff"
        />

        {/* Rim strips: narrow and bright. These are what draw the hard edge
            highlights along the girdle and the kada's bevel. */}
        <Lightformer
          form="rect"
          intensity={18}
          position={[3.4, 0.6, -1.6]}
          rotation={[0, -Math.PI / 2.4, 0]}
          scale={[0.35, 4, 1]}
          color="#dceaf6"
        />
        {!reduced && (
          <Lightformer
            form="rect"
            intensity={13}
            position={[-3.2, -0.4, -1.9]}
            rotation={[0, Math.PI / 2.4, 0]}
            scale={[0.3, 3.4, 1]}
            color="#ffffff"
          />
        )}

        {/* Warm bounce card, low and in front — gives the gold somewhere warm
            to pick up so it does not go green in the shadow side. */}
        <Lightformer
          form="rect"
          intensity={2.1}
          position={[0.8, -2.1, 2.4]}
          rotation={[Math.PI / 2.6, 0, 0]}
          scale={[5, 2.6, 1]}
          color="#f3ddb6"
        />

        {!reduced && (
          <Lightformer
            form="ring"
            intensity={1.6}
            position={[0, 2.4, -3]}
            scale={2.4}
            color="#bcd7ea"
          />
        )}
      </Environment>

      {/* A hard spot so the caustic has a source to read against. Shadows are
          off — the caustic pass carries the floor, and a shadow map here would
          cost more than it adds on a dark ground. */}
      <spotLight
        position={[-2.2, 4.4, 2.6]}
        angle={0.44}
        penumbra={0.72}
        intensity={reduced ? 22 : 38}
        distance={16}
        color="#ffffff"
      />
    </>
  );
}
