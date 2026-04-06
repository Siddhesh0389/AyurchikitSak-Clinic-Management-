/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf0dc',
          200: '#b9e0b9',
          300: '#8fc98f',
          400: '#65b365',
          500: '#4a9e4a',
          600: '#3a7f3a',
          700: '#2f662f',
          800: '#275227',
          900: '#204320',
        },
        secondary: {
          50: '#fff8e7',
          100: '#feefc3',
          200: '#fddf8a',
          300: '#fcc74a',
          400: '#fbaf23',
          500: '#f58e0b',
          600: '#d96b06',
          700: '#b44a09',
          800: '#923a0e',
          900: '#78300f',
        },
        accent: {
          light: '#c9a77d',
          DEFAULT: '#b48c5c',
          dark: '#8b643a',
        }
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'ayurvedic': ['Cormorant Garamond', 'serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/src/assets/leaf-bg.png')",
        'gradient-ayurvedic': 'linear-gradient(135deg, #4a9e4a 0%, #f58e0b 100%)',
      }
    },
  },
  plugins: [],
}