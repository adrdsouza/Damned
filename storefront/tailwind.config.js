/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Courier New', 'monospace'],
      },
      colors: {
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#ff0000',
        cream: '#F5F5F5', // Updated to a light grey color
      },
    },
  },
  plugins: [],
}