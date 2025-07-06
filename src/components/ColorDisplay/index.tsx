'use client'

import { useState, useRef, useEffect } from 'react'
import { Color } from '@/lib/types'

interface ColorDisplayProps {
  color: Color
  index: number
  isPopupOpen: boolean
  onPopupToggle: () => void
}

export const ColorDisplay = ({ color, index, isPopupOpen, onPopupToggle }: ColorDisplayProps) => {
  const [format, setFormat] = useState<'ips' | 'rgb' | 'hex'>('ips')
  const [popupAlignment, setPopupAlignment] = useState<'left' | 'right'>('left')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isPopupOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const popupWidth = 200 // Approximate popup width
      
      // Check if popup would overflow viewport when aligned left
      if (rect.left + popupWidth > window.innerWidth) {
        setPopupAlignment('right')
      } else {
        setPopupAlignment('left')
      }
    }
  }, [isPopupOpen])

  const formatColor = () => {
    switch (format) {
      case 'rgb':
        return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
      case 'hex':
        return color.hex
      default:
        return `ips(${color.ips.r}, ${color.ips.g}, ${color.ips.b})`
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="w-16 h-16 rounded shadow-md transition-transform hover:scale-105"
        style={{ backgroundColor: color.hex }}
        onClick={onPopupToggle}
        aria-label={`Color C${index}`}
      />
      
      {isPopupOpen && (
        <div 
          className={`absolute z-10 mt-2 p-4 bg-gray-900 rounded-lg shadow-lg border border-gray-800 ${
            popupAlignment === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="space-y-2">
            <div className="flex space-x-2">
              <button
                className={`px-2 py-1 rounded transition-colors ${
                  format === 'ips'
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setFormat('ips')}
              >
                IPS
              </button>
              <button
                className={`px-2 py-1 rounded transition-colors ${
                  format === 'rgb'
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setFormat('rgb')}
              >
                RGB
              </button>
              <button
                className={`px-2 py-1 rounded transition-colors ${
                  format === 'hex'
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setFormat('hex')}
              >
                HEX
              </button>
            </div>
            <div className="font-mono text-sm text-gray-300 whitespace-nowrap">
              {formatColor()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 