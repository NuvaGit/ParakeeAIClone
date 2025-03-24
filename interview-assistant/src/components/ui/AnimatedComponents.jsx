// src/components/ui/AnimatedComponents.jsx
import React from 'react';

// Animated background with floating blobs
export const AnimatedBackground = ({ children }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="blob w-96 h-96 -top-20 -left-20 opacity-40"></div>
      <div className="blob w-96 h-96 top-1/3 right-0 opacity-30 animation-delay-2000"></div>
      <div className="blob w-64 h-64 bottom-0 left-1/4 opacity-20 animation-delay-4000"></div>
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.03]"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Animated section that fades and slides up when it comes into view
export const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, []);

  const delayStyle = {
    transitionDelay: `${delay}ms`,
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8"
      } ${className}`}
      style={delayStyle}
    >
      {children}
    </div>
  );
};

// Button with hover effects
export const AnimatedButton = ({ 
  children, 
  className = "", 
  onClick,
  variant = "primary",
  size = "md",
  animated = true
}) => {
  const baseClasses = "relative overflow-hidden inline-flex items-center justify-center rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all";
  
  const variantClasses = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500",
    secondary: "bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500",
    accent: "bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500",
    outline: "bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  };
  
  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "px-6 py-3",
    lg: "text-lg px-8 py-4",
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
      
      {animated && (
        <span className="absolute inset-0 overflow-hidden rounded-lg">
          <span className="absolute left-0 top-0 h-full w-0 bg-white bg-opacity-20 transform skew-x-15 transition-all duration-500 group-hover:w-full"></span>
        </span>
      )}
    </button>
  );
};

// Card with hover effects
export const AnimatedCard = ({ 
  children, 
  className = "", 
  hoverEffect = true,
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300
        ${hoverEffect ? 'hover:shadow-xl transform hover:-translate-y-1' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Typing animation for text
export const TypingText = ({ text, className = "", speed = 100 }) => {
  const [displayText, setDisplayText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [text, currentIndex, speed]);
  
  return (
    <span className={className}>
      {displayText}
      {isTyping && <span className="typing-indicator"></span>}
    </span>
  );
};

// Logo that pulses on hover
export const AnimatedLogo = ({ text, className = "" }) => {
  return (
    <div className={`relative group ${className}`}>
      <span className="text-2xl font-bold text-gradient">{text}</span>
      <span className="absolute -inset-3 rounded-full bg-primary-500 opacity-0 blur-xl group-hover:opacity-20 transition-opacity duration-500"></span>
    </div>
  );
};

// Wave animation for icon or image
export const WaveAnimation = ({ children, className = "" }) => {
  return (
    <div className={`inline-block animate-wave ${className}`}>
      {children}
    </div>
  );
};

// Loading spinner with multiple dots
export const LoadingDots = ({ color = "text-primary-500", size = "md" }) => {
  const sizeClasses = {
    sm: "h-1 w-1",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };
  
  return (
    <div className="flex space-x-1 justify-center items-center">
      <div className={`${sizeClasses[size]} rounded-full ${color} animate-bounce`}></div>
      <div className={`${sizeClasses[size]} rounded-full ${color} animate-bounce animation-delay-200`}></div>
      <div className={`${sizeClasses[size]} rounded-full ${color} animate-bounce animation-delay-400`}></div>
    </div>
  );
};

// Tooltip component
export const Tooltip = ({ text, children, position = "top" }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-1",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-1",
    left: "right-full top-1/2 transform -translate-x-2 -translate-y-1/2 mr-1",
    right: "left-full top-1/2 transform translate-x-2 -translate-y-1/2 ml-1",
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-10 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap transition-all duration-200 ${positionClasses[position]} ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {text}
          <div className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
            position === 'top' ? 'left-1/2 -bottom-1 -translate-x-1/2' :
            position === 'bottom' ? 'left-1/2 -top-1 -translate-x-1/2' :
            position === 'left' ? 'top-1/2 -right-1 -translate-y-1/2' :
            'top-1/2 -left-1 -translate-y-1/2'
          }`}></div>
        </div>
      )}
    </div>
  );
};

// Gradient text
export const GradientText = ({ children, className = "" }) => {
  return <span className={`text-gradient ${className}`}>{children}</span>;
};

// Gradient border
export const GradientBorder = ({ children, className = "", padding = "p-0.5" }) => {
  return (
    <div className={`gradient-border ${padding} ${className}`}>
      <div className="bg-white h-full w-full rounded-lg">
        {children}
      </div>
    </div>
  );
};

// Notification badge
export const NotificationBadge = ({ count, className = "" }) => {
  return (
    <span className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full ${className}`}>
      {count}
    </span>
  );
};

export default {
  AnimatedBackground,
  AnimatedSection,
  AnimatedButton,
  AnimatedCard,
  TypingText,
  AnimatedLogo,
  WaveAnimation,
  LoadingDots,
  Tooltip,
  GradientText,
  GradientBorder,
  NotificationBadge
};