export const hexToRgba = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const a = hex.length > 7 ? parseInt(hex.slice(7, 9), 16) / 255 : 1
  return [r, g, b, a]
}

export const blendHex = (colorHex1: string, colorHex2: string) => {
  const colorRGBA1 = hexToRgba(colorHex1)
  const colorRGBA2 = hexToRgba(colorHex2)
  const red = colorRGBA1[0] * (1 - colorRGBA2[3]) + colorRGBA2[0] * colorRGBA2[3]
  const green = colorRGBA1[1] * (1 - colorRGBA2[3]) + colorRGBA2[1] * colorRGBA2[3]
  const blue = colorRGBA1[2] * (1 - colorRGBA2[3]) + colorRGBA2[2] * colorRGBA2[3]
  const color = [Math.round(red), Math.round(green), Math.round(blue)]
  return `rgb(${color.join(', ')})`
}