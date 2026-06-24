/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d5f5',
          300: '#a0b4e8',
          500: '#1a2f5e',
          600: '#162850',
          700: '#0f1c3d',
          800: '#0a1428',
          900: '#060d1a',
        },
        ink: '#1a1a2e',
        cream: '#faf8f4',
        gold: '#c9a84c',
        accent: '#e63946',
      },
    }
  },
  plugins: [],
};