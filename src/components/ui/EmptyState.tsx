import { Inbox } from 'lucide-react'
import { useId } from 'react'
import type { ReactNode } from 'react'

import { cn } from '../../lib/utils'

export interface EmptyStateProps {
  title: string
  description: string
  cta?: ReactNode
  illustration?: ReactNode
  className?: string
}

export function EmptyState({ className, cta, description, illustration, title }: EmptyStateProps) {
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className={cn('rounded-xl border border-dashed border-marino/20 bg-white px-5 py-12 text-center', className)}
    >
      {illustration ?? (
        <div className="mx-auto inline-flex rounded-full bg-violeta/10 p-3 text-violeta">
          <Inbox aria-hidden="true" className="size-6" />
        </div>
      )}
      <h2 className="mt-4 text-lg font-extrabold text-marino" id={titleId}>
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-marino/65">{description}</p>
      {cta ? <div className="mt-5">{cta}</div> : null}
    </section>
  )
}
