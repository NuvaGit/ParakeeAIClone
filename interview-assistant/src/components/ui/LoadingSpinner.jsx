// src/components/ui/LoadingSpinner.jsx
import React from 'react';

const variants = {
  dots: ({ size, color }) => (
    <div className="flex justify-center items-center space-x-2">
      <div className={`${size} rounded-full ${color} animate-bounce`}></div>
      <div className={`${size} rounded-full ${color} animate-bounce delay-75`}></div>
      <div className={`${size} rounded-full ${color} animate-bounce delay-150`}></div>
    </div>
  ),
  
  spinner: ({ size, thickness, color }) => (
    <div className="relative flex justify-center items-center">
      <div className={`${size} ${thickness} rounded-full ${color} opacity-25`}></div>
      <div className={`absolute ${size} ${thickness} rounded-full ${color} animate-spin border-t-transparent`}></div>
    </div>
  ),
  
  pulse: ({ size, color }) => (
    <div className={`${size} ${color} rounded-full animate-ping`}></div>
  ),
  
  growing: ({ size, color }) => (
    <div className={`${size} ${color} rounded-full animate-pulse transform scale-75`}></div>
  ),
  
  bars: ({ color }) => (
    <div className="flex items-center justify-center space-x-1 h-8">
      {[0, 1, 2, 3].map((i) => (
        <div 
          key={i}
          className={`w-1 h-full ${color} animate-pulse`} 
          style={{ animationDelay: `${i * 0.15}s` }}
        ></div>
      ))}
    </div>
  ),
  
  ripple: ({ size, color }) => (
    <div className="relative flex justify-center items-center">
      <div className={`absolute ${size} ${color} rounded-full animate-ping opacity-75`}></div>
      <div className={`relative ${size} ${color} rounded-full opacity-90`} style={{ transform: 'scale(0.75)' }}></div>
    </div>
  ),
  
  typing: ({ color }) => (
    <div className="flex space-x-1 items-center justify-center h-5">
      <div className={`w-2 h-2 ${color} rounded-full animate-bounce`} style={{ animationDuration: '0.6s' }}></div>
      <div className={`w-2 h-2 ${color} rounded-full animate-bounce`} style={{ animationDuration: '0.6s', animationDelay: '0.2s' }}></div>
      <div className={`w-2 h-2 ${color} rounded-full animate-bounce`} style={{ animationDuration: '0.6s', animationDelay: '0.4s' }}></div>
    </div>
  ),
};

const sizeMaps = {
  xs: {
    dots: 'w-1 h-1',
    spinner: 'w-4 h-4',
    thickness: 'border-2',
    pulse: 'w-2 h-2',
    growing: 'w-2 h-2',
    ripple: 'w-4 h-4'
  },
  sm: {
    dots: 'w-2 h-2',
    spinner: 'w-6 h-6',
    thickness: 'border-2',
    pulse: 'w-3 h-3',
    growing: 'w-3 h-3',
    ripple: 'w-6 h-6'
  },
  md: {
    dots: 'w-2.5 h-2.5',
    spinner: 'w-8 h-8',
    thickness: 'border-2',
    pulse: 'w-4 h-4',
    growing: 'w-4 h-4',
    ripple: 'w-8 h-8'
  },
  lg: {
    dots: 'w-3 h-3',
    spinner: 'w-12 h-12',
    thickness: 'border-3',
    pulse: 'w-5 h-5',
    growing: 'w-6 h-6',
    ripple: 'w-12 h-12'
  },
  xl: {
    dots: 'w-4 h-4',
    spinner: 'w-16 h-16',
    thickness: 'border-4',
    pulse: 'w-6 h-6',
    growing: 'w-8 h-8',
    ripple: 'w-16 h-16'
  }
};

const colorMaps = {
  primary: {
    dots: 'bg-primary-500',
    spinner: 'border-primary-500',
    pulse: 'bg-primary-500',
    growing: 'bg-primary-500',
    bars: 'bg-primary-500',
    ripple: 'bg-primary-500'
  },
  secondary: {
    dots: 'bg-secondary-500',
    spinner: 'border-secondary-500',
    pulse: 'bg-secondary-500',
    growing: 'bg-secondary-500',
    bars: 'bg-secondary-500',
    ripple: 'bg-secondary-500'
  },
  accent: {
    dots: 'bg-accent-500',
    spinner: 'border-accent-500',
    pulse: 'bg-accent-500',
    growing: 'bg-accent-500',
    bars: 'bg-accent-500',
    ripple: 'bg-accent-500'
  },
  white: {
    dots: 'bg-white',
    spinner: 'border-white',
    pulse: 'bg-white',
    growing: 'bg-white',
    bars: 'bg-white',
    ripple: 'bg-white'
  },
  gray: {
    dots: 'bg-gray-500',
    spinner: 'border-gray-500',
    pulse: 'bg-gray-500',
    growing: 'bg-gray-500',
    bars: 'bg-gray-500',
    ripple: 'bg-gray-500'
  },
  success: {
    dots: 'bg-success-500',
    spinner: 'border-success-500',
    pulse: 'bg-success-500',
    growing: 'bg-success-500',
    bars: 'bg-success-500',
    ripple: 'bg-success-500'
  },
  error: {
    dots: 'bg-error-500',
    spinner: 'border-error-500',
    pulse: 'bg-error-500',
    growing: 'bg-error-500',
    bars: 'bg-error-500',
    ripple: 'bg-error-500'
  },
  warning: {
    dots: 'bg-warning-500',
    spinner: 'border-warning-500',
    pulse: 'bg-warning-500',
    growing: 'bg-warning-500',
    bars: 'bg-warning-500',
    ripple: 'bg-warning-500'
  }
};

const LoadingSpinner = ({ 
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  message = '',
  className = '',
  fullScreen = false
}) => {
  const sizeMap = sizeMaps[size] || sizeMaps.md;
  const colorMap = colorMaps[color] || colorMaps.primary;
  
  const renderVariant = () => {
    const props = {
      size: variant === 'spinner' ? sizeMap.spinner : 
           variant === 'dots' ? sizeMap.dots :
           variant === 'pulse' ? sizeMap.pulse :
           variant === 'growing' ? sizeMap.growing :
           variant === 'ripple' ? sizeMap.ripple :
           sizeMap.spinner,
      thickness: sizeMap.thickness,
      color: variant === 'spinner' ? colorMap.spinner : 
           variant === 'dots' ? colorMap.dots :
           variant === 'pulse' ? colorMap.pulse :
           variant === 'growing' ? colorMap.growing :
           variant === 'bars' ? colorMap.bars :
           variant === 'ripple' ? colorMap.ripple :
           colorMap.spinner
    };
    
    return variants[variant](props);
  };
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center">
          {renderVariant()}
          {message && <p className="mt-4 text-gray-700 animate-pulse">{message}</p>}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {renderVariant()}
      {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;