import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils.js';
import { Spinner } from './Spinner.js';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold transition-all duration-150 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500 shadow-sm shadow-sky-600/20 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 dark:focus:ring-sky-400 dark:shadow-sky-500/20',
        secondary:
          'bg-sky-100 text-sky-800 hover:bg-sky-200 focus:ring-sky-400 dark:bg-[#1E293B] dark:text-slate-100 dark:hover:bg-[#2A374F]',
        outline:
          'border border-slate-200 text-slate-800 bg-white hover:bg-slate-50 focus:ring-sky-500 dark:border-[#223049] dark:bg-[#131B2A] dark:text-slate-200 dark:hover:bg-[#1C273B]',
        ghost:
          'text-slate-600 hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-[#1A2639] dark:hover:text-white',
        danger:
          'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm shadow-rose-600/20 dark:bg-rose-500 dark:text-white dark:hover:bg-rose-600',
        success:
          'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm dark:bg-emerald-500 dark:text-slate-950',
      },
      size: {
        sm: 'h-8 px-3 text-xs gap-1.5',
        md: 'h-10 px-4 text-sm gap-2',
        lg: 'h-12 px-6 text-base gap-2.5',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading ? (
          <Spinner size="sm" className="mr-1" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
