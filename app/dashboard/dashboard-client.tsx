'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DashboardClientProps {
  user: any
  settings: any
  projects: any[]
  recentTweets: any[]
}

export function DashboardClient({ user, settings, projects, recentTweets }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'projects' | 'profile'>('feed')
  const router = useRouter()
  
  const selectedProjectsData = projects.filter(p => 
    settings.selected_projects.includes(p.id)
  )

  const formatTime = (date: string) => {
    const now = new Date()
    const tweetDate = new Date(date)
    const diffInHours = (now.getTime() - tweetDate.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return tweetDate.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1e1e3f] text-white flex flex-col">
      {/* Header */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-light tracking-wider">MONITOOR</h1>
            {activeTab === 'feed' && recentTweets.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Live</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {activeTab === 'feed' && (
            <div className="p-6">
              {recentTweets.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 mb-2">No alerts yet</p>
                  <p className="text-sm text-gray-500">Important tweets will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTweets.map((tweet) => (
                    <div key={tweet.id} className="bg-gray-800 bg-opacity-30 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-blue-400">{tweet.projects?.name}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{formatTime(tweet.tweet_date)}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-400">@{tweet.author_username}</span>
                            <span className="text-xs bg-blue-500 bg-opacity-20 text-blue-400 px-2 py-0.5 rounded">
                              Score: {tweet.importance_score}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed mb-3">{tweet.tweet_text}</p>
                      {tweet.ai_summary && (
                        <p className="text-xs text-blue-400 italic bg-blue-500 bg-opacity-10 rounded p-2 mb-3">
                          {tweet.ai_summary}
                        </p>
                      )}
                      <a 
                        href={tweet.tweet_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
                      >
                        View on Twitter →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="p-6">
              <h2 className="text-lg font-light mb-6">Your Projects</h2>
              <div className="space-y-3">
                {selectedProjectsData.map((project) => (
                  <div key={project.id} className="bg-gray-800 bg-opacity-30 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {project.symbol.substring(0, 3)}
                        </div>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-xs text-gray-400">12 alerts today</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => router.push('/onboarding/projects')}
                className="w-full mt-6 py-3 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
              >
                Manage Projects
              </button>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-lg font-light mb-6">Profile</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-800 bg-opacity-30 rounded-xl p-4 border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Email</div>
                  <div className="text-white">{user.email}</div>
                </div>

                <div className="bg-gray-800 bg-opacity-30 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Alert Threshold</div>
                      <div className="text-white">Score ≥ {settings.importance_threshold}</div>
                    </div>
                    <button 
                      onClick={() => router.push('/onboarding/threshold')}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800 bg-opacity-30 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Telegram</div>
                      <div className="text-white">
                        {settings.telegram_username ? `@${settings.telegram_username}` : 'Not connected'}
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push('/onboarding/telegram')}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      {settings.telegram_username ? 'Change' : 'Connect'}
                    </button>
                  </div>
                </div>

                <form action="/api/auth/signout" method="post">
                  <button className="w-full py-3 border border-red-500 text-red-400 rounded-lg text-sm hover:bg-red-500 hover:bg-opacity-10 transition-colors">
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex flex-col items-center p-3 ${
                activeTab === 'feed' ? 'text-blue-400' : 'text-gray-500'
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-xs">Feed</span>
            </button>
            
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex flex-col items-center p-3 ${
                activeTab === 'projects' ? 'text-blue-400' : 'text-gray-500'
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="text-xs">Projects</span>
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center p-3 ${
                activeTab === 'profile' ? 'text-blue-400' : 'text-gray-500'
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}