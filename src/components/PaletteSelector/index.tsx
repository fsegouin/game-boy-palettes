'use client'

import { useEffect, useState } from 'react'
import { getAllPalettes } from '@/lib/utils'
import { GroupedPalettes } from '@/lib/types'

interface PaletteSelectorProps {
  currentPalette: string
  onPaletteChange: (palette: string) => void
}

export const PaletteSelector = ({ currentPalette, onPaletteChange }: PaletteSelectorProps) => {
  const [groupedPalettes, setGroupedPalettes] = useState<GroupedPalettes>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPalettes = async () => {
      try {
        const palettes = await getAllPalettes()
        setGroupedPalettes(palettes)
      } catch (error) {
        console.error('Error loading palettes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPalettes()
  }, [])

  if (isLoading) {
    return <div className="text-center">Loading palettes...</div>
  }

  return (
    <select
      name="palette-selector"
      className="w-full lg:max-w-md mx-auto pl-2 pr-8 py-2 bg-black text-white border border-gray-600 rounded-md 
        focus:outline-none focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-50
        hover:border-opacity-75 transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] 
        bg-[length:8px_8px] bg-no-repeat bg-[right_12px_center]"
      value={currentPalette}
      onChange={(e) => onPaletteChange(e.target.value)}
    >
      {Object.entries(groupedPalettes).map(([group, palettes]) => (
        <optgroup key={group} label={group} className="bg-black text-white">
          {palettes.map((palette) => (
            <option key={palette} value={palette} className="bg-black text-white">
              {palette.split('/').pop()?.replace('.pal', '')}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )
} 