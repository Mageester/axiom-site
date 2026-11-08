/**
 * GLSL for Mirrorline. One paint model (midnight blue metallic basecoat, flake, clearcoat,
 * studio lights) is shared by two programs:
 *
 *   WATER    the hero: a ceramic-coated panel with beads from the droplet simulation
 *   DEFECTS  the correction panel: haze and swirl marks that polishing removes
 *
 * The droplet simulation runs entirely on the GPU. Every bead is one texel of a float
 * texture (x, y, radius, speed). Each frame:
 *
 *   claim      every bead writes its id into a coarse grid; the depth test keeps the largest
 *   resolve    every bead looks at the grid around it and finds a larger bead it touches
 *   gain       beads that merge scatter their volume onto the bead that absorbs them
 *   integrate  volumes are added, beads past their pinning size slide with gravity,
 *              beads that left the panel die, and empty slots occasionally become new mist
 *   splat      beads are drawn as spherical caps into a height field the paint shader reads
 */

export const VS_FULL = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const HASH = `
float h12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec3 h32(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yzz) * p3.zyx);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h12(i), h12(i + vec2(1.0, 0.0)), u.x), mix(h12(i + vec2(0.0, 1.0)), h12(i + vec2(1.0, 1.0)), u.x), u.y);
}
`;

/* ---------------------------------------------------------------- paint ---------- */

