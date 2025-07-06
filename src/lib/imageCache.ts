type CacheKey = {
  imageUrl: string
  paletteKey: string // Hash of the palette colors
}

type CacheEntry = {
  dataUrl: string
  timestamp: number
}

const CACHE_DURATION = 1000 * 60 * 60 // 1 hour
const cache = new Map<string, CacheEntry>()

const createCacheKey = (key: CacheKey): string => {
  return `${key.imageUrl}:${key.paletteKey}`
}

const createPaletteKey = (palette: { hex: string }[]): string => {
  return palette.map(color => color.hex).join('-')
}

export const getCachedImage = (imageUrl: string, palette: { hex: string }[]): string | null => {
  const key = createCacheKey({
    imageUrl,
    paletteKey: createPaletteKey(palette)
  })
  
  const entry = cache.get(key)
  if (!entry) return null
  
  // Check if cache has expired
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key)
    return null
  }
  
  return entry.dataUrl
}

export const setCachedImage = (
  imageUrl: string,
  palette: { hex: string }[],
  dataUrl: string
): void => {
  const key = createCacheKey({
    imageUrl,
    paletteKey: createPaletteKey(palette)
  })
  
  cache.set(key, {
    dataUrl,
    timestamp: Date.now()
  })
  
  // Clean up old entries
  for (const [key, entry] of cache.entries()) {
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      cache.delete(key)
    }
  }
} 