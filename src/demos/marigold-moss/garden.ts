/**
 * The stage the flowers grow on. A thin layer over the kit's three.js stage that adds depth of
 * field the cheap way: blooms are sorted into three planes. The far plane is drawn small and
 * blurred, the middle plane is drawn sharp, the near plane is blurred heavily and laid on top.
 */
import {
  CustomBlending,
  LinearFilter,
  Mesh,
  OneFactor,
  OneMinusSrcAlphaFactor,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type Object3D,
} from 'three';
import { createStage, type Stage } from '../_kit/stage3d';
import { TIME } from './flora';

export type Cam = { az: number; el: number; dist: number; tx: number; ty: number; tz: number; ox: number; oy: number };

const QUAD_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

// Nine-tap gaussian in five fetches, using the linear filter to sample between texels.
const BLUR_FRAG = /* glsl */ `
uniform sampler2D tSrc;
uniform vec2 uStep;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(tSrc, vUv) * 0.2270270270;
  c += texture2D(tSrc, vUv + uStep * 1.3846153846) * 0.3162162162;
  c += texture2D(tSrc, vUv - uStep * 1.3846153846) * 0.3162162162;
  c += texture2D(tSrc, vUv + uStep * 3.2307692308) * 0.0702702703;
  c += texture2D(tSrc, vUv - uStep * 3.2307692308) * 0.0702702703;
  gl_FragColor = c;
}`;

const COMPOSITE_FRAG = /* glsl */ `
uniform sampler2D tSrc;
uniform float uAlpha;
varying vec2 vUv;
void main() {
  gl_FragColor = texture2D(tSrc, vUv) * uAlpha;
}`;

const rad = Math.PI / 180;

export type Garden = {
  stage: Stage;
  far: Scene;
  mid: Scene;
  near: Scene;
  cam: Cam;
  /** Blur radii, in pixels of a quarter-size image. */
  blur: { far: number; near: number };
  /** Pointer parallax, -1 to 1. */
  parallax: { x: number; y: number };
  add: (layer: 'far' | 'mid' | 'near', obj: Object3D) => void;
  project: (x: number, y: number, z: number) => { x: number; y: number };
};

