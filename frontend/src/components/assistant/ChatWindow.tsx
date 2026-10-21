import React, { useState, useEffect, useRef } from 'react'
import { Bot, MessageSquare, Scale, Sparkles, Trash2 } from 'lucide-react'
import { ChatMessage as ChatMessageType } from '../../types'
import { assistantApi } from '../../api/assistant'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [mode, setMode] = useState<'chat' | 'compare' | 'recommendations'>('chat')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const history = await assistantApi.getChatHistory()
        setMessages(history)
      } catch {
        // fallback
      }
    }
    fetchInitial()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessageType = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      mode,
    }

    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await assistantApi.sendMessage(text, mode)
      setMessages((prev) => [...prev, response])
    } catch {
      const errorMsg: ChatMessageType = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearHistory = async () => {
    await assistantApi.clearChatHistory()
    setMessages([
      {
        id: 'intro-new',
        role: 'assistant',
        content: 'Chat cleared. How can I help you find the best shopping deals today?',
        timestamp: new Date().toISOString(),
      },
    ])
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[750px] max-h-[85vh] overflow-hidden">
      {/* Top Header & Mode Toggle Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              PriceWise AI Shopping Consultant
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-xs text-gray-500">Live multi-retailer price intelligence</p>
          </div>
        </div>

        {/* Modes: Chat, Compare, Recommendations */}
        <div className="flex items-center gap-1 bg-gray-200/60 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'chat'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'compare'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('recommendations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'recommendations'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top Deals</span>
          </button>

          <button
            type="button"
            onClick={handleClearHistory}
            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white ml-1 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Message History List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
              <span className="text-xs text-gray-400 ml-1.5 font-medium">
                Analyzing prices & specs...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder={
            mode === 'compare'
              ? 'Enter products to compare (e.g., iPhone 15 Pro vs Samsung Galaxy S24 Ultra)...'
              : mode === 'recommendations'
              ? 'Tell me your budget or product category for personalized deal picks...'
              : 'Ask anything about prices, discounts, or best retailers...'
          }
        />
      </div>
    </div>
  )
}

export default ChatWindow
