/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F2F6F4',
          100: '#E1ECE7',
          200: '#C4DDD3',
          300: '#9BBDAC',
          400: '#64957D',
          500: '#2A5D4F',
          600: '#1E4C40',
          700: '#173B32', // Brand Primary Forest Green
          800: '#122E27',
          900: '#0C201B',
          DEFAULT: '#173B32',
        },
        terracotta: {
          50: '#FDF6F4',
          100: '#FCEBE6',
          200: '#F9D8CE',
          300: '#F3B7A5',
          400: '#DC7E63',
          500: '#C9684B', // Brand Accent Terracotta
          600: '#B25439',
          700: '#94412A',
          800: '#7B3624',
          900: '#672E20',
          DEFAULT: '#C9684B',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FAF5ED', // Brand Warm Cream
          200: '#F4EBD9',
          300: '#E8DCBF',
          400: '#D7C49C',
          DEFAULT: '#FAF5ED',
        },
        charcoal: {
          50: '#F7F7F6',
          100: '#EDEDEB',
          200: '#D7D6D3',
          300: '#B6B4AF',
          400: '#8A8780',
          500: '#67645D',
          600: '#4D4B45',
          700: '#3A3833',
          800: '#292824', // Brand Charcoal
          900: '#1B1A17',
          DEFAULT: '#292824',
        },
        badge: {
          pendingBg: '#FEF3C7',
          pendingText: '#B45309',
          processingBg: '#EDE9FE',
          processingText: '#6D28D9',
          shippedBg: '#E0F2FE',
          shippedText: '#0369A1',
          deliveredBg: '#DCFCE7',
          deliveredText: '#15803D',
          cancelledBg: '#FEE2E2',
          cancelledText: '#B91C1C',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(23, 59, 50, 0.04)',
        'card': '0 4px 20px rgba(41, 40, 36, 0.06)',
        'dropdown': '0 10px 30px rgba(23, 59, 50, 0.12)',
      }
    },
  },
  plugins: [],
}
