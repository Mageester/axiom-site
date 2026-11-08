/**
 * Silk shading. The sheet is "shot" silk: warp and weft catch the light in two colours.
 *
 *  - Two anisotropic (Kajiya-Kay) lobes. One follows the weft, so highlights run as long
 *    streaks down each fold; the other follows the warp, a broad warm sheen across the folds.
 *    Slight unevenness in the threads (slubs) breaks both into fine strands.
 *  - Soft wrapped diffuse with a warm band at the terminator, and fold shadowing from the
 *    simulation, darker in the valleys.
 *  - Light through the cloth: a warm back light glows through thin areas and turns brightest
 *    when you look toward it, and the key light shows through wherever the sheet turns away.
 *  - A grazing sheen at the edges, a double-layer hem, filmic tone mapping and dither.
 */
export const SILK_VERTEX = /* glsl */ `
attribute vec3 aTan;
attribute float aFold;
varying vec3 vPos;
varying vec3 vN;
varying vec3 vT;
varying vec2 vUv;
varying float vFold;

void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vPos = wp.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vT = normalize(mat3(modelMatrix) * aTan);
  vUv = uv;
  vFold = aFold;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

export const SILK_FRAGMENT = /* glsl */ `
uniform vec3 uKeyDir;
uniform vec3 uKeyCol;
uniform vec3 uBackDir;
uniform vec3 uBackCol;
uniform vec3 uSky;
uniform vec3 uGround;
uniform vec3 uBase;
uniform vec3 uStreak;
uniform vec3 uSheen;
uniform vec3 uGlow;
uniform vec4 uGlowSpot;
uniform float uGlowGain;
uniform float uExposure;
uniform float uFoldScale;
uniform float uTime;

varying vec3 vPos;
varying vec3 vN;
varying vec3 vT;
varying vec2 vUv;
varying float vFold;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), f.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), f.x), f.y);
}

// Bright where the half vector crosses the thread at right angles.
float strand(vec3 t, vec3 h, float e) {
  float d = dot(t, h);
  return pow(clamp(1.0 - d * d, 0.0, 1.0), e);
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  float side = gl_FrontFacing ? 1.0 : -1.0;
  vec3 N = normalize(vN) * side;
  vec3 V = normalize(cameraPosition - vPos);
  // where the interpolated normal turns away at a silhouette, lean it back toward the eye
  N = normalize(N + V * max(0.0, 0.12 - dot(N, V)));
  float nv = clamp(dot(N, V), 0.0, 1.0);

  vec3 warp = normalize(vT - N * dot(vT, N));
  vec3 weft = normalize(cross(N, warp));
  float slubA = vnoise(vec2(vUv.x * 150.0, vUv.y * 3.0)) - 0.5;
  float slubB = vnoise(vec2(vUv.x * 3.0, vUv.y * 120.0)) - 0.5;
  vec3 weftS = normalize(weft + warp * slubB * 0.06);
  vec3 warpS = normalize(warp + weft * slubA * 0.08);

  float fold = clamp(vFold * side * uFoldScale, -1.0, 1.0);
  float valley = max(fold, 0.0);
  float ao = clamp(1.0 - valley * 0.75, 0.42, 1.0);
  float crest = clamp(-fold, 0.0, 1.0);

  // the hem is a second layer of silk: a touch denser, a little more sheen
  float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float hem = 1.0 - smoothstep(0.006, 0.014, edge);

  vec3 L = normalize(uKeyDir);
  float ndl = dot(N, L);
  float wrapL = clamp((ndl + 0.35) / 1.35, 0.0, 1.0);

  // body: a modest diffuse, so the sheen carries the form
  vec3 col = uBase * uKeyCol * (wrapL * wrapL) * ao;
  col += uBase * mix(uGround, uSky, N.y * 0.5 + 0.5) * mix(0.5, 1.0, ao);
  // warmth where light turns into shadow, as it does in thin fabric
  float term = smoothstep(-0.4, 0.05, ndl) * (1.0 - smoothstep(0.05, 0.5, ndl));
  col += uGlow * uBase * uKeyCol * term * 0.18 * ao;

  // shot silk: long cool streaks down the folds, a broad warm sheen across them
  vec3 H = normalize(L + V);
  float lit = smoothstep(-0.2, 0.35, ndl) * smoothstep(0.0, 0.2, nv);
  float streak = strand(weftS, H, 36.0) * 0.9 + strand(weftS, H, 160.0) * 0.5 + strand(weftS, H, 8.0) * 0.12;
  float sheen = strand(warpS, H, 5.0);
  col += uKeyCol * (uStreak * streak * 0.95 + uSheen * sheen * 0.14) * lit * mix(0.3, 1.0, ao) * (1.0 + hem * 0.5) * (0.85 + crest * 0.4);

  // a cooler streak from the sky, so the shadow side is never flat
  vec3 Hs = normalize(vec3(0.2, 1.0, 0.25) + V);
  col += uSky * uStreak * strand(weftS, Hs, 28.0) * 0.5 * ao * smoothstep(0.0, 0.3, nv);

  // grazing sheen
  float fres = pow(1.0 - nv, 3.0);
  col += mix(uSky, uSheen * 0.35, 0.4) * fres * 0.7 * mix(0.4, 1.0, ao);

  // light through the cloth: a warm window behind the sheet, strongest where it is thin and facing away
  vec3 B = normalize(uBackDir);
  float thin = ao * (1.0 - hem * 0.55);
  float backside = clamp(-dot(N, B), 0.0, 1.0);
  vec2 sp = (vPos.xy - uGlowSpot.xy) / uGlowSpot.z;
  float spot = exp(-dot(sp, sp)) * uGlowSpot.w;
  float through = pow(clamp(dot(V, -B), 0.0, 1.0), 10.0);
  col += uGlow * uBackCol * (backside * backside * (0.05 + spot * 0.6) + through * spot * 0.5) * thin * uGlowGain;
  col += uGlow * uKeyCol * clamp(-ndl, 0.0, 1.0) * 0.12 * thin;

  col *= uExposure;
  col = aces(col);
  col = pow(col, vec3(1.0 / 2.2));
  col += (hash12(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;
