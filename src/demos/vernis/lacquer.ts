/**
 * The lacquer: one fragment shader that draws thick, wet enamel filling the screen.
 *
 * The surface is a height field made of domain-warped fractal noise, so it flows in slow,
 * rolling folds instead of looking like clouds. Normals come from finite differences of that
 * field. Shading is a coloured body (deep in the pools, lighter where the film is thin, light
 * coming through the slopes) under a clear coat that reflects a small procedural studio:
 * a wide softbox, a vertical strip and a low bounce. Because the reflection is looked up
 * with the surface normal, the softbox slides and bends over every fold the way it does on
 * a real wet coat of polish.
 *
 * Other things the same height field carries:
 *  - the pointer: a slow bulge that follows it, and rings when it moves quickly or is pressed
 *  - the scroll: a brush stroke that drags the lacquer off the page, leaving a bead along its edge
 *  - the intro: the lacquer pours down from the top on load
 *  - the shade change: a noisy, expanding edge with a glossy lip, painting the new palette
 *    (and, when the hero is gone, the flat page colour) from the swatch outwards
 */
export const LACQUER = /* glsl */ `
uniform vec3 u_bgA; uniform vec3 u_deepA; uniform vec3 u_midA; uniform vec3 u_glowA;
uniform vec3 u_bgB; uniform vec3 u_deepB; uniform vec3 u_midB; uniform vec3 u_glowB;
uniform float u_flood;
uniform vec2 u_origin;
uniform float u_recede;
uniform float u_pour;
uniform vec2 u_ptr;
uniform float u_energy;
uniform vec3 u_drop;
uniform vec4 u_c0; uniform vec4 u_c1; uniform vec4 u_c2; uniform vec4 u_c3; uniform vec4 u_c4; uniform vec4 u_c5;
uniform vec4 u_calm4;

float aspect;
float fscale;

// 0 inside a rectangle where text sits, rising to 1 a short way outside it.
float calmAtW(vec2 uv, vec4 r, float w) {
  if (r.z <= 0.0) return 1.0;
  vec2 d = max(abs(uv - r.xy) - r.zw, 0.0) * vec2(aspect, 1.0);
  return smoothstep(0.0, w, length(d));
}
float calmAt(vec2 uv, vec4 r) { return calmAtW(uv, r, 0.07); }

float hash11(float p) { p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float vn1(float x) {
  float i = floor(x); float f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(hash11(i), hash11(i + 1.0), f);
}

float gnoise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 g00 = hash22(i) * 2.0 - 1.0;
  vec2 g10 = hash22(i + vec2(1.0, 0.0)) * 2.0 - 1.0;
  vec2 g01 = hash22(i + vec2(0.0, 1.0)) * 2.0 - 1.0;
  vec2 g11 = hash22(i + vec2(1.0, 1.0)) * 2.0 - 1.0;
  float n00 = dot(g00, f);
  float n10 = dot(g10, f - vec2(1.0, 0.0));
  float n01 = dot(g01, f - vec2(0.0, 1.0));
  float n11 = dot(g11, f - vec2(1.0, 1.0));
  return mix(mix(n00, n10, u.x), mix(n01, n11, u.x), u.y);
}

const mat2 ROT = mat2(0.8, -0.6, 0.6, 0.8);

float fbm3(vec2 p) {
  float s = 0.0; float a = 0.5;
  for (int i = 0; i < 3; i++) { s += a * gnoise(p); p = ROT * p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return s;
}
float fbm4(vec2 p) {
  float s = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * gnoise(p); p = ROT * p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return s;
}

// The poured field: slow, thick, folding.
float poured(vec2 p) {
  float t = u_time;
  vec2 s = p * 0.66 * fscale;
  vec2 q = vec2(fbm3(s + vec2(0.0, t * 0.05)), fbm3(s + vec2(5.2, 1.3) - vec2(t * 0.045, 0.0)));
  float h = fbm3(s * 0.9 + 2.2 * q + vec2(t * 0.02, -t * 0.03));
  return h * 3.0;
}

// Pointer: a slow bulge, rings that follow movement, and a ring per press.
float touch(vec2 p) {
  vec2 pp = vec2(u_ptr.x * aspect, u_ptr.y);
  float d = length(p - pp);
  float bulge = 0.42 * exp(-d * d * 7.5);
  float ring = u_energy * 0.05 * sin(d * 30.0 - u_time * 3.4) * exp(-d * 3.0) * smoothstep(0.0, 0.1, d);
  vec2 dp = vec2(u_drop.x * aspect, u_drop.y);
  float dd = length(p - dp);
  float age = u_drop.z;
  float front = age * 0.5;
  float drop = step(0.0, age) * 0.11 * sin((dd - front) * 26.0) * exp(-pow((dd - front) * 4.5, 2.0)) * exp(-age * 1.2);
  return bulge + ring + drop;
}

// Lacquer coverage: x > 0 means lacquer, thickness ramps up behind the edge.
// Returns (thickness 0..1, edge sharpness alpha)
vec2 coverage(vec2 p) {
  float thick = 1.0;

  // brush stroke: drags the lacquer away from left to right
  if (u_recede > 0.0005) {
    vec2 dir = normalize(vec2(1.0, 0.24));
    vec2 perp = vec2(-dir.y, dir.x);
    float s01 = dot(p, dir) / (aspect * dir.x + dir.y);
    float c = dot(p, perp);
    float bristle = gnoise(vec2(c * 1.7, 3.1)) * 0.6 + (vn1(c * 22.0 + 7.0) - 0.5) * 0.1 + (vn1(c * 90.0) - 0.5) * 0.05;
    float edge = mix(-0.4, 1.32, u_recede);
    float x = s01 - edge + bristle * 0.3;
    thick = min(thick, clamp(x / 0.2, 0.0, 1.0));
  }

  // the pour: lacquer comes down from the top with heavy lobes
  if (u_pour < 0.9995) {
    float s = 1.0 - p.y;
    float lobes = gnoise(vec2(p.x * 2.6, 1.3)) * 0.34 + gnoise(vec2(p.x * 7.0, 4.1)) * 0.07;
    float edge = mix(-0.42, 1.5, u_pour);
    float x = edge - s + lobes;
    thick = min(thick, clamp(x / 0.26, 0.0, 1.0));
  }
  return vec2(thick, thick);
}

// Shade change: signed distance inside the flood. > 0 is the new shade.
float floodX(vec2 p) {
  vec2 o = vec2(u_origin.x * aspect, u_origin.y);
  float maxR = max(max(length(o), length(o - vec2(aspect, 0.0))), max(length(o - vec2(0.0, 1.0)), length(o - vec2(aspect, 1.0)))) + 0.55;
  float R = u_flood * maxR;
  float d = length(p - o);
  float wob = fbm3(p * 2.1 + vec2(0.0, u_time * 0.12)) * 0.95 + gnoise(p * 6.0 + 4.0) * 0.07;
  return R - d + wob * 0.34 * min(1.0, R * 1.4);
}

float field(vec2 p) {
  vec2 cv = coverage(p);
  float tk = cv.x;
  float body = (poured(p) + touch(p)) * smoothstep(0.0, 0.7, tk);
  // the meniscus bead along any edge
  float bead = sqrt(max(1.0 - (1.0 - tk) * (1.0 - tk), 0.0));
  float h = body + 0.26 * bead;
  // the lip of the flood
  if (u_flood > 0.0005) {
    float x = floodX(p);
    float w = x < 0.03 ? 0.016 : 0.075;
    h += 0.3 * exp(-pow((x - 0.03) / w, 2.0)) * smoothstep(-0.05, 0.02, x);
  }
  return h;
}

float sdRB(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float AA;
float EY;
float lightBox(vec2 e, vec2 c, vec2 b, float r, float soft) { soft = max(soft, AA); return 1.0 - smoothstep(-soft, soft, sdRB(e - c, b, r)); }

// The studio: what the clear coat reflects. Looking straight on, it reflects a calm dark.
// Returns (softbox cores, broad halo).
vec2 studio(vec2 e) {
  float core = 0.0;
  core += lightBox(e, vec2(-0.32, 0.34), vec2(0.26, 0.12), 0.06, 0.012);
  core += 0.95 * lightBox(e, vec2(0.5, 0.0), vec2(0.055, 0.52), 0.055, 0.01);
  core += 0.9 * lightBox(e, vec2(0.0, -0.5), vec2(0.3, 0.04), 0.04, 0.01);
  core += 0.9 * lightBox(e, vec2(0.16, 0.56), vec2(0.045, 0.045), 0.045, 0.01);
  core += 0.8 * lightBox(e, vec2(-0.66, -0.16), vec2(0.025, 0.3), 0.025, 0.01);
  float halo = 0.0;
  halo += lightBox(e, vec2(-0.32, 0.34), vec2(0.4, 0.24), 0.16, 0.3);
  halo += 0.6 * lightBox(e, vec2(0.48, 0.0), vec2(0.12, 0.56), 0.1, 0.24);
  return vec2(core, halo);
}

// sp = (hard highlight, coloured shoulder, halo, rim)
vec3 shade(vec3 n, float h, float alpha, vec3 bg, vec3 deep, vec3 mid, vec3 glow, float calm, vec4 sp) {
  float th = smoothstep(-0.3, 1.5, h) * 0.85;
  vec3 body = mix(deep, mid, th);
  float slope = 1.0 - n.z;
  body += glow * pow(clamp(slope * 2.4, 0.0, 1.0), 1.6) * 0.5;
  body = mix(body, glow * 0.75, smoothstep(0.0, -1.0, h) * 0.3);

  vec3 L = normalize(vec3(-0.45, 0.55, 0.7));
  float diff = dot(n, L) * 0.5 + 0.5;
  float diff0 = L.z * 0.5 + 0.5;
  float lit = 1.0 + 0.7 * (diff - diff0);
  body *= clamp(lit, 0.35, 1.7);

  vec3 flat_ = bg * clamp(1.0 + 0.55 * (diff - diff0), 0.5, 1.5);
  vec3 col = mix(flat_, body, alpha);

  // light polish: the steep side of a fold reflects the dark room, which gives the form
  float lum = dot(mid, vec3(0.3, 0.59, 0.11));
  col *= 1.0 - lum * 0.42 * smoothstep(0.08, 0.5, slope) * alpha;

  vec3 tint = mix(glow, vec3(1.0), 0.4);
  col += glow * sp.z * 0.12 * (0.4 + alpha * 0.6) * mix(0.25, 1.0, calm);
  col += glow * sp.w * 0.5 * alpha * calm;
  col = mix(col, tint, sp.y * 0.6 * (1.0 - 0.6 * (1.0 - calm)));
  // Behind pale type (dark shades) a reflection turns into a deep coloured sheen instead of white,
  // so letters never merge with a highlight. Dark type on a light shade keeps the white.
  float bl = dot(bg, vec3(0.3, 0.59, 0.11));
  float q = (1.0 - smoothstep(0.3, 0.85, calm)) * (1.0 - step(0.45, bl));
  vec3 hi = mix(vec3(1.0, 0.985, 0.97), mix(mid, glow, 0.35) * 1.05, q);
  hi *= 0.84 + 0.16 * smoothstep(-0.45, 0.45, EY);
  col = mix(col, hi, sp.x);
  return col;
}

void main() {
  aspect = u_res.x / u_res.y;
  fscale = mix(1.0, 1.3, smoothstep(1.0, 0.45, aspect));
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = vec2(uv.x * aspect, uv.y);

  if (u_recede >= 0.9995 && u_flood <= 0.0005 && u_pour >= 0.9995) {
    o = vec4(u_bgA, 1.0);
    return;
  }

  float eps = 1.6 / u_res.y;
  float h = field(p);
  float hx = field(p + vec2(eps, 0.0));
  float hy = field(p + vec2(0.0, eps));
  vec3 n = normalize(vec3(-(hx - h) / eps * 0.3, -(hy - h) / eps * 0.3, 1.0));

  float tk = coverage(p).x;
  float alpha = smoothstep(0.0, 0.05, tk);

  float calmName = calmAtW(uv, u_calm4, 0.07);
  float calmText = min(min(min(calmAt(uv, u_c0), calmAt(uv, u_c1)), min(calmAt(uv, u_c2), calmAt(uv, u_c3))), min(calmAt(uv, u_c4), calmAt(uv, u_c5)));
  float calm = min(calmText, calmName);

  // reflected studio, looked up once with screen-space anti-aliasing so edges stay crisp at any resolution
  vec3 r = 2.0 * n.z * n - vec3(0.0, 0.0, 1.0);
  vec2 e = r.xy / max(r.z + 0.18, 0.3);
  AA = clamp((fwidth(e.x) + fwidth(e.y)) * 0.6, 0.004, 0.03);
  EY = e.y;
  vec2 env = studio(e);
  float F = 0.8 + 0.2 * pow(1.0 - n.z, 2.0);
  float core = env.x * F * 1.1;
  float hard = smoothstep(0.34, 0.5, core);
  float shoulder = smoothstep(0.1, 0.34, core) * (1.0 - hard);
  float halo = clamp(env.y, 0.0, 1.0);
  float rim = pow(clamp(1.0 - n.z, 0.0, 1.0), 4.0) * 0.7;
  vec4 sp = vec4(hard, shoulder, halo, rim);

  vec3 col = shade(n, h, alpha, u_bgA, u_deepA, u_midA, u_glowA, calm, sp);
  if (u_flood > 0.0005) {
    float x = floodX(p);
    float m = smoothstep(-0.004, 0.012, x);
    if (m > 0.0) {
      vec3 colB = shade(n, h, alpha, u_bgB, u_deepB, u_midB, u_glowB, calm, sp);
      col = mix(col, colB, m);
    }
  }

  col += (hash12(gl_FragCoord.xy + fract(u_time) * 17.0) - 0.5) / 255.0;
  o = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
