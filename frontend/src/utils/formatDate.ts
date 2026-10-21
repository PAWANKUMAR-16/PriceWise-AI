import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'

export function formatDate(dateInput: string | Date | undefined | null, formatStr: string = 'dd MMM yyyy'): string {
  if (!dateInput) return ''
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput
    if (!isValid(date)) return ''
    return format(date, formatStr)
  } catch {
    return ''
  }
}

export function formatTimeAgo(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return ''
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput
    if (!isValid(date)) return ''
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return ''
  }
}

export function formatChartDate(dateInput: string | Date): string {
  return formatDate(dateInput, 'dd MMM')
}
