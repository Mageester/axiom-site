/**
 * GLSL for the lawn. Everything is lit in display space and graded at the end of each
 * fragment shader, so the sky, the ground, the blades and the leaves share one look.
 *
 * The trail texture records where a footstep pressed the lawn: RG is the direction the
 * blades were pushed, B is how hard (it fades back to zero as they spring up). It is
 * mapped over the ground in front of the camera with a log scale in depth, so near
 * ground gets most of the texels.
 */

export const COMMON = /* glsl */ `
uniform float uTime;
uniform vec3 uSunDir;
uniform vec3 uSunCol;
uniform vec3 uSkyTop;
uniform vec3 uSkyHor;
uniform vec3 uFogCol;
uniform vec3 uAmb;
uniform vec3 uSnowAlb;
uniform float uFogDen;
uniform float uSnow;
uniform sampler2D uTrail;
uniform vec4 uTrailMap;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm3(vec2 p) {
  float s = 0.5 * vnoise(p);
  p = p * 2.03 + 11.7;
  s += 0.25 * vnoise(p);
  p = p * 2.01 + 5.3;
  s += 0.125 * vnoise(p);
  return s / 0.875;
}

vec2 trailUV(vec2 xz) {
  float d = max(-xz.y, 0.001);
  float v = log(d / uTrailMap.x) / uTrailMap.y;
  float u = 0.5 + xz.x / (2.0 * (d * uTrailMap.z + uTrailMap.w));
  return vec2(u, v);
}

vec4 trailAt(vec2 xz) {
  vec2 uv = trailUV(xz);
  if (uv.x < 0.002 || uv.x > 0.998 || uv.y < 0.002 || uv.y > 0.998) return vec4(0.5, 0.5, 0.0, 0.0);
  return textureLod(uTrail, uv, 0.0);
}

// Mowing stripes: bands about 80 cm wide, running away from the camera on a slight diagonal.
float stripeBand(vec2 xz) {
  return step(0.5, fract(dot(xz, vec2(0.94, 0.34)) * 0.92));
}

float cloudShade(vec2 xz) {
  float c = vnoise(xz * 0.07 + vec2(uTime * 0.02, uTime * 0.007));
  return mix(0.52, 1.0, smoothstep(0.3, 0.72, c));
}

float snowDepth(vec2 xz, float clear) {
  float n = vnoise(xz * 1.6) * 0.55 + vnoise(xz * 0.3 + 4.0) * 0.45;
  return uSnow * (0.06 + 0.07 * n) * (1.0 - clear);
}

vec3 snowLight(float shade) {
  return uSnowAlb * (uAmb * 1.3 + uSunCol * (0.16 + 0.9 * max(uSunDir.y, 0.0)) * shade);
}

// Haze thickens with distance and swallows the far edge of the lawn completely.
float fogAmount(float dist) {
  return max(1.0 - exp(-dist * uFogDen), smoothstep(22.0, 60.0, dist));
}

vec3 fogTint(vec3 viewDir) {
  float s = max(dot(viewDir, uSunDir), 0.0);
  return mix(uFogCol, uSunCol, pow(s, 7.0) * 0.6);
}
`;

export const FRAG_COMMON = /* glsl */ `
vec3 finish(vec3 c) {
  c = max(c, 0.0);
  c = c / (1.0 + 0.22 * c) * 1.1;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(vec3(l), c, 1.05);
  c += vec3(-0.004, 0.005, 0.011) * (1.0 - smoothstep(0.0, 0.3, l));
  float g = hash12(gl_FragCoord.xy + fract(uTime * 7.13) * 113.0) - 0.5;
  return c + g * 0.02;
}
`;

/* ---------- blades ---------- */

