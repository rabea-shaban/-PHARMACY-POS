import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils.js';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors',
  {
    variants: {
      variant: {
        success: 'bg-[#E8F7E8] text-[#2D6A4F] border border-[#C8E6C9]',
        warning: 'bg-[#FFF8D8] text-[#8C6D1F] border border-[#FFE082]',
        danger: 'bg-[#FDEBEC] text-[#842029] border border-[#F8D7DA]',
        info: 'bg-[#E4F6F8] text-[#0C5460] border border-[#BEE5EB]',
        mint: 'bg-[#E6F8F5] text-[#1D5D53] border border-[#83D4C8]',
        coral: 'bg-[#FDEEEF] text-[#713F42] border border-[#F2A9AB]',
        lime: 'bg-[#F4FBEB] text-[#365A35] border border-[#CBEF91]',
        purple: 'bg-[#F2F4FC] text-[#4A55A2] border border-[#AEB9E8]',
        neutral: 'bg-[#F2FBFA] text-[#557274] border border-[#D5E6E5]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({ className, variant, children, ...props }) => {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {children}
    </span>
  );
};
