/**
 * Lightweight GPU helpers. `createLoop` is the frame loop every effect uses: it only
 * runs while its element is on screen and the tab is visible, steps quality down on
 * slow devices, and draws a single still frame with reduced motion or software WebGL.
 * `runShader` draws a fullscreen fragment shader with no 3D library at all, so a
 * shader demo costs about a kilobyte of code.
 */
import { reducedMotion } from './motion';

export type Loop = { stop: () => void; invalidate: () => void };

export function isSoftwareGL(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  try {
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    return /swiftshader|llvmpipe|software|mesa offscreen/i.test(name);
  } catch {
    return false;
  }
}

/**
 * @param onFrame called with seconds since start and the capped frame delta
 * @param options.still draw once and stop, for reduced motion or software rendering
 * @param options.onSlow called with 1, then 2, as sustained frame times get too long
 */
export function createLoop(
  target: Element,
  onFrame: (time: number, dt: number) => void,
  options: { still?: boolean; onSlow?: (level: number) => void } = {},
): Loop {
  const still = options.still || reducedMotion;
  let raf = 0;
  let visible = true;
  let last = 0;
  let time = 0;
  let stopped = false;
  let samples = 0;
  let total = 0;
  let level = 0;

  const tick = (now: number) => {
    raf = 0;
    if (stopped) return;
    const delta = last ? (now - last) / 1000 : 0.016;
    last = now;
    time += Math.min(delta, 0.05);
    onFrame(time, Math.min(delta, 0.05));
    if (still) return;
    samples += 1;
    total += delta;
    if (samples >= 45) {
      if (total / samples > 0.03 && level < 2) {
        level += 1;
        options.onSlow?.(level);
      }
      samples = 0;
      total = 0;
    }
    schedule();
  };
  const schedule = () => {
    if (!raf && visible && !document.hidden && !stopped) raf = requestAnimationFrame(tick);
  };
  const wake = () => {
    last = 0;
    samples = 0;
    total = 0;
    schedule();
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !still) wake();
  });
  observer.observe(target);
  const onVisibility = () => {
    if (!still) wake();
  };
  document.addEventListener('visibilitychange', onVisibility);
  raf = requestAnimationFrame(tick);

  return {
    stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    },
    invalidate() {
      if (still) raf = requestAnimationFrame(tick);
    },
  };
}

export type ShaderUniforms = Record<string, number | number[]>;

export type Shader = {
  gl: WebGL2RenderingContext;
  /** Change these freely; they are sent to the GPU every frame. */
  uniforms: ShaderUniforms;
  loop: Loop;
};

const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

/**
 * Runs a GLSL ES 3.00 fragment shader over the whole canvas. Write the shader body with
 * a `main()` that sets `out vec4 o`. These uniforms are always provided:
 *
 *   u_time     seconds
 *   u_res      canvas size in pixels
 *   u_pointer  pointer position, 0 to 1 with y up, smoothed
 *   u_scroll   page scroll progress, 0 to 1
 *
 * Declare your own with `uniform` and set initial values in `uniforms`. Returns null and
 * sets `html.no-gl` when WebGL2 is unavailable, so give the canvas's parent a CSS
 * background that stands in for the effect.
 */
export function runShader(
  canvas: HTMLCanvasElement,
  fragment: string,
  options: {
    uniforms?: ShaderUniforms;
    maxDpr?: number;
    onFrame?: (time: number, dt: number, uniforms: ShaderUniforms) => void;
  } = {},
): Shader | null {
  const fail = () => {
    document.documentElement.classList.add('no-gl');
    return null;
  };
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, powerPreference: 'high-performance' });
  if (!gl) return fail();

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
    }
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, `#version 300 es\nprecision highp float;\nout vec4 o;\nuniform float u_time;\nuniform vec2 u_res;\nuniform vec2 u_pointer;\nuniform float u_scroll;\n${fragment}`));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return fail();
  }
  gl.useProgram(program);
  gl.bindVertexArray(gl.createVertexArray());

  const uniforms: ShaderUniforms = { ...options.uniforms };
  const locations = new Map<string, WebGLUniformLocation | null>();
  const locate = (name: string) => {
    if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
    return locations.get(name) ?? null;
  };

  let scale = 1;
  const maxDpr = options.maxDpr ?? 1.5;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr) * scale;
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };
  new ResizeObserver(() => {
    resize();
    loop.invalidate();
  }).observe(canvas);

  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  window.addEventListener(
    'pointermove',
    (event) => {
      const r = canvas.getBoundingClientRect();
      pointer.tx = (event.clientX - r.left) / Math.max(r.width, 1);
      pointer.ty = 1 - (event.clientY - r.top) / Math.max(r.height, 1);
    },
    { passive: true },
  );

  const software = isSoftwareGL(gl);
  const loop = createLoop(
    canvas,
    (time, dt) => {
      resize();
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      options.onFrame?.(time, dt, uniforms);
      gl.uniform1f(locate('u_time'), time);
      gl.uniform2f(locate('u_res'), canvas.width, canvas.height);
      gl.uniform2f(locate('u_pointer'), pointer.x, pointer.y);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      gl.uniform1f(locate('u_scroll'), max > 0 ? window.scrollY / max : 0);
      for (const [name, value] of Object.entries(uniforms)) {
        const location = locate(name);
        if (!location) continue;
        if (typeof value === 'number') gl.uniform1f(location, value);
        else if (value.length === 2) gl.uniform2fv(location, value);
        else if (value.length === 3) gl.uniform3fv(location, value);
        else if (value.length === 4) gl.uniform4fv(location, value);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    {
      still: software,
      onSlow: (level) => {
        scale = level === 1 ? 0.75 : 0.5;
      },
    },
  );

  return { gl, uniforms, loop };
}
