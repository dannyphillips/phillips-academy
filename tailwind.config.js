/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'farmhouse': {
          sage: '#87A878',
          clay: '#B47E5F',
          navy: '#34435E',
          'dusty-blue': '#8BA0B5',
          moss: '#6B7F59',
          stone: '#8F8B83',
          rust: '#A65D57',
          slate: '#6E7C8C',
          olive: '#767E4E',
          taupe: '#8B7E74',
          plum: '#7D6B7D',
          sienna: '#9C6B4E',

          cream: '#EAE1D0',
          beige: '#E6DFD3',
          brown: '#786F69',
          accent: '#D4B595'
        }
      },
      borderRadius: {
        'lg': '0.75rem',
      },
    },
  },
  plugins: [],
} 