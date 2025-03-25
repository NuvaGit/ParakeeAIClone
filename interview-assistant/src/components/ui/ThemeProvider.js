import React, { createContext, useContext, useState } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const colors = {
    primary: {
      50: '#e6f1ff',
      100: '#cce3ff',
      200: '#99c7ff',
      300: '#66abff',
      400: '#338fff',
      500: '#0073ff', 
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
      500: '#69affa', 
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
      500: '#e090ff', 
      600: '#c26fec',
      700: '#a34fd9',
      800: '#8430c6',
      900: '#6510b3',
    }
  };
  
  const animations = {
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
  
  const typography = {
    fontFamily: 'Inter var, Inter, system-ui, sans-serif',
    headings: {
      h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
      h2: 'text-3xl md:text-4xl font-bold',
      h3: 'text-2xl font-semibold',
      h4: 'text-xl font-semibold',
      h5: 'text-lg font-medium',
      h6: 'text-base font-medium',
    },
    body: {
      large: 'text-lg',
      base: 'text-base',
      small: 'text-sm',
      tiny: 'text-xs',
    },
  };
  
  const spacing = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  };
  
  const shadows = {
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
  
  const borderRadius = {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  };
  
  const buttons = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    ghost: 'bg-transparent hover:bg-zinc-100 text-zinc-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
  };
  
  const cards = {
    default: 'bg-white rounded-xl shadow-md overflow-hidden',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-md overflow-hidden',
    bordered: 'bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden',
    flat: 'bg-white rounded-xl overflow-hidden',
    hover: 'bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden',
  };
  
  const transitions = {
    fast: 'transition-all duration-150 ease-in-out',
    normal: 'transition-all duration-300 ease-in-out',
    slow: 'transition-all duration-500 ease-in-out',
  };
  
  const themeValues = {
    theme,
    setTheme,
    colors,
    animations,
    typography,
    spacing,
    shadows,
    borderRadius,
    buttons,
    cards,
    transitions,
  };
  
  return (
    <ThemeContext.Provider value={themeValues}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;