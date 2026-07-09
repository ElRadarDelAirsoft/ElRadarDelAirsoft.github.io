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
        accent: {
          DEFAULT: '#5FD3EC',
          dim: '#3B8FA3',
        },
        base: {
          950: '#000000',
          900: '#0a0a0a',
          800: '#131313',
          700: '#1e1e1e',
          600: '#2b2b2b',
        },
      },
      fontFamily: {
        display: ['"Oswald"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
