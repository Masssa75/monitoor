const fetch = require('node-fetch')
require('dotenv').config()

const CRONJOB_API_KEY = process.env.CRONJOB_API_KEY
const CRON_SECRET = process.env.CRON_SECRET
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID

async function setupCronJob() {
  console.log('Setting up MONITOOR cron job...')
  
  try {
    // Edge Function URL for monitor-projects
    const webhookUrl = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/monitor-projects`
    
    const response = await fetch('https://api.cron-job.org/jobs', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${CRONJOB_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        job: {
          url: webhookUrl,
          enabled: true,
          saveResponses: true,
          schedule: {
            timezone: 'UTC',
            hours: [-1],
            mdays: [-1],
            minutes: [-1],  // Every minute
            months: [-1],
            wdays: [-1]
          },
          requestTimeout: 30,
          auth: {
            enable: true,
            user: '',
            password: ''
          },
          notification: {
            onFailure: false,
            onSuccess: false,
            onDisable: false
          },
          extendedData: {
            headers: {
              'x-cron-key': CRON_SECRET,
              'Content-Type': 'application/json'
            },
            body: '{"action": "monitor_next_project"}'
          },
          requestMethod: 'POST'
        }
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Cron job created successfully!')
      console.log('Job ID:', data.jobId)
      console.log('Next execution:', data.schedule?.next)
      console.log('Webhook URL:', webhookUrl)
    } else {
      const error = await response.text()
      console.error('❌ Failed to create cron job:', response.status, error)
    }

  } catch (error) {
    console.error('❌ Error setting up cron job:', error.message)
  }
}

setupCronJob()