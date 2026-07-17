/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './scripts/**/*.mjs',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#6B9B37',
          dim: '#3D5C28',
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
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 320ms cubic-bezier(0.25, 1, 0.5, 1) both',
        'pop-in': 'pop-in 180ms cubic-bezier(0.25, 1, 0.5, 1) both',
      },
    },
  },
  plugins: [],
}
