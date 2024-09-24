import React from 'react';

export const RadioGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`flex ${className}`} {...props}>
    {children}
  </div>
);

export const RadioGroupItem: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input type="radio" className={`sr-only ${className}`} {...props} />
);