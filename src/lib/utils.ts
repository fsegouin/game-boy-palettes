import { Color, Palette, GroupedPalettes } from './types'

export const hexToRgb = (hex: string): { r: number, g: number, b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

export const rgbToIps = (rgb: { r: number, g: number, b: number }): { r: number, g: number, b: number } => {
  return {
    r: Math.min(31, Math.round(rgb.r * 31 / 255)),
    g: Math.min(63, Math.round(rgb.g * 63 / 255)),
    b: Math.min(31, Math.round(rgb.b * 31 / 255))
  }
}

export const formatPaletteName = (palettePath: string): string => {
  // Extract the filename without extension and path
  const filename = palettePath.split('/').pop()?.replace('.pal', '') || ''
  
  // Replace underscores, hyphens and other common separators with spaces
  return filename
    .replace(/[_\-+]/g, ' ')  // Replace underscores, hyphens, and plus signs with spaces
    .replace(/\s+/g, ' ')     // Replace multiple spaces with a single space
    .replace(/\(\s*/g, '(')   // Remove spaces after opening parentheses
    .replace(/\s*\)/g, ')')   // Remove spaces before closing parentheses
    .replace(/\s*,\s*/g, ', ') // Ensure consistent spacing around commas
    .trim()                    // Remove leading/trailing spaces
}

export const readPaletteFile = async (filePath: string): Promise<Palette> => {
  const response = await fetch(filePath)
  const buffer = await response.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  
  const colors: Color[] = []
  
  // Read colors in inverted order (C3->C0)
  for (let i = 3; i >= 0; i--) {
    const startIdx = i * 3
    const hex = `#${bytes[startIdx].toString(16).padStart(2, '0')}${bytes[startIdx + 1].toString(16).padStart(2, '0')}${bytes[startIdx + 2].toString(16).padStart(2, '0')}`
    const rgb = hexToRgb(hex)
    const ips = rgbToIps(rgb)
    colors.push({ hex, rgb, ips })
  }

  return {
    name: formatPaletteName(filePath),
    colors
  }
}

export const getAllPalettes = async (): Promise<GroupedPalettes> => {
  const response = await fetch('/api/palettes')
  const groupedPalettes = await response.json()
  return groupedPalettes
} 