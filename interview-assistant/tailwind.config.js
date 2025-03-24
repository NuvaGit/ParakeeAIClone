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
            50: '#e6f1ff',
            100: '#cce3ff',
            200: '#99c7ff',
            300: '#66abff',
            400: '#338fff',
            500: '#0073ff', // Primary brand color
            600: '#005cd9',
            700: '#0044b3',
            800: '#002d8c',
            900: '#001766',
          },
          secondary: {
            50: '#f0f7ff',
            100: '#e1effe',
            200: '#c3dffd',
            300: '#a5cffc',
            400: '#87bffb',
            500: '#69affa', // Secondary brand color
            600: '#4a8ce6',
            700: '#2c6ad2',
            800: '#1d48bd',
            900: '#0e26a8',
          },
          accent: {
            50: '#fcf4ff',
            100: '#f9e9ff',
            200: '#f3d3ff',
            300: '#ecbcff',
            400: '#e6a6ff',
            500: '#e090ff', // Accent color for highlights
            600: '#c26fec',
            700: '#a34fd9',
            800: '#8430c6',
            900: '#6510b3',
          },
          success: {
            500: '#10b981',
          },
          warning: {
            500: '#f59e0b',
          },
          error: {
            500: '#ef4444',
          },
        },
        animation: {
          'float': 'float 3s ease-in-out infinite',
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'slide-up': 'slideUp 0.5s ease-out forwards',
          'slide-in-right': 'slideInRight 0.6s ease-out forwards',
          'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
          'fade-in': 'fadeIn 0.5s ease-out forwards',
          'bounce-in': 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          'wave': 'wave 2.5s ease-in-out infinite',
          'typing': 'typing 1.5s steps(20, end) infinite',
          'blink-caret': 'blinkCaret 0.75s step-end infinite',
          'morph': 'morph 8s ease-in-out infinite',
          'gradient-shift': 'gradientShift 8s ease infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          slideUp: {
            '0%': { transform: 'translateY(20px)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 },
          },
          slideInRight: {
            '0%': { transform: 'translateX(30px)', opacity: 0 },
            '100%': { transform: 'translateX(0)', opacity: 1 },
          },
          slideInLeft: {
            '0%': { transform: 'translateX(-30px)', opacity: 0 },
            '100%': { transform: 'translateX(0)', opacity: 1 },
          },
          fadeIn: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
          bounceIn: {
            '0%': { transform: 'scale(0.8)', opacity: 0 },
            '80%': { transform: 'scale(1.05)' },
            '100%': { transform: 'scale(1)', opacity: 1 },
          },
          wave: {
            '0%': { transform: 'rotate(0deg)' },
            '10%': { transform: 'rotate(14deg)' },
            '20%': { transform: 'rotate(-8deg)' },
            '30%': { transform: 'rotate(14deg)' },
            '40%': { transform: 'rotate(-4deg)' },
            '50%': { transform: 'rotate(10deg)' },
            '60%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(0deg)' },
          },
          typing: {
            '0%': { width: '0' },
            '50%': { width: '100%' },
            '55%': { width: '100%' },
            '100%': { width: '0' }
          },
          blinkCaret: {
            '0%, 100%': { borderColor: 'transparent' },
            '50%': { borderColor: 'currentColor' },
          },
          morph: {
            '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
            '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
            '50%': { borderRadius: '40% 60% 30% 70% / 30% 40% 70% 60%' },
            '75%': { borderRadius: '60% 40% 70% 30% / 70% 30% 60% 40%' },
          },
          gradientShift: {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        },
        boxShadow: {
          glow: '0 0 15px rgba(0, 115, 255, 0.5)',
          'accent-glow': '0 0 20px rgba(224, 144, 255, 0.6)',
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'gradient-shine': 'linear-gradient(45deg, transparent 25%, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, transparent 75%, rgba(255, 255, 255, 0.1) 75%, rgba(255, 255, 255, 0.1))',
        },
        fontFamily: {
          sans: ['Inter var', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }