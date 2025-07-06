import { readdir } from 'fs/promises'
import { join } from 'path'
import { NextResponse } from 'next/server'
import { GroupedPalettes } from '@/lib/types'

async function getPalettesInDir(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        return getPalettesInDir(fullPath)
      } else if (entry.name.endsWith('.pal')) {
        return [fullPath.replace(process.cwd() + '/public', '')]
      }
      return []
    })
  )
  return files.flat()
}

async function groupPalettesByFolder(palettes: string[]): Promise<GroupedPalettes> {
  const grouped: GroupedPalettes = {}
  
  palettes.forEach(palette => {
    const parts = palette.split('/')
    const folder = parts.length > 3 ? parts[2] : 'Default' // parts[0] is empty, parts[1] is 'palettes'
    
    if (!grouped[folder]) {
      grouped[folder] = []
    }
    grouped[folder].push(palette)
  })
  
  return grouped
}

export async function GET() {
  try {
    const palettesDir = join(process.cwd(), 'public/palettes')
    const allPalettes = await getPalettesInDir(palettesDir)
    const groupedPalettes = await groupPalettesByFolder(allPalettes)
    
    return NextResponse.json(groupedPalettes)
  } catch (error) {
    console.error('Error reading palettes:', error)
    return NextResponse.json({ error: 'Failed to read palettes' }, { status: 500 })
  }
} 