export const GRASS_VERT = /* glsl */ `
${COMMON}
attribute vec4 aRoot;   // x, z, yaw, random
attribute vec4 aShape;  // height, width, lean, random
uniform vec3 uRootCol;
uniform vec3 uTipCol;
uniform vec3 uAltCol;
uniform float uAltAmt;
uniform vec2 uWind;
uniform float uWindAmp;
uniform float uHeightK;
uniform float uStripe;
uniform float uWinter;
varying vec3 vCol;
varying vec3 vSnowCol;
varying float vY;
varying float vSnowD;
varying float vCap;
varying float vFog;
varying vec3 vFogCol;

void main() {
  float t = position.y;
  float side = position.x;
  vec2 root = aRoot.xy;
  float yaw = aRoot.z;
  float r1 = aRoot.w;
  float r2 = aShape.w;

  vec4 tr = trailAt(root);
  float press = smoothstep(0.02, 0.7, tr.z);
  vec2 pdir = tr.xy * 2.0 - 1.0;
  float pl = length(pdir);
  pdir = pl > 0.001 ? pdir / pl : vec2(0.0, -1.0);
  float clear = smoothstep(0.04, 0.45, tr.z) * uWinter;
  float sd = snowDepth(root, clear);

  float h = aShape.x * uHeightK;
  float w = aShape.y;

  float band = stripeBand(root);
  float la = yaw * 2.7 + r2 * 4.0;
  vec2 leanDir = vec2(cos(la), sin(la));
  vec2 sdir = vec2(0.34, -0.94) * (band * 2.0 - 1.0);
  leanDir = normalize(mix(leanDir, sdir, uStripe * 0.75) + 0.0001);

  float gust = smoothstep(0.12, 0.88, vnoise(root * 0.32 - uWind * uTime * 0.62));
  float flutter = sin(uTime * (2.0 + r1 * 1.8) + r2 * 6.2831 + dot(root, uWind) * 1.4);
  float windAng = uWindAmp * (0.1 + 0.95 * gust + 0.13 * flutter);
  windAng *= 1.0 - clamp(sd / max(h, 0.01), 0.0, 0.85);

  vec2 bendV = leanDir * aShape.z + uWind * windAng + pdir * press * 1.5;
  float bl = length(bendV);
  vec2 bdir = bl > 0.0001 ? bendV / bl : vec2(0.0, -1.0);
  float theta = min(bl, 1.5);

  float a = theta * t;
  float horiz = 0.0;
  float vert = h * t;
  if (theta > 0.001) {
    float R = h / theta;
    horiz = R * (1.0 - cos(a));
    vert = R * sin(a);
  }
  float taper = pow(1.0 - t, 0.72);
  vec2 wdir = vec2(cos(yaw), sin(yaw));

  vec3 pos = vec3(root.x, 0.0, root.y);
  pos.xz += bdir * horiz + wdir * side * w * 0.5 * taper;
  pos.y += vert;

  vec3 tangent = normalize(vec3(bdir.x * sin(a), cos(a), bdir.y * sin(a)));
  vec3 across = vec3(wdir.x, 0.0, wdir.y);
  vec3 n = normalize(cross(across, tangent));
  n = normalize(n + across * side * 0.55);
  vec3 toCam = cameraPosition - pos;
  float dist = length(toCam);
  vec3 V = toCam / dist;
  if (dot(n, V) < 0.0) n = -n;

  // Colour: root to tip, some blades in the season's second colour.
  float isAlt = step(r2, uAltAmt);
  vec3 tipC = mix(uTipCol, uAltCol, isAlt) * (0.8 + 0.4 * r1);
  vec3 alb = mix(uRootCol, tipC, pow(t, 0.7));
  alb *= 1.0 + uStripe * (band - 0.5) * 0.62;
  alb = mix(alb, alb * 1.3 + vec3(0.012, 0.02, 0.0), press * 0.55 * (1.0 - uWinter));

  // Light: wrapped diffuse, light through the blade when the sun is behind it, a little sheen.
  vec3 L = uSunDir;
  float shade = cloudShade(root);
  float ao = mix(0.16, 1.0, smoothstep(0.0, 0.85, t)) * (1.0 - press * 0.25);
  float wrap = clamp(dot(n, L) * 0.55 + 0.45, 0.0, 1.0);
  float back = pow(clamp(dot(-V, L), 0.0, 1.0), 3.5);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(n, H), 0.0), 28.0);

  float tipLight = smoothstep(0.35, 1.0, t);
  vec3 col = alb * uAmb * ao * (0.6 + 0.4 * max(n.y, 0.0));
  col += alb * uSunCol * wrap * 0.5 * shade * ao;
  col += alb * uSunCol * back * (0.1 + 2.6 * tipLight) * shade * (0.65 + 0.35 * abs(side)) * 1.6;
  col += uSunCol * spec * 0.2 * t * shade;
  col *= 1.0 + (gust - 0.5) * 0.24 * uWindAmp;
  vCol = col;

  vSnowCol = snowLight(shade);
  vSnowD = sd;
  vY = pos.y;
  vCap = uSnow * smoothstep(0.5, 1.0, t) * clamp(n.y * 0.6 + 0.5, 0.0, 1.0) * (1.0 - clear) * 0.85;

  vFog = fogAmount(dist);
  vFogCol = fogTint(-V);
  gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
}
`;

export const GRASS_FRAG = /* glsl */ `
${COMMON}
${FRAG_COMMON}
varying vec3 vCol;
varying vec3 vSnowCol;
varying float vY;
varying float vSnowD;
varying float vCap;
varying float vFog;
varying vec3 vFogCol;

void main() {
  vec3 col = mix(vCol, vSnowCol, vCap);
  if (vSnowD > 0.002) {
    float above = smoothstep(vSnowD - 0.012, vSnowD + 0.006, vY);
    col = mix(vSnowCol, col, above);
  }
  col = mix(col, vFogCol, vFog);
  gl_FragColor = vec4(finish(col), 1.0);
}
`;

/* ---------- ground ---------- */

export const GROUND_VERT = /* glsl */ `
varying vec3 vWP;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWP = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const GROUND_FRAG = /* glsl */ `
${COMMON}
${FRAG_COMMON}
uniform vec3 uGroundCol;
uniform vec3 uGroundFar;
uniform float uLitter;
uniform float uStripe;
uniform float uWinter;
varying vec3 vWP;

vec3 leafLitter(vec2 xz, vec3 base, float amount, float shade) {
  if (amount < 0.01) return base;
  vec2 q = xz * 5.0;
  vec2 cell = floor(q);
  vec2 f = fract(q) - 0.5;
  float h = hash12(cell);
  if (h > amount * 0.6) return base;
  float ang = hash12(cell + 4.1) * 6.2831;
  vec2 o = (vec2(hash12(cell + 1.7), hash12(cell + 8.3)) - 0.5) * 0.3;
  vec2 p = f - o;
  float cs = cos(ang);
  float sn = sin(ang);
  p = vec2(cs * p.x - sn * p.y, sn * p.x + cs * p.y);
  float len = 0.2 + 0.1 * hash12(cell + 2.9);
  vec2 lq = p / vec2(len * 0.62, len);
  float wd = sqrt(max(1.0 - lq.y * lq.y, 0.0)) * (1.0 - 0.3 * lq.y);
  float inside = (1.0 - smoothstep(wd - 0.15, wd, abs(lq.x))) * step(abs(lq.y), 1.0);
  float pick = hash12(cell + 6.6);
  vec3 lc = pick < 0.3 ? vec3(0.78, 0.33, 0.07) : pick < 0.55 ? vec3(0.62, 0.16, 0.05) : pick < 0.82 ? vec3(0.84, 0.58, 0.14) : vec3(0.4, 0.24, 0.09);
  lc *= 0.72 + 0.28 * smoothstep(0.0, 0.1, abs(lq.x));
  vec3 lit = lc * (uAmb * 1.1 + uSunCol * 0.45 * shade);
  return mix(base, lit, inside);
}

