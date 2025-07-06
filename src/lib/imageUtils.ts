// Original Game Boy grayscale colors (from lightest to darkest)
const ORIGINAL_PALETTE = [
  [255, 255, 255], // White
  [170, 170, 170], // Light gray
  [85, 85, 85],    // Dark gray
  [0, 0, 0]        // Black
]

export const swapPaletteInImage = async (
  imageUrl: string,
  newPalette: { hex: string; rgb: { r: number; g: number; b: number } }[]
): Promise<string> => {
  // Create a new Image object
  const img = new Image()
  img.crossOrigin = 'anonymous' // Enable CORS if image is from different origin
  
  // Create canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Could not get canvas context')
  }

  // Wait for image to load
  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = imageUrl
  })

  // Set canvas size to match image
  canvas.width = img.width
  canvas.height = img.height
  
  // Draw original image
  ctx.drawImage(img, 0, 0)
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Create a map of original grayscale values to indices
  const grayToIndex = new Map(
    ORIGINAL_PALETTE.map((color, index) => [color[0], index])
  )

  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    // Check if this is a grayscale pixel (r = g = b)
    if (r === g && g === b) {
      const paletteIndex = grayToIndex.get(r)
      if (paletteIndex !== undefined) {
        // Replace with new palette color
        const newColor = newPalette[paletteIndex].rgb
        data[i] = newColor.r
        data[i + 1] = newColor.g
        data[i + 2] = newColor.b
        // Alpha channel (data[i + 3]) remains unchanged
      }
    }
  }

  // Put processed image data back to canvas
  ctx.putImageData(imageData, 0, 0)
  
  // Return as data URL
  return canvas.toDataURL('image/png')
}

// Function to check if an image uses the Game Boy palette
export const isGameBoyPalette = async (imageUrl: string): Promise<boolean> => {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  
  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = imageUrl
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Could not get canvas context')
  }

  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(img, 0, 0)
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  
  // Create a Set to store unique colors
  const uniqueColors = new Set<string>()

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    // Only check pixels that are grayscale
    if (r === g && g === b) {
      uniqueColors.add(r.toString())
    }
  }

  // Check if all colors are from the Game Boy palette
  const validColors = new Set(ORIGINAL_PALETTE.map(color => color[0].toString()))
  return Array.from(uniqueColors).every(color => validColors.has(color))
} 