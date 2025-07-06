'use client'

import { useState, useEffect } from 'react'
import { PaletteSelector } from '../PaletteSelector'
import { ColorDisplay } from '../ColorDisplay'
import { GameBoyImage } from '../GameBoyImage'
import { readPaletteFile, getAllPalettes } from '@/lib/utils'
import { Palette, GroupedPalettes } from '@/lib/types'

export const PaletteBrowser = () => {
  const [groupedPalettes, setGroupedPalettes] = useState<GroupedPalettes>({})
  const [currentPalette, setCurrentPalette] = useState<string>('')
  const [paletteData, setPaletteData] = useState<Palette | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [openPopupIndex, setOpenPopupIndex] = useState<number | null>(null)

  useEffect(() => {
    const loadPalettes = async () => {
      try {
        const palettes = await getAllPalettes()
        setGroupedPalettes(palettes)
        
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

  const handlePaletteChange = (palette: string) => {
    setCurrentPalette(palette)
    setOpenPopupIndex(null)
  }

  const handlePrevNext = (direction: 'prev' | 'next') => {
    const allPalettes = Object.values(groupedPalettes).flat()
    const currentIndex = allPalettes.indexOf(currentPalette)
    
    if (currentIndex === -1) return
    
    let newIndex
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + allPalettes.length) % allPalettes.length
    } else {
      newIndex = (currentIndex + 1) % allPalettes.length
    }
    
    setCurrentPalette(allPalettes[newIndex])
    setOpenPopupIndex(null)
  }

  if (isLoading) {
    return <div className="text-center text-gray-300">Loading palettes...</div>
  }

  const allPalettes = Object.values(groupedPalettes).flat()
  if (allPalettes.length === 0) {
    return <div className="text-center text-gray-300">No palettes found</div>
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center lg:flex-row flex-col gap-6">
        <button
          onClick={() => handlePrevNext('prev')}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={allPalettes.length <= 1}
        >
          Previous
        </button>
        
        <PaletteSelector
          currentPalette={currentPalette}
          onPaletteChange={handlePaletteChange}
        />
        
        <button
          onClick={() => handlePrevNext('next')}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={allPalettes.length <= 1}
        >
          Next
        </button>
      </div>
      
      {paletteData && (
        <>
          <div className="flex items-start gap-6">
            {paletteData.colors.map((color, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="text-sm font-medium text-gray-300">
                  C{index}
                </div>
                <ColorDisplay
                  color={color}
                  index={index}
                  isPopupOpen={openPopupIndex === index}
                  onPopupToggle={() => setOpenPopupIndex(openPopupIndex === index ? null : index)}
                />
              </div>
            ))}
          </div>

          <div className="w-full max-w-3xl flex items-center lg:flex-row flex-col gap-4 justify-center">
            <GameBoyImage
              src="/screenshots/Tetris.png"
              palette={paletteData.colors}
              className="rounded-sm"
              />
             <GameBoyImage
              src="/screenshots/Pkmn-Yellow.png"
              palette={paletteData.colors}
              className="rounded-sm"
              />
             <GameBoyImage
              src="/screenshots/Zelda.png"
              palette={paletteData.colors}
              className="rounded-sm"
            />
          </div>
        </>
      )}
      
      <div className="text-sm text-gray-400">
        {allPalettes.indexOf(currentPalette) + 1} of {allPalettes.length} palettes
      </div>
    </div>
  )
} 