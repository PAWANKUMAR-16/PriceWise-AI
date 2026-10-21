import React from 'react'
import clsx from 'clsx'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  className?: string
  fullScreen?: boolean
  message?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  fullScreen = false,
  message,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  }

  const colorStyles = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-emerald-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
  }

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={clsx(
          'rounded-full animate-spin',
          sizeStyles[size],
          colorStyles[color],
          className
        )}
      />
      {message && <p className="text-sm text-gray-500 font-medium animate-pulse">{message}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinnerElement}
      </div>
    )
  }

  return spinnerElement
}

export default Spinner
