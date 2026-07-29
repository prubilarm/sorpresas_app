/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        romantic: {
          dark: '#26000f',
          pink: '#df2878',
          soft: '#fff5f8',
          gold: '#dfa857',
        },
      },
    },
  },
  plugins: [],
};
