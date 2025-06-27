const fetch = require('node-fetch')
require('dotenv').config()

const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN
const SUPABASE_API_URL = 'https://api.supabase.com/v1'
const PROJECT_ID = 'rcqlmqnydnfroifsmyem'

async function getApiKeys() {
  console.log('Getting API keys for project:', PROJECT_ID)
  
  try {
    const response = await fetch(`${SUPABASE_API_URL}/projects/${PROJECT_ID}/api-keys`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get API keys: ${response.status} ${error}`)
    }
    
    const keys = await response.json()
    console.log('Keys response:', JSON.stringify(keys, null, 2))
    
    // Find the keys
    const anonKey = keys.find(k => k.name === 'anon')
    const serviceKey = keys.find(k => k.name === 'service_role')
    
    console.log('\n=== API Keys ===')
    console.log(`NEXT_PUBLIC_SUPABASE_URL=https://${PROJECT_ID}.supabase.co`)
    console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey?.api_key}`)
    console.log(`SUPABASE_SERVICE_ROLE_KEY=${serviceKey?.api_key}`)
    console.log(`SUPABASE_PROJECT_ID=${PROJECT_ID}`)
    
    // Update .env.new
    const envContent = `# MONITOOR Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://${PROJECT_ID}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey?.api_key}
SUPABASE_SERVICE_ROLE_KEY=${serviceKey?.api_key}
SUPABASE_PROJECT_ID=${PROJECT_ID}
`
    
    require('fs').writeFileSync('.env.new', envContent)
    console.log('\nCredentials saved to .env.new')
    
  } catch (error) {
    console.error('Error getting API keys:', error.message)
  }
}

getApiKeys()