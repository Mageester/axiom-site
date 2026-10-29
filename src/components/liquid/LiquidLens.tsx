/**
 * The liquid lens: a glossy, noise-displaced sphere that carries the studio's
 * client sites across its surface and dissolves to the next one every few
 * seconds. Ported from the approved prototype and hardened for production:
 * adaptive quality, true cover mapping in sRGB, an intro that materialises out
 * of a blur, a static poster until WebGL is ready (and forever for no-WebGL or
 * reduced motion), and a reel caption synced to the shader timeline.
 *
 * The island renders only the canvas. The hero copy, poster and reel caption
 * are server-rendered HTML that this component drives by id.
 */
import { useEffect, useRef } from 'react';
import {
  Clock,
  Color,
  DataTexture,
  IcosahedronGeometry,
  LinearFilter,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  Quaternion,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
  ClampToEdgeWrapping,
} from 'three';

export type LensProject = { name: string; kind: string; src: string };

type Props = {
  projects: LensProject[];
  /** The hero section the lens lives in; pointer and size come from it. */
  stageId: string;
  /** Element whose `data-reel-*` children show the current project. */
  reelId: string;
  /** Poster image shown until the scene is ready. */
  posterId: string;
  /** Seconds each site is held before the dissolve. */
  dwell?: number;
};

const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERT = `${NOISE}
uniform float uTime; uniform float uAmp; uniform float uFreq; uniform vec3 uMouse; uniform float uPulse;
varying vec3 vNormal; varying vec3 vView;
float field(vec3 p){
  float n = snoise(p*uFreq + vec3(0.0, uTime*0.18, uTime*0.11));
  n += 0.12*snoise(p*uFreq*1.8 - vec3(uTime*0.12));
  float toward = max(dot(p, normalize(uMouse + vec3(0.0001))), 0.0);
  float bulge = smoothstep(0.55, 1.0, toward) * length(uMouse) * 0.22;
  float ripple = uPulse * sin(22.0*toward - uTime*9.0) * 0.07 * toward;
  return n*uAmp + bulge + ripple;
}
vec3 disp(vec3 p){ vec3 n = normalize(p); return n*(1.0 + field(n)); }
void main(){
  vec3 p = normalize(position);
  vec3 up = abs(p.y) > 0.99 ? vec3(1.0,0.0,0.0) : vec3(0.0,1.0,0.0);
  vec3 t = normalize(cross(p, up)); vec3 b = normalize(cross(p, t));
  float e = 0.012;
  vec3 d0 = disp(p); vec3 d1 = disp(p + t*e); vec3 d2 = disp(p + b*e);
  vec3 nrm = normalize(cross(d1 - d0, d2 - d0));
  if (dot(nrm, p) < 0.0) nrm = -nrm;
  vNormal = normalize(normalMatrix * nrm);
  vec4 mv = modelViewMatrix * vec4(d0, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = `
uniform sampler2D uTexA; uniform sampler2D uTexB; uniform float uMix; uniform float uTime; uniform vec3 uTint;
uniform vec2 uAspectA; uniform vec2 uAspectB;
varying vec3 vNormal; varying vec3 vView;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float vnoise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x), mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x), u.y); }
vec3 pal(float t){ return 0.5 + 0.5*cos(6.28318*(t + vec3(0.0, 0.33, 0.67))); }
vec2 cover(vec2 uv, vec2 a){ return (uv - 0.5) * a + 0.5; }
vec3 site(vec2 uv, float m){
  vec3 a = texture2D(uTexA, cover(uv, uAspectA)).rgb;
  vec3 b = texture2D(uTexB, cover(uv, uAspectB)).rgb;
  return mix(a, b, m);
}
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 2.4);
  vec2 uv = N.xy * 0.44 + 0.5;
  uv += 0.02 * vec2(sin(uTime*0.31), cos(uTime*0.27));
  float n = vnoise(uv*5.0 + uTime*0.04)*0.75 + vnoise(uv*13.0)*0.25;
  float m = smoothstep(n - 0.06, n + 0.06, uMix*1.14 - 0.07);
  vec2 off = N.xy * (0.012 + fres*0.05);
  vec3 col = vec3(site(uv + off, m).r, site(uv, m).g, site(uv - off, m).b);
  vec3 L1 = normalize(vec3(-0.45, 0.7, 0.6));
  vec3 L2 = normalize(vec3(0.75, -0.25, 0.55));
  vec3 R = reflect(-V, N);
  float diff = 0.74 + 0.26*max(dot(N, L1), 0.0);
  col *= diff;
  col = pow(col, vec3(1.06));
  vec3 irid = mix(uTint, pal(fres*0.85 + N.y*0.18 + uTime*0.035), 0.3);
  col = mix(col, irid, fres*0.72);
  float spec = pow(max(dot(R, L1), 0.0), 90.0) * 1.35 + pow(max(dot(R, L1), 0.0), 12.0) * 0.12;
  float spec2 = pow(max(dot(R, L2), 0.0), 34.0) * 0.4;
  col += spec + spec2 * irid;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

