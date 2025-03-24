// src/components/ui/theme.js
// This file defines our color palette and animation variables

export const colors = {
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
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  };
  
  export const animations = {
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      verySlow: '1000ms',
    },
  };
  
  export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
    glow: '0 0 15px rgba(0, 115, 255, 0.5)',
    'accent-glow': '0 0 20px rgba(224, 144, 255, 0.6)',
  };