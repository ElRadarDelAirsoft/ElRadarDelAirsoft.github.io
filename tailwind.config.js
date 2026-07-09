/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#39FF14',
          blue: '#00D9FF',
        },
        base: {
          950: '#0a0e12',
          900: '#0f1419',
          800: '#161c22',
          700: '#1f272f',
        },
      },
      fontFamily: {
        display: ['"Rajdhani"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