/** Low-end hardware, phones and data saver get a lighter mesh and pixel ratio. */
function detectQuality() {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 8;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const low = cores <= 4 || memory <= 4 || coarse || nav.connection?.saveData === true;
  return low ? { detail: 24, dpr: 1.5 } : { detail: 40, dpr: 2 };
}

export default function LiquidLens({ projects, stageId, reelId, posterId, dwell = 5.5 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = document.getElementById(stageId);
    const reel = document.getElementById(reelId);
    const poster = document.getElementById(posterId);
    if (!canvas || !stage || projects.length === 0) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // In development, `?lens-poster` keeps the drawing buffer so a script can
    // export the rendered lens as the static poster (scripts/render-lens-poster.mjs).
    const posterMode = import.meta.env.DEV && new URLSearchParams(location.search).has('lens-poster');
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: posterMode,
      });
    } catch {
      return;
    }

    const quality = detectQuality();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.dpr));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;

    const scene = new Scene();
    const camera = new PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const blank = new DataTexture(new Uint8Array([20, 19, 27, 255]), 1, 1, RGBAFormat);
    blank.colorSpace = SRGBColorSpace;
    blank.needsUpdate = true;
    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.12 },
      uFreq: { value: 0.95 },
      uMouse: { value: new Vector3() },
      uPulse: { value: 0 },
      uMix: { value: 0 },
      uTexA: { value: blank as Texture },
      uTexB: { value: blank as Texture },
      uAspectA: { value: new Vector2(1, 1) },
      uAspectB: { value: new Vector2(1, 1) },
      uTint: { value: new Color('#8B7BFF') },
    };
    const material = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
    let geometry = new IcosahedronGeometry(1, quality.detail);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    // Textures: linear filtering, no mipmaps, sRGB, and a per-image "cover" scale
    // so every site fills the lens without stretching.
    const textures: Texture[] = [];
    const aspects: Vector2[] = [];
    const loader = new TextureLoader();
    const coverFor = (texture: Texture) => {
      const image = texture.image as { width: number; height: number };
      const r = image.width / image.height;
      return r > 1 ? new Vector2((1 / r) * 1.15, 1.15) : new Vector2(1.15, r * 1.15);
    };
    let ready = false;
    projects.forEach((project, index) => {
      loader.load(project.src, (texture) => {
        texture.minFilter = LinearFilter;
        texture.magFilter = LinearFilter;
        texture.generateMipmaps = false;
        texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
        texture.colorSpace = SRGBColorSpace;
        textures[index] = texture;
        aspects[index] = coverFor(texture);
        if (index === current) {
          uniforms.uTexA.value = texture;
          uniforms.uAspectA.value = aspects[index];
        }
      });
    });

    let width = 1;
    let height = 1;
    const base = new Vector3();
    const resize = () => {
      width = stage.clientWidth || 1;
      height = stage.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const wide = width > 860;
      const visH = 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const visW = visH * camera.aspect;
      // Keep in step with the poster's CSS: diameter = min(58cqh, 38cqw) at (76cqw, 44cqh) wide, min(56cqw, 30cqh) at (50cqw, 36cqh) narrow.
      const s = wide ? Math.min(visH * 0.29, visW * 0.19) : Math.min(visW * 0.28, visH * 0.15);
      mesh.scale.setScalar(s);
      base.set(wide ? visW * 0.26 : 0, wide ? visH * 0.06 : visH * 0.14, 0);
      mesh.position.copy(base);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(stage);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0, near: 0, tnear: 0 };
    const projected = new Vector3();
    const onMove = (event: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      mouse.tx = ((event.clientX - r.left) / r.width) * 2 - 1;
      mouse.ty = -(((event.clientY - r.top) / r.height) * 2 - 1);
      projected.set(mesh.position.x, mesh.position.y, 0).project(camera);
      const dx = mouse.tx - projected.x;
      const dy = mouse.ty - projected.y;
      mouse.tnear = Math.max(0, 1 - Math.hypot(dx * camera.aspect, dy) / 1.1);
    };
    const onLeave = () => {
      mouse.tx = 0;
      mouse.ty = 0;
      mouse.tnear = 0;
    };
    const onDown = () => {
      uniforms.uPulse.value = 1;
    };
    stage.addEventListener('pointermove', onMove, { passive: true });
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointerdown', onDown, { passive: true });

    // Reel caption and progress bars, driven from the shader timeline.
    const bars = reel ? Array.from(reel.querySelectorAll<HTMLElement>('[data-reel-bars] i')) : [];
    const setReel = (index: number) => {
      if (!reel) return;
      const project = projects[index];
      const num = reel.querySelector<HTMLElement>('[data-reel-index]');
      const name = reel.querySelector<HTMLElement>('[data-reel-name]');
      const kind = reel.querySelector<HTMLElement>('[data-reel-kind]');
      if (num) num.textContent = String(index + 1).padStart(2, '0');
      if (name) name.textContent = project.name;
      if (kind) kind.textContent = `· ${project.kind}`;
      bars.forEach((bar, k) => {
        bar.classList.remove('is-on', 'is-done');
        if (k < index) bar.classList.add('is-done');
      });
      const bar = bars[index];
      if (bar) {
        void bar.offsetWidth;
        bar.classList.add('is-on');
      }
    };
    reel?.style.setProperty('--dwell', `${dwell}s`);

    let current = 0;
    let next = projects.length > 1 ? 1 : 0;
    let phase: 'hold' | 'blend' = 'hold';
    let phaseT = 0;
    const TRANSITION = 1.8;

    let visible = true;
    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    });
    io.observe(stage);
    const onVisibility = () => {
      if (!document.hidden) clock.getDelta();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // A short FPS sample after the intro; a slow device drops to the light mesh and 1x pixels.
    let frames = 0;
    let sampleTime = 0;
    let sampled = false;

    const clock = new Clock();
    let t = 0;
    let raf = 0;
    const q = new Quaternion();
    const dir = new Vector3();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible || document.hidden) return;
      t += dt;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.near += (mouse.tnear - mouse.near) * 0.05;
      uniforms.uTime.value = t;
      uniforms.uAmp.value = 0.11 + mouse.near * 0.07 + uniforms.uPulse.value * 0.05;
      uniforms.uPulse.value *= 0.965;
      mesh.rotation.y = t * 0.08 + mouse.x * 0.5;
      mesh.rotation.x = -mouse.y * 0.35 + Math.sin(t * 0.3) * 0.05;
      const scrollK = Math.min(window.scrollY / Math.max(height, 1), 1);
      mesh.position.set(base.x + mouse.x * 0.12, base.y + mouse.y * 0.08 + scrollK * 0.6, 0);
      dir.set(mouse.x, mouse.y, 0.9).normalize().multiplyScalar(mouse.near);
      q.copy(mesh.quaternion).invert();
      uniforms.uMouse.value.copy(dir.applyQuaternion(q));

      phaseT += dt;
      if (phase === 'hold' && phaseT > dwell - TRANSITION && textures[next] && next !== current) {
        phase = 'blend';
        phaseT = 0;
        uniforms.uTexB.value = textures[next];
        uniforms.uAspectB.value = aspects[next];
        setReel(next);
      }
      if (phase === 'blend') {
        const k = Math.min(phaseT / TRANSITION, 1);
        uniforms.uMix.value = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        if (k >= 1) {
          current = next;
          next = (next + 1) % projects.length;
          uniforms.uTexA.value = textures[current];
          uniforms.uAspectA.value = aspects[current];
          uniforms.uMix.value = 0;
          phase = 'hold';
          phaseT = 0;
        }
      }
      renderer.render(scene, camera);

      if (!ready && textures[current]) {
        ready = true;
        canvas.classList.add('is-ready');
        poster?.setAttribute('data-hidden', '');
        setReel(current);
      }

      if (!sampled && ready) {
        frames += 1;
        sampleTime += dt;
        if (sampleTime > 2.5) {
          sampled = true;
          const fps = frames / sampleTime;
          if (fps < 45 && quality.detail > 24) {
            geometry.dispose();
            geometry = new IcosahedronGeometry(1, 24);
            mesh.geometry = geometry;
            renderer.setPixelRatio(1);
          }
        }
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointerdown', onDown);
      textures.forEach((texture) => texture.dispose());
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [projects, stageId, reelId, posterId, dwell]);

  return <canvas ref={canvasRef} className="lens-canvas" aria-hidden="true" />;
}
