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
          purple: '#B14EFF',
        },
        base: {
          950: '#07090c',
          900: '#0f1419',
          800: '#161c22',
          700: '#232b33',
          600: '#323d47',
        },
      },
      fontFamily: {
        display: ['"Rajdhani"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(57,255,20,0.25), 0 8px 24px -8px rgba(0,217,255,0.35)',
        'glow-sm': '0 0 0 1px rgba(57,255,20,0.2), 0 4px 14px -4px rgba(0,217,255,0.3)',
      },
      backgroundImage: {
        'grid-dark':
          'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.14) 1px, transparent 0)',
        'grid-light':
          'radial-gradient(circle at 1px 1px, rgba(15,20,25,0.08) 1px, transparent 0)',
      },
      backgroundSize: {
        grid: '22px 22px',
      },
    },
  },
  plugins: [],
}
