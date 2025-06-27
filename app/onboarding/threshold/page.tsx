'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ThresholdPage() {
  const [threshold, setThreshold] = useState(9)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleContinue = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase
        .from('user_settings')
        .update({ importance_threshold: threshold })
        .eq('user_id', user.id)
    }
    
    router.push('/onboarding/telegram')
  }

  const getDescription = (value: number) => {
    if (value <= 3) return "You'll receive all updates including casual tweets."
    if (value <= 5) return "You'll see moderately important updates and announcements."
    if (value <= 7) return "You'll get important announcements and major updates."
    if (value <= 9) return "You'll only receive notifications for the most critical updates."
    return "Ultra-selective: Only game-changing announcements."
  }

  const getFrequency = (value: number) => {
    if (value <= 3) return "20-30 alerts per week"
    if (value <= 5) return "10-15 alerts per week"
    if (value <= 7) return "5-10 alerts per week"
    if (value <= 9) return "1-3 alerts per week"
    return "1-2 alerts per month"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1e1e3f] text-white flex flex-col">
      <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-xl font-light mb-2">Set Alert Threshold</h1>
          <p className="text-sm text-gray-400">Only see what matters most</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Current Value Display */}
          <div className="text-center mb-16">
            <div className="text-7xl font-thin text-blue-400 mb-4">{threshold}</div>
            <p className="text-sm text-gray-400">Importance score</p>
          </div>

          {/* Slider */}
          <div className="mb-16">
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(threshold - 1) * 11.11}%, #374151 ${(threshold - 1) * 11.11}%, #374151 100%)`
                }}
              />
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-500">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                <span className="text-blue-400">i</span>
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-2">
                  {getDescription(threshold)}
                </p>
                <p className="text-xs text-gray-500">
                  Typically {getFrequency(threshold)} across your selected projects.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={saving}
          className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Continue'}
        </button>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  )
}