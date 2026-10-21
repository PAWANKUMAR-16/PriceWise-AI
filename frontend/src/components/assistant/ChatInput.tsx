import React, { useState, KeyboardEvent } from 'react'
import { Send, Sparkles } from 'lucide-react'
import Button from '../ui/Button'

export interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  placeholder?: string
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder = 'Ask PriceWise AI about prices, deals, or product comparisons...',
}) => {
  const [text, setText] = useState('')

  const quickPrompts = [
    'Best laptop under ₹60,000?',
    'Compare MacBook Air M3 vs Dell XPS 14',
    'Which flagship phone has the steepest discount?',
    'Should I buy Sony WH-1000XM5 now or wait?',
  ]

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim())
      setText('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-3">
      {/* Quick Prompts Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-gray-400 flex items-center gap-1 font-medium shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Suggestions:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700 rounded-full border border-gray-200 transition-colors shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl p-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 shadow-xs">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
        />
        <Button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || isLoading}
          isLoading={isLoading}
          size="sm"
          className="rounded-lg shrink-0 px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default ChatInput
