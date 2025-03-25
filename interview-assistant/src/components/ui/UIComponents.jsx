import React, { useState, useEffect } from 'react';
// Modern Button with multiple variants
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  ...props
}) => {
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    ghost: 'bg-transparent hover:bg-zinc-100 text-zinc-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
  };
  
  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };
  
  // Construct button classes
  const buttonClasses = `
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    transition-all duration-300 ease-in-out
    rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}
    ${fullWidth ? 'w-full' : ''}
    flex items-center justify-center
    ${className}
  `;
  
  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

// Card component with various styles
export const Card = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  hover = false,
  ...props
}) => {
  // Card variant classes
  const variantClasses = {
    default: 'bg-white rounded-xl shadow-md',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-md',
    bordered: 'bg-white border border-zinc-200 rounded-xl shadow-sm',
    flat: 'bg-white rounded-xl',
    elevated: 'bg-white rounded-xl shadow-lg',
  };
  
  return (
    <div
      className={`
        ${variantClasses[variant] || variantClasses.default}
        overflow-hidden
        ${hover ? 'transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Input component
export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-zinc-700 mb-1">
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2 rounded-lg border 
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 focus:ring-primary-500'}
          focus:outline-none focus:ring-2 focus:border-transparent
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-zinc-500">{helperText}</p>
      )}
    </div>
  );
};

// Textarea component
export const Textarea = ({
  placeholder,
  value,
  onChange,
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  id,
  rows = 4,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-zinc-700 mb-1">
          {label}
        </label>
      )}
      
      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-4 py-2 rounded-lg border 
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 focus:ring-primary-500'}
          focus:outline-none focus:ring-2 focus:border-transparent
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-zinc-500">{helperText}</p>
      )}
    </div>
  );
};

// Badge component
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  // Variant classes
  const variantClasses = {
    default: 'bg-zinc-100 text-zinc-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    accent: 'bg-accent-100 text-accent-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };
  
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantClasses[variant] || variantClasses.default}
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

// Avatar component
export const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className = '',
  fallback,
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };
  
  const [imgError, setImgError] = React.useState(false);
  
  const handleError = () => {
    setImgError(true);
  };
  
  return (
    <div
      className={`
        relative rounded-full overflow-hidden inline-flex items-center justify-center bg-zinc-200
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      {...props}
    >
      {!imgError && src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleError}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-zinc-200 text-zinc-600 font-medium">
          {fallback || alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

// Divider component
export const Divider = ({ className = '', vertical = false, ...props }) => {
  return vertical ? (
    <div className={`h-full w-px bg-zinc-200 ${className}`} {...props} />
  ) : (
    <div className={`w-full h-px bg-zinc-200 ${className}`} {...props} />
  );
};

// Alert component
export const Alert = ({
  children,
  variant = 'info',
  title,
  icon,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}) => {
  // Variant classes
  const variantClasses = {
    info: 'bg-blue-50 border-blue-300 text-blue-800',
    success: 'bg-green-50 border-green-300 text-green-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    error: 'bg-red-50 border-red-300 text-red-800',
  };
  
  // Icons for each variant
  const variantIcons = {
    info: (
      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };
  
  return (
    <div
      className={`
        p-4 rounded-lg border-l-4 
        ${variantClasses[variant] || variantClasses.info}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {icon || variantIcons[variant]}
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          
          <div className={`text-sm ${title ? 'mt-1' : ''}`}>
            {children}
          </div>
        </div>
        
        {dismissible && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={onDismiss}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Tooltip component
export const Tooltip = ({
  children,
  content,
  position = 'top',
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 transform -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 transform -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 transform -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 transform -translate-y-1/2',
  };
  
  const arrowClasses = {
    top: 'bottom-0 left-1/2 transform translate-x-1/2 translate-y-1/2 rotate-45',
    bottom: 'top-0 left-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45',
    left: 'right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45',
    right: 'left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45',
  };
  
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {isVisible && (
        <div className={`
          absolute z-10 px-3 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg shadow-sm
          whitespace-nowrap
          ${positionClasses[position]}
          ${className}
        `}>
          {content}
          <div className={`
            absolute w-2 h-2 bg-zinc-900
            ${arrowClasses[position]}
          `}></div>
        </div>
      )}
      {children}
    </div>
  );
};

// Skeleton loading component
export const Skeleton = ({
  variant = 'text',
  width,
  height,
  circle = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'animate-pulse bg-zinc-200 rounded';
  
  const variantClasses = {
    text: 'w-full h-4',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };
  
  const customStyles = {
    width: width,
    height: height,
  };
  
  return (
    <div
      className={`
        ${baseClasses}
        ${circle ? variantClasses.circular : variantClasses[variant]}
        ${className}
      `}
      style={customStyles}
      {...props}
    />
  );
};


export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    className = '',
    ...props
  }) => {
    // Size classes
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4',
    };
    
    // Handle backdrop click
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
    
    // Handle escape key - moved outside conditional rendering
    useEffect(() => {
      if (!isOpen) return; // Only add listeners when modal is open
      
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEsc);
      
      return () => {
        document.removeEventListener('keydown', handleEsc);
      };
    }, [isOpen, onClose]);
    
    // Control body overflow - moved outside conditional rendering
    useEffect(() => {
      if (!isOpen) return; // Only modify body style when modal is open
      
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);
    
    if (!isOpen) return null;
    
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div
          className={`
            ${sizeClasses[size]} w-full bg-white rounded-xl shadow-xl transform transition-all animate-scale-in
            ${className}
          `}
          {...props}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-200">
            <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
            <button
              className="p-1 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
              onClick={onClose}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          
          {/* Body */}
          <div className="p-4">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="p-4 border-t border-zinc-200 bg-zinc-50 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  };

// Tabs component
export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'default',
  className = '',
  ...props
}) => {
  // Variant classes
  const variantClasses = {
    default: {
      container: 'border-b border-zinc-200',
      tab: {
        active: 'border-b-2 border-primary-500 text-primary-600',
        inactive: 'border-b-2 border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300',
      },
    },
    pills: {
      container: 'space-x-1',
      tab: {
        active: 'bg-primary-100 text-primary-700 rounded-lg',
        inactive: 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg',
      },
    },
    minimal: {
      container: '',
      tab: {
        active: 'text-primary-600 font-medium',
        inactive: 'text-zinc-500 hover:text-zinc-700',
      },
    },
  };
  
  return (
    <div className={className} {...props}>
      <div className={`flex ${variantClasses[variant].container}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              py-2 px-4 font-medium transition-colors
              ${activeTab === tab.id
                ? variantClasses[variant].tab.active
                : variantClasses[variant].tab.inactive
              }
            `}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Progress component
export const Progress = ({
  value = 0,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) => {
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Size classes
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };
  
  // Color classes
  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    accent: 'bg-accent-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };
  
  return (
    <div className={className} {...props}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1">
          {label && <div className="text-sm font-medium text-zinc-700">{label}</div>}
          {showValue && <div className="text-sm font-medium text-zinc-700">{value}%</div>}
        </div>
      )}
      
      <div className={`w-full bg-zinc-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Toggle / Switch component
export const Toggle = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: {
      toggle: 'w-8 h-4',
      circle: 'h-3 w-3 translate-x-0.5',
      circleChecked: 'translate-x-4',
    },
    md: {
      toggle: 'w-11 h-6',
      circle: 'h-5 w-5 translate-x-0.5',
      circleChecked: 'translate-x-5',
    },
    lg: {
      toggle: 'w-14 h-7',
      circle: 'h-6 w-6 translate-x-0.5',
      circleChecked: 'translate-x-7',
    },
  };
  
  return (
    <div className={`flex items-center ${className}`} {...props}>
      <button
        type="button"
        className={`
          ${sizeClasses[size].toggle}
          ${checked ? 'bg-primary-600' : 'bg-zinc-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          relative inline-flex flex-shrink-0 rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2
          focus:ring-primary-500 focus:ring-offset-2
        `}
        onClick={() => !disabled && onChange(!checked)}
        aria-pressed={checked}
        disabled={disabled}
      >
        <span className="sr-only">{label}</span>
        <span
          className={`
            ${sizeClasses[size].circle}
            ${checked ? sizeClasses[size].circleChecked : ''}
            bg-white rounded-full shadow
            transform transition duration-200 ease-in-out
          `}
        />
      </button>
      
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <span className="text-sm font-medium text-zinc-900">{label}</span>
          )}
          {description && (
            <span className="text-sm text-zinc-500 block">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Dropdown / Menu component
export const Dropdown = ({
  trigger,
  items = [],
  isOpen,
  setIsOpen,
  align = 'right',
  className = '',
  ...props
}) => {
  const dropdownRef = React.useRef(null);
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen]);
  
  // Alignment classes
  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
  };
  
  return (
    <div className="relative inline-block text-left" ref={dropdownRef} {...props}>
      {/* Trigger button */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`
            absolute z-10 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5
            ${alignClasses[align]}
            transform transition-all duration-100 ease-out scale-in-origin-top
            ${className}
          `}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {item.divider ? (
                  <div className="my-1 h-px bg-zinc-200" />
                ) : (
                  <button
                    className={`
                      ${item.className || ''}
                      ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      flex items-center w-full px-4 py-2 text-sm text-left
                      ${item.danger ? 'text-red-700 hover:bg-red-50' : 'text-zinc-700 hover:bg-zinc-50'}
                    `}
                    onClick={() => {
                      if (!item.disabled) {
                        item.onClick();
                        if (!item.keepOpen) {
                          setIsOpen(false);
                        }
                      }
                    }}
                    disabled={item.disabled}
                  >
                    {item.icon && (
                      <span className="mr-2">{item.icon}</span>
                    )}
                    {item.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
// Here are additional advanced UI components you can add to UIComponents.jsx:

// Accordion component
export const Accordion = ({
    items = [],
    allowMultiple = false,
    className = '',
    ...props
  }) => {
    const [openItems, setOpenItems] = useState([]);
    
    const toggleItem = (index) => {
      if (allowMultiple) {
        setOpenItems(
          openItems.includes(index)
            ? openItems.filter(i => i !== index)
            : [...openItems, index]
        );
      } else {
        setOpenItems(
          openItems.includes(index) ? [] : [index]
        );
      }
    };
    
    return (
      <div className={`divide-y divide-zinc-200 border border-zinc-200 rounded-lg ${className}`} {...props}>
        {items.map((item, index) => (
          <div key={index} className="overflow-hidden">
            <button
              className="w-full py-4 px-5 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => toggleItem(index)}
              aria-expanded={openItems.includes(index)}
            >
              <span className="font-medium text-zinc-900">{item.title}</span>
              <svg
                className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ${
                  openItems.includes(index) ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              className={`px-5 overflow-hidden transition-all duration-300 ${
                openItems.includes(index)
                  ? 'max-h-96 py-4'
                  : 'max-h-0 py-0'
              }`}
            >
              <div className="text-zinc-700">{item.content}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Pagination component
  export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    className = '',
    ...props
  }) => {
    const getPageNumbers = () => {
      const totalPageNumbers = siblingCount * 2 + 3; // Current page + first/last page + siblings on both sides
      
      if (totalPageNumbers >= totalPages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
      
      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
      
      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 1 + 2 * siblingCount;
        return [
          ...Array.from({ length: leftItemCount }, (_, i) => i + 1),
          'dots',
          totalPages
        ];
      }
      
      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 1 + 2 * siblingCount;
        return [
          1,
          'dots',
          ...Array.from(
            { length: rightItemCount },
            (_, i) => totalPages - rightItemCount + i + 1
          )
        ];
      }
      
      return [
        1,
        'dots',
        ...Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        ),
        'dots',
        totalPages
      ];
    };
    
    const pageNumbers = getPageNumbers();
    
    return (
      <nav
        className={`flex justify-center space-x-1 ${className}`}
        aria-label="Pagination"
        {...props}
      >
        <button
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            currentPage === 1
              ? 'text-zinc-400 cursor-not-allowed'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Previous</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {pageNumbers.map((pageNumber, i) => {
          if (pageNumber === 'dots') {
            return (
              <span
                key={`dots-${i}`}
                className="px-3 py-2 rounded-md text-sm text-zinc-500"
              >
                ...
              </span>
            );
          }
          
          return (
            <button
              key={pageNumber}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pageNumber === currentPage
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
        
        <button
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            currentPage === totalPages
              ? 'text-zinc-400 cursor-not-allowed'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Next</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    );
  };
  
  // Tag/Chip component with optional remove button
  export const Tag = ({
    children,
    variant = 'default',
    size = 'md',
    onRemove,
    className = '',
    ...props
  }) => {
    // Variant classes
    const variantClasses = {
      default: 'bg-zinc-100 text-zinc-800',
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-secondary-100 text-secondary-800',
      accent: 'bg-accent-100 text-accent-800',
      success: 'bg-green-100 text-green-800',
      danger: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
    };
    
    // Size classes
    const sizeClasses = {
      sm: 'text-xs h-6',
      md: 'text-sm h-8',
      lg: 'text-base h-10',
    };
    
    return (
      <span
        className={`
          inline-flex items-center rounded-full px-3 font-medium
          ${variantClasses[variant] || variantClasses.default}
          ${sizeClasses[size] || sizeClasses.md}
          ${className}
        `}
        {...props}
      >
        {children}
        
        {onRemove && (
          <button
            type="button"
            className={`
              ml-1.5 -mr-1 h-4 w-4 rounded-full inline-flex items-center justify-center
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
              ${variant === 'default' ? 'hover:bg-zinc-200' : `hover:bg-${variant}-200`}
            `}
            onClick={onRemove}
          >
            <span className="sr-only">Remove</span>
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </span>
    );
  };
  
  // Breadcrumbs component
  export const Breadcrumbs = ({ items, className = '', ...props }) => {
    return (
      <nav className={`flex ${className}`} aria-label="Breadcrumb" {...props}>
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="flex-shrink-0 h-5 w-5 text-zinc-400 mx-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              
              {item.href && !item.current ? (
                <a
                  href={item.href}
                  className={`text-sm font-medium ${
                    index === 0 ? 'text-primary-600 hover:text-primary-700' : 'text-zinc-600 hover:text-zinc-700'
                  }`}
                >
                  {item.label}
                </a>
              ) : (
                <span className={`text-sm font-medium ${item.current ? 'text-zinc-500' : 'text-zinc-700'}`}>
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  };
  
  // Stepper component
  export const Stepper = ({
    steps,
    currentStep,
    onStepClick,
    className = '',
    ...props
  }) => {
    return (
      <nav className={`${className}`} aria-label="Progress" {...props}>
        <ol className="flex items-center">
          {steps.map((step, index) => (
            <li
              key={index}
              className={`
                ${index !== steps.length - 1 ? 'flex-1' : ''}
                ${index !== 0 ? 'ml-2 sm:ml-4' : ''}
                relative
              `}
            >
              {index !== steps.length - 1 && (
                <div
                  className={`
                    absolute top-1/2 left-0 -mt-px w-full h-0.5
                    ${index < currentStep ? 'bg-primary-500' : 'bg-zinc-200'}
                  `}
                  aria-hidden="true"
                  style={{ left: '50%', width: '100%' }}
                />
              )}
              
              <button
                className={`
                  relative flex items-center justify-center w-8 h-8 rounded-full
                  ${
                    index < currentStep
                      ? 'bg-primary-500 text-white'
                      : index === currentStep
                      ? 'border-2 border-primary-500 bg-white text-primary-700'
                      : 'border-2 border-zinc-300 bg-white text-zinc-500'
                  }
                  ${onStepClick ? 'cursor-pointer' : 'cursor-default'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                `}
                onClick={() => onStepClick && onStepClick(index)}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
                <span className="sr-only">{step.label}</span>
              </button>
              
              <div className="hidden sm:block mt-2 text-center text-xs font-medium text-zinc-600">
                {step.label}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    );
  };
  
  // File input component
  export const FileInput = ({
    label,
    accept,
    onChange,
    multiple = false,
    error,
    helperText,
    className = '',
    containerClassName = '',
    ...props
  }) => {
    const [dragActive, setDragActive] = React.useState(false);
    const inputRef = React.useRef(null);
    
    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    };
    
    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onChange(e);
      }
    };
    
    const handleChange = (e) => {
      onChange(e);
    };
    
    const handleClick = () => {
      inputRef.current.click();
    };
    
    return (
      <div className={`mb-4 ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            {label}
          </label>
        )}
        
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6
            ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-zinc-300 bg-zinc-50'}
            ${error ? 'border-red-500' : ''}
            transition-colors duration-200
            ${className}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            {...props}
          />
          
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-1 text-sm text-zinc-600">
              Drag and drop your file here, or{' '}
              <span className="text-primary-600 font-medium">browse</span>
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {multiple ? 'Files' : 'File'} should be {accept}
            </p>
          </div>
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-zinc-500">{helperText}</p>
        )}
      </div>
    );
  };
  
  // Toast notification component
  export const Toast = ({
    message,
    type = 'default',
    duration = 3000,
    onClose,
    position = 'bottom-right',
    className = '',
    ...props
  }) => {
    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          onClose && onClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);
    
    // Type classes
    const typeClasses = {
      default: 'bg-zinc-800 text-white',
      success: 'bg-green-600 text-white',
      error: 'bg-red-600 text-white',
      warning: 'bg-yellow-500 text-white',
      info: 'bg-blue-600 text-white',
    };
    
    // Position classes
    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };
    
    // Type icons
    const typeIcons = {
      success: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      default: null,
    };
    
    return (
      <div
        className={`
          fixed ${positionClasses[position]}
          flex items-center px-4 py-3 rounded-lg shadow-lg
          max-w-xs sm:max-w-sm animate-fade-in z-50
          ${typeClasses[type]}
          ${className}
        `}
        role="alert"
        {...props}
      >
        {typeIcons[type] && (
          <div className="flex-shrink-0 mr-2">
            {typeIcons[type]}
          </div>
        )}
        
        <div className="flex-1 mr-2 text-sm">{message}</div>
        
        <button
          className="flex-shrink-0 ml-auto text-white focus:outline-none"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  };
  
  // Rating component
  export const Rating = ({
    value = 0,
    max = 5,
    onChange,
    size = 'md',
    color = 'primary',
    readOnly = false,
    className = '',
    ...props
  }) => {
    const [hoverValue, setHoverValue] = React.useState(0);
    
    // Size classes
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    };
    
    // Color classes
    const colorClasses = {
      primary: 'text-primary-500',
      secondary: 'text-secondary-500',
      accent: 'text-accent-500',
      warning: 'text-yellow-500',
    };
    
    const handleMouseEnter = (index) => {
      if (!readOnly) {
        setHoverValue(index);
      }
    };
    
    const handleMouseLeave = () => {
      if (!readOnly) {
        setHoverValue(0);
      }
    };
    
    const handleClick = (index) => {
      if (!readOnly && onChange) {
        onChange(index);
      }
    };
    
    return (
      <div
        className={`flex ${className}`}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {[...Array(max)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = hoverValue ? starValue <= hoverValue : starValue <= value;
          
          return (
            <button
              key={index}
              type="button"
              className={`
                ${isFilled ? colorClasses[color] : 'text-zinc-300'}
                ${readOnly ? 'cursor-default' : 'cursor-pointer'}
                focus:outline-none transition-colors duration-150
              `}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onClick={() => handleClick(starValue)}
              disabled={readOnly}
            >
              <svg
                className={sizeClasses[size]}
                fill={isFilled ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          );
        })}
      </div>
    );
  };