/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farmhouse: {
          navy: '#1B2A3A',
          cream: '#EAE1D0',
          beige: '#E6DFD3',
          sage: '#739E82',
          brown: '#786F69',
          accent: '#D4B595',
          terracotta: '#C17F59',
          dustyblue: '#7D94A1',
        },
      },
      borderRadius: {
        'lg': '0.75rem',
      },
    },
  },
  plugins: [],
} 