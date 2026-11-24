import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useEffect } from 'react'
import type { HTMLAttributes } from 'react'

import { cn } from '../../lib/utils'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  message: string
  variant?: ToastVariant
  onDismiss: () => void
  duration?: number
  autoDismiss?: boolean
}

const variantClasses: Record<ToastVariant, string> = {
  success: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  error: 'border-red-300 bg-red-50 text-red-900',
  info: 'border-azul/25 bg-azul/10 text-marino',
}

export function Toast({
  autoDismiss = true,
  className,
  duration = 5_000,
  message,
  onDismiss,
  variant = 'info',
  ...props
}: ToastProps) {
  useEffect(() => {
    if (!autoDismiss) {
      return
    }

    const timeoutId = window.setTimeout(onDismiss, duration)

    return () => window.clearTimeout(timeoutId)
  }, [autoDismiss, duration, onDismiss])

  const Icon = variant === 'success' ? CheckCircle2 : variant === 'error' ? AlertCircle : Info

  return (
    <div
      {...props}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'fixed inset-x-4 top-4 z-[60] flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg sm:left-auto sm:w-full sm:max-w-sm',
        variantClasses[variant],
        className,
      )}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <Icon aria-hidden="true" className="size-5 shrink-0" />
      <p className="flex-1 font-medium">{message}</p>
      <button
        aria-label="Cerrar notificacion"
        className="rounded p-1 transition hover:bg-marino/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        type="button"
        onClick={onDismiss}
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}
