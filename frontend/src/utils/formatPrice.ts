export function formatPrice(
  amount: number | undefined | null,
  currency: string = 'INR',
  fractionDigits: number = 0
): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0'
  }

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: fractionDigits,
    }).format(amount)
  } catch {
    // Fallback if currency code is not supported
    return `₹${amount.toLocaleString('en-IN')}`
  }
}

export function formatCompactPrice(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`
  }
  return `₹${amount}`
}
