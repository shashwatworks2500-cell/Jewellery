import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

/**
 * Procedural geometry. There are no GLB assets in this project and none are
 * downloaded — every form here is constructed from first principles (brief §3).
 *
 * The governing constraint for the diamond: it must have HARD FLAT FACETS.
 * A smooth-shaded octahedron reads as a cheap glass blob. So we build the real
 * round-brilliant profile as a point cloud on the classic proportion rings and
 * take its convex hull — a cut diamond *is* a convex polyhedron, so the hull is
 * not an approximation of the shape, it is the shape. ConvexGeometry emits
 * non-indexed triangles, so computeVertexNormals() gives one normal per face:
 * hard facet edges, correct specular breakup, visible dispersion.
 */

/** Standard round-brilliant proportions, as fractions of the girdle diameter. */
const BRILLIANT = {
  girdleRadius: 1,
  /** Table 55% of diameter — within the 53–58% "excellent" band. */
  tableRadius: 0.55,
  /** Crown height 16.2% of diameter. */
  crownHeight: 0.324,
  /** Star facet break, between table edge and girdle. */
  starRadius: 0.78,
  starHeight: 0.2,
  girdleThickness: 0.042,
  /** Pavilion depth 43.1% of diameter. */
  pavilionDepth: 0.862,
  /** A real culet is a tiny facet, not a mathematical point. Leaving it as a
   *  point makes the pavilion converge into a shading singularity. */
  culetRadius: 0.022,
};

function ring(count: number, radius: number, y: number, phase = 0): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const a = phase + (i / count) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius));
  }
  return pts;
}

/**
 * Round brilliant. 8-fold table, 16-fold girdle — the hull resolves these into
 * bezel (kite), star, upper-girdle, pavilion-main and lower-girdle facets.
 */
export function createBrilliantGeometry(): THREE.BufferGeometry {
  const B = BRILLIANT;
  const halfGirdle = B.girdleThickness / 2;

  const points: THREE.Vector3[] = [
    // Table — octagonal, the flat top.
    ...ring(8, B.tableRadius, B.crownHeight),
    // Star break — 8 points aligned with table corners, pulling the kite
    // facets into existence rather than one continuous cone.
    ...ring(8, B.starRadius, B.starHeight, Math.PI / 8),
    // Girdle — 16 points, the widest circumference, given real thickness so
    // the crown and pavilion do not meet at a knife edge.
    ...ring(16, B.girdleRadius, halfGirdle),
    ...ring(16, B.girdleRadius, -halfGirdle),
    // Culet — small octagonal facet at the bottom.
    ...ring(8, B.culetRadius, -B.pavilionDepth),
  ];

  const geo = new ConvexGeometry(points);
  // Non-indexed + recomputed normals => one flat normal per triangle.
  geo.computeVertexNormals();
  geo.center();
  return geo;
}

/**
 * Gold bridal kada — a bangle. Swept torus with a bevelled outer edge rather
 * than a plain circular section, so the highlight breaks into two bands the way
 * a real raised (not cast) piece does.
 */
export function createKadaGeometry(): THREE.BufferGeometry {
  // Profile of the band's cross-section, revolved around the bangle axis.
  const profile: THREE.Vector2[] = [
    new THREE.Vector2(0.86, -0.075),
    new THREE.Vector2(0.95, -0.055),
    new THREE.Vector2(1.0, -0.02),
    new THREE.Vector2(1.0, 0.02),
    new THREE.Vector2(0.95, 0.055),
    new THREE.Vector2(0.86, 0.075),
    new THREE.Vector2(0.83, 0.05),
    // Inner face left flat — the brief's craft note says it is unpolished so
    // the piece sits without slipping.
    new THREE.Vector2(0.83, -0.05),
    new THREE.Vector2(0.86, -0.075),
  ];
  const geo = new THREE.LatheGeometry(profile, 128);
  geo.rotateX(Math.PI / 2);
  geo.computeVertexNormals();
  geo.center();
  return geo;
}

/**
 * 999 silver temple-form anklet. Lathed, with a deliberate irregularity in the
 * profile — the craft note says the tool mark is not corrected, so the silhouette
 * must not be perfectly regular or the material story is a lie.
 */
export function createAnkletGeometry(): THREE.BufferGeometry {
  const profile: THREE.Vector2[] = [];
  const steps = 26;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = (t - 0.5) * 1.5;
    // Base temple-bell curve.
    let r = 0.42 + Math.sin(t * Math.PI) * 0.32;
    // Hand-hammered irregularity: a low-frequency wobble, deterministic so the
    // geometry is stable across reloads.
    r += Math.sin(t * 13.7) * 0.012 + Math.sin(t * 31.3) * 0.006;
    profile.push(new THREE.Vector2(Math.max(r, 0.04), y));
  }
  // 48 segments, not 128 — the faceting from a coarser lathe reads as hammer
  // planes on silver, which is what we want here.
  const geo = new THREE.LatheGeometry(profile, 48);
  geo.computeVertexNormals();
  geo.center();
  return geo;
}
