export type DealScoreCategory = 'hot' | 'good' | 'fair' | 'neutral'

export interface DealScoreMeta {
  category: DealScoreCategory
  label: string
  bgClass: string
  textClass: string
  borderClass: string
  colorHex: string
}

export function getDealScoreMeta(score: number | undefined | null): DealScoreMeta {
  const numericScore = typeof score === 'number' ? score : 50

  if (numericScore >= 80) {
    return {
      category: 'hot',
      label: 'Hot Deal',
      bgClass: 'bg-red-50 text-red-700',
      textClass: 'text-red-600',
      borderClass: 'border-red-200',
      colorHex: '#EF4444',
    }
  }

  if (numericScore >= 60) {
    return {
      category: 'good',
      label: 'Good Deal',
      bgClass: 'bg-amber-50 text-amber-700',
      textClass: 'text-amber-600',
      borderClass: 'border-amber-200',
      colorHex: '#F59E0B',
    }
  }

  if (numericScore >= 40) {
    return {
      category: 'fair',
      label: 'Fair Price',
      bgClass: 'bg-blue-50 text-blue-700',
      textClass: 'text-blue-600',
      borderClass: 'border-blue-200',
      colorHex: '#3B82F6',
    }
  }

  return {
    category: 'neutral',
    label: 'Overpriced',
    bgClass: 'bg-gray-100 text-gray-700',
    textClass: 'text-gray-500',
    borderClass: 'border-gray-200',
    colorHex: '#6B7280',
  }
}
