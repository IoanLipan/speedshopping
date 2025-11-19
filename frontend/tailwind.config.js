/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        game: {
          purple: '#a855f7',
          pink: '#ec4899',
          blue: '#3b82f6',
          green: '#10b981',
          yellow: '#fbbf24',
          orange: '#f97316',
          red: '#ef4444',
          cyan: '#06b6d4',
        },
      },
      backgroundImage: {
        'game-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'game-gradient-2': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'game-gradient-3': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'game-gradient-4': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'game-gradient-5': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'rainbow': 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
