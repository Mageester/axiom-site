/**
 * A three.js stage for the demos that need real 3D, with the same manners as the
 * shaders: paused off screen, a capped pixel ratio that steps down on slow devices,
 * and a still frame with reduced motion or software WebGL. Import only what you use
 * from 'three' so the bundle stays small.
 */
import { PerspectiveCamera, Scene, SRGBColorSpace, WebGLRenderer } from 'three';
import { createLoop, isSoftwareGL, type Loop } from './gl';

export type Stage = {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  loop: Loop;
};

/**
 * Returns null and sets `html.no-gl` when WebGL is unavailable, so give the canvas's
 * parent a CSS background that stands in for the scene.
 */
export function createStage(
  canvas: HTMLCanvasElement,
  onFrame: (time: number, dt: number, stage: Omit<Stage, 'loop'>) => void,
  options: { fov?: number; maxDpr?: number; onResize?: (aspect: number) => void } = {},
): Stage | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    document.documentElement.classList.add('no-gl');
    return null;
  }
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(options.fov ?? 30, 1, 0.1, 200);
  const maxDpr = options.maxDpr ?? (matchMedia('(pointer: coarse)').matches ? 1.5 : 2);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));

  const resize = () => {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    options.onResize?.(camera.aspect);
  };
  resize();
  new ResizeObserver(() => {
    resize();
    loop.invalidate();
  }).observe(canvas);

  const parts = { renderer, scene, camera };
  const loop = createLoop(
    canvas,
    (time, dt) => {
      onFrame(time, dt, parts);
      renderer.render(scene, camera);
    },
    {
      still: isSoftwareGL(renderer.getContext()),
      onSlow: (level) => {
        renderer.setPixelRatio(level === 1 ? 1.25 : 1);
        resize();
      },
    },
  );

  return { ...parts, loop };
}
