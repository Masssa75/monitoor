const { execSync } = require('child_process')
const fetch = require('node-fetch')
require('dotenv').config()

async function createGitHubRepo() {
  console.log('🚀 Creating GitHub repository for MONITOOR...')
  
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'your-github-token'
  const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'your-username'
  
  try {
    // Create repository via GitHub API
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'monitoor',
        description: 'Twitter monitoring service for crypto projects',
        private: false,
        has_issues: true,
        has_projects: false,
        has_wiki: false,
        auto_init: false
      })
    })
    
    if (response.ok) {
      const repo = await response.json()
      console.log('✅ Repository created:', repo.html_url)
      
      // Initialize git and push
      console.log('\n📦 Initializing git and pushing to GitHub...')
      execSync('git init', { stdio: 'inherit' })
      execSync('git add .', { stdio: 'inherit' })
      execSync('git commit -m "Initial MONITOOR implementation with beautiful UI"', { stdio: 'inherit' })
      execSync('git branch -M main', { stdio: 'inherit' })
      execSync(`git remote add origin https://github.com/${GITHUB_USERNAME}/monitoor.git`, { stdio: 'inherit' })
      execSync('git push -u origin main', { stdio: 'inherit' })
      
      console.log('✅ Code pushed to GitHub!')
      
      return repo.html_url
    } else {
      const error = await response.json()
      if (error.errors?.[0]?.message === 'name already exists on this account') {
        console.log('Repository already exists, using existing repo...')
        return `https://github.com/${GITHUB_USERNAME}/monitoor`
      }
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Error creating GitHub repo:', error.message)
    throw error
  }
}

async function deployToNetlify() {
  console.log('\n🌐 Deploying to Netlify...')
  
  const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN || 'your-netlify-token'
  
  try {
    // Create Netlify site
    const createResponse = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NETLIFY_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'monitoor',
        custom_domain: null,
        repo: {
          provider: 'github',
          repo: 'marcschwyn/monitoor',
          private: false,
          branch: 'main'
        }
      })
    })
    
    if (createResponse.ok) {
      const site = await createResponse.json()
      console.log('✅ Netlify site created:', site.url)
      console.log('✅ Admin URL:', site.admin_url)
      
      // Set environment variables
      console.log('\n🔐 Setting environment variables...')
      const envVars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        NODE_VERSION: '18'
      }
      
      for (const [key, value] of Object.entries(envVars)) {
        await fetch(`https://api.netlify.com/api/v1/sites/${site.id}/env/${key}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${NETLIFY_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ value })
        })
      }
      
      console.log('✅ Environment variables configured!')
      return site.url
    } else {
      const error = await createResponse.text()
      throw new Error(error)
    }
  } catch (error) {
    console.error('Error deploying to Netlify:', error.message)
    throw error
  }
}

async function main() {
  try {
    const githubUrl = await createGitHubRepo()
    const netlifyUrl = await deployToNetlify()
    
    console.log('\n🎉 MONITOOR Successfully Deployed!')
    console.log('=====================================')
    console.log('GitHub:', githubUrl)
    console.log('Netlify:', netlifyUrl)
    console.log('=====================================')
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message)
  }
}

main()