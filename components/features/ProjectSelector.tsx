'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase/client'

interface Project {
  id: string
  name: string
  symbol: string
  twitter_username: string
  description: string
}

interface ProjectSelectorProps {
  selectedProjects: string[]
  onProjectsChange: (projects: string[]) => void
}

export default function ProjectSelector({ selectedProjects, onProjectsChange }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (!error && data) {
      setProjects(data)
    }
    setLoading(false)
  }

  const toggleProject = (projectId: string) => {
    if (selectedProjects.includes(projectId)) {
      onProjectsChange(selectedProjects.filter(id => id !== projectId))
    } else {
      onProjectsChange([...selectedProjects, projectId])
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-800 bg-opacity-50 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => {
        const isSelected = selectedProjects.includes(project.id)
        
        return (
          <button
            key={project.id}
            onClick={() => toggleProject(project.id)}
            className={`w-full p-4 rounded-lg border transition-all text-left ${
              isSelected
                ? 'bg-blue-500 bg-opacity-20 border-blue-500'
                : 'bg-gray-800 bg-opacity-50 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{project.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">{project.symbol}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-blue-500' : 'border-gray-600'
                }`}>
                  {isSelected && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          </button>
        )
      })}
      
      {selectedProjects.length < 3 && (
        <p className="text-sm text-gray-500 text-center mt-4">
          Select at least {3 - selectedProjects.length} more project{3 - selectedProjects.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}