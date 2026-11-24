import type { CSSProperties, HTMLAttributes } from 'react'

import { cn } from '../../lib/utils'

export type SkeletonVariant = 'text' | 'circular' | 'rectangular'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  variant?: SkeletonVariant
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded',
  circular: 'size-10 rounded-full',
  rectangular: 'h-24 w-full rounded-lg',
}

export function Skeleton({ className, height, style, variant = 'text', width, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn('animate-pulse bg-marino/10', variantClasses[variant], className)}
      role="presentation"
      style={{ width, height, ...style }}
    />
  )
}
