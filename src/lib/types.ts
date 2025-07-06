export interface Color {
  hex: string
  rgb: {
    r: number
    g: number
    b: number
  }
  ips: {
    r: number
    g: number
    b: number
  }
}

export interface Palette {
  name: string
  colors: Color[]
}

export interface PaletteGroup {
  name: string
  palettes: string[]
}

export interface GroupedPalettes {
  [key: string]: string[]
} 