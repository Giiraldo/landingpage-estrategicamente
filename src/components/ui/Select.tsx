import { forwardRef, useId } from 'react'
import type { ReactNode, SelectHTMLAttributes } from 'react'

import { cn } from '../../lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: ReactNode
  error?: string
  helperText?: string
  options: readonly SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    className,
    disabled,
    error,
    helperText,
    id,
    label,
    options,
    placeholder,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const errorId = `${selectId}-error`
  const helperTextId = `${selectId}-helper`
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
        <label className="block text-sm font-semibold text-marino" htmlFor={selectId}>
          {label}
        </label>
      ) : null}
      <select
        {...props}
        aria-describedby={describedBy}
        aria-disabled={disabled || undefined}
        aria-invalid={error ? true : ariaInvalid}
        className={cn(
          'min-h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-marino outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60',
          error
            ? 'border-red-600 focus:border-red-600 focus:ring-red-600/20'
            : 'border-marino/20 focus:border-violeta focus:ring-violeta/20',
          className,
        )}
        disabled={disabled}
        id={selectId}
        ref={ref}
      >
        {placeholder ? (
          <option disabled value="">
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} disabled={option.disabled} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

Select.displayName = 'Select'
