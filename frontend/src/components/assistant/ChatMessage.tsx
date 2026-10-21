import React from 'react'
import { Link } from 'react-router-dom'
import { Bot, User as UserIcon, ExternalLink } from 'lucide-react'
import { ChatMessage as ChatMessageType } from '../../types'
import { formatTimeAgo } from '../../utils/formatDate'
import { formatPrice } from '../../utils/formatPrice'

export interface ChatMessageProps {
  message: ChatMessageType
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser
            ? 'bg-blue-600 text-white shadow-xs'
            : 'bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-xs'
        }`}
      >
        {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-none shadow-xs'
              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-xs'
          }`}
        >
          {/* Format content with line breaks and basic markdown formatting */}
          <div className="whitespace-pre-wrap space-y-2">
            {message.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div
            className={`text-[10px] mt-2 font-medium ${
              isUser ? 'text-blue-100 text-right' : 'text-gray-400 text-left'
            }`}
          >
            {formatTimeAgo(message.timestamp)}
          </div>
        </div>

        {/* Sources / Referenced Products */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
              Referenced Products:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.sources.map((source, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg p-2.5 hover:border-blue-300 transition-colors shadow-2xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-900 truncate">{source.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                      {source.price && (
                        <span className="font-bold text-emerald-600">
                          {formatPrice(source.price)}
                        </span>
                      )}
                      {source.retailer && (
                        <span className="text-gray-400 truncate">• {source.retailer}</span>
                      )}
                    </div>
                  </div>

                  {source.url && (
                    <Link
                      to={source.url}
                      className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
