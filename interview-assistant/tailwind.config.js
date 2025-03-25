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
          500: '#0073ff',
          600: '#005cd9',
        },
        secondary: {
          500: '#69affa',
          600: '#4a8ce6',
        },
        accent: {
          500: '#e090ff',
          600: '#c26fec',
        },
      },
    },
  },
};