import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ children, ...props }) => (
  <select {...props}>{children}</select>
);

export const SelectTrigger: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const SelectItem: React.FC<React.OptionHTMLAttributes<HTMLOptionElement>> = ({ children, ...props }) => (
  <option {...props}>{children}</option>
);

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder, children }) => (
  <span>{children || placeholder}</span>
);