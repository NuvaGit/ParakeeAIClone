import React, { useState, useEffect, useRef } from 'react';

export const AnimatedBackground = ({ children }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="blob w-96 h-96 -top-20 -left-20 opacity-40"></div>
      <div className="blob w-96 h-96 top-1/3 right-0 opacity-30 animate-delay-200"></div>
      <div className="blob w-64 h-64 bottom-0 left-1/4 opacity-20 animate-delay-400"></div>
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.03]"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
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

export const AnimatedButton = ({ 
  children, 
  className = "", 
  onClick,
  variant = "primary",
  size = "md",
  animated = true,
  ...props
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
      {...props}
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

export const TypingText = ({ text, className = "", speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
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

export const AnimatedLogo = ({ text, className = "" }) => {
  return (
    <div className={`relative group ${className}`}>
      <span className="text-2xl font-bold text-gradient">{text}</span>
      <span className="absolute -inset-3 rounded-full bg-primary-500 opacity-0 blur-xl group-hover:opacity-20 transition-opacity duration-500"></span>
    </div>
  );
};

export const WaveAnimation = ({ children, className = "" }) => {
  return (
    <div className={`inline-block animate-wave ${className}`}>
      {children}
    </div>
  );
};

export const GradientText = ({ children, className = "" }) => {
  return <span className={`text-gradient ${className}`}>{children}</span>;
};

export const GradientBorder = ({ children, className = "", padding = "p-0.5" }) => {
  return (
    <div className={`gradient-border ${padding} ${className}`}>
      <div className="bg-white h-full w-full rounded-lg">
        {children}
      </div>
    </div>
  );
};

export const NotificationBadge = ({ count, className = "" }) => {
  return (
    <span className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full ${className}`}>
      {count}
    </span>
  );
};