export const FS_PAINT = `
precision highp float;
uniform vec2 u_res;
uniform float u_dpr;
uniform float u_time;
uniform mat3 u_rot;
uniform vec2 u_l2d;
uniform float u_env;
uniform vec4 u_lights;
uniform vec3 u_disc;
uniform float u_discI;
uniform float u_fade;
uniform float u_persp;
uniform float u_flake;
#ifdef WATER
uniform sampler2D u_h;
#endif
#ifdef DEFECTS
uniform sampler2D u_mask;
uniform sampler2D u_scr;
uniform vec3 u_lightW;
uniform vec4 u_split;
#endif
out vec4 o;
${HASH}

// The panel's shape, as a slope field in screen-height units.
vec2 slopeAt(vec2 q, vec2 fp) {
  vec2 s;
#ifdef WATER
  // A door seen from the side: convex top to bottom, a crisp shoulder line rising to the
  // right, and a soft swage lower down.
  s = vec2(-0.16 * q.x, -0.42 * (q.y + 0.02));
  float l1 = q.y - (0.165 + 0.11 * q.x + 0.05 * q.x * q.x);
  float a1 = smoothstep(-0.0014, 0.0014, l1);
  s += vec2(0.11 + 0.1 * q.x, -1.0) * 0.46 * a1;
  float l2 = q.y - (-0.3 + 0.06 * q.x);
  float a2 = smoothstep(-0.08, 0.08, l2) - 1.0;
  s += vec2(0.06, -1.0) * 0.14 * a2;
#else
  // A bonnet under an inspection light: almost flat, gently crowned.
  s = vec2(-0.1 * q.x, -0.16 * q.y);
#endif
  // Orange peel: the faint ripple every factory clearcoat has.
  vec2 op = fp / (22.0 * u_dpr);
  s += (vec2(vnoise(op), vnoise(op + vec2(17.3, 3.1))) - 0.5) * 0.0012;
  return s;
}

float rectSDF(vec2 p, vec2 c, vec2 hs) {
  vec2 d = abs(p - c) - hs;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
float soft(float d, float w) {
  return 1.0 - smoothstep(-w, w, d);
}

// The studio, as seen in the paint: dark walls, two long strip lights and a tall softbox
// behind the camera, a big softbox overhead, and an optional inspection light.
vec3 envAt(vec3 Rw, float rough) {
  vec3 R = u_rot * Rw;
  float up = R.y;
  vec3 col = mix(vec3(0.0016, 0.0019, 0.0026), vec3(0.010, 0.012, 0.016), smoothstep(-0.4, 0.9, up));
  col += vec3(0.0035, 0.004, 0.005) * exp(-abs(up + 0.04) * 14.0);
  float L = 0.0;
  if (R.z > 0.04) {
    vec2 p = R.xy / R.z;
    float w = 0.003 + rough * (0.7 + 0.35 * length(p));
    // a long strip light, slightly brighter in the middle
    L += 30.0 * u_lights.x * soft(rectSDF(p, vec2(-0.2, 0.2), vec2(1.7, 0.016)), w) * (0.75 + 0.25 * smoothstep(1.8, 0.0, abs(p.x + 0.2)));
    // a thinner, dimmer one below it
    L += 12.0 * u_lights.y * soft(rectSDF(p, vec2(0.45, -0.2), vec2(1.0, 0.007)), w) * smoothstep(-0.05, 0.55, p.x);
    // a tall softbox: bright core, soft diffuser edges
    float sb = soft(rectSDF(p, vec2(0.58, 0.12), vec2(0.04, 0.5)), w + 0.04);
    L += 26.0 * u_lights.z * sb * sb * (0.7 + 0.3 * smoothstep(-0.4, 0.5, p.y));
  }
  if (R.y > 0.04) {
    vec2 p = R.xz / R.y;
    float w = 0.02 + rough * (0.9 + 0.35 * length(p));
    float ob = soft(rectSDF(p, vec2(-0.1, 1.1), vec2(1.0, 0.55)), w + 0.12);
    L += 11.0 * u_lights.w * ob * smoothstep(0.5, 1.7, p.y) * smoothstep(-0.4, 0.6, p.x);
  }
  col += vec3(1.0, 0.985, 0.96) * L * u_env;
  if (u_discI > 0.0) {
    float c = dot(R, u_disc);
    float ang = sqrt(max(0.0, 2.0 * (1.0 - c)));
    float wd = 0.003 + rough * 1.6;
    col += vec3(1.0, 0.975, 0.94) * u_discI * soft(ang - 0.045, wd) * (0.045 / max(0.045, wd * 1.4));
  }
  return col;
}

vec3 flakeLayer(vec2 fp, float cell, vec3 N, vec3 V, float tilt, float dens, float seed) {
  vec2 g = fp / cell;
  vec2 id = floor(g);
  vec3 h = h32(id + seed);
  if (h.z > dens) return vec3(0.0);
  float d = length(fract(g) - (0.22 + 0.56 * h.xy));
  float m = 1.0 - smoothstep(0.16, 0.34, d);
  if (m <= 0.0) return vec3(0.0);
  vec3 rn = h32(id * 1.37 + seed + 11.0) * 2.0 - 1.0;
  vec3 Nf = normalize(N + rn * tilt);
  return envAt(reflect(-V, Nf), 0.015) * m;
}

const vec3 DEEP = vec3(0.0018, 0.0042, 0.018);
const vec3 FACE = vec3(0.018, 0.05, 0.25);

// Basecoat, flake and clearcoat at one point. coat scales the clearcoat reflection and
// rough blurs it (haze).
vec3 paint(vec2 fp, vec3 N, vec3 V, float coat, float rough) {
  vec3 R = reflect(-V, N);
  vec3 glow = envAt(R, 0.32);
  float lum = dot(glow, vec3(0.3333));
  vec3 col = DEEP + FACE * lum * 0.05 + FACE * max(N.y, 0.0) * 0.004;
  vec3 fl = flakeLayer(fp, 2.2 * u_dpr, N, V, 0.15, 0.75, 0.0) * 0.0085;
  fl += flakeLayer(fp + 31.7, 3.6 * u_dpr, N, V, 0.1, 0.35, 7.0) * 0.014;
  col += fl * vec3(0.7, 0.8, 1.0) * u_flake;
  float NdV = max(dot(N, V), 0.0);
  float F = 0.04 + 0.96 * pow(1.0 - NdV, 5.0);
  col += envAt(R, rough) * F * coat;
  return col;
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 fp = gl_FragCoord.xy;
  vec2 q = (fp - 0.5 * u_res) / u_res.y;
  vec2 uv = fp / u_res;
  vec2 s = slopeAt(q, fp);
  vec3 N = normalize(vec3(-s, 1.0));
  vec3 V = normalize(vec3(-q * u_persp, 1.0));

  float rough = 0.0018;
  float coat = 1.0;
#ifdef DEFECTS
  float m = texture(u_mask, uv).r;
  // A two-step correction: the cutting stage takes the swirls, the finishing stage the haze.
  float swirlVis = 1.0 - smoothstep(0.0, 0.55, m);
  float hazeVis = 1.0 - smoothstep(0.3, 1.0, m);
  // Optional static split for the still frame: left half untouched, right half corrected.
  if (u_split.x > 0.0) {
    float k = smoothstep(u_split.y - 2.0, u_split.y + 2.0, fp.x);
    swirlVis = mix(swirlVis, 0.0, k);
    hazeVis = mix(hazeVis, 0.0, k);
  }
  rough = mix(0.0018, 0.03, hazeVis);
  coat = mix(1.0, 0.75, hazeVis);
#endif

  vec3 col = paint(fp, N, V, coat, rough);

#ifdef DEFECTS
  vec3 R = reflect(-V, N);
  col += envAt(R, 0.3) * 0.002 * hazeVis;
  vec4 sc = texture(u_scr, uv);
  if (sc.b > 0.004) {
    float a = atan(sc.g * 2.0 - 1.0, sc.r * 2.0 - 1.0) * 0.5;
    vec2 t2 = vec2(cos(a), sin(a));
    vec3 T = normalize(vec3(t2, dot(t2, s)));
    vec3 Hh = normalize(u_lightW + V);
    float along = dot(Hh, T);
    float tilt = 1.0 - dot(Hh, N);
    float glint = exp(-along * along / 0.00016) * exp(-tilt / 0.0038);
    float vis = sc.a > 0.5 ? max(swirlVis, 0.45) : swirlVis;
    float d = length(fp - (u_res * 0.5));
    vec3 iri = 0.82 + 0.18 * cos(6.2831 * (a * 0.6 + tilt * 9.0 + vec3(0.0, 0.33, 0.67)));
    col += vec3(1.0, 0.97, 0.93) * iri * glint * sc.b * vis * u_discI * 0.04;
  }
  if (u_split.x > 0.0) {
    col = mix(col, vec3(0.6), (1.0 - smoothstep(0.0, 1.2 * u_dpr, abs(fp.x - u_split.y))) * 0.5);
  }
#endif

#ifdef WATER
  vec2 tx = 1.0 / u_res;
  float h = texture(u_h, uv).r;
  if (h > 0.03) {
    float hl = texture(u_h, uv - vec2(tx.x, 0.0)).r;
    float hr = texture(u_h, uv + vec2(tx.x, 0.0)).r;
    float hd = texture(u_h, uv - vec2(0.0, tx.y)).r;
    float hu = texture(u_h, uv + vec2(0.0, tx.y)).r;
    vec2 g = vec2(hr - hl, hu - hd) * 0.5;
    float gl = length(g);
    if (gl > 6.0) g *= 6.0 / gl;
    gl = min(gl, 6.0);
    float cov = smoothstep(0.03, 0.55, h);
    vec3 Nw = normalize(N + vec3(-g, 0.0));
    vec2 fp2 = fp - g * h * 0.42;
    vec3 under = paint(fp2, N, V, 0.1, 0.002) * 0.8;
    vec2 outward = -g / max(gl, 1e-3);
    float cz = max(dot(outward, -u_l2d), 0.0);
    float ring = smoothstep(0.2, 0.9, gl) * (1.0 - smoothstep(1.4, 3.2, gl));
    under += (FACE * 2.4 + vec3(0.05)) * cz * cz * ring * 0.5 * u_env;
    under *= mix(1.0, 0.3, smoothstep(1.1, 3.6, gl));
    float NdVw = max(dot(Nw, V), 0.0);
    float Fw = 0.02 + 0.98 * pow(1.0 - NdVw, 5.0);
    vec3 surf = envAt(reflect(-V, Nw), 0.012) * Fw;
    col = mix(col, under + surf, cov);
  }
#endif

  col = aces(col * 1.15);
  col = pow(col, vec3(1.0 / 2.2));
  float vig = smoothstep(1.35, 0.25, length(q * vec2(0.8, 1.0)));
  col *= mix(0.68, 1.0, vig);
  col += (h12(fp + fract(u_time * 7.13) * 91.0) - 0.5) * 0.018;
  o = vec4(col * u_fade, 1.0);
}`;

export const fsPaint = (variant: 'WATER' | 'DEFECTS') => `#version 300 es\n#define ${variant}\n${FS_PAINT}`;

/* ---------------------------------------------------------------- droplets ------- */

const SIM_HEAD = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
`;

// Every bead writes its id into the grid cell under it. The depth test keeps the largest.
export const VS_CLAIM = `${SIM_HEAD}
uniform sampler2D u_state;
uniform vec2 u_grid;
uniform float u_cell;
flat out int v_id;
void main() {
  int S = textureSize(u_state, 0).x;
  int id = gl_VertexID;
  vec4 s = texelFetch(u_state, ivec2(id % S, id / S), 0);
  gl_PointSize = 1.0;
  v_id = id;
  if (s.z <= 0.0) {
    gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
    return;
  }
  vec2 cell = floor(s.xy / u_cell);
  vec2 ndc = (cell + 0.5) / u_grid * 2.0 - 1.0;
  gl_Position = vec4(ndc, clamp(s.z / 64.0, 0.0, 1.0) * 2.0 - 1.0, 1.0);
}`;

export const FS_CLAIM = `${SIM_HEAD}
flat in int v_id;
out vec4 o;
void main() {
  o = vec4(float(v_id & 255) / 255.0, float((v_id >> 8) & 255) / 255.0, 0.0, 1.0);
}`;

// Finds the largest bead this one touches, if it is larger than this one.
export const FS_RESOLVE = `${SIM_HEAD}
uniform sampler2D u_state;
uniform sampler2D u_grid;
uniform float u_cell;
uniform float u_touch;
out vec4 o;
void main() {
  ivec2 t = ivec2(gl_FragCoord.xy);
  int S = textureSize(u_state, 0).x;
  int id = t.y * S + t.x;
  vec4 s = texelFetch(u_state, t, 0);
  float best = -1.0;
  float bestR = 0.0;
  if (s.z > 0.0) {
    ivec2 gs = textureSize(u_grid, 0);
    ivec2 c = ivec2(floor(s.xy / u_cell));
    for (int dy = -6; dy <= 6; dy++) {
      for (int dx = -6; dx <= 6; dx++) {
        ivec2 g = c + ivec2(dx, dy);
        if (g.x < 0 || g.y < 0 || g.x >= gs.x || g.y >= gs.y) continue;
        vec4 e = texelFetch(u_grid, g, 0);
        if (e.a < 0.5) continue;
        int j = int(e.r * 255.0 + 0.5) + int(e.g * 255.0 + 0.5) * 256;
        if (j == id) continue;
        vec4 sj = texelFetch(u_state, ivec2(j % S, j / S), 0);
        if (sj.z <= 0.0) continue;
        if (sj.z < s.z || (sj.z == s.z && j < id)) continue;
        float d = distance(sj.xy, s.xy);
        if (d < (sj.z + s.z) * u_touch && sj.z > bestR) {
          best = float(j);
          bestR = sj.z;
        }
      }
    }
  }
  o = vec4(best, 0.0, 0.0, 1.0);
}`;

// Beads that merge send their volume to the bead that takes them (following one more hop
// when that bead is itself merging this frame).
export const VS_GAIN = `${SIM_HEAD}
uniform sampler2D u_state;
uniform sampler2D u_parent;
out float v_vol;
void main() {
  int S = textureSize(u_state, 0).x;
  int id = gl_VertexID;
  ivec2 t = ivec2(id % S, id / S);
  float p = texelFetch(u_parent, t, 0).r;
  vec4 s = texelFetch(u_state, t, 0);
  gl_PointSize = 1.0;
  v_vol = s.z * s.z * s.z * 0.001;
  if (p < 0.0 || s.z <= 0.0) {
    gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
    return;
  }
  int j = int(p + 0.5);
  float pj = texelFetch(u_parent, ivec2(j % S, j / S), 0).r;
  if (pj >= 0.0) j = int(pj + 0.5);
  vec2 ndc = (vec2(float(j % S), float(j / S)) + 0.5) / float(S) * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
}`;

export const FS_GAIN = `${SIM_HEAD}
in float v_vol;
out vec4 o;
void main() {
  o = vec4(v_vol, 0.0, 0.0, 1.0);
}`;

export const FS_INTEGRATE = `${SIM_HEAD}
uniform sampler2D u_state;
uniform sampler2D u_parent;
uniform sampler2D u_gain;
uniform vec2 u_sim;
uniform float u_dt;
uniform uint u_frame;
uniform vec2 u_grav;
uniform float u_spawn;
uniform vec4 u_spray;
uniform float u_rc;
uniform float u_rmax;
uniform vec2 u_rspawn;
out vec4 o;
uint pcg(uint v) {
  uint st = v * 747796405u + 2891336453u;
  uint w = ((st >> ((st >> 28u) + 4u)) ^ st) * 277803737u;
  return (w >> 22u) ^ w;
}
float rnd(inout uint s) {
  s = pcg(s);
  return float(s) * (1.0 / 4294967296.0);
}
${HASH}
void main() {
  ivec2 t = ivec2(gl_FragCoord.xy);
  int S = textureSize(u_state, 0).x;
  int id = t.y * S + t.x;
  vec4 s = texelFetch(u_state, t, 0);
  uint seed = pcg(uint(id) * 9781u + u_frame * 26699u + 7u);

  if (s.z <= 0.0) {
    float p = u_spawn;
    vec2 pos = vec2(rnd(seed), rnd(seed)) * u_sim;
    float big = rnd(seed);
    if (u_spray.w > 0.0 && rnd(seed) < u_spray.w) {
      float a = rnd(seed) * 6.2831853;
      float rr = pow(rnd(seed), 0.7) * u_spray.z;
      pos = u_spray.xy + vec2(cos(a), sin(a)) * rr;
      p = 1.0;
    }
    if (rnd(seed) < p) {
      o = vec4(pos, mix(u_rspawn.x, u_rspawn.y, pow(big, 1.8)), 0.0);
    } else {
      o = vec4(0.0);
    }
    return;
  }

  if (texelFetch(u_parent, t, 0).r >= 0.0) {
    o = vec4(0.0);
    return;
  }

  float gain = texelFetch(u_gain, t, 0).r * 1000.0;
  float vol = s.z * s.z * s.z;
  float nvol = vol + max(gain, 0.0);
  float r = min(pow(nvol, 1.0 / 3.0), u_rmax);
  float speed = s.w * vol / max(nvol, 1e-4);

  // Pinning: the coating is not perfectly uniform, so beads stick in some places longer.
  float stick = vnoise(s.xy * 0.045 + float(id % 7) * 3.1);
  float rc = u_rc * (0.78 + 0.5 * stick);
  float g = length(u_grav);
  if (r > rc && g > 0.01) {
    float drive = min((r - rc) / rc, 2.2);
    speed += (g * 1500.0 * drive - speed * 2.4) * u_dt;
  } else {
    speed = max(0.0, speed - 1100.0 * u_dt);
  }
  vec2 dir = g > 0.01 ? u_grav / g : vec2(0.0, -1.0);
  vec2 side = vec2(-dir.y, dir.x);
  float wob = (vnoise(s.xy * 0.018 + float(id % 13) * 1.7) - 0.5) * 0.7;
  vec2 pos = s.xy + (dir + side * wob) * speed * u_dt;

  if (pos.y < -r * 2.0 - 8.0 || pos.y > u_sim.y + 60.0 || pos.x < -60.0 || pos.x > u_sim.x + 60.0) {
    o = vec4(0.0);
    return;
  }
  o = vec4(pos, r, speed);
}`;

// Beads as spherical caps in a height field. Sliding beads stretch along their path.
export const VS_SPLAT = `${SIM_HEAD}
uniform sampler2D u_state;
uniform vec2 u_sim;
uniform vec2 u_grav;
out vec2 v_local;
out float v_r;
out float v_st;
void main() {
  int S = textureSize(u_state, 0).x;
  int id = gl_InstanceID;
  vec4 s = texelFetch(u_state, ivec2(id % S, id / S), 0);
  if (s.z <= 0.0) {
    gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
    v_local = vec2(0.0);
    v_r = 0.0;
    v_st = 1.0;
    return;
  }
  int vid = gl_VertexID;
  vec2 corner = vec2((vid == 1 || vid == 2 || vid == 4) ? 1.0 : -1.0, (vid == 2 || vid == 4 || vid == 5) ? 1.0 : -1.0);
  float st = 1.0 + min(s.w / 260.0, 0.55);
  float g = length(u_grav);
  vec2 dir = g > 0.01 ? u_grav / g : vec2(0.0, -1.0);
  vec2 side = vec2(-dir.y, dir.x);
  float ext = s.z + 1.5;
  vec2 local = corner * vec2(ext * st, ext);
  vec2 world = s.xy + dir * local.x + side * local.y;
  v_local = local / s.z;
  v_r = s.z;
  v_st = st;
  gl_Position = vec4(world / u_sim * 2.0 - 1.0, 0.0, 1.0);
}`;

export const FS_SPLAT = `${SIM_HEAD}
uniform float u_scale;
uniform float u_k;
in vec2 v_local;
in float v_r;
in float v_st;
out vec4 o;
void main() {
  vec2 l = v_local;
  l.x /= v_st;
  // A sliding bead is fuller at the front and draws out at the back.
  if (l.x < 0.0) l.y *= 1.0 + (v_st - 1.0) * 0.9 * -l.x;
  float d2 = dot(l, l);
  if (d2 >= 1.0) discard;
  o = vec4(sqrt(1.0 - d2) * v_r * u_scale * u_k, 0.0, 0.0, 1.0);
}`;

/* ---------------------------------------------------------------- correction ----- */

// Bakes the panel's defects once: fine wash scratches and rotary buffer trails, stored as
// a direction (doubled angle, so a line has no front or back) and a strength, plus two
// deeper scratches that polishing can only soften.
export const FS_SCRATCH = `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform float u_dpr;
uniform vec4 u_deep1;
uniform vec4 u_deep2;
out vec4 o;
${HASH}
float seg(vec2 p, vec2 a, vec2 b, out float t) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * t);
}
void main() {
  vec2 p = gl_FragCoord.xy / u_dpr;
  float px = 1.0 / u_dpr;
  float best = 0.0;
  vec2 tan = vec2(1.0, 0.0);
  float deep = 0.0;

  // Straight marring from washing and drying.
  for (int layer = 0; layer < 2; layer++) {
    float C = layer == 0 ? 26.0 : 44.0;
    float seed = layer == 0 ? 0.0 : 91.0;
    vec2 cell = floor(p / C);
    for (int dy = -2; dy <= 2; dy++) {
      for (int dx = -2; dx <= 2; dx++) {
        vec2 id = cell + vec2(float(dx), float(dy));
        vec3 h = h32(id + seed);
        vec3 k = h32(id * 1.91 + seed + 5.0);
        vec2 c = (id + h.xy) * C;
        float ang = h.z * 6.2831853;
        float len = mix(12.0, layer == 0 ? 70.0 : 120.0, k.x * k.x);
        vec2 dir = vec2(cos(ang), sin(ang));
        float t;
        float d = seg(p, c - dir * len * 0.5, c + dir * len * 0.5, t);
        float w = mix(0.35, 0.75, k.y);
        float v = (1.0 - smoothstep(w - px * 0.5, w + px * 0.9, d)) * sin(3.14159 * t) * mix(0.35, 1.0, k.z);
        if (v > best) {
          best = v;
          tan = dir;
        }
      }
    }
  }

  // Arcs left by a rotary buffer: holograms.
  {
    float C = 150.0;
    vec2 cell = floor(p / C);
    for (int dy = -1; dy <= 1; dy++) {
      for (int dx = -1; dx <= 1; dx++) {
        vec2 id = cell + vec2(float(dx), float(dy));
        vec3 h = h32(id + 211.0);
        vec3 k = h32(id * 2.3 + 17.0);
        vec2 c = (id + h.xy) * C;
        vec2 dp = p - c;
        float rad = mix(30.0, 120.0, h.z);
        float rr = length(dp);
        float ring = abs(rr - rad);
        // several concentric passes, slightly offset
        for (int n = 0; n < 3; n++) {
          float rn = rad + float(n) * mix(3.0, 7.0, k.z);
          float dn = abs(rr - rn);
          float a = atan(dp.y, dp.x);
          float a0 = k.x * 6.2831853;
          float span = mix(0.6, 2.2, k.y);
          float da = mod(a - a0 + 3.14159, 6.2831853) - 3.14159;
          float arc = smoothstep(span, span * 0.5, abs(da));
          float v = (1.0 - smoothstep(0.3, 0.3 + px * 1.2, dn)) * arc * 0.75;
          if (v > best) {
            best = v;
            tan = vec2(-dp.y, dp.x) / max(rr, 1e-3);
          }
        }
      }
    }
  }

  // Two deeper scratches, the kind that go through the clear coat.
  for (int i = 0; i < 2; i++) {
    vec4 L = i == 0 ? u_deep1 : u_deep2;
    float t;
    float d = seg(p, L.xy, L.zw, t);
    float v = (1.0 - smoothstep(0.6, 0.6 + px * 1.4, d)) * smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.85, t);
    if (v > 0.2 && v >= best * 0.8) {
      best = max(v, best);
      vec2 dd = L.zw - L.xy;
      tan = dd / length(dd);
      deep = 1.0;
    }
  }

  float ang = atan(tan.y, tan.x) * 2.0;
  o = vec4(cos(ang) * 0.5 + 0.5, sin(ang) * 0.5 + 0.5, best, deep);
}`;

// A polishing pad pass: adds correction where the pad touches.
export const VS_BRUSH = `#version 300 es
uniform vec2 u_res;
uniform vec3 u_brush;
out vec2 v_p;
void main() {
  int vid = gl_VertexID;
  vec2 corner = vec2((vid == 1 || vid == 2 || vid == 4) ? 1.0 : -1.0, (vid == 2 || vid == 4 || vid == 5) ? 1.0 : -1.0);
  v_p = corner;
  vec2 world = u_brush.xy + corner * u_brush.z;
  gl_Position = vec4(world / u_res * 2.0 - 1.0, 0.0, 1.0);
}`;

export const FS_BRUSH = `#version 300 es
precision highp float;
uniform float u_amount;
in vec2 v_p;
out vec4 o;
void main() {
  float d = length(v_p);
  float f = 1.0 - smoothstep(0.55, 1.0, d);
  o = vec4(f * u_amount, 0.0, 0.0, 1.0);
}`;
