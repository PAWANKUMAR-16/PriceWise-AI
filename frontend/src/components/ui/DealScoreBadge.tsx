import React from 'react'
import { Flame, Sparkles, Check, AlertCircle } from 'lucide-react'
import clsx from 'clsx'
import { getDealScoreMeta } from '../../utils/dealScore'

export interface DealScoreBadgeProps {
  score?: number
  label?: string
  showScore?: boolean
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const DealScoreBadge: React.FC<DealScoreBadgeProps> = ({
  score = 50,
  showScore = true,
  showLabel = true,
  size = 'md',
  className,
}) => {
  const meta = getDealScoreMeta(score)

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-bold px-3 py-1.5 gap-2',
  }

  const iconMap = {
    hot: <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0" />,
    good: <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
    fair: <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />,
    neutral: <AlertCircle className="w-3.5 h-3.5 text-gray-500 shrink-0" />,
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border shadow-xs select-none transition-transform hover:scale-105',
        meta.bgClass,
        meta.borderClass,
        sizeClasses[size],
        className
      )}
      title={`Deal Score: ${score}/100 - ${meta.label}`}
    >
      {iconMap[meta.category]}
      {showLabel && <span>{meta.label}</span>}
      {showScore && (
        <span
          className={clsx(
            'rounded-full px-1.5 py-0.2 text-[10px] font-bold bg-white/80 border',
            meta.borderClass,
            meta.textClass
          )}
        >
          {score}
        </span>
      )}
    </span>
  )
}

export default DealScoreBadge
