/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        koon: {
          bg: '#0B0A09',
          secondary: '#151310',
          card: '#1A1714',
          text: '#F5F0E7',
          muted: '#B6AEA2',
          gold: '#C6A15B',
          champagne: '#D8BD83',
        },
        cosmic: {
          950: '#0B0A09',
          900: '#100E0C',
          850: '#151310',
          800: '#1A1714',
          700: '#26221D',
          600: '#38322B',
          border: 'rgba(198, 161, 91, 0.2)',
          glow: 'rgba(198, 161, 91, 0.16)',
        },
        gold: {
          300: '#D8BD83',
          400: '#C6A15B',
          500: '#C6A15B',
          600: '#A68341',
          luxury: '#C6A15B',
          glow: 'rgba(198, 161, 91, 0.28)',
        },
        silver: {
          100: '#F5F0E7',
          200: '#E5DDD0',
          300: '#C8BEB0',
          400: '#9B9183',
        }
      },
      fontFamily: {
        arabic: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        hebrew: ['"Heebo"', 'sans-serif'],
        cairo: ['"IBM Plex Sans Arabic"', '"Heebo"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at top, #151310 0%, #0E0D0B 55%, #0B0A09 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D8BD83 0%, #C6A15B 50%, #9E7B3B 100%)',
        'silver-gradient': 'linear-gradient(135deg, #F5F0E7 0%, #D8BD83 50%, #C6A15B 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
}
