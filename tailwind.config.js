/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#EEF4FF',
          100: '#E0EAFF',
          600: '#2563EB',
        },
        green: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          600: '#16A34A',
        },
        red: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          600: '#DC2626',
        },
        gray: {
          300: '#D1D5DB',
          400: '#9CA3AF',
          600: '#4B5563',
        },
        yellow: {
          400: '#FBBF24',
        }
      },
    },
  },
  plugins: [],
} 