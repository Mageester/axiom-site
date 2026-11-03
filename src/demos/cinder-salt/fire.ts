/**
 * The fire. A GLSL ES 3.00 fragment shader for the kit's runShader.
 *
 * Structure: ridged, domain-warped fractal noise sampled in a space that stretches upward with
 * height, so flames are fine and sharp at the base and taper into wisps that detach and vanish.
 * Colour: the flame is an HDR heat value, run through per-channel exposure so it climbs from
 * black through deep red, orange and gold to a white-hot core. A cheap low-frequency pass
 * stands in for bloom. Embers are tiny hot streaks stretched along their path.
 *
 * Extra uniforms (the page drives them from scroll and pointer):
 *   u_noise   256x256 random texture (bilinear value noise, one fetch per octave)
 *   u_level   flame height, 1 is a full roar, about 0.3 is a low bed of coals
 *   u_gain    overall brightness
 *   u_ember   how many sparks are in the air
 *   u_stoke   extra heat, from pressing, or from scrolling fast
 *   u_wind    pointer velocity, bends the flames and carries sparks
 *   u_off     1 hides the fire completely and skips all the work
 *   u_hero    1 while the name is whole on screen: a minimum coal glow and taller flames in tall stacks
 *   u_oct     octaves of fine detail (6 on desktop, 4 on phones)
 */
