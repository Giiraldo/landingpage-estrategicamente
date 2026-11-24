import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

import { cn } from '../../lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    className,
    disabled,
    error,
    helperText,
    id,
    label,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const helperTextId = `${inputId}-helper`
  const describedBy = [
    ariaDescribedBy,
    error ? errorId : undefined,
    !error && helperText ? helperTextId : undefined,
  ]
    .filter(Boolean)
    .join(' ') || undefined

  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="block text-sm font-semibold text-marino" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        {...props}
        aria-describedby={describedBy}
        aria-disabled={disabled || undefined}
        aria-invalid={error ? true : ariaInvalid}
        className={cn(
          'min-h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-marino outline-none transition placeholder:text-marino/45 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60',
          error
            ? 'border-red-600 focus:border-red-600 focus:ring-red-600/20'
            : 'border-marino/20 focus:border-violeta focus:ring-violeta/20',
          className,
        )}
        disabled={disabled}
        id={inputId}
        ref={ref}
      />
      {error ? (
        <p className="text-sm text-red-700" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
      {!error && helperText ? (
        <p className="text-sm text-marino/60" id={helperTextId}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
})

Input.displayName = 'Input'