export function createGarden(
  canvas: HTMLCanvasElement,
  options: { low: boolean; dof: boolean; fov?: number; onFrame: (time: number, dt: number) => void; fit?: (aspect: number) => number },
): Garden | null {
  const far = new Scene();
  const near = new Scene();
  const cam: Cam = { az: 0, el: 10, dist: 10, tx: 0, ty: 0, tz: 0, ox: 0, oy: 0 };
  const blur = { far: 3, near: 6 };
  const parallax = { x: 0, y: 0 };
  let aspect = 1.6;

  const quad = new PlaneGeometry(2, 2);
  const blurMat = new ShaderMaterial({
    uniforms: { tSrc: { value: null }, uStep: { value: new Vector2() } },
    vertexShader: QUAD_VERT,
    fragmentShader: BLUR_FRAG,
    depthTest: false,
    depthWrite: false,
  });
  const blurScene = new Scene();
  const blurQuad = new Mesh(quad, blurMat);
  blurQuad.frustumCulled = false;
  blurScene.add(blurQuad);

  const composite = (order: number, transparent: boolean) => {
    const material = new ShaderMaterial({
      uniforms: { tSrc: { value: null }, uAlpha: { value: 1 } },
      vertexShader: QUAD_VERT,
      fragmentShader: COMPOSITE_FRAG,
      depthTest: false,
      depthWrite: false,
      transparent,
      blending: CustomBlending,
      blendSrc: OneFactor,
      blendDst: OneMinusSrcAlphaFactor,
      blendSrcAlpha: OneFactor,
      blendDstAlpha: OneMinusSrcAlphaFactor,
    });
    const mesh = new Mesh(quad, material);
    mesh.frustumCulled = false;
    mesh.renderOrder = order;
    return mesh;
  };
  const backQuad = composite(-10, false);
  const frontQuad = composite(10, true);

  const targets: WebGLRenderTarget[] = [];
  const makeTarget = (depth: boolean) => {
    const t = new WebGLRenderTarget(4, 4, { depthBuffer: depth, minFilter: LinearFilter, magFilter: LinearFilter, generateMipmaps: false });
    targets.push(t);
    return t;
  };
  const rtScene = makeTarget(true);
  const rtA = makeTarget(false);
  const rtFar = makeTarget(false);
  const rtNear = makeTarget(false);
  const size = new Vector2();
  let sized = '';

  let stage: Stage | null = null;

  const runBlur = (src: WebGLRenderTarget, dst: WebGLRenderTarget, radius: number, passes: number) => {
    const renderer = stage!.renderer;
    let from = src;
    for (let i = 0; i < passes; i++) {
      const r = radius * (1 + i * 0.75);
      blurMat.uniforms.tSrc.value = from.texture;
      blurMat.uniforms.uStep.value.set(r / from.width, 0);
      renderer.setRenderTarget(rtA);
      renderer.render(blurScene, stage!.camera);
      blurMat.uniforms.tSrc.value = rtA.texture;
      blurMat.uniforms.uStep.value.set(0, r / rtA.height);
      renderer.setRenderTarget(dst);
      renderer.render(blurScene, stage!.camera);
      from = dst;
    }
  };

  stage = createStage(
    canvas,
    (time, dt, parts) => {
      const { camera, renderer } = parts;
      TIME.value = time;
      options.onFrame(time, dt);

      const fit = options.fit ? options.fit(aspect) : 1;
      const az = (cam.az + parallax.x * 2.6) * rad;
      const el = (cam.el - parallax.y * 1.6) * rad;
      const dist = cam.dist * fit;
      camera.position.set(
        cam.tx + dist * Math.cos(el) * Math.sin(az),
        cam.ty + dist * Math.sin(el),
        cam.tz + dist * Math.cos(el) * Math.cos(az),
      );
      camera.lookAt(cam.tx, cam.ty, cam.tz);
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      camera.setViewOffset(w, h, -cam.ox * w, cam.oy * h, w, h);
      camera.updateMatrixWorld();

      if (!options.dof) return;
      renderer.getDrawingBufferSize(size);
      const key = `${size.x}x${size.y}`;
      if (key !== sized) {
        sized = key;
        const hw = Math.max(2, Math.round(size.x / 2));
        const hh = Math.max(2, Math.round(size.y / 2));
        const qw = Math.max(2, Math.round(size.x / 4));
        const qh = Math.max(2, Math.round(size.y / 4));
        rtScene.setSize(hw, hh);
        rtA.setSize(qw, qh);
        rtFar.setSize(qw, qh);
        rtNear.setSize(qw, qh);
      }
      if (far.children.length) {
        renderer.setRenderTarget(rtScene);
        renderer.render(far, camera);
        runBlur(rtScene, rtFar, blur.far, 2);
        backQuad.visible = true;
      } else backQuad.visible = false;
      if (near.children.length) {
        renderer.setRenderTarget(rtScene);
        renderer.render(near, camera);
        runBlur(rtScene, rtNear, blur.near, 2);
        frontQuad.visible = true;
      } else frontQuad.visible = false;
      renderer.setRenderTarget(null);
    },
    {
      fov: options.fov ?? 28,
      maxDpr: options.low ? 1.5 : 1.75,
      onResize: (a) => (aspect = a),
    },
  );
  if (!stage) return null;

  (backQuad.material as ShaderMaterial).uniforms.tSrc.value = rtFar.texture;
  (frontQuad.material as ShaderMaterial).uniforms.tSrc.value = rtNear.texture;
  if (options.dof) stage.scene.add(backQuad, frontQuad);

  const layers = { far, mid: stage.scene, near };
  const projected = new Vector3();

  return {
    stage,
    far,
    mid: stage.scene,
    near,
    cam,
    blur,
    parallax,
    add: (layer, obj) => {
      // Without depth of field, every plane is drawn sharp in one pass.
      (options.dof ? layers[layer] : stage!.scene).add(obj);
    },
    project: (x, y, z) => {
      const v = projected.set(x, y, z).project(stage!.camera);
      return { x: (v.x * 0.5 + 0.5) * canvas.clientWidth, y: (-v.y * 0.5 + 0.5) * canvas.clientHeight };
    },
  };
}
