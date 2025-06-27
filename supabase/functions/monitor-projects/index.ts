import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-key',
}

// Track last monitored project in memory (will reset on cold starts)
let lastMonitoredIndex = 0

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify cron authentication
    const cronKey = req.headers.get('x-cron-key')
    const authHeader = req.headers.get('authorization')
    
    // Check both possible secret names (for compatibility)
    const cronSecret = Deno.env.get('CRON_SECRET') || Deno.env.get('CRON_SECRET_KEY')
    const isValidCronKey = cronKey === cronSecret
    const isValidAuthHeader = authHeader === `Bearer ${cronSecret}`
    
    if (!isValidCronKey && !isValidAuthHeader) {
      console.log('Auth failed - expected:', cronSecret?.substring(0, 10), 'got cronKey:', cronKey?.substring(0, 10), 'authHeader:', authHeader?.substring(0, 20))
      return new Response('Unauthorized', { status: 401 })
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all active projects
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (fetchError || !projects || projects.length === 0) {
      console.log('No projects to monitor:', fetchError)
      return new Response(JSON.stringify({ message: 'No projects to monitor' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // Get the next project to monitor (round-robin)
    const project = projects[lastMonitoredIndex % projects.length]
    lastMonitoredIndex++

    console.log(`Monitoring project: ${project.name} (@${project.twitter_username})`)

    // Fetch recent tweets using ScraperAPI
    const scraperApiKey = Deno.env.get('SCRAPERAPI_KEY')
    const nitterInstances = [
      'nitter.poast.org',
      'nitter.privacydev.net',
      'nitter.d420.de'
    ]
    
    let tweets = []
    for (const instance of nitterInstances) {
      try {
        const url = `https://${instance}/${project.twitter_username}`
        const scraperUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(url)}`
        
        const response = await fetch(scraperUrl)
        if (response.ok) {
          const html = await response.text()
          // Parse tweets from HTML (simplified for now)
          console.log(`Fetched tweets from ${instance}`)
          
          // Extract tweet data using regex (basic implementation)
          const tweetMatches = html.matchAll(/<div class="tweet-content[^>]*>(.*?)<\/div>/gs)
          for (const match of tweetMatches) {
            tweets.push({
              text: match[1].replace(/<[^>]*>/g, '').trim(),
              url: url,
              project_id: project.id
            })
          }
          
          if (tweets.length > 0) break
        }
      } catch (error) {
        console.log(`Failed to fetch from ${instance}:`, error.message)
      }
    }

    // For now, just log the results
    console.log(`Found ${tweets.length} tweets for ${project.name}`)

    // If we have tweets, we would analyze them here
    if (tweets.length > 0) {
      // Invoke analyze-tweets function for each tweet
      for (const tweet of tweets.slice(0, 5)) { // Limit to 5 tweets per run
        try {
          const analyzeUrl = `${supabaseUrl}/functions/v1/analyze-tweets`
          await fetch(analyzeUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              tweet: tweet,
              project: project
            })
          })
        } catch (error) {
          console.error('Failed to analyze tweet:', error)
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      project: project.name,
      tweetsFound: tweets.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Error in monitor-projects:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})