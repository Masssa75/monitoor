'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'

interface Project {
  id: string
  name: string
  symbol: string
  twitter_username: string
  logo_url: string | null
}

export default function ProjectSelectionPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    if (data) {
      setProjects(data)
    }
    setLoading(false)
  }

  const toggleProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const handleContinue = async () => {
    if (selectedProjects.length < 3) return
    
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          selected_projects: selectedProjects,
          importance_threshold: 9
        })
    }
    
    router.push('/onboarding/threshold')
  }

  const getProjectLogo = (project: Project) => {
    const logos: { [key: string]: string } = {
      'bitcoin': '₿',
      'ethereum': 'Ξ',
      'solana': '◎',
      'kaspa': 'K',
      'chainlink': 'LINK',
      'polygon': 'MATIC',
      'avalanche': 'AVAX',
      'sui': 'SUI',
      'arbitrum': 'ARB',
      'thegraph': 'GRT'
    }
    return logos[project.id] || project.symbol
  }

  const getProjectColor = (project: Project) => {
    const colors: { [key: string]: string } = {
      'bitcoin': 'bg-orange-500',
      'ethereum': 'bg-gray-700',
      'solana': 'bg-purple-500',
      'kaspa': 'bg-blue-600',
      'chainlink': 'bg-blue-500',
      'polygon': 'bg-purple-600',
      'avalanche': 'bg-red-500',
      'sui': 'bg-blue-400',
      'arbitrum': 'bg-blue-500',
      'thegraph': 'bg-indigo-600'
    }
    return colors[project.id] || 'bg-gray-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1e1e3f] text-white flex items-center justify-center">
        <div className="text-gray-400">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1e1e3f] text-white flex flex-col">
      <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-light mb-2">Select Projects</h1>
          <p className="text-sm text-gray-400">Choose at least 3 to monitor</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            readOnly
          />
        </div>

        {/* Projects List */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {projects.map((project) => {
            const isSelected = selectedProjects.includes(project.id)
            
            return (
              <div
                key={project.id}
                onClick={() => toggleProject(project.id)}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-500 bg-opacity-10 border border-blue-500'
                    : 'bg-gray-800 bg-opacity-50 border border-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${getProjectColor(project)} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                    {getProjectLogo(project)}
                  </div>
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-gray-400">{project.symbol}</div>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-blue-500' : 'border border-gray-600'
                }`}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={selectedProjects.length < 3 || saving}
          className={`w-full py-4 rounded-lg font-medium mt-6 transition-all ${
            selectedProjects.length >= 3
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          {saving ? 'Saving...' : `Continue (${selectedProjects.length} selected)`}
        </button>
      </div>
    </div>
  )
}