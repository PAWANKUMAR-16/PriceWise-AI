import React, { useState } from 'react'
import { Bell, Check, Sparkles } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice'
import Button from '../ui/Button'
import Input from '../ui/Input'

export interface AlertFormProps {
  currentPrice: number
  productTitle: string
  initialTargetPrice?: number
  currency?: string
  onSubmit: (targetPrice: number) => Promise<void> | void
  onCancel?: () => void
}

export const AlertForm: React.FC<AlertFormProps> = ({
  currentPrice,
  productTitle,
  initialTargetPrice,
  currency = 'INR',
  onSubmit,
  onCancel,
}) => {
  const defaultTarget = initialTargetPrice || Math.round(currentPrice * 0.9)
  const [targetPrice, setTargetPrice] = useState<string>(defaultTarget.toString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePercentageClick = (percentage: number) => {
    const calculated = Math.round(currentPrice * (1 - percentage / 100))
    setTargetPrice(calculated.toString())
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numericTarget = parseFloat(targetPrice)

    if (isNaN(numericTarget) || numericTarget <= 0) {
      setError('Please enter a valid price amount.')
      return
    }

    if (numericTarget >= currentPrice) {
      setError('Target price should be lower than the current best price.')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit(numericTarget)
      setIsSuccess(true)
    } catch {
      setError('Failed to set alert. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-6 space-y-3">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-900 text-base">Price Alert Configured!</h4>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          We will notify you the instant the price hits{' '}
          <strong className="text-gray-900">{formatPrice(parseFloat(targetPrice), currency)}</strong>{' '}
          or lower.
        </p>
        <div className="pt-2">
          <Button variant="primary" size="sm" onClick={onCancel}>
            Done
          </Button>
        </div>
      </div>
    )
  }

  const numericTarget = parseFloat(targetPrice) || 0
  const savings = Math.max(0, currentPrice - numericTarget)
  const percentOff = currentPrice > 0 ? Math.round((savings / currentPrice) * 100) : 0

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-xs text-gray-500 line-clamp-1 mb-1 font-medium">{productTitle}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Current Best Price:</span>
          <span className="font-bold text-gray-900">{formatPrice(currentPrice, currency)}</span>
        </div>
      </div>

      {/* Quick Percentage Chips */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
          Quick Preset Drops
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[5, 10, 15, 20].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => handlePercentageClick(pct)}
              className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700 transition-colors"
            >
              -{pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Target Price input */}
      <Input
        label="Desired Target Price (₹)"
        type="number"
        value={targetPrice}
        onChange={(e) => {
          setTargetPrice(e.target.value)
          setError(null)
        }}
        error={error || undefined}
        placeholder="Enter your target price"
        helperText={
          numericTarget > 0 && numericTarget < currentPrice
            ? `You will save ${formatPrice(savings, currency)} (${percentOff}% off)`
            : undefined
        }
      />

      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg flex items-start gap-2.5 text-xs text-blue-900">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p>
          We check retailer prices every 15 minutes. You will receive an instant notification when any verified store matches or beats this target.
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          leftIcon={<Bell className="w-4 h-4" />}
        >
          Set Price Alert
        </Button>
      </div>
    </form>
  )
}

export default AlertForm
