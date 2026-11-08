/**
 * The still ring, drawn at build time from the same cut, camera and framing as the live
 * render: shown without JavaScript, with reduced motion, and while the shader warms up.
 * Colours come from CSS custom properties, so choosing a metal or stone recolours it,
 * even with JavaScript off.
 */
import { brilliant, facets, type Vec3 } from './geometry';
import { DIST, ELEV, RING_CY, RM, START_YAW, type Framing } from './scene';

const V = 1000;
const norm = (v: Vec3): Vec3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const n1 = (v: number) => v.toFixed(1);

export function standinSvg(FRAMING: Framing, id: string) {
  const yaw = START_YAW;
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const turn = (p: Vec3): Vec3 => [cy * p[0] + sy * p[2], p[1], -sy * p[0] + cy * p[2]];

  const eye: Vec3 = [0, DIST * Math.sin(ELEV), DIST * Math.cos(ELEV)];
  const cf = norm([-eye[0], -eye[1], -eye[2]]);
  const cr = norm(cross(cf, [0, 1, 0]));
  const cu = cross(cr, cf);
  const focal = DIST / FRAMING.units;
  const ox = V / 2 + FRAMING.ox * V;
  const oy = V / 2 + FRAMING.oy * V;
  const project = (p: Vec3) => {
    const w = turn(p);
    const rel: Vec3 = [w[0] - eye[0], w[1] - eye[1], w[2] - eye[2]];
    const z = dot(rel, cf);
    return { x: ox + (dot(rel, cr) / z) * focal * V, y: oy - (dot(rel, cu) / z) * focal * V, z };
  };
  const unit = focal * V / DIST;
  const path = (pts: { x: number; y: number }[], close = false) =>
    'M' + pts.map((p) => `${n1(p.x)} ${n1(p.y)}`).join('L') + (close ? 'Z' : '');

  const parts: string[] = [];

  // A soft pool of light behind the stone.
  const gemCentre = project([0, 0, 0]);
  parts.push(`<circle class="si-glow" cx="${n1(gemCentre.x)}" cy="${n1(gemCentre.y)}" r="${n1(unit * 2.6)}" fill="url(#si-glow-${id})"/>`);

  // The band, as layered strokes: shadow, body, a highlight near the outer edge.
  const loop = (radius: number, z = 0) =>
    Array.from({ length: 121 }, (_, i) => {
      const a = (i / 120) * Math.PI * 2;
      return project([radius * Math.sin(a), RING_CY + radius * Math.cos(a), z]);
    });
  const width = unit * 0.42;
  parts.push(`<path class="si-band-shadow" d="${path(loop(RM))}" stroke-width="${n1(width + 4)}"/>`);
  parts.push(`<path class="si-band" d="${path(loop(RM))}" stroke="url(#si-metal-${id})" stroke-width="${n1(width)}"/>`);
  parts.push(`<path class="si-band-lo" d="${path(loop(RM - 0.11, -0.06))}" stroke-width="${n1(width * 0.22)}"/>`);
  parts.push(`<path class="si-band-hi" d="${path(loop(RM + 0.1, 0.05))}" stroke-width="${n1(width * 0.16)}"/>`);

  // Claws and the rail that holds them: round wires that rise past the girdle and bend over
  // the crown, each ending in a small polished bead.
  const prongs = Array.from({ length: 6 }, (_, k) => {
    const a = (k + 0.5) * (Math.PI / 3);
    const at = (r: number, y: number): Vec3 => [r * Math.cos(a), y, r * Math.sin(a)];
    const [base, mid, rise, bend, tip] = [at(0.34, -0.93), at(0.9, -0.38), at(1.045, 0.0), at(1.05, 0.07), at(0.97, 0.095)].map(project);
    const d = `M${n1(base.x)} ${n1(base.y)}Q${n1(mid.x)} ${n1(mid.y)} ${n1(rise.x)} ${n1(rise.y)}Q${n1(bend.x)} ${n1(bend.y)} ${n1(tip.x)} ${n1(tip.y)}`;
    return { d, tip, z: project(at(1.05, 0)).z };
  });
  const rail = Array.from({ length: 49 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    return project([0.69 * Math.cos(a), -0.43, 0.69 * Math.sin(a)]);
  });
  const wire = unit * 0.11;
  const prongSvg = (p: (typeof prongs)[number]) =>
    `<path class="si-prong-shadow" d="${p.d}" stroke-width="${n1(wire + 3)}"/>` +
    `<path class="si-prong" d="${p.d}" stroke="url(#si-metal-${id})" stroke-width="${n1(wire)}"/>` +
    `<path class="si-prong-hi" d="${p.d}" stroke-width="${n1(wire * 0.28)}" transform="translate(${n1(-wire * 0.22)} ${n1(-wire * 0.08)})"/>` +
    `<circle class="si-bead" cx="${n1(p.tip.x)}" cy="${n1(p.tip.y)}" r="${n1(wire * 0.68)}" fill="url(#si-bead-${id})"/>`;
  parts.push(`<path class="si-rail" d="${path(rail, true)}" stroke-width="${n1(unit * 0.085)}"/>`);
  const centreZ = gemCentre.z;
  prongs.filter((p) => p.z > centreZ).forEach((p) => parts.push(prongSvg(p)));

  // The stone: the far side first, seen through the crown, then the near facets over it.
  const cut = facets(brilliant()).filter((f) => f.poly.length >= 3);
  const shade = (n: Vec3, salt: number) => {
    const h = Math.sin(n[0] * 12.9898 + n[1] * 78.233 + n[2] * 37.719 + salt) * 43758.5453;
    return h - Math.floor(h);
  };
  const back: string[] = [];
  const front: string[] = [];
  for (const f of cut) {
    const nw = turn(f.plane.n);
    const c = f.poly.reduce<Vec3>((s, p) => [s[0] + p[0] / f.poly.length, s[1] + p[1] / f.poly.length, s[2] + p[2] / f.poly.length], [0, 0, 0]);
    const cw = turn(c);
    const toEye = norm([eye[0] - cw[0], eye[1] - cw[1], eye[2] - cw[2]]);
    const facing = dot(nw, toEye);
    const d = path(f.poly.map(project), true);
    const h = shade(f.plane.n, 0.37);
    if (facing <= 0) {
      const cls = h < 0.3 ? 'g0' : h < 0.55 ? 'g1' : h < 0.8 ? 'g2' : h < 0.9 ? 'g3' : h < 0.95 ? 'f1' : 'f2';
      back.push(`<path class="${cls}" d="${d}"/>`);
    } else {
      // Facets that catch the overhead light or the side strips read brightest.
      const r: Vec3 = [-toEye[0] + 2 * facing * nw[0], -toEye[1] + 2 * facing * nw[1], -toEye[2] + 2 * facing * nw[2]];
      const lit = Math.max(r[1] * 0.9, dot(r, norm([-0.78, 0.3, 0.62])), dot(r, norm([0.82, 0.22, 0.48])));
      const k = h * 0.6 + lit * 0.5;
      const cls = f.plane.kind === 'girdle' ? 'gd' : k > 0.85 ? 'g3' : k > 0.62 ? 'g2' : k > 0.42 ? 'g1' : k > 0.36 ? 'f3' : 'g0';
      front.push(`<path class="c ${cls}" d="${d}"/>`);
    }
  }
  parts.push(`<g class="si-back">${back.join('')}</g>`);
  parts.push(`<g class="si-front">${front.join('')}</g>`);

  prongs.filter((p) => p.z <= centreZ).forEach((p) => parts.push(prongSvg(p)));

  // Two glints.
  const star = (x: number, y: number, s: number) =>
    `<g class="si-star" transform="translate(${n1(x)} ${n1(y)}) scale(${s})"><path d="M0 -40 L3 -3 L40 0 L3 3 L0 40 L-3 3 L-40 0 L-3 -3Z"/><circle r="5"/></g>`;
  const g1 = project([-0.42, 0.33, 0.18]);
  const g2 = project([0.62, 0.2, -0.35]);
  parts.push(star(g1.x, g1.y, 1.1), star(g2.x, g2.y, 0.7));

  return `<svg viewBox="0 0 ${V} ${V}" preserveAspectRatio="xMidYMid meet" focusable="false" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialGradient id="si-glow-${id}"><stop offset="0" stop-color="var(--glow, #fff)" stop-opacity="0.16"/><stop offset="1" stop-color="var(--glow, #fff)" stop-opacity="0"/></radialGradient>
<radialGradient id="si-bead-${id}" cx="0.36" cy="0.32" r="0.75"><stop offset="0" stop-color="var(--m3)"/><stop offset="0.45" stop-color="var(--m1)"/><stop offset="1" stop-color="var(--m0)"/></radialGradient>
<linearGradient id="si-metal-${id}" gradientUnits="userSpaceOnUse" x1="${n1(ox - unit * 2.6)}" y1="${n1(oy - unit)}" x2="${n1(ox + unit * 2.6)}" y2="${n1(oy + unit * 5)}"><stop offset="0" stop-color="var(--m2)"/><stop offset="0.35" stop-color="var(--m1)"/><stop offset="0.55" stop-color="var(--m0)"/><stop offset="0.8" stop-color="var(--m2)"/><stop offset="1" stop-color="var(--m1)"/></linearGradient>
</defs>
${parts.join('\n')}
</svg>`;
}
