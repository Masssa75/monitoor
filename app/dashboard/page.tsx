import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/signin')
  }

  // Get user's settings
  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // If no settings, redirect to onboarding
  if (!settings || !settings.selected_projects || settings.selected_projects.length === 0) {
    redirect('/onboarding/projects')
  }

  // Get all projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('is_active', true)
    .order('name')

  // Get recent tweets
  const { data: recentTweets } = await supabase
    .from('tweet_analyses')
    .select('*, projects!inner(name, symbol)')
    .in('project_id', settings.selected_projects)
    .gte('importance_score', settings.importance_threshold)
    .order('tweet_date', { ascending: false })
    .limit(50)

  return (
    <DashboardClient
      user={user}
      settings={settings}
      projects={projects || []}
      recentTweets={recentTweets || []}
    />
  )
}