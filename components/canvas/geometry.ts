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
 * 999 silver temple-form anklet (payal).
 *
 * An anklet is a RING worn round the ankle. The previous version revolved an
 * open bell curve about the axis, which produces a solid of revolution — it
 * read as a vessel, not jewellery, and contradicted its own copy.
 *
 * So: a closed cross-section swept at a radius, i.e. a torus. It is
 * distinguished from the gold kada by being a thin round wire rather than a
 * wide bevelled band, and by a periodic radial ripple around the circumference
 * — the temple-form scallop, and the hammer planes the craft note refuses to
 * polish out. The ripple has to be applied per-vertex after the lathe, because
 * LatheGeometry cannot vary a profile by angle.
 */
export function createAnkletGeometry(): THREE.BufferGeometry {
  const RING_RADIUS = 0.92;
  const WIRE = 0.055; // noticeably thinner than the kada's band

  // Closed, slightly flattened section — the face that sits against the ankle.
  const profile: THREE.Vector2[] = [];
  const sectionSteps = 18;
  for (let i = 0; i <= sectionSteps; i++) {
    const a = (i / sectionSteps) * Math.PI * 2;
    profile.push(
      new THREE.Vector2(RING_RADIUS + Math.cos(a) * WIRE, Math.sin(a) * WIRE * 0.78),
    );
  }

  const geo = new THREE.LatheGeometry(profile, 136);

  // Temple-form scallop + hammer irregularity, applied around the ring.
  // Deterministic, so the geometry is identical on every reload.
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const radial = Math.hypot(v.x, v.z);
    if (radial > 1e-6) {
      const theta = Math.atan2(v.z, v.x);
      const ripple = Math.sin(theta * 24) * 0.009 + Math.sin(theta * 8) * 0.005;
      const s = (radial + ripple) / radial;
      v.x *= s;
      v.z *= s;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
  }
  pos.needsUpdate = true;

  geo.rotateX(Math.PI / 2);
  geo.computeVertexNormals();
  geo.center();
  return geo;
}
