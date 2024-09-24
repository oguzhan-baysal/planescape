import React from 'react';

interface AvatarProps {
  fallback: string;
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ fallback, children }) => (
  <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
    {children}
    {!React.Children.toArray(children).some(child => React.isValidElement(child) && child.type === AvatarImage) && (
      <div className="flex items-center justify-center w-full h-full bg-purple-600 text-white text-sm font-medium">
        {fallback}
      </div>
    )}
  </div>
);

export const AvatarImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img {...props} className="w-full h-full object-cover" />
);

export const AvatarFallback: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div {...props} className="flex items-center justify-center w-full h-full bg-purple-600 text-white text-sm font-medium">
    {children}
  </div>
);