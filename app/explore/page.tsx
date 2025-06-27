'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../../lib/supabase/client'
import ProjectSelector from '../../components/features/ProjectSelector'
import ImportanceSlider from '../../components/features/ImportanceSlider'
import { ChevronLeft, Bell } from 'lucide-react'

interface Tweet {
  id: string
  project_id: string
  tweet_text: string
  author_username: string
  importance_score: number
  ai_summary: string
  tweet_date: string
  project?: {
    name: string
    symbol: string
  }
}

export default function ExplorePage() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [threshold, setThreshold] = useState(9)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [showProjects, setShowProjects] = useState(true)
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  const supabase = createClient()

  // Load tweets based on selected projects and threshold
  useEffect(() => {
    if (selectedProjects.length > 0 && !showProjects) {
      loadTweets()
    }
  }, [selectedProjects, threshold, showProjects])

  async function loadTweets() {
    const { data, error } = await supabase
      .from('tweet_analyses')
      .select(`
        *,
        project:projects(name, symbol)
      `)
      .in('project_id', selectedProjects)
      .gte('importance_score', threshold)
      .order('tweet_date', { ascending: false })
      .limit(50)

    if (!error && data) {
      setTweets(data)
    }
  }

  const handleProjectSelection = (projects: string[]) => {
    setSelectedProjects(projects)
    if (projects.length >= 3) {
      setShowProjects(false)
    }
  }

  const handleTelegramConnect = () => {
    setShowSignupPrompt(true)
  }

  if (showSignupPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1e1e3f] text-white flex flex-col justify-center p-6">
        <div className="max-w-md mx-auto w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-xl blur-xl"></div>
              <div className="relative w-full h-full border border-blue-400 rounded-xl flex items-center justify-center">
                <Bell className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h2 className="text-2xl font-light">Create an Account</h2>
            <p className="text-gray-400 text-sm">
              Sign up to save your preferences and connect Telegram notifications
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/auth/signup"
              className="block w-full bg-blue-500 text-white py-3 rounded-lg text-center hover:bg-blue-600 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/auth/signin"
              className="block w-full border border-gray-600 text-gray-300 py-3 rounded-lg text-center hover:border-gray-500 transition-colors"
            >
              Already have an account? Sign In
            </Link>
            <button
              onClick={() => setShowSignupPrompt(false)}
              className="block w-full text-gray-500 py-3 text-center hover:text-gray-400 transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showProjects) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1e1e3f] text-white">
        <div className="max-w-md mx-auto p-6">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-gray-300 mb-8">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Link>
          
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-light">Select Projects</h1>
            <p className="text-sm text-gray-400">
              Choose at least 3 projects to monitor (Demo Mode)
            </p>
          </div>

          <ProjectSelector
            selectedProjects={selectedProjects}
            onProjectsChange={handleProjectSelection}
          />

          {selectedProjects.length >= 3 && (
            <button
              onClick={() => setShowProjects(false)}
              className="w-full bg-blue-500 text-white py-3 rounded-lg mt-8 hover:bg-blue-600 transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1e1e3f] text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowProjects(true)}
              className="text-gray-400 hover:text-gray-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-light">Live Feed (Demo)</h1>
            <button
              onClick={handleTelegramConnect}
              className="text-blue-400 hover:text-blue-300"
            >
              <Bell className="w-6 h-6" />
            </button>
          </div>

          {/* Importance Slider */}
          <div className="mb-6">
            <ImportanceSlider initialValue={threshold} onChange={setThreshold} />
          </div>
        </div>

        {/* Tweet Feed */}
        <div className="px-6 pb-6 space-y-4">
          {tweets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No tweets found with importance ≥ {threshold}</p>
              <p className="text-gray-600 text-sm mt-2">Try lowering the threshold</p>
            </div>
          ) : (
            tweets.map((tweet) => (
              <div key={tweet.id} className="bg-white bg-opacity-5 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 text-sm font-medium">
                      {tweet.project?.symbol}
                    </span>
                    <span className="text-gray-500 text-sm">@{tweet.author_username}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Score: {tweet.importance_score}/10
                  </span>
                </div>
                <p className="text-sm text-gray-300">{tweet.tweet_text}</p>
                {tweet.ai_summary && (
                  <p className="text-xs text-gray-500 italic">{tweet.ai_summary}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Demo Mode Banner */}
        <div className="sticky bottom-0 bg-gradient-to-t from-[#0f0f23] to-transparent p-6">
          <button
            onClick={handleTelegramConnect}
            className="w-full bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400 py-3 rounded-lg backdrop-blur hover:bg-opacity-30 transition-all"
          >
            Sign Up to Save & Get Notifications
          </button>
        </div>
      </div>
    </div>
  )
}