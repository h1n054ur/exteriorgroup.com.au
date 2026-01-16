/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{ts,tsx}',
    './functions/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Safety Amber - Primary CTA color
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FFB100', // Updated to Refined Safety Amber
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Exterior Group brand colors
        brand: {
          primary: '#0052CC', // Royal Blue
          accent: '#06A0FF',  // Sky Blue
          dark: '#003366',
        },
        exterior: {
          dark: '#1a1a2e',
          primary: '#16213e',
          accent: '#0f3460',
          light: '#e94560',
        },
      },
    },
  },
  plugins: [],
};
