import React from 'react';

interface LoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  containerClassName?: string;
}

export function Loader({ 
  text = 'Loading...', 
  size = 'md',
  containerClassName = 'h-40' 
}: LoaderProps) {
  const spinnerSize = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex justify-center items-center ${containerClassName}`}>
      <div className={`animate-spin rounded-full ${spinnerSize[size]} border-b-2 border-current`}></div>
      {text && <span className="ml-3">{text}</span>}
    </div>
  );
}

export function ErrorMessage({ message = 'An error occurred. Please try again later.' }) {
  return (
    <div className="p-6 bg-red-500 bg-opacity-10 border border-red-400 rounded-md text-center text-red-300 my-4">
      {message}
    </div>
  );
}
