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
        sethu: {
          bg: '#0B0F19',
          surface: '#111827',
          surfaceLight: '#182234',
          border: '#1F2937',
          borderLight: '#2D3748',
          text: '#F9FAFB',
          textMuted: '#9CA3AF',
          primary: '#4F46E5',
          primaryHover: '#4338CA',
          accent: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}

