'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ImportanceSliderProps {
  initialValue: number
  onChange: (value: number) => void
}

export function ImportanceSlider({ initialValue, onChange }: ImportanceSliderProps) {
  const [value, setValue] = useState(initialValue)
  const [saving, setSaving] = useState(false)
  
  const handleChange = async (newValue: number) => {
    setValue(newValue)
    onChange(newValue)
    
    // Save to database
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            importance_threshold: newValue,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })
      }
    } catch (error) {
      console.error('Failed to save threshold:', error)
    } finally {
      setSaving(false)
    }
  }
  
  const getDescription = (val: number) => {
    if (val <= 3) return 'All tweets including casual updates'
    if (val <= 5) return 'Moderately important tweets'
    if (val <= 7) return 'Important announcements and updates'
    if (val <= 9) return 'Only critical announcements'
    return 'Ultra-critical alerts only'
  }
  
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Importance Threshold</h2>
        {saving && <span className="text-sm text-slate-400">Saving...</span>}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-blue-400">{value}</span>
          <span className="text-sm text-slate-400">out of 10</span>
        </div>
        
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(value - 1) * 11.11}%, #475569 ${(value - 1) * 11.11}%, #475569 100%)`
          }}
        />
        
        <div className="flex justify-between text-xs text-slate-500">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
        
        <p className="text-sm text-slate-300 mt-4">
          {getDescription(value)}
        </p>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}