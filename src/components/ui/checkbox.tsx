import React from 'react';

export const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input
    type="checkbox"
    className={`form-checkbox h-4 w-4 text-purple-600 transition duration-150 ease-in-out ${className}`}
    {...props}
  />
);