'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { getAllPalettes, formatPaletteName } from '@/lib/utils'
import { GroupedPalettes } from '@/lib/types'
import fuzzysort from 'fuzzysort'

interface PaletteSelectorProps {
  currentPalette: string
  onPaletteChange: (palette: string) => void
  onFilteredPalettesChange?: (currentIndex: number, total: number) => void
}

export const PaletteSelector = ({ currentPalette, onPaletteChange, onFilteredPalettesChange }: PaletteSelectorProps) => {
  const [groupedPalettes, setGroupedPalettes] = useState<GroupedPalettes>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPalettes, setFilteredPalettes] = useState<string[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const loadPalettes = async () => {
      try {
        const palettes = await getAllPalettes()
        setGroupedPalettes(palettes)
        const allPalettes = Object.values(palettes).flat()
        setFilteredPalettes(allPalettes)
      } catch (error) {
        console.error('Error loading palettes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPalettes()
  }, [])

  const getFilteredPalettes = useCallback(() => {
    if (!searchTerm) return groupedPalettes

    const filteredGroups: GroupedPalettes = {}
    
    Object.entries(groupedPalettes).forEach(([group, palettes]) => {
      const searchResults = fuzzysort.go(searchTerm, palettes, {
        key: (palette: string) => formatPaletteName(palette),
        threshold: -10000 // More lenient threshold
      })
      
      if (searchResults.length > 0) {
        filteredGroups[group] = searchResults.map(result => result.obj)
      }
    })

    return Object.keys(filteredGroups).length > 0 ? filteredGroups : groupedPalettes
  }, [searchTerm, groupedPalettes])

  // Update filtered palettes when search term changes
  useEffect(() => {
    const filteredGroups = getFilteredPalettes()
    const allFilteredPalettes = Object.values(filteredGroups).flat()
    setFilteredPalettes(allFilteredPalettes)
  }, [getFilteredPalettes])

  // Update the count when filtered palettes or current palette changes
  useEffect(() => {
    if (!onFilteredPalettesChange) return

    const currentIndex = filteredPalettes.indexOf(currentPalette)
    onFilteredPalettesChange(
      currentIndex !== -1 ? currentIndex : 0,
      filteredPalettes.length
    )
  }, [filteredPalettes, currentPalette, onFilteredPalettesChange])

  const handleSelect = (palette: string) => {
    onPaletteChange(palette)
    setIsOpen(false)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setIsOpen(true)
    
    // If search is cleared, close the dropdown
    if (!value) {
      setIsOpen(false)
    }
  }

  const handlePrevNext = (direction: 'prev' | 'next') => {
    const currentIndex = filteredPalettes.indexOf(currentPalette)
    let newIndex

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredPalettes.length - 1
    } else {
      newIndex = currentIndex < filteredPalettes.length - 1 ? currentIndex + 1 : 0
    }
    
    onPaletteChange(filteredPalettes[newIndex])
  }

  const getCurrentPaletteName = () => {
    return formatPaletteName(currentPalette)
  }

  if (isLoading) {
    return <div className="text-center">Loading palettes...</div>
  }

  const filteredPalettesGroups = getFilteredPalettes()

  return (
    <div className="flex items-center lg:flex-row flex-col gap-6 font-pixelify-sans">
      <button
        onClick={() => handlePrevNext('prev')}
        className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={filteredPalettes.length <= 1}
      >
        Previous
      </button>

      <div ref={wrapperRef} className="relative w-full lg:max-w-md">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-2 pr-8 py-2 bg-black text-white border border-gray-600 rounded-md 
              focus:outline-none focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-50
              hover:border-opacity-75 transition-all"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onClick={() => setIsOpen(true)}
          />
          {!searchTerm && (
            <div className="absolute inset-0 pointer-events-none pl-2 py-2 text-gray-400">
              {getCurrentPaletteName()}
            </div>
          )}
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4
              bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')]
              bg-[length:100%] bg-no-repeat bg-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle dropdown"
          />
        </div>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-black border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            {Object.entries(filteredPalettesGroups).map(([group, palettes]) => (
              palettes.length > 0 && (
                <div key={group}>
                  <div className="px-2 py-1 bg-gray-800 text-gray-400 text-sm">{group}</div>
                  {palettes.map((palette) => (
                    <button
                      key={palette}
                      className={`w-full text-left px-2 py-1 hover:bg-gray-800 text-white ${
                        palette === currentPalette ? 'bg-gray-800' : ''
                      }`}
                      onClick={() => handleSelect(palette)}
                    >
                      {formatPaletteName(palette)}
                    </button>
                  ))}
                </div>
              )
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => handlePrevNext('next')}
        className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={filteredPalettes.length <= 1}
      >
        Next
      </button>
    </div>
  )
} 