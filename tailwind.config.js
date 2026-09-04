/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f8f9fc',
          muted: '#f1f2f7',
          border: '#e6e8f0',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(15, 23, 42, 0.06)',
        card: '0 4px 20px rgba(15, 23, 42, 0.08)',
        popover: '0 10px 40px rgba(15, 23, 42, 0.12)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        bounceIn: { '0%': { transform: 'scale(0.8)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
        pulseDot: { '0%, 100%': { opacity: 0.3 }, '50%': { opacity: 1 } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        slideUp: 'slideUp 0.25s ease-out',
        slideInRight: 'slideInRight 0.25s ease-out',
        bounceIn: 'bounceIn 0.2s ease-out',
        pulseDot: 'pulseDot 1.4s infinite ease-in-out',
        shimmer: 'shimmer 1.6s infinite linear',
      },
    },
  },
  plugins: [],
};