void main() {
  vec2 xz = vWP.xz;
  vec3 toP = vWP - cameraPosition;
  float dist = length(toP);
  vec3 V = -toP / dist;
  vec4 tr = trailAt(xz);
  float clear = smoothstep(0.04, 0.45, tr.z) * uWinter;
  float shade = cloudShade(xz);

  float n1 = vnoise(xz * 4.0);
  float n2 = vnoise(xz * 0.45);
  vec3 g = uGroundCol * (0.7 + 0.6 * n1) * (0.8 + 0.4 * n2);
  float far = smoothstep(2.0, 20.0, dist);
  g = mix(g, uGroundFar * (0.8 + 0.4 * n2), far);
  g *= 1.0 + uStripe * (stripeBand(xz) - 0.5) * 0.5;
  vec3 col = g * (uAmb + uSunCol * 0.5 * shade);
  col = leafLitter(xz, col, uLitter * (1.0 - smoothstep(5.0, 16.0, dist)), shade);

  // A cleared path is not bare earth: a thin, patchy film of packed snow and frost stays behind.
  float film = uWinter * (0.3 + 0.4 * smoothstep(0.25, 0.75, vnoise(xz * 9.0 + 3.1)));
  col = mix(col, snowLight(shade) * vec3(0.7, 0.74, 0.8), film);

  float sd = snowDepth(xz, clear);
  if (sd > 0.0004) {
    vec3 sn = snowLight(shade);
    // Snow piled at the edge of a cleared path catches more light.
    float ridge = smoothstep(0.0, 0.35, clear) * (1.0 - smoothstep(0.35, 0.9, clear));
    sn *= 1.0 + ridge * 0.18;
    vec2 cell = floor(xz * 70.0);
    float hh = hash12(cell);
    float tw = step(0.992, hh) * (0.55 + 0.45 * sin(uTime * 2.3 + hh * 300.0)) * (1.0 - smoothstep(1.5, 6.0, dist));
    sn += uSunCol * tw * 0.9;
    col = mix(col, sn, smoothstep(0.0, 0.022, sd));
  }

  col = mix(col, fogTint(-V), fogAmount(dist));
  gl_FragColor = vec4(finish(col), 1.0);
}
`;

/* ---------- sky, sun and the treeline ---------- */

export const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vec2 p = position.xy;
  gl_Position = vec4(p, 1.0, 1.0);
  vec4 v = inverse(projectionMatrix) * vec4(p, 1.0, 1.0);
  vDir = (inverse(viewMatrix) * vec4(v.xyz / v.w, 0.0)).xyz;
}
`;

export const SKY_FRAG = /* glsl */ `
${COMMON}
${FRAG_COMMON}
uniform vec3 uTreeCol;
uniform float uCloud;
uniform float uSunVis;
uniform float uBare;
varying vec3 vDir;

float crowns(float x) {
  // Rounded tree crowns: the top of overlapping circles.
  float c = floor(x);
  float f = fract(x) - 0.5;
  float r = 0.35 + 0.25 * hash12(vec2(c, 2.0));
  return sqrt(max(r * r - f * f, 0.0)) * (0.6 + 0.8 * hash12(vec2(c, 9.0)));
}

float treeline(float az) {
  float x = az * 9.0;
  float h = 0.012 + 0.012 * vnoise(vec2(x * 0.22, 3.1));
  float tall = smoothstep(0.55, 0.9, vnoise(vec2(x * 0.9, 5.0)));
  h += 0.016 * max(crowns(x * 6.0), crowns(x * 6.0 + 0.5) * 0.8) * (0.6 + tall);
  h += 0.012 * crowns(x * 2.3 + 0.3) * tall;
  h += 0.0035 * vnoise(vec2(x * 40.0, 1.3)) * (0.5 + uBare);
  return h;
}

void main() {
  vec3 d = normalize(vDir);
  float e = d.y;
  float sd = max(dot(d, uSunDir), 0.0);
  vec3 sky = mix(uSkyHor, uSkyTop, pow(smoothstep(-0.01, 0.3, e), 0.7));
  sky += uSunCol * (pow(sd, 8.0) * 0.2 * (1.0 - smoothstep(0.0, 0.3, e) * 0.6) + pow(sd, 90.0) * 0.5) * (0.6 + 0.4 * uSunVis);

  if (e > 0.0) {
    vec2 cp = d.xz / (e + 0.06);
    float c = fbm3(cp * vec2(0.2, 0.85) + vec2(uTime * 0.006, 0.0));
    float m = smoothstep(0.66 - uCloud * 0.22, 0.92, c) * smoothstep(0.01, 0.1, e) * (1.0 - smoothstep(0.32, 0.7, e));
    vec3 cc = mix(uSkyTop * 1.45 + vec3(0.025), uSunCol * 0.92, clamp(pow(sd, 3.0) * 0.9 + 0.12, 0.0, 1.0));
    sky = mix(sky, cc, m * 0.62);
  }

  sky += uSunCol * (smoothstep(0.99986, 0.99995, sd) * 1.3 + pow(sd, 2400.0) * 0.9) * uSunVis;

  float az = atan(d.x, -d.z);
  float th = treeline(az);
  float tm = 1.0 - smoothstep(th - 0.003, th + 0.003, e);
  float mist = 1.0 - smoothstep(-0.001, th * 0.95, e);
  vec3 tc = mix(uTreeCol, fogTint(d), 0.28);
  tc += uSunCol * pow(sd, 10.0) * 0.3;
  tc = mix(tc, fogTint(d), mist * mist);
  sky = mix(sky, tc, tm);
  gl_FragColor = vec4(finish(sky), 1.0);
}
`;

