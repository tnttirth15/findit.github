/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f7',
          100: '#ccefef',
          200: '#99dfde',
          300: '#66cfce',
          400: '#33bfbd',
          500: '#0D9488', // Primary color
          600: '#0b7a70',
          700: '#085f58',
          800: '#064540',
          900: '#032d2a',
        },
        secondary: {
          50: '#f5f0fa',
          100: '#ebe0f5',
          200: '#d7c1ea',
          300: '#c3a2e0',
          400: '#ae83d5',
          500: '#9a64cb',
          600: '#7E22CE', // Secondary color
          700: '#651aa5',
          800: '#4c137b',
          900: '#320d52',
        },
        accent: {
          500: '#f59e0b', // Accent color
        },
        success: {
          500: '#10b981', // Success color
        },
        warning: {
          500: '#f97316', // Warning color
        },
        error: {
          500: '#ef4444', // Error color
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '8': '2rem',      // 32px
        '10': '2.5rem',   // 40px
        '12': '3rem',     // 48px
        '16': '4rem',     // 64px
        '20': '5rem',     // 80px
        '24': '6rem',     // 96px
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};