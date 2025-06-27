const fetch = require('node-fetch')
require('dotenv').config()

const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID
const CRON_SECRET = process.env.CRON_SECRET

async function testMonitorFunction() {
  console.log('Testing monitor-projects Edge Function...')
  
  const functionUrl = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/monitor-projects`
  
  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'x-cron-key': CRON_SECRET,
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'monitor_next_project'
      })
    })
    
    console.log('Response status:', response.status)
    
    const responseText = await response.text()
    console.log('Response:', responseText)
    
    if (response.ok) {
      console.log('✅ Monitor function is working!')
    } else {
      console.log('❌ Monitor function returned an error')
    }
    
  } catch (error) {
    console.error('❌ Error testing monitor function:', error.message)
  }
}

testMonitorFunction()