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
        kawn: {
          bg: 'var(--kawn-bg)',
          secondary: 'var(--kawn-bg-secondary)',
          card: 'var(--kawn-card)',
          text: 'var(--kawn-text)',
          muted: 'var(--kawn-text-muted)',
          gold: 'var(--kawn-gold)',
          border: 'var(--kawn-border)',
        },
        cosmic: {
          950: '#111111',
          900: '#161616',
          850: '#1D1D1D',
          800: '#222222',
          700: '#2C2C2C',
          600: '#3D3D3D',
          border: 'rgba(197, 163, 106, 0.18)',
          glow: 'rgba(197, 163, 106, 0.15)',
        },
        gold: {
          300: '#E5CFA0',
          400: '#D4B67D',
          500: '#C5A36A',
          600: '#A98750',
          luxury: '#C5A36A',
          glow: 'rgba(197, 163, 106, 0.28)',
        },
        silver: {
          100: '#F5F0E8',
          200: '#E9DECC',
          300: '#D5C7B2',
          400: '#9E9283',
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
        'cosmic-gradient': 'radial-gradient(ellipse at top, #1D1D1D 0%, #151515 55%, #111111 100%)',
        'gold-gradient': 'linear-gradient(135deg, #E5CFA0 0%, #C5A36A 50%, #A98750 100%)',
        'silver-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #E9DECC 50%, #A98750 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
}
