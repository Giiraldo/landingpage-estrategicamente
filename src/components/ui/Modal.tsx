import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'

import { cn } from '../../lib/utils'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title: string
  size?: ModalSize
  className?: string
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function Modal({ children, className, isOpen, onClose, size = 'md', title }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const dialog = dialogRef.current
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousBodyOverflow = document.body.style.overflow
    const getFocusableElements = () =>
      dialog ? Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)) : []
    const focusFrame = window.requestAnimationFrame(() => {
      const [firstFocusableElement] = getFocusableElements()

      if (firstFocusableElement) {
        firstFocusableElement.focus()
      } else {
        dialog?.focus()
      }
    })

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialog) {
        return
      }

      const focusableElements = getFocusableElements()

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const firstFocusableElement = focusableElements[0]
      const lastFocusableElement = focusableElements[focusableElements.length - 1]

      if (!dialog.contains(document.activeElement)) {
        event.preventDefault()
        firstFocusableElement.focus()
        return
      }

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault()
        lastFocusableElement.focus()
      }

      if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault()
        firstFocusableElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousBodyOverflow
      previousActiveElement?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-marino/55 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(
          'max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-xl bg-white p-5 shadow-xl sm:p-6',
          sizeClasses[size],
          className,
        )}
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-extrabold text-marino" id={titleId}>
            {title}
          </h2>
          <button
            aria-label="Cerrar modal"
            className="rounded-md p-1 text-marino/70 transition hover:bg-violeta/10 hover:text-marino focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta"
            type="button"
            onClick={onClose}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
