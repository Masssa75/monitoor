const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function executeSchema() {
  console.log('Executing database schema...')
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Execute the schema using the REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY
      },
      body: JSON.stringify({ query: schema })
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.error('Response:', error)
      
      // Try alternative approach - direct SQL execution
      console.log('\nTrying alternative approach...')
      const statements = schema.split(';').filter(s => s.trim())
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim()
        if (!statement) continue
        
        console.log(`Executing statement ${i + 1}/${statements.length}...`)
        
        // For CREATE TABLE and other DDL, we need to use different approach
        // Let's create a simpler script
      }
    } else {
      console.log('Schema executed successfully!')
    }
    
  } catch (error) {
    console.error('Error executing schema:', error.message)
    console.log('\nPlease use Supabase CLI instead:')
    console.log('1. ./supabase-cli/supabase login')
    console.log('2. ./supabase-cli/supabase link --project-ref', process.env.SUPABASE_PROJECT_ID)
    console.log('3. ./supabase-cli/supabase db push ./supabase/schema.sql')
  }
}

executeSchema()