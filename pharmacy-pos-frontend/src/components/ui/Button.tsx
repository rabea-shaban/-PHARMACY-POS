import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils.js';
import { Spinner } from './Spinner.js';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-[#003C3D] text-white hover:bg-[#005456] focus:ring-[#003C3D] shadow-sm hover:shadow',
        secondary:
          'bg-[#DDEEEE] text-[#003C3D] hover:bg-[#c9e4e4] focus:ring-[#003C3D]',
        outline:
          'border border-[#D5E6E5] text-[#0B3031] bg-[#F7FCFC] hover:bg-white focus:ring-[#003C3D]',
        ghost:
          'text-[#557274] hover:bg-[#DDEEEE]/50 hover:text-[#003C3D]',
        danger:
          'bg-[#F2A9AB] text-[#713F42] hover:bg-[#ea9496] focus:ring-[#F2A9AB]',
        mint:
          'bg-[#83D4C8] text-[#003C3D] hover:bg-[#72c5b9] focus:ring-[#83D4C8]',
        lime:
          'bg-[#CBEF91] text-[#365A35] hover:bg-[#bee67e] focus:ring-[#CBEF91]',
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
