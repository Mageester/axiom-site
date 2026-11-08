/**
 * One fragment shader draws the whole ring. The stone is traced exactly: a ray enters the
 * convex cut, then bounces between facets, splitting at each one into the light that
 * escapes (Fresnel) and the light that reflects back in, with total internal reflection
 * past the critical angle. Red, green and blue each get their own refractive index, so
 * the colours part ways inside the stone and leave as fire. The claws and band are a
 * distance field, raymarched and lit by the same procedural studio.
 *
 * Everything is in the ring's own space; the studio stays put while the ring turns.
 */
import { RING_CY, RM } from './scene';

export const PLANES = 73;
const f = (n: number) => n.toFixed(4);

export const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export const FRAG = `#version 300 es
precision highp float;
out vec4 o;

#define NP ${PLANES}
uniform vec4 u_pl[NP];
uniform vec2 u_res;
uniform vec2 u_center;
uniform float u_scale;
uniform float u_focal;
uniform vec3 u_eye;
uniform vec3 u_cr;
uniform vec3 u_cu;
uniform vec3 u_cf;
uniform mat3 u_rot;
uniform vec3 u_metal;
uniform float u_rough;
uniform vec3 u_ior;
uniform vec3 u_absorb;
uniform float u_stoneGlow;
uniform int u_bounces;
uniform int u_paths;
uniform float u_alpha;
uniform float u_exposure;

const vec3 RING_C = vec3(0.0, ${f(RING_CY)}, 0.0);
const float RM = ${f(RM)};

/* ---------------- The studio ---------------- */
float softbox(vec3 d, vec3 c, vec2 size, float soft) {
  float k = dot(d, c);
  if (k <= 0.0) return 0.0;
  vec3 u = normalize(cross(c, vec3(0.0, 1.0, 0.0001)));
  vec3 v = cross(u, c);
  vec3 q = d / k;
  vec2 e = abs(vec2(dot(q, u), dot(q, v))) - size;
  float m = max(e.x, e.y);
  float inner = 1.0 - smoothstep(-soft, soft, m);
  // Brighter toward the middle, like real diffusion fabric.
  float fall = 1.0 - 0.35 * clamp(length(vec2(dot(q, u), dot(q, v)) / size) * 0.7, 0.0, 1.0);
  return inner * fall;
}

float spot(vec3 d, vec3 c, float r) {
  float k = dot(d, c);
  return smoothstep(1.0 - r * r * 0.5, 1.0 - r * r * 0.12, k);
}

vec3 studio(vec3 d, float soft) {
  float y = d.y;
  // A dark cyclorama: warm, faint, a little lighter at the horizon behind the ring.
  vec3 col = mix(vec3(0.006, 0.005, 0.0045), vec3(0.05, 0.043, 0.036), smoothstep(-0.25, 0.35, y));
  col *= 1.0 - 0.6 * smoothstep(0.45, 0.95, y);
  col += vec3(0.018, 0.015, 0.012) * smoothstep(-0.1, -0.6, y);

  float s = 0.02 + soft;
  // Overhead softbox.
  col += vec3(2.4, 2.3, 2.15) * softbox(d, normalize(vec3(0.05, 1.0, 0.28)), vec2(0.62, 0.42), s);
  // Two tall strips either side of the camera: the main brilliance.
  col += vec3(5.2, 4.9, 4.5) * softbox(d, normalize(vec3(-0.78, 0.30, 0.62)), vec2(0.09, 0.55), s);
  col += vec3(4.2, 4.2, 4.3) * softbox(d, normalize(vec3(0.82, 0.22, 0.48)), vec2(0.07, 0.5), s);
  // A rim light behind, low and wide.
  col += vec3(3.0, 2.85, 2.6) * softbox(d, normalize(vec3(-0.15, 0.18, -1.0)), vec2(0.7, 0.05), s);
  // A warm bounce card low on the right.
  col += vec3(0.75, 0.55, 0.36) * softbox(d, normalize(vec3(0.9, -0.15, -0.3)), vec2(0.35, 0.25), s + 0.08);

  // Small hard lights: the sources of sparkle and fire.
  float r = 0.02 + soft * 0.6;
  float sp = 0.0;
  sp += spot(d, normalize(vec3(-0.35, 0.82, 0.45)), r);
  sp += spot(d, normalize(vec3(0.42, 0.78, 0.40)), r);
  sp += spot(d, normalize(vec3(0.05, 0.62, 0.78)), r * 0.8);
  sp += spot(d, normalize(vec3(-0.62, 0.55, -0.55)), r);
  sp += spot(d, normalize(vec3(0.66, 0.58, -0.45)), r);
  sp += spot(d, normalize(vec3(-0.18, 0.92, -0.32)), r * 0.9);
  sp += spot(d, normalize(vec3(0.25, 0.45, 0.86)), r * 0.7);
  sp += spot(d, normalize(vec3(-0.5, 0.35, 0.79)), r * 0.7);
  sp += spot(d, normalize(vec3(0.9, 0.42, 0.05)), r);
  sp += spot(d, normalize(vec3(-0.92, 0.38, 0.0)), r);
  sp += spot(d, normalize(vec3(0.3, 0.95, -0.05)), r * 0.8);
  sp += spot(d, normalize(vec3(-0.25, 0.7, 0.66)), r * 0.7);
  sp += spot(d, normalize(vec3(0.58, 0.3, 0.75)), r * 0.8);
  sp += spot(d, normalize(vec3(-0.75, 0.62, 0.2)), r * 0.8);
  sp += spot(d, normalize(vec3(0.1, 0.4, -0.92)), r);
  sp += spot(d, normalize(vec3(0.72, 0.68, 0.12)), r * 0.7);
  col += vec3(30.0, 29.0, 27.0) * sp * max(0.0, 1.0 - soft * 3.0);

  // The viewer's own head blocks the light straight behind the camera.
  float head = smoothstep(0.93, 0.985, dot(d, normalize(vec3(0.0, 0.42, 0.91))));
  col *= 1.0 - 0.85 * head;
  return col;
}

vec3 world(vec3 d) { return u_rot * d; }
vec3 env(vec3 d) { return studio(world(d), 0.0); }

/* ---------------- The stone ---------------- */
bool gemHit(vec3 ro, vec3 rd, out float tHit, out vec3 nHit) {
  float tn = -1e9;
  float tf = 1e9;
  vec3 nn = vec3(0.0, 1.0, 0.0);
  for (int i = 0; i < NP; i++) {
    vec4 pl = u_pl[i];
    float dn = dot(pl.xyz, rd);
    float dist = pl.w - dot(pl.xyz, ro);
    if (abs(dn) < 1e-7) {
      if (dist < 0.0) return false;
      continue;
    }
    float t = dist / dn;
    if (dn < 0.0) {
      if (t > tn) { tn = t; nn = pl.xyz; }
    } else {
      tf = min(tf, t);
    }
  }
  if (tn > tf || tf < 0.0 || tn < 0.0) return false;
  tHit = tn;
  nHit = nn;
  return true;
}

float fresnel(float ci, float ct, float n1, float n2) {
  float rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct);
  float rp = (n1 * ct - n2 * ci) / (n1 * ct + n2 * ci);
  return clamp(0.5 * (rs * rs + rp * rp), 0.0, 1.0);
}

// Light that has entered the stone: bounce until it leaves or we stop counting.
// Fast mode follows one path and splits the colours only where light leaves.
vec3 inside(vec3 p, vec3 d, float ior, bool fast) {
  vec3 col = vec3(0.0);
  vec3 thr = vec3(1.0);
  for (int b = 0; b < 8; b++) {
    if (b >= u_bounces) break;
    float tmin = 1e9;
    vec3 n = vec3(0.0, 1.0, 0.0);
    for (int i = 0; i < NP; i++) {
      vec4 pl = u_pl[i];
      float dn = dot(pl.xyz, d);
      if (dn > 1e-6) {
        float t = (pl.w - dot(pl.xyz, p)) / dn;
        if (t < tmin) { tmin = t; n = pl.xyz; }
      }
    }
    if (tmin > 1e8) break;
    tmin = max(tmin, 0.0);
    p += d * tmin;
    thr *= exp(-u_absorb * tmin);
    float ci = dot(d, n);
    vec3 refl = d - 2.0 * ci * n;
    vec3 t = refract(d, -n, ior);
    if (dot(t, t) < 1e-6) {
      d = refl;
      continue;
    }
    float ct = dot(t, n);
    float F = fresnel(ci, ct, ior, 1.0);
    if (fast) {
      vec3 tr = refract(d, -n, u_ior.r);
      vec3 tb = refract(d, -n, u_ior.b);
      vec3 er = dot(tr, tr) > 1e-6 ? env(tr) : env(refl);
      vec3 eg = env(t);
      vec3 eb = dot(tb, tb) > 1e-6 ? env(tb) : env(refl);
      col += thr * (1.0 - F) * vec3(er.r, eg.g, eb.b);
    } else {
      col += thr * (1.0 - F) * env(t);
    }
    thr *= F;
    d = refl;
  }
  // Whatever is still bouncing leaves the way it is heading.
  col += thr * env(d) * 0.7;
  return col;
}

vec3 shadeGem(vec3 ro, vec3 rd, float tHit, vec3 n) {
  vec3 p = ro + rd * tHit;
  float ci = clamp(-dot(rd, n), 0.0, 1.0);
  vec3 col = vec3(0.0);
  float mid = u_ior.g;
  vec3 tg = refract(rd, n, 1.0 / mid);
  float F = fresnel(ci, -dot(tg, n), 1.0, mid);
  col += F * env(reflect(rd, n));
  if (u_paths >= 3) {
    for (int c = 0; c < 3; c++) {
      float ior = u_ior[c];
      vec3 t = refract(rd, n, 1.0 / ior);
      vec3 inner = inside(p - n * 1e-4, t, ior, false);
      col[c] += (1.0 - F) * inner[c];
    }
  } else {
    col += (1.0 - F) * inside(p - n * 1e-4, tg, mid, true);
  }
  // Coloured stones glow a little with their own body colour.
  col += u_stoneGlow * exp(-u_absorb * 1.4) * 0.09;
  return col;
}

/* ---------------- The setting ---------------- */
float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

float capsule(vec3 p, vec3 a, vec3 b, float ra, float rb) {
  vec3 pa = p - a;
  vec3 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}

float band(vec3 p) {
  vec3 q = p - RING_C;
  float r = length(q.xy);
  float top = q.y / max(r, 1e-4) * 0.5 + 0.5;
  top = top * top * top;
  float halfT = mix(0.13, 0.17, top);
  float halfW = mix(0.17, 0.235, top);
  vec2 s = vec2(r - RM, q.z);
  float rr = 0.11;
  vec2 dd = abs(s) - vec2(halfT, halfW) + rr;
  return length(max(dd, 0.0)) + min(max(dd.x, dd.y), 0.0) - rr;
}

float headBound(vec3 p) {
  return max(length(p.xz) - 1.24, abs(p.y + 0.42) - 0.7);
}

float head(vec3 p) {
  float rail = length(vec2(length(p.xz) - 0.69, p.y + 0.43)) - 0.042;
  float seat = length(vec2(length(p.xz) - 0.40, p.y + 0.80)) - 0.05;
  float sector = 6.2831853 / 6.0;
  float a = atan(p.z, p.x) - sector * 0.5;
  float an = floor(a / sector + 0.5) * sector + sector * 0.5;
  vec2 cs = vec2(cos(an), sin(an));
  vec3 q = vec3(p.x * cs.x + p.z * cs.y, p.y, -p.x * cs.y + p.z * cs.x);
  float d1 = capsule(q, vec3(0.30, -0.98, 0.0), vec3(1.052, 0.02, 0.0), 0.07, 0.058);
  float d2 = capsule(q, vec3(1.052, 0.02, 0.0), vec3(0.95, 0.105, 0.0), 0.058, 0.056);
  float prong = smin(d1, d2, 0.04);
  return smin(smin(prong, rail, 0.06), seat, 0.08);
}

float metal(vec3 p) {
  float b = band(p);
  // Outside its bounding cylinder the head is at least 0.12 away, so there is nothing to blend.
  float c = headBound(p);
  if (c > 0.05) return min(b, c + 0.07);
  return smin(b, head(p), 0.12);
}

vec3 metalNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  const float h = 0.0015;
  return normalize(
    k.xyy * metal(p + k.xyy * h) +
    k.yyx * metal(p + k.yyx * h) +
    k.yxy * metal(p + k.yxy * h) +
    k.xxx * metal(p + k.xxx * h)
  );
}

float occlusion(vec3 p, vec3 n) {
  float occ = 0.0;
  float w = 1.0;
  for (int i = 1; i <= 4; i++) {
    float h = 0.03 + 0.07 * float(i);
    occ += (h - metal(p + n * h)) * w;
    w *= 0.7;
  }
  return clamp(1.0 - occ * 2.2, 0.35, 1.0);
}

vec3 shadeMetal(vec3 p, vec3 rd) {
  vec3 n = metalNormal(p);
  vec3 r = reflect(rd, n);
  float c = clamp(dot(-rd, n), 0.0, 1.0);
  vec3 F = u_metal + (1.0 - u_metal) * pow(1.0 - c, 5.0);
  vec3 rw = world(r);
  vec3 e = studio(rw, u_rough);
  // A broad, dim fill so polished metal shows its colour, not only its highlights.
  e += vec3(0.16, 0.15, 0.14) * smoothstep(-0.6, 0.8, rw.y) + vec3(0.05);
  // Light that passes through the stone lands on the claws as a faint warm glow.
  float nearStone = smoothstep(1.3, 0.9, length(p.xz)) * smoothstep(-1.1, 0.0, p.y);
  e += nearStone * 0.08;
  return F * e * occlusion(p, n);
}

/* ---------------- Tone ---------------- */
vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_center) / u_scale;
  vec3 rdW = normalize(u_cr * uv.x + u_cu * uv.y + u_cf * u_focal);
  // Into the ring's own space.
  vec3 ro = u_eye * u_rot;
  vec3 rd = rdW * u_rot;

  // A loose sphere around the whole ring: everything else is clear.
  vec3 bc = vec3(0.0, ${f((0.34 + RING_CY - RM - 0.14) / 2)}, 0.0);
  vec3 oc = ro - bc;
  float bb = dot(oc, rd);
  float cc = dot(oc, oc) - ${f(Math.hypot(1.15, (0.34 - (RING_CY - RM - 0.14)) / 2) + 0.06)} * ${f(Math.hypot(1.15, (0.34 - (RING_CY - RM - 0.14)) / 2) + 0.06)};
  float disc = bb * bb - cc;
  if (disc < 0.0) { o = vec4(0.0); return; }
  float sq = sqrt(disc);
  float t0 = max(-bb - sq, 0.0);
  float t1 = -bb + sq;

  float tg = 1e9;
  vec3 ng;
  bool gem = gemHit(ro, rd, tg, ng);
  float tEnd = gem ? min(tg, t1) : t1;

  float t = t0;
  bool hit = false;
  float pix = 1.0 / (u_scale * u_focal);
  float edge = 1e9;
  float tEdge = t;
  for (int i = 0; i < 110; i++) {
    float d = metal(ro + rd * t);
    float e = d / (t * pix);
    if (e < edge) { edge = e; tEdge = t; }
    if (d < 0.2 * t * pix) { hit = true; break; }
    t += d * 0.92;
    if (t > tEnd) break;
  }

  vec3 col;
  float alpha;
  if (hit) {
    col = shadeMetal(ro + rd * t, rd);
    alpha = 1.0;
  } else if (gem) {
    col = shadeGem(ro, rd, tg, ng);
    alpha = 1.0;
  } else {
    col = vec3(0.0);
    alpha = 0.0;
    // Soften the metal's outline over about a pixel.
    float a = clamp(1.0 - edge * 0.9, 0.0, 1.0);
    if (a > 0.0) {
      col = shadeMetal(ro + rd * tEdge, rd);
      alpha = a;
    }
  }
  col = aces(col * u_exposure);
  col = pow(col, vec3(1.0 / 2.2));
  alpha *= u_alpha;
  o = vec4(col * alpha, alpha);
}`;
