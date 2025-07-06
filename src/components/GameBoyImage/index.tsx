'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { swapPaletteInImage, isGameBoyPalette } from '@/lib/imageUtils'
import { getCachedImage, setCachedImage } from '@/lib/imageCache'
import { Color } from '@/lib/types'

interface GameBoyImageProps {
  src: string
  palette: Color[]
  className?: string
}

export const GameBoyImage = ({ src, palette, className = '' }: GameBoyImageProps) => {
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processImage = async () => {
      try {
        // Check cache first
        const cached = getCachedImage(src, palette)
        if (cached) {
          setProcessedImage(cached)
          setError(null)
          return
        }

        // First verify this is a valid Game Boy image
        const isValid = await isGameBoyPalette(src)
        if (!isValid) {
          setError('This image does not use the Game Boy palette')
          return
        }

        // Process the image with the new palette
        const newImageUrl = await swapPaletteInImage(src, palette)
        setProcessedImage(newImageUrl)
        setError(null)

        // Cache the result
        setCachedImage(src, palette, newImageUrl)
      } catch (err) {
        setError('Failed to process image')
        console.error('Error processing image:', err)
      }
    }

    processImage()
  }, [src, palette])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!processedImage) {
    return <div className="animate-pulse bg-gray-800 rounded-lg aspect-video" />
  }

  return (
    <Image
      src={processedImage}
      alt="Game Boy Screenshot with custom palette"
      className={className}
      width={160*2}
      height={140*2}
    />
  )
} 