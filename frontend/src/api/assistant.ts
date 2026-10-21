import apiClient from './client'
import { ChatMessage } from '../types'

export const assistantApi = {
  async sendMessage(
    message: string,
    mode: 'chat' | 'compare' | 'recommendations' = 'chat'
  ): Promise<ChatMessage> {
    try {
      const response = await apiClient.post<ChatMessage>('/assistant/chat', { message, mode })
      return response.data
    } catch {
      // Simulate intelligent AI shopping response
      await new Promise((resolve) => setTimeout(resolve, 800))

      const lower = message.toLowerCase()

      if (mode === 'compare' || lower.includes('compare') || lower.includes('vs')) {
        return {
          id: 'ai-msg-' + Date.now(),
          role: 'assistant',
          content:
            "I've analyzed the options for you. The **Apple MacBook Air 15\" M3** offers superior battery life (18 hrs) and quiet fanless design at **₹134,900**, whereas the **Dell XPS 14 OLED** provides dedicated NVIDIA RTX 4050 graphics and an ultra-vivid OLED touchscreen for power users at **₹189,990**.\n\n*Verdict:* Choose MacBook Air for portability and daily productivity; choose Dell XPS for CAD/heavy creative rendering.",
          timestamp: new Date().toISOString(),
          mode: 'compare',
          sources: [
            {
              productId: 'prod-1',
              title: 'Apple MacBook Air 15" M3 (16GB, 512GB)',
              price: 134900,
              retailer: 'Amazon India',
              url: '/products/prod-1',
            },
            {
              productId: 'prod-5',
              title: 'Dell XPS 14 OLED Laptop (Intel Core Ultra 7)',
              price: 189990,
              retailer: 'Dell Store',
              url: '/products/prod-5',
            },
          ],
        }
      }

      if (mode === 'recommendations' || lower.includes('recommend') || lower.includes('best') || lower.includes('deal')) {
        return {
          id: 'ai-msg-' + Date.now(),
          role: 'assistant',
          content:
            "Here are today's highest-rated deals based on real-time price drops:\n\n1. **Sony WH-1000XM5 Headphones**: Deal Score **92/100** (23% off) - Down to ₹26,990 from ₹34,990.\n2. **Logitech MX Master 3S**: Deal Score **90/100** (23% off) - Lowest price in 90 days.\n3. **Apple MacBook Air M3**: Deal Score **88/100** (₹15,000 drop across Amazon and Croma).",
          timestamp: new Date().toISOString(),
          mode: 'recommendations',
          sources: [
            {
              productId: 'prod-3',
              title: 'Sony WH-1000XM5 Wireless Headphones',
              price: 26990,
              retailer: 'Amazon India',
              url: '/products/prod-3',
            },
            {
              productId: 'prod-8',
              title: 'Logitech MX Master 3S Performance Mouse',
              price: 8495,
              retailer: 'Amazon India',
              url: '/products/prod-8',
            },
          ],
        }
      }

      return {
        id: 'ai-msg-' + Date.now(),
        role: 'assistant',
        content: `I'm tracking live prices across Amazon India, Flipkart, Croma, and Reliance Digital. You asked: "${message}". Currently, tech gadgets and audio gear have the steepest discounts. Feel free to ask me to compare two products, evaluate if a price is fair, or find coupons and bank offers!`,
        timestamp: new Date().toISOString(),
        mode: 'chat',
        sources: [
          {
            productId: 'prod-1',
            title: 'MacBook Air 15" M3',
            price: 134900,
            retailer: 'Amazon India',
            url: '/products/prod-1',
          },
        ],
      }
    }
  },

  async getChatHistory(): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get<ChatMessage[]>('/assistant/history')
      return response.data
    } catch {
      return [
        {
          id: 'intro-msg',
          role: 'assistant',
          content:
            'Hello! I am your **PriceWise AI Assistant**. I can help you track historical price drops, compare specs and retailers, find promo codes, and decide when is the best time to buy.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          mode: 'chat',
        },
      ]
    }
  },

  async clearChatHistory(): Promise<void> {
    try {
      await apiClient.delete('/assistant/history')
    } catch {
      // ignore
    }
  },
}
