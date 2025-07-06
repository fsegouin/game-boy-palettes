'use client'

export const Footer = () => {
  return (
    <footer className="text-center mt-8 py-6 px-4 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-3xl mx-auto text-sm text-gray-600 dark:text-gray-400 space-y-4">
        <p>
          This page was created to help convert <a href="https://www.analogue.co/developer/docs/custom-palettes" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-gray-200 inline-flex items-center gap-1">APGB</a> files to the color codes used
          for customizing in-game palettes on Game Boy devices compatible with the HISPEEDIDO Q5 IPS display.
        </p>
        <p>
          Palettes provided in this webapp come from a{' '}
          <a 
            href="https://www.reddit.com/r/AnaloguePocket/comments/18q2iz1/collection_of_all_official_game_boy_color_and/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline hover:text-gray-200 inline-flex items-center gap-1"
          >
            Reddit post
          </a>
          {' '}by{' '}
          <a 
            href="https://www.reddit.com/user/RAHelllord"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline hover:text-gray-200 inline-flex items-center gap-1"
          >
            u/RAHelllord
          </a>
          .
        </p>
        <p>
          This project is open source and available on{' '}
          <a 
            href="https://github.com/fsegouin/game-boy-palettes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline hover:text-gray-200 inline-flex items-center gap-1"
          >
            GitHub
          </a>
          . I am not affiliated with Analogue or HISPEEDIDO.
        </p>
        <p>
          Made with ❤️ by{' '}
          <a 
            href="https://github.com/fsegouin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline hover:text-gray-200 inline-flex items-center gap-1"
          >
            fsegouin
          </a>
          .
        </p>
      </div>
    </footer>
  )
} 