/* ---------- falling leaves ---------- */

export const LEAF_VERT = /* glsl */ `
${COMMON}
attribute vec4 aLeaf;   // x, z, phase, random
attribute vec3 aTint;
uniform float uFall;
uniform float uHeightK;
uniform vec2 uWind;
varying vec2 vUv;
varying vec3 vCol;
varying float vFog;
varying vec3 vFogCol;

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

void main() {
  float r = aLeaf.w;
  float P = 8.0 + r * 6.0;
  float cyc = uTime / P + aLeaf.z;
  float k = fract(cyc);
  float id = floor(cyc);
  vec2 base = aLeaf.xy + (vec2(hash12(vec2(id, r * 91.0)), hash12(vec2(r * 37.0, id))) - 0.5) * 1.4;

  float fallT = 0.42;
  float f = clamp(k / fallT, 0.0, 1.0);
  float H = 2.4 + r * 1.4;
  float restY = 0.07 * uHeightK + 0.02;
  float y = mix(H, restY, f);
  float air = 1.0 - f;
  vec2 drift = -uWind * air * 2.2 + vec2(sin(uTime * 1.6 + r * 20.0), cos(uTime * 1.25 + r * 11.0)) * 0.22 * air;
  vec3 c = vec3(base.x + drift.x, y, base.y + drift.y);

  float spin = uTime * (1.8 + r * 2.6) + r * 30.0;
  float landed = smoothstep(0.92, 1.0, f);
  float pitch = mix(-1.5708 + 1.1 * sin(spin), -1.5708, landed);
  float roll = mix(0.9 * cos(spin * 0.8), 0.0, landed);
  float yaw = r * 40.0 + air * spin * 0.3;
  mat3 R = rotY(yaw) * rotX(pitch) * rotZ(roll);

  // Present while falling in autumn, then lie on the lawn and fade.
  float life = uFall * (1.0 - smoothstep(0.86, 1.0, k)) * smoothstep(0.0, 0.04, k);
  float size = (0.032 + 0.022 * r) * life;
  vec3 local = vec3(position.x * 0.62, position.y, 0.0) * size;
  vec3 pos = c + R * local;

  vec3 n = R * vec3(0.0, 0.0, 1.0);
  vec3 toCam = cameraPosition - pos;
  float dist = length(toCam);
  vec3 V = toCam / dist;
  if (dot(n, V) < 0.0) n = -n;
  float shade = cloudShade(pos.xz);
  float wrap = clamp(dot(n, uSunDir) * 0.5 + 0.5, 0.0, 1.0);
  float back = pow(clamp(dot(-V, uSunDir), 0.0, 1.0), 3.0);
  vCol = aTint * (uAmb * 1.2 + uSunCol * wrap * 0.7 * shade) + aTint * uSunCol * back * 1.5 * shade;
  vUv = position.xy * 2.0;
  vFog = fogAmount(dist);
  vFogCol = fogTint(-V);
  gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
}
`;

export const LEAF_FRAG = /* glsl */ `
${COMMON}
${FRAG_COMMON}
varying vec2 vUv;
varying vec3 vCol;
varying float vFog;
varying vec3 vFogCol;
void main() {
  vec2 p = vUv;
  float wd = sqrt(max(1.0 - p.y * p.y, 0.0)) * (1.0 - 0.28 * p.y);
  float edge = abs(p.x) - wd;
  float stem = step(abs(p.x), 0.05) * step(p.y, -0.85) * step(-1.0, p.y);
  float a = max(1.0 - smoothstep(-0.08, 0.02, edge), stem);
  if (a < 0.02) discard;
  vec3 col = vCol * (0.78 + 0.22 * smoothstep(0.0, 0.07, abs(p.x)));
  col = mix(col, vFogCol, vFog);
  gl_FragColor = vec4(finish(col), a);
}
`;

/* ---------- snow and motes ---------- */

