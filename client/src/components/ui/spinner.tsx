import React from 'react';
import { Loader2 as LoaderIcon } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 36,
  };
  
  return (
    <LoaderIcon 
      size={sizeMap[size]} 
      className={`animate-spin text-primary ${className}`}
    />
  );
};

export default Spinner;