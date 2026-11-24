import type { HTMLAttributes } from 'react'

import { cn } from '../../lib/utils'

export type BadgeVariant = 'new' | 'contacted' | 'quoted' | 'closed' | 'lost'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  new: 'bg-azul/15 text-azul',
  contacted: 'bg-violeta/15 text-violeta',
  quoted: 'bg-celeste/25 text-marino',
  closed: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-slate-200 text-slate-700',
}

export function Badge({ className, variant = 'new', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold leading-none',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
