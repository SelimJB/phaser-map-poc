type Color = [number, number, number];

export const grayWeights: Color = [0.299, 0.587, 0.114];

export const conversions = {
  hexToNormalizedRgb,
  normalizedRgbToHex,
  hexNumberToHexString,
  hexStringToHexNumber,
  hslToRgb
};

export const interpolation = {
  lerp,
  lerpColor,
  lerpHexColor,
  lerpHexIntegerColor
};

export function hexToNormalizedRgb(hexColor: string): Color {
  const color = Phaser.Display.Color.HexStringToColor(hexColor);
  return [color.red / 255.0, color.green / 255.0, color.blue / 255.0];
}

export function isHexColor(hexColor: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(hexColor);
}

export function normalizedRgbToHexNumber(rgb: Color): number {
  const scaledRgb = rgb.map((val) => Math.floor(val * 255));

  let hex = 0;
  hex |= scaledRgb[0] << 16;
  hex |= scaledRgb[1] << 8;
  hex |= scaledRgb[2];

  return hex;
}

export function normalizedRgbToHex(rgb: Color): string {
  const hex = normalizedRgbToHexNumber(rgb);
  return `#${hex.toString(16).padStart(6, '0')}`;
}

export function lerp(min: number, max: number, value: number) {
  return min * (1 - value) + max * value;
}

export function lerpColor(min: Color, max: Color, value: number): Color {
  return [lerp(min[0], max[0], value), lerp(min[1], max[1], value), lerp(min[2], max[2], value)];
}

export function hexStringToHexNumber(colorString: string): number {
  const hexWithoutPrefix = colorString.startsWith('#') ? colorString.slice(1) : colorString;
  const hexNumber = parseInt(hexWithoutPrefix, 16);
  return 0x000000 | hexNumber;
}

export function hexNumberToHexString(hexNumber: number, includeAlpha = false): string {
  const charLength = includeAlpha ? 8 : 6;
  const hexString = hexNumber.toString(16).padStart(charLength, '0');
  return `#${hexString}`;
}

export function lerpHexIntegerColor(min: number, max: number, value: number): number {
  const minColor = hexNumberToHexString(min);
  const maxColor = hexNumberToHexString(max);

  const color = lerpHexColor(minColor, maxColor, value);
  return normalizedRgbToHexNumber(color);
}

export function lerpHexColor(min: string, max: string, value: number): Color {
  const minColor = hexToNormalizedRgb(min);
  const maxColor = hexToNormalizedRgb(max);
  return [
    lerp(minColor[0], maxColor[0], value),
    lerp(minColor[1], maxColor[1], value),
    lerp(minColor[2], maxColor[2], value)
  ];
}

export function hslToRgb(h: number, s: number, l: number): Color {
  h /= 360;
  s /= 100;
  l /= 100;

  let r;
  let g;
  let b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hueToRgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return [r, g, b];
}

export function generateDistinctRGBValues(count: number): Color[] {
  const distinctRGBValues = [];

  for (let i = 0; i < count; i++) {
    const hue = (i * (360 / count)) % 360;
    const adjustedHue = hue * (330 / 360) + 30; // 30 so start with h=30 which is brown #bf8040
    const saturation = 50;
    const lightness = 50;
    const rgbValue = hslToRgb(adjustedHue, saturation, lightness);
    distinctRGBValues.push(rgbValue);
  }

  return distinctRGBValues;
}

export function dotProduct(vec1: Color, vec2: Color): number {
  return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
}

export function normalizeColor(vector: Color): Color {
  const [x, y, z] = vector;
  const magnitude = Math.sqrt(x * x + y * y + z * z);

  if (magnitude === 0) {
    return vector;
  }

  return [x / magnitude, y / magnitude, z / magnitude];
}

export function calculateGlowingColor(
  color: Color,
  intensityLimiter = 1,
  attenuationCoef = 1,
  whiteCoef = 0.25,
  whiteAddition = 0
): Color {
  const scalar = 1 + dotProduct(color, grayWeights) * attenuationCoef;
  const newColor = color.map((val) => (val / scalar) * (1 - whiteCoef) + whiteCoef) as Color;
  const normalizedColor = normalizeColor(newColor);
  return normalizedColor.map((val) => val * intensityLimiter + whiteAddition) as Color;
}
