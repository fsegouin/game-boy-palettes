'use client'

import { useState, useEffect, useCallback } from 'react'
import { PaletteSelector } from '../PaletteSelector'
import { ColorDisplay } from '../ColorDisplay'
import { GameBoyImage } from '../GameBoyImage'
import { readPaletteFile, getAllPalettes } from '@/lib/utils'
import { Palette, Color } from '@/lib/types'

export const PaletteBrowser = () => {
  const [currentPalette, setCurrentPalette] = useState<string>('')
  const [paletteData, setPaletteData] = useState<Palette | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [openPopupIndex, setOpenPopupIndex] = useState<number | null>(null)
  const [paletteCount, setPaletteCount] = useState({ current: 0, total: 0 })
  const [isInverted, setIsInverted] = useState(false)

  useEffect(() => {
    const loadPalettes = async () => {
      try {
        const palettes = await getAllPalettes()
        
        // Set initial palette to the first one available
        const firstGroup = Object.values(palettes)[0]
        if (firstGroup && firstGroup.length > 0) {
          setCurrentPalette(firstGroup[0])
        }
      } catch (error) {
        console.error('Error loading palettes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPalettes()
  }, [])

  useEffect(() => {
    const loadPaletteData = async () => {
      if (!currentPalette) return
      
      try {
        const data = await readPaletteFile(currentPalette)
        setPaletteData(data)
      } catch (error) {
        console.error('Error loading palette data:', error)
      }
    }

    loadPaletteData()
  }, [currentPalette])

  const handlePaletteChange = useCallback((palette: string) => {
    setCurrentPalette(palette)
    setOpenPopupIndex(null)
  }, [])

  const handleFilteredPalettesChange = useCallback((currentIndex: number, total: number) => {
    setPaletteCount({ current: currentIndex + 1, total })
  }, [])

  const getInvertedColors = (colors: Color[]): Color[] => {
    if (!isInverted) return colors
    return [...colors].reverse()
  }

  if (isLoading) {
    return <div className="text-center text-gray-300">Loading palettes...</div>
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <PaletteSelector
        currentPalette={currentPalette}
        onPaletteChange={handlePaletteChange}
        onFilteredPalettesChange={handleFilteredPalettesChange}
      />
      
      {paletteData && (
        <>
          <div className="text-lg text-gray-400 font-pixelify-sans">
            {paletteData.name} {isInverted ? '(Inverted)' : ''}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isInverted}
              onChange={(e) => setIsInverted(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-300 font-pixelify-sans">
              Invert Colors
            </span>
          </label>

          <div className="flex items-start gap-6">
            {getInvertedColors(paletteData.colors).map((color, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="text-sm font-medium text-gray-300 font-pixelify-sans">
                  C{isInverted ? 3 - index : index}
                </div>
                <ColorDisplay
                  color={color}
                  index={isInverted ? 3 - index : index}
                  isPopupOpen={openPopupIndex === index}
                  onPopupToggle={() => setOpenPopupIndex(openPopupIndex === index ? null : index)}
                />
              </div>
            ))}
          </div>

          <div className="w-full max-w-3xl flex items-center lg:flex-row flex-col gap-4 justify-center">
            <GameBoyImage
              src="/screenshots/Tetris.png"
              palette={getInvertedColors(paletteData.colors)}
              className="rounded-sm"
            />
            <GameBoyImage
              src="/screenshots/Pkmn-Yellow.png"
              palette={getInvertedColors(paletteData.colors)}
              className="rounded-sm"
            />
            <GameBoyImage
              src="/screenshots/Zelda.png"
              palette={getInvertedColors(paletteData.colors)}
              className="rounded-sm"
            />
          </div>
        </>
      )}

      <div className="text-sm text-gray-400 font-pixelify-sans">
        {paletteCount.current} of {paletteCount.total} palettes
      </div>
    </div>
  )
} 