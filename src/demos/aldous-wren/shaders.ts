/**
 * GLSL for the ink-in-water simulation: stable fluids (advection, vorticity, divergence,
 * Jacobi pressure, projection) plus a dye pass that keeps two pigments, a dense carbon
 * core and a wider, slower "stain" that bleeds around it like sumi ink in wet paper.
 */
export const VERT = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 o;
`;

export const NOISE = `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 5; i++) {
    s += a * vnoise(p);
    p = p * 2.03 + vec2(17.1, 9.7);
    a *= 0.5;
  }
  return s;
}
`;

export const CLEAR = `${HEAD}
uniform sampler2D uTex;
uniform float uValue;
void main() { o = texture(uTex, vUv) * uValue; }`;

export const SPLAT = `${HEAD}
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec4 uAmount;
uniform float uRadius;
uniform float uAspect;
uniform float uSeed;
uniform float uEdge;
uniform float uDisc;
void main() {
  vec2 p = vUv - uPoint;
  p.x *= uAspect;
  float r = length(p);
  float a = atan(p.y, p.x);
  float irr = 1.0 + uEdge * (0.22 * sin(a * 3.0 + uSeed) + 0.15 * sin(a * 5.0 + uSeed * 2.3) + 0.08 * sin(a * 9.0 + uSeed * 4.1));
  float t = r / (uRadius * irr);
  float prof = mix(exp(-t * t * 3.0), smoothstep(1.0, 0.4, t), uDisc);
  o = texture(uTarget, vUv) + uAmount * prof;
}`;

export const ADVECT = `${HEAD}
uniform sampler2D uVel;
uniform sampler2D uSrc;
uniform vec2 uTexel;
uniform float uDt;
uniform float uDecay;
void main() {
  vec2 coord = vUv - uDt * texture(uVel, vUv).xy * uTexel;
  o = texture(uSrc, coord) * uDecay;
}`;

export const ADVECT_DYE = `${HEAD}
uniform sampler2D uVel;
uniform sampler2D uDye;
uniform sampler2D uAvoid;
uniform vec2 uTexel;
uniform vec2 uDyeTexel;
uniform float uDt;
uniform float uDecay;
uniform float uStainDecay;
uniform float uBleed;
uniform float uSpread;
uniform float uShift;
uniform float uAvoidK;
uniform float uRDiff;
void main() {
  vec2 coord = vUv - uDt * texture(uVel, vUv).xy * uTexel;
  vec4 c = texture(uDye, coord);
  vec2 e = uDyeTexel * uSpread;
  float s = texture(uDye, coord + vec2(e.x, 0.0)).g + texture(uDye, coord - vec2(e.x, 0.0)).g
          + texture(uDye, coord + vec2(0.0, e.y)).g + texture(uDye, coord - vec2(0.0, e.y)).g;
  s = mix(c.g, s * 0.25, 0.85);
  s += c.r * uDt * uBleed;
  vec2 q = vec2(vUv.x, vUv.y - uShift);
  float av = 0.0;
  if (q.y > 0.0 && q.y < 1.0) { vec2 a = texture(uAvoid, q).rg; av = max(a.x, a.y); }
  float k = exp(-uDt * av * uAvoidK);
  float rn = texture(uDye, coord + vec2(e.x, 0.0)).r + texture(uDye, coord - vec2(e.x, 0.0)).r
           + texture(uDye, coord + vec2(0.0, e.y)).r + texture(uDye, coord - vec2(0.0, e.y)).r;
  float r = mix(c.r, rn * 0.25, uRDiff);
  o = vec4(r * uDecay * k, min(s, 3.0) * uStainDecay * k, 0.0, 1.0);
}`;

export const FORCES = `${HEAD}
uniform sampler2D uVel;
uniform sampler2D uDye;
uniform sampler2D uAvoid;
uniform float uDt;
uniform float uTime;
uniform float uGravity;
uniform float uAmbient;
uniform float uScrollV;
uniform float uAspect;
uniform float uShift;
uniform float uDamp;
vec2 stream(vec2 p, float t) {
  float a1 = p.x * 1.3 + t * 0.21;
  float b1 = p.y * 1.1 - t * 0.17;
  float a2 = p.x * 2.6 - t * 0.13 + 1.7;
  float b2 = p.y * 2.2 + t * 0.11 + 0.6;
  float dx = 1.3 * cos(a1) * sin(b1) + 1.3 * cos(a2) * sin(b2);
  float dy = 1.1 * sin(a1) * cos(b1) + 1.1 * sin(a2) * cos(b2);
  return vec2(dy, -dx);
}
void main() {
  vec2 v = texture(uVel, vUv).xy;
  float d = texture(uDye, vUv).r;
  v.y -= uGravity * d * uDt;
  v += uAmbient * stream(vUv * vec2(uAspect, 1.0) * 3.0, uTime) * uDt;
  v.y += uScrollV * uDt * (0.55 + 0.45 * sin(vUv.x * 9.0 + uTime * 0.7));
  vec2 q = vec2(vUv.x, vUv.y - uShift);
  float am = 0.0;
  if (q.y > 0.0 && q.y < 1.0) { vec2 a = texture(uAvoid, q).rg; am = max(a.x, a.y); }
  v *= exp(-uDt * am * uDamp);
  o = vec4(v, 0.0, 1.0);
}`;

export const CURL = `${HEAD}
uniform sampler2D uVel;
uniform vec2 uTexel;
void main() {
  float L = texture(uVel, vUv - vec2(uTexel.x, 0.0)).y;
  float R = texture(uVel, vUv + vec2(uTexel.x, 0.0)).y;
  float T = texture(uVel, vUv + vec2(0.0, uTexel.y)).x;
  float B = texture(uVel, vUv - vec2(0.0, uTexel.y)).x;
  o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`;

export const VORTICITY = `${HEAD}
uniform sampler2D uVel;
uniform sampler2D uCurl;
uniform vec2 uTexel;
uniform float uStrength;
uniform float uDt;
void main() {
  float L = texture(uCurl, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uCurl, vUv + vec2(uTexel.x, 0.0)).x;
  float T = texture(uCurl, vUv + vec2(0.0, uTexel.y)).x;
  float B = texture(uCurl, vUv - vec2(0.0, uTexel.y)).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= uStrength * C;
  force.y *= -1.0;
  vec2 v = texture(uVel, vUv).xy + force * uDt;
  o = vec4(clamp(v, -600.0, 600.0), 0.0, 1.0);
}`;

export const DIVERGENCE = `${HEAD}
uniform sampler2D uVel;
uniform vec2 uTexel;
void main() {
  vec2 vL = vUv - vec2(uTexel.x, 0.0);
  vec2 vR = vUv + vec2(uTexel.x, 0.0);
  vec2 vT = vUv + vec2(0.0, uTexel.y);
  vec2 vB = vUv - vec2(0.0, uTexel.y);
  vec2 C = texture(uVel, vUv).xy;
  float L = texture(uVel, vL).x;
  float R = texture(uVel, vR).x;
  float T = texture(uVel, vT).y;
  float B = texture(uVel, vB).y;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`;

export const PRESSURE = `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
void main() {
  float L = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float T = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  float B = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float div = texture(uDivergence, vUv).x;
  o = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
}`;

export const GRADIENT = `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uVel;
uniform vec2 uTexel;
void main() {
  float L = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float T = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  float B = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  vec2 v = texture(uVel, vUv).xy - vec2(R - L, T - B);
  o = vec4(v, 0.0, 1.0);
}`;

/**
 * The final image. Ink darkens warm paper: a wide warm stain under a dense, slightly cool core.
 * `uFlood` is the page-wide colour change: an organic front of black climbs the screen, and
 * inside it the same dye shows as pale smoke.
 */
export const RENDER = `${HEAD}
${NOISE}
uniform sampler2D uDye;
uniform sampler2D uAvoid;
uniform vec2 uRes;
uniform float uTime;
uniform float uAspect;
uniform float uStrength;
uniform float uFlood;
uniform float uDark;
uniform float uShift;
uniform float uBigCap;
uniform vec2 uDyeSize;
uniform float uGain;

/* Cubic B-spline reconstruction in four bilinear taps: smooths the dye so dark edges lose their texel stair-steps. */
vec4 dyeSmooth(vec2 uv) {
  vec2 st = uv * uDyeSize - 0.5;
  vec2 i = floor(st);
  vec2 f = st - i;
  vec2 w0 = (1.0 - f) * (1.0 - f) * (1.0 - f) / 6.0;
  vec2 w1 = (3.0 * f * f * f - 6.0 * f * f + 4.0) / 6.0;
  vec2 w2 = (-3.0 * f * f * f + 3.0 * f * f + 3.0 * f + 1.0) / 6.0;
  vec2 w3 = f * f * f / 6.0;
  vec2 g0 = w0 + w1;
  vec2 g1 = w2 + w3;
  vec2 h0 = (i - 0.5 + w1 / g0) / uDyeSize;
  vec2 h1 = (i + 1.5 + w3 / g1 + 0.5) / uDyeSize;
  return g0.y * (g0.x * texture(uDye, vec2(h0.x, h0.y)) + g1.x * texture(uDye, vec2(h1.x, h0.y)))
       + g1.y * (g0.x * texture(uDye, vec2(h0.x, h1.y)) + g1.x * texture(uDye, vec2(h1.x, h1.y)));
}

vec3 avoidAt(vec2 uv) {
  vec2 q = vec2(uv.x, uv.y - uShift);
  vec3 a = vec3(0.0);
  if (q.y > 0.0 && q.y < 1.0) a.xy = texture(uAvoid, q).rg;
  a.z = texture(uAvoid, uv).b;
  return a;
}
float floodField(vec2 uv, float dyeD) {
  vec2 p = vec2(uv.x * uAspect, uv.y);
  float n = fbm(vec2(p.x * 2.1, p.y * 1.0) + vec2(0.0, uTime * 0.012));
  float m = fbm(p * 6.5 + vec2(3.1, -uTime * 0.04));
  return uv.y + (n - 0.5) * 0.95 + (m - 0.5) * 0.07 - dyeD * 0.32;
}
void main() {
  vec2 uv = vUv;
  vec4 dye = dyeSmooth(uv);
  vec3 av = avoidAt(uv);
  float cap = (1.0 - av.x * uBigCap) * (1.0 - av.y * 0.88) * (1.0 - av.z * 0.8);

  float dd = 1.0 - exp(-dye.r * uGain);
  float st = 1.0 - exp(-dye.g * 1.7);
  float aCore = smoothstep(0.03, 0.62, dd) * uStrength * cap;
  float aStain = st * uStrength * cap;

  vec3 paper = vec3(0.9529, 0.9412, 0.9098);
  vec3 ink = vec3(0.0549, 0.0549, 0.0627);
  vec3 coreMid = vec3(0.13, 0.14, 0.17);

  float fibre = fbm(uv * vec2(uAspect, 1.0) * 90.0);
  vec3 colP = paper * (1.0 + (fibre - 0.5) * 0.028);
  colP = mix(colP, colP * vec3(0.80, 0.69, 0.55), aStain * 0.85);
  vec3 core = mix(coreMid, ink, smoothstep(0.35, 0.85, dd));
  colP = mix(colP, core, clamp(aCore, 0.0, 1.0));

  float fm = 0.0;
  if (uFlood > 0.002) {
    float field = floodField(uv, dd);
    float thr = mix(-0.55, 1.62, uFlood);
    fm = 1.0 - smoothstep(thr - 0.06, thr + 0.06, field);
    fm = max(fm, smoothstep(0.955, 1.0, uFlood));
    float halo = smoothstep(thr + 0.28, thr, field) * (1.0 - fm);
    colP *= 1.0 - halo * 0.09;
  }
  float wisp = clamp(dd * 0.75 + st * 0.2, 0.0, 1.0) * uDark;
  vec3 colD = ink + (vec3(0.93, 0.91, 0.87) - ink) * wisp;
  vec3 col = mix(colP, colD, fm);

  col += (hash(gl_FragCoord.xy) - 0.5) * 0.014;
  o = vec4(col, 1.0);
}`;

/** The no-simulation fallback: a domain-warped noise ink, same palette, same flood. */
export const FALLBACK = `
${NOISE}
uniform float u_flood;
uniform float u_strength;
uniform vec4 u_text;
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 1.7;
  float t = u_time * 0.16;
  vec2 q = vec2(fbm(p + vec2(0.0, -t)), fbm(p + vec2(5.2, 1.3) + t * 0.6));
  float n = fbm(p + 2.4 * q + vec2(0.0, -t * 0.7));
  float plume = smoothstep(0.38, 0.78, n);
  float band = smoothstep(0.12, 0.85, uv.y) * smoothstep(0.05, 0.9, uv.x);
  vec2 pp = vec2((uv.x - u_pointer.x) * aspect, uv.y - u_pointer.y);
  float trail = exp(-dot(pp, pp) * 22.0) * 0.5;
  float dd = clamp(plume * band + trail, 0.0, 1.0);
  vec2 tm = smoothstep(u_text.xy - 0.2, u_text.xy + 0.04, uv) * (1.0 - smoothstep(u_text.zw - 0.04, u_text.zw + 0.2, uv));
  float cap = (1.0 - 0.68 * tm.x * tm.y) * (1.0 - 0.85 * smoothstep(0.88, 0.95, uv.y));
  float a = dd * u_strength * cap;
  vec3 paper = vec3(0.9529, 0.9412, 0.9098);
  vec3 ink = vec3(0.0549, 0.0549, 0.0627);
  vec3 colP = paper * (1.0 + (fbm(uv * vec2(aspect, 1.0) * 90.0) - 0.5) * 0.028);
  colP = mix(colP, colP * vec3(0.80, 0.69, 0.55), smoothstep(0.0, 0.7, a) * 0.5);
  colP = mix(colP, mix(vec3(0.19, 0.205, 0.245), ink, smoothstep(0.4, 1.0, dd)), clamp(a, 0.0, 1.0));
  float fm = 0.0;
  if (u_flood > 0.002) {
    float field = uv.y + (fbm(vec2(uv.x * aspect * 2.1, uv.y) + vec2(0.0, u_time * 0.012)) - 0.5) * 0.95 - dd * 0.3;
    float thr = mix(-0.55, 1.62, u_flood);
    fm = 1.0 - smoothstep(thr - 0.06, thr + 0.06, field);
    fm = max(fm, smoothstep(0.955, 1.0, u_flood));
  }
  vec3 colD = ink + (vec3(0.93, 0.91, 0.87) - ink) * dd * 0.2;
  vec3 col = mix(colP, colD, fm);
  col += (hash(gl_FragCoord.xy) - 0.5) * 0.014;
  o = vec4(col, 1.0);
}`;
