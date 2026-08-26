import React from 'react';
import {
  HeartPulse,
  PlusSquare,
  Pill,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks.js';

export interface PharmacyBrandLogoProps {
  logo?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showFallbackGradient?: boolean;
}

export const PharmacyBrandLogo: React.FC<PharmacyBrandLogoProps> = ({
  logo: propLogo,
  size = 'md',
  className = '',
  showFallbackGradient = true,
}) => {
  const { publicSettings } = useAppSelector((state) => state.settings);
  const logo = propLogo !== undefined ? propLogo : publicSettings.pharmacyLogo;

  const sizeClasses = {
    sm: 'w-7 h-7 rounded-xl p-1',
    md: 'w-10 h-10 rounded-2xl p-1.5',
    lg: 'w-12 h-12 rounded-2xl p-2',
    xl: 'w-16 h-16 rounded-3xl p-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  };

  const isCustomImage = logo && logo.startsWith('data:image');

  if (isCustomImage) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 shadow-sm shrink-0 ${sizeClasses[size]} ${className}`}
      >
        <img src={logo} alt="Pharmacy Brand Logo" className="w-full h-full object-contain" />
      </div>
    );
  }

  if (logo === 'cross') {
    return (
      <div
        className={`flex items-center justify-center bg-emerald-500 text-white shadow-md shadow-emerald-500/25 shrink-0 ${sizeClasses[size]} ${className}`}
      >
        <PlusSquare className={iconSizes[size]} strokeWidth={2.5} />
      </div>
    );
  }

  if (logo === 'pill') {
    return (
      <div
        className={`flex items-center justify-center bg-indigo-600 text-white shadow-md shadow-indigo-500/25 shrink-0 ${sizeClasses[size]} ${className}`}
      >
        <Pill className={iconSizes[size]} strokeWidth={2.5} />
      </div>
    );
  }

  if (logo === 'shield') {
    return (
      <div
        className={`flex items-center justify-center bg-teal-600 text-white shadow-md shadow-teal-500/25 shrink-0 ${sizeClasses[size]} ${className}`}
      >
        <ShieldCheck className={iconSizes[size]} strokeWidth={2.5} />
      </div>
    );
  }

  if (logo === 'sparkles') {
    return (
      <div
        className={`flex items-center justify-center bg-amber-500 text-white shadow-md shadow-amber-500/25 shrink-0 ${sizeClasses[size]} ${className}`}
      >
        <Sparkles className={iconSizes[size]} strokeWidth={2.5} />
      </div>
    );
  }

  // Default: Gradient HeartPulse
  return (
    <div
      className={`flex items-center justify-center text-white shrink-0 ${
        showFallbackGradient
          ? 'bg-gradient-to-tr from-sky-600 via-cyan-500 to-teal-400 shadow-md shadow-sky-500/25'
          : 'bg-sky-600'
      } ${sizeClasses[size]} ${className}`}
    >
      <HeartPulse className={`${iconSizes[size]} animate-pulse`} strokeWidth={2.5} />
    </div>
  );
};
