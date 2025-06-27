const fetch = require('node-fetch')
require('dotenv').config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function checkTables() {
  console.log('Checking database tables...')
  
  try {
    // Check for our custom tables
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('Projects table exists! Found', data.length, 'projects')
      console.log(data)
    } else {
      console.log('Projects table not found. Status:', response.status)
      console.log('Schema might not be applied yet.')
    }
    
  } catch (error) {
    console.error('Error checking tables:', error.message)
  }
}

checkTables()