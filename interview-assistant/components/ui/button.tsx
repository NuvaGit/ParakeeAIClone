import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline';
  className?: string;
  disabled?: boolean;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'default', 
  className = '',
  disabled = false
}: ButtonProps) {
  
  const baseStyles = "px-4 py-2 rounded-md transition-colors font-medium";
  
  const variantStyles = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "bg-transparent border border-gray-600 text-gray-200 hover:bg-gray-800"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}