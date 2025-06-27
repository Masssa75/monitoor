'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function TelegramPage() {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    generateToken()
  }, [])

  const generateToken = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Generate a simple token
      const token = Math.random().toString(36).substring(2, 8).toUpperCase()
      setToken(token)
      
      // Save token to database
      await supabase
        .from('telegram_tokens')
        .insert({
          user_id: user.id,
          token: token
        })
    }
  }

  const handleConnect = () => {
    const botUsername = 'monitoor_alerts_bot'
    const url = `https://t.me/${botUsername}?start=${token}`
    window.open(url, '_blank')
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1e1e3f] text-white flex flex-col">
      <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-light mb-2">Connect Telegram</h1>
          <p className="text-sm text-gray-400">Get instant notifications</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Telegram Icon */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-blue-500 bg-opacity-10 border border-blue-400 rounded-3xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.02-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.5-.18.94.12.78.88z"/>
              </svg>
            </div>
            
            <h2 className="text-lg font-light mb-4">How it works</h2>
            
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-center space-x-3 text-left max-w-xs mx-auto">
                <div className="text-blue-400 font-light">1.</div>
                <p>Click connect below</p>
              </div>
              <div className="flex items-center space-x-3 text-left max-w-xs mx-auto">
                <div className="text-blue-400 font-light">2.</div>
                <p>Open the link in Telegram</p>
              </div>
              <div className="flex items-center space-x-3 text-left max-w-xs mx-auto">
                <div className="text-blue-400 font-light">3.</div>
                <p>Start receiving alerts</p>
              </div>
            </div>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium flex items-center justify-center space-x-3 hover:bg-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.02-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.5-.18.94.12.78.88z"/>
            </svg>
            <span>Connect Telegram</span>
          </button>
        </div>

        {/* Skip Option */}
        <button 
          onClick={handleSkip}
          className="text-center text-sm text-gray-500 py-4 hover:text-gray-400 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}