export const fireFrag = /* glsl */ `
uniform sampler2D u_noise;
uniform float u_level;
uniform float u_gain;
uniform float u_ember;
uniform float u_stoke;
uniform float u_off;
uniform float u_oct;
uniform float u_hero;
uniform vec2 u_wind;

float vn(vec2 x) {
  vec2 p = floor(x);
  vec2 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return textureLod(u_noise, (p + f + 0.5) / 256.0, 0.0).r;
}

const mat2 ROT = mat2(1.6, 1.2, -1.2, 1.6);

// smooth fractal noise, used for slow things (envelopes, warps, glow)
float fbm3(vec2 p) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 3; i++) {
    s += a * vn(p);
    p = ROT * p + 3.7;
    a *= 0.5;
  }
  return s;
}

// ridged noise: sharp creases become filaments and the edges of tongues
float ridged(vec2 p) {
  float a = 0.55;
  float s = 0.0;
  for (int i = 0; i < 6; i++) {
    if (float(i) >= u_oct) break;
    float n = 1.0 - abs(2.0 * vn(p) - 1.0);
    n *= n;
    s += a * n;
    p = ROT * p + 3.7;
    a *= 0.52;
  }
  return s;
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Heat to light. Each channel has its own exposure, so red saturates first, then green, then blue.
vec3 blackbody(float I) {
  vec3 c = I * vec3(1.55, 0.46, 0.065);
  c.b += I * I * I * 0.0065;
  c.g += I * I * 0.012;
  return c;
}

// A layer of embers. Each cell holds at most one, small and bright, stretched along its path.
vec3 embers(vec2 p, float t, float scale, float speed, float seed, float density, float size) {
  vec2 q = vec2(p.x * scale, p.y * scale - t * speed);
  q.x += sin(p.y * scale * 0.7 + seed + t * 0.7) * 0.4;
  q.x += u_wind.x * p.y * scale * 2.5;
  vec2 id = floor(q);
  vec2 f = fract(q) - 0.5;
  float r = hash(id + seed);
  float r2 = hash(id * 1.7 + seed + 9.1);
  float r3 = hash(id * 2.3 + seed + 31.7);
  float alive = step(1.0 - density * (0.25 + 0.75 * u_ember), r2);
  float ph = t * (1.2 + r2 * 2.5) + r * 40.0;
  f.x += (r - 0.5) * 0.42 + sin(ph) * 0.1;
  f.y += (r3 - 0.5) * 0.42 + cos(ph * 0.7) * 0.05;
  // lean the streak with the sideways drift of the spark
  float lean = cos(ph) * 0.5 + u_wind.x * 0.9;
  vec2 d = vec2(f.x - f.y * lean, f.y * 0.24);
  float sz = size * (0.3 + 1.4 * r3 * r3);
  float dist = length(d) / sz;
  float core = exp(-dist * dist * 2.2);
  float halo = exp(-dist * 0.55) * 0.05;
  float age = clamp(p.y * 1.05 + (r3 - 0.5) * 0.4, 0.0, 1.4);
  float fade = smoothstep(1.15, 0.05, age);
  float flick = 0.45 + 0.55 * sin(t * (7.0 + r * 12.0) + r * 60.0);
  float hot = 0.5 + 0.5 * fade;
  return vec3(1.0, 0.5 + 0.35 * hot, 0.14 + 0.3 * hot) * (core * 7.0 + halo * 2.0) * fade * flick * alive * (0.4 + 0.9 * r);
}

void main() {
  if (u_off > 0.5) {
    o = vec4(0.0);
    return;
  }
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  float t = u_time;
  vec2 p = vec2(uv.x * asp, uv.y);
  vec2 ptr = vec2(u_pointer.x * asp, u_pointer.y);

  // the pointer is a bellows: heat gathers near it and the flames lean with its motion
  vec2 dp = (p - ptr) * vec2(1.0, 0.8);
  float near = exp(-dot(dp, dp) * 5.0);
  float lean = uv.y * uv.y;
  p.x -= u_wind.x * (0.12 + 1.8 * lean);
  p.x -= (ptr.x - p.x) * near * 0.12 * smoothstep(0.0, 0.5, uv.y);

  // how high the fire stands at this x, wandering
  float slow = fbm3(vec2(p.x * 1.9, t * 0.3));
  float quick = vn(vec2(p.x * 6.5, t * 1.3 + 11.0));
  float tall = smoothstep(1.0, 0.55, asp);
  float H = u_level * (0.72 + 0.7 * slow) * (0.72 + 0.5 * quick) * (1.0 + 0.5 * tall * u_hero);
  H += near * (0.08 + 0.5 * u_stoke) * u_level;
  H = max(H, 0.04);
  float g = clamp(1.0 - uv.y / H, -1.0, 1.0);

  // height is stretched as it climbs: tall strands low down, long wisps higher up
  float ys = 1.0 - exp(-1.5 * uv.y);
  float rise = t * 1.7;
  vec2 q = vec2(p.x * 3.4, ys * 1.6 - rise * 0.5);
  vec2 w = vec2(fbm3(q * 0.8 + vec2(0.0, 2.0)), fbm3(q * 0.8 + vec2(5.2, 1.3) - vec2(0.0, rise * 0.12)));
  float sway = 0.35 + 1.5 * uv.y;
  vec2 np = vec2(p.x * 9.0, ys * 3.2 - rise) + (w - 0.5) * vec2(2.0, 0.9) * sway;
  float n = ridged(np);

  // a tongue exists where the noise beats a threshold that climbs with height
  float thr = mix(0.2, 0.7, smoothstep(1.0, -0.15, g));
  float heat = (n - thr) * (2.9 + 1.0 * g);
  // a bed of coals for the fire to stand on
  float bed = smoothstep(0.16, 0.0, uv.y) * (0.4 + 0.8 * fbm3(vec2(p.x * 11.0, p.y * 13.0 + t * 0.15)));
  heat += bed * 0.5;
  heat += u_stoke * 0.3 * exp(-uv.y * 3.0);
  heat = max(heat, 0.0);
  float body = smoothstep(0.0, 0.12, heat);
  float I = pow(heat, 1.6) * 1.05 * body;

  // soft bloom: a coarse pass of the same fire, spread wide
  float lowN = fbm3(vec2(p.x * 3.0 + (w.x - 0.5) * 0.8, ys * 1.2 - rise * 0.35));
  float env = max(1.2 * g + 1.7 * (lowN - 0.44), 0.0);
  float glowAmt = env * env * 0.5 * smoothstep(1.0, 0.0, uv.y * 0.9 / max(u_level, 0.2));
  vec3 col = blackbody(I) + vec3(1.0, 0.2, 0.035) * glowAmt * (0.3 + 0.12 * u_stoke);

  // in the hero a deep ember glow stays under every letter, so the name never vanishes
  col += vec3(0.085, 0.012, 0.005) * smoothstep(0.55, 1.1, u_level) * (0.5 + 0.9 * fbm3(vec2(p.x * 5.0, p.y * 3.0 - t * 0.5)));

  // while the name is on screen, a bed of hot coals glows under every letter so it never goes dark
  col += vec3(0.30, 0.05, 0.012) * u_hero * (0.55 + 0.6 * fbm3(vec2(p.x * 3.0, p.y * 2.0 - t * 0.25)));

  col *= u_gain;

  vec3 em = embers(p, t, 8.0, 0.55, 0.0, 0.07, 0.034);
  em += embers(p + 3.1, t, 13.0, 0.85, 7.0, 0.06, 0.03);
  em += embers(p + 7.7, t, 5.0, 0.38, 13.0, 0.045, 0.045);
  col += em * u_ember;

  // filmic shoulder: hot cores roll off to white and glow instead of clipping
  col = 1.0 - exp(-col * 1.15);
  col = pow(col, vec3(0.92));
  o = vec4(col, 1.0);
}
`;
