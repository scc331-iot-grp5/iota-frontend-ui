// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
const hexToRGB: (hex: string) => { r: number; g: number; b: number } = (
  hex
) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result === null) {
    return { r: 0, b: 0, g: 0 };
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

const rgbToHex: (rgb: { r: number; g: number; b: number }) => string = ({
  r,
  g,
  b,
}) => {
  const componentToHex: (c: number) => string = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  };
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export { hexToRGB, rgbToHex };
