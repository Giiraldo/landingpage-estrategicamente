import type { KeyboardEvent, ReactNode } from 'react'

import { cn } from '../../lib/utils'
import { Skeleton } from './Skeleton'

export interface TableColumn<TData extends object> {
  key: keyof TData
  label: string
  render?: (value: TData[keyof TData], row: TData) => ReactNode
}

export interface TableProps<TData extends object> {
  columns: readonly TableColumn<TData>[]
  data: readonly TData[]
  isLoading?: boolean
  emptyMessage?: string
  ariaLabel?: string
  className?: string
  getRowId?: (row: TData, index: number) => string | number
  onRowClick?: (row: TData) => void
}

function getCellContent<TData extends object>(column: TableColumn<TData>, row: TData): ReactNode {
  const value = row[column.key]

  if (column.render) {
    return column.render(value, row)
  }

  return value === null || value === undefined || value === '' ? 'Sin datos' : String(value)
}

export function Table<TData extends object>({
  ariaLabel = 'Tabla de datos',
  className,
  columns,
  data,
  emptyMessage = 'No hay datos para mostrar.',
  getRowId,
  isLoading = false,
  onRowClick,
}: TableProps<TData>) {
  const getRowKey = (row: TData, index: number) => getRowId?.(row, index) ?? index
  const handleRowKeyDown = (event: KeyboardEvent<HTMLElement>, row: TData) => {
    if (!onRowClick || (event.key !== 'Enter' && event.key !== ' ')) {
      return
    }

    event.preventDefault()
    onRowClick(row)
  }

  if (isLoading) {
    return (
      <div aria-busy="true" aria-label="Cargando datos" className={cn('space-y-3', className)} role="status">
        <Skeleton className="h-14 w-full" variant="rectangular" />
        <Skeleton className="h-14 w-full" variant="rectangular" />
        <Skeleton className="h-14 w-full" variant="rectangular" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div
        className={cn('rounded-xl border border-dashed border-marino/20 bg-white px-5 py-10 text-center', className)}
        role="status"
      >
        <p className="text-sm font-medium text-marino/70">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="space-y-3 md:hidden">
        {data.map((row, rowIndex) => (
          <article
            key={getRowKey(row, rowIndex)}
            className={cn(
              'rounded-xl border border-marino/10 bg-white p-4 shadow-sm',
              onRowClick && 'cursor-pointer transition hover:border-violeta/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta',
            )}
            role={onRowClick ? 'button' : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            onKeyDown={(event) => handleRowKeyDown(event, row)}
          >
            <dl className="space-y-3">
              {columns.map((column) => (
                <div key={String(column.key)} className="flex items-start justify-between gap-5">
                  <dt className="shrink-0 text-xs font-bold uppercase tracking-wide text-marino/55">{column.label}</dt>
                  <dd className="min-w-0 text-right text-sm text-marino">{getCellContent(column, row)}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-marino/10 bg-white md:block">
        <table aria-label={ariaLabel} className="min-w-full divide-y divide-marino/10 text-left text-sm text-marino">
          <thead className="bg-marino/5 text-xs uppercase tracking-wide text-marino/65">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-4 py-3 font-bold" scope="col">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-marino/10">
            {data.map((row, rowIndex) => (
            <tr
              key={getRowKey(row, rowIndex)}
              className={cn(
                'transition-colors hover:bg-violeta/5',
                onRowClick && 'cursor-pointer focus-within:bg-violeta/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violeta',
              )}
              role={onRowClick ? 'button' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={(event) => handleRowKeyDown(event, row)}
            >
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3">
                    {getCellContent(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
