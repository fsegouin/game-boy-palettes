import { PaletteBrowser } from '@/components/PaletteBrowser'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center font-pixelify-sans">
          Game Boy Palette Viewer
        </h1>
        <PaletteBrowser />
      </div>
      <Footer />
    </main>
  )
}
