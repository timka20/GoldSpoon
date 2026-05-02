/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#0A0A0A',
          light: '#0F0F0F',
          card: '#111111',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E4C76B',
          dark: '#AA8A2A',
        },
        sage: {
          DEFAULT: '#7A8B6F',
          light: '#90A085',
          dark: '#5E6E55',
        },
        deepblue: {
          DEFAULT: '#0F1B2E',
          light: '#1A2D4A',
        },
        platinum: '#E5E5E5',
        muted: '#9CA3AF',
        snow: '#FAFAFA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