export const FLAKE_VERT = /* glsl */ `
${COMMON}
attribute vec4 aP;
uniform float uAmt;
uniform float uScale;
uniform float uMode;   // 0: falling snow, 1: drifting motes in the light
uniform vec2 uWind;
varying float vA;
varying float vBlur;
varying vec3 vC;

void main() {
  float d = mix(0.6, 15.0, aP.z);
  float hw = d * 0.75 + 0.4;
  float H = 3.4;
  vec3 p;
  if (uMode < 0.5) {
    float speed = 0.38 + aP.w * 0.42;
    p.y = H - mod(aP.y * H + uTime * speed, H);
    p.x = (fract(aP.x - uTime * 0.01 * (0.6 + aP.w) * uWind.x) * 2.0 - 1.0) * hw + sin(uTime * 0.9 + aP.w * 31.0) * 0.07;
  } else {
    p.y = 0.1 + aP.y * aP.y * 1.1 + sin(uTime * 0.35 + aP.x * 25.0) * 0.08;
    p.x = (fract(aP.x + uTime * 0.004 * (0.5 + aP.w)) * 2.0 - 1.0) * hw + cos(uTime * 0.27 + aP.w * 17.0) * 0.15;
  }
  p.z = -d;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  float depth = max(-mv.z, 0.05);
  float blur = smoothstep(1.4, 0.4, depth);
  float size = uMode < 0.5 ? (0.006 + 0.008 * aP.w * aP.w) : (0.0035 + 0.003 * aP.w);
  gl_PointSize = clamp(size * uScale / depth * (1.0 + blur * 1.6), 1.0, uMode < 0.5 ? 34.0 : 22.0);

  vec3 V = normalize(p - cameraPosition);
  float glow = pow(max(dot(V, uSunDir), 0.0), 5.0);
  float fade = smoothstep(0.0, 0.25, p.y) * smoothstep(H, H - 0.5, p.y) * (1.0 - smoothstep(9.0, 15.0, d));
  if (uMode < 0.5) {
    vC = snowLight(1.0) * 1.08 + uSunCol * glow * 0.4;
    vA = uAmt * fade * (1.0 - blur * 0.6) * 0.9;
  } else {
    vC = uSunCol * (0.6 + 1.6 * glow);
    vA = uAmt * fade * (0.18 + 0.9 * glow) * (1.0 - blur * 0.6);
  }
  vBlur = blur;
  gl_Position = projectionMatrix * mv;
}
`;

export const FLAKE_FRAG = /* glsl */ `
varying float vA;
varying float vBlur;
varying vec3 vC;
void main() {
  float r = length(gl_PointCoord - 0.5);
  float soft = mix(0.18, 0.5, vBlur);
  float a = (1.0 - smoothstep(0.5 - soft, 0.5, r)) * vA;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vC, a);
}
`;

/* ---------- the trail ---------- */

export const TRAIL_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const TRAIL_FRAG = /* glsl */ `
uniform sampler2D uPrev;
uniform vec4 uSeg;
uniform float uRadius;
uniform float uStamp;
uniform float uDecay;
uniform vec2 uMove;
uniform vec4 uTrailMap;
varying vec2 vUv;

vec2 uvToWorld(vec2 uv) {
  float d = uTrailMap.x * exp(uv.y * uTrailMap.y);
  float x = (uv.x - 0.5) * 2.0 * (d * uTrailMap.z + uTrailMap.w);
  return vec2(x, -d);
}

void main() {
  vec4 prev = texture2D(uPrev, vUv);
  float s = max(prev.z - uDecay, 0.0);
  vec2 dir = prev.xy * 2.0 - 1.0;
  if (uStamp > 0.5) {
    vec2 p = uvToWorld(vUv);
    vec2 a = uSeg.xy;
    vec2 ab = uSeg.zw - a;
    float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 0.000001), 0.0, 1.0);
    vec2 r = p - (a + ab * h);
    float dist = length(r);
    float k = 1.0 - smoothstep(uRadius * 0.35, uRadius, dist);
    if (k > 0.002) {
      vec2 radial = dist > 0.00001 ? r / dist : vec2(0.0);
      vec2 nd = radial * smoothstep(0.0, uRadius * 0.6, dist) + uMove * 0.55;
      float l = length(nd);
      nd = l > 0.0001 ? nd / l : vec2(0.0, -1.0);
      float wgt = k / max(k + s, 0.001);
      vec2 m = mix(dir, nd, wgt);
      float ml = length(m);
      dir = ml > 0.0001 ? m / ml : nd;
      s = max(s, k);
    }
  }
  gl_FragColor = vec4(dir * 0.5 + 0.5, s, 1.0);
}
`;
