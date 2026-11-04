import { runShader, isSoftwareGL, type Shader } from '../_kit/gl';
import { fireFrag } from './fire';

/** The values the page animates; the fire reads them every frame. */
export const fx = {
  level: 0.0,
  gain: 1.0,
  ember: 1.0,
  stoke: 0.0,
  off: 0,
  hero: 0,
};

let shader: Shader | null = null;
const wind = { x: 0, y: 0, tx: 0, ty: 0 };
let pressed = 0;

function noiseTexture(gl: WebGL2RenderingContext) {
  const size = 256;
  const data = new Uint8Array(size * size);
  let s = 0x9e3779b9;
  for (let i = 0; i < data.length; i++) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    data[i] = (s >>> 0) & 255;
  }
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, size, size, 0, gl.RED, gl.UNSIGNED_BYTE, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
}

/** Starts the fire on a canvas. Returns false when WebGL is unavailable. */
export function startFire(canvas: HTMLCanvasElement): boolean {
  const coarse = matchMedia('(pointer: coarse)').matches;
  shader = runShader(canvas, fireFrag, {
    maxDpr: coarse ? 1.25 : 1.5,
    uniforms: { u_level: 0, u_gain: 1, u_ember: 1, u_stoke: 0, u_off: 0, u_hero: 0, u_oct: coarse ? 4 : 6, u_wind: [0, 0] },
    onFrame: (_time, _dt, u) => {
      wind.x += (wind.tx - wind.x) * 0.12;
      wind.y += (wind.ty - wind.y) * 0.12;
      wind.tx *= 0.93;
      wind.ty *= 0.93;
      pressed *= 0.96;
      u.u_level = fx.level;
      u.u_gain = fx.gain;
      u.u_ember = fx.ember;
      u.u_stoke = Math.min(1.4, fx.stoke + pressed);
      u.u_off = fx.off;
      u.u_hero = fx.hero;
      u.u_wind = [wind.x, wind.y];
    },
  });
  if (!shader) return false;
  const gl = shader.gl;
  if (isSoftwareGL(gl)) {
    // software rendering would crawl: use the static gradient instead
    shader.loop.stop();
    document.documentElement.classList.add('no-gl');
    return false;
  }
  noiseTexture(gl);
  const program = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram;
  gl.uniform1i(gl.getUniformLocation(program, 'u_noise'), 0);

  let lx = -1;
  let ly = -1;
  window.addEventListener(
    'pointermove',
    (event) => {
      if (lx >= 0) {
        wind.tx = Math.max(-1.2, Math.min(1.2, wind.tx + ((event.clientX - lx) / innerWidth) * 7));
        wind.ty = Math.max(-1.2, Math.min(1.2, wind.ty - ((event.clientY - ly) / innerHeight) * 7));
      }
      lx = event.clientX;
      ly = event.clientY;
    },
    { passive: true },
  );
  window.addEventListener('pointerdown', () => (pressed = 1.2), { passive: true });
  document.documentElement.classList.add('gl-on');
  return true;
}
