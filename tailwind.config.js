/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A0A0A',
          light: '#1A1A1A',
          dark: '#000000'
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          light: '#2A2A2A',
          dark: '#0A0A0A'
        },
        accent: '#FF0000',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        concrete: {
          base: '#0A0A0A',
          surface: '#1A1A1A',
          panel: '#2A2A2A',
          void: '#050505',
          text: '#E0E0E0',
          border: '#3A3A3A'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], 
        heading: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      boxShadow: { 
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'concrete': '8px 8px 0px rgba(0, 0, 0, 0.8)',
        'concrete-inset': 'inset 4px 4px 8px rgba(0, 0, 0, 0.5)'
      },
      borderRadius: { 
        xl: '0rem',
        '2xl': '0rem'
      },
      borderWidth: {
        '4': '4px'
      },
      fontSize: {
        'brutal': ['72px', { lineHeight: '0.8', fontWeight: '700' }],
        'monument': ['48px', { lineHeight: '0.9', fontWeight: '600' }]
      },
      spacing: {
        '32': '8rem'
      }
    },
  },
  plugins: [],
}