const { execSync } = require('child_process')

async function deployToNetlify() {
  console.log('🚀 Deploying MONITOOR to Netlify...')
  
  try {
    // Create Netlify site and link to GitHub
    const command = `echo '[{
      "action": "execute",
      "params": {
        "command": "cd /Users/marcschwyn/Desktop/projects/monitoor && npx netlify init --manual && npx netlify env:set NEXT_PUBLIC_SUPABASE_URL ${process.env.NEXT_PUBLIC_SUPABASE_URL} && npx netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY} && npx netlify env:set SUPABASE_SERVICE_ROLE_KEY ${process.env.SUPABASE_SERVICE_ROLE_KEY} && npx netlify deploy --prod",
        "cwd": "/Users/marcschwyn/Desktop/projects/monitoor"
      }
    }]' > ../automation-commands.json`
    
    execSync(command)
    console.log('✅ Deployment command sent to automation server')
    
    // Wait for results
    console.log('⏳ Waiting for deployment to complete...')
    await new Promise(resolve => setTimeout(resolve, 30000))
    
    console.log('\n🎉 MONITOOR has been deployed!')
    console.log('Check the deployment at: https://monitoor.netlify.app')
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message)
  }
}

deployToNetlify()