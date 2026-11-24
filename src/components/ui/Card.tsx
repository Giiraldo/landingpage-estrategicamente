import type { HTMLAttributes } from 'react'

import { cn } from '../../lib/utils'

export type CardVariant = 'default' | 'outlined' | 'elevated'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
}

const variantClasses: Record<CardVariant, string> = {
  default: 'border border-marino/10 bg-white shadow-sm',
  outlined: 'border border-marino/20 bg-white',
  elevated: 'border border-marino/5 bg-white shadow-xl',
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6 sm:p-8',
}

export function Card({ className, padding = 'md', variant = 'default', ...props }: CardProps) {
  return (
    <div className={cn('rounded-xl', variantClasses[variant], paddingClasses[padding], className)} {...props} />
  )
}
