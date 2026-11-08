/** Numbers the live render and the still drawing share, so they always line up. */
export const DEG = Math.PI / 180;
/** Camera height above the ring, as an angle. Higher shows more of the stone's face. */
export const ELEV = 27 * DEG;
export const DIST = 26;
/** The band: a circle standing upright under the stone. */
export const RM = 2.32;
export const RING_CY = -0.88 - 0.17 - RM;
/** Where the ring starts turned when the page opens. */
export const START_YAW = -0.62;

export type Framing = {
  /** The stone's offset from the middle of the stage, in fractions of its shorter side. */
  ox: number;
  oy: number;
  /** Scene units across the stage's shorter side. The stone is 2 across. */
  units: number;
};

/** Desktop: the stage is the hero's right-hand column, and the band fades out behind the controls. */
export const FRAMING: Framing = { ox: 0, oy: -0.2, units: 5.25 };
/** Phones: a shorter stage between the headline and the controls. */
export const FRAMING_NARROW: Framing = { ox: 0, oy: -0.2, units: 4.5 };
