
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: 'full' | 'icon-only';
  className?: string;
}

export function Logo({ size = 'md', type = 'full', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: { container: 'h-8', text: 'text-lg' },
    md: { container: 'h-10', text: 'text-xl' },
    lg: { container: 'h-12', text: 'text-2xl' },
    xl: { container: 'h-16', text: 'text-3xl' },
  };

  const containerClass = sizeClasses[size].container;
  const textClass = sizeClasses[size].text;

  return (
    <Link 
      to="/" 
      className={`flex items-center space-x-2 ${className}`}
    >
      <div className={`relative ${containerClass} aspect-square bg-gradient-to-r from-slate-green to-slate-green/80 rounded-md flex items-center justify-center overflow-hidden border border-primary/20`}>
        <div className="absolute inset-0 bg-primary/10" />
        <span className="relative text-ivory font-bold text-xl drop-shadow-md">i</span>
      </div>
      {type === 'full' && (
        <span className={`font-bold ${textClass} bg-gradient-to-r from-slate-green via-primary to-slate-green/80   bg-clip-text`}>
          i5s
        </span>
      )}
    </Link>
  );
}
