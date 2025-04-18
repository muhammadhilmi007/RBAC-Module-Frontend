// src/components/ui/Button.js
import React from 'react';

const variants = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  success: 'bg-green-500 hover:bg-green-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  info: 'bg-cyan-500 hover:bg-cyan-600 text-white',
  light: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  dark: 'bg-gray-800 hover:bg-gray-900 text-white',
  link: 'bg-transparent text-blue-500 hover:text-blue-700 hover:underline',
};

const sizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Komponen Button yang dapat dikustomisasi
 *
 * @param {Object} props - Props komponen
 * @param {string} [props.variant='primary'] - Variant button
 * @param {string} [props.size='md'] - Ukuran button
 * @param {boolean} [props.fullWidth=false] - Button full width
 * @param {boolean} [props.isLoading=false] - State loading
 * @param {boolean} [props.disabled=false] - State disabled
 * @param {Function} [props.onClick] - Fungsi onClick
 * @param {ReactNode} props.children - Content button
 * @param {Object} [props.rest] - Props lainnya
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  ...rest
}) => {
  return (
    <button
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        rounded-md 
        font-medium 
        focus:outline-none 
        focus:ring-2 
        focus:ring-offset-2 
        focus:ring-blue-500 
        transition-colors 
        ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''} 
        ${className}
      `}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;