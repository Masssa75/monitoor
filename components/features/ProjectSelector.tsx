'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'

interface Project {
  id: string
  name: string
  symbol: string
  twitter_username: string
  logo_url: string | null
  description: string | null
  is_active: boolean
}

interface ProjectSelectorProps {
  projects: Project[]
  selectedProjects: string[]
  onSelectionChange: (projectIds: string[]) => void
}

export function ProjectSelector({ projects, selectedProjects, onSelectionChange }: ProjectSelectorProps) {
  const [saving, setSaving] = useState(false)
  
  const toggleProject = async (projectId: string) => {
    const newSelection = selectedProjects.includes(projectId)
      ? selectedProjects.filter(id => id !== projectId)
      : [...selectedProjects, projectId]
    
    onSelectionChange(newSelection)
    
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
            selected_projects: newSelection,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })
      }
    } catch (error) {
      console.error('Failed to save selection:', error)
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Select Projects to Monitor</h2>
        {saving && <span className="text-sm text-slate-400">Saving...</span>}
        <span className="text-sm text-slate-400">
          {selectedProjects.length} of {projects.length} selected
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const isSelected = selectedProjects.includes(project.id)
          
          return (
            <div
              key={project.id}
              onClick={() => toggleProject(project.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-900/30 border-blue-500'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-slate-400">{project.symbol}</p>
                  <p className="text-xs text-slate-500 mt-1">@{project.twitter_username}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-600'
                }`}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              {project.description && (
                <p className="text-xs text-slate-500 mt-2">{project.description}</p>
              )}
            </div>
          )
        })}
      </div>
      
      {selectedProjects.length < 3 && (
        <p className="mt-4 text-sm text-amber-400">
          Please select at least 3 projects to monitor
        </p>
      )}
    </div>
  )
}