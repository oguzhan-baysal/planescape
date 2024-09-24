import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    default: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
    outline: 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50 focus:ring-purple-500',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};