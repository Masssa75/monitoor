const fetch = require('node-fetch');

async function checkNetlifyDeploys() {
  console.log('🔍 Checking Netlify deployment history...\n');
  
  try {
    // Get site info first
    const siteResponse = await fetch('https://api.netlify.com/api/v1/sites/monitoor.netlify.app');
    
    if (!siteResponse.ok) {
      console.log('❌ Could not fetch site info');
      return;
    }
    
    const siteData = await siteResponse.json();
    console.log('📦 Site Information:');
    console.log(`   Name: ${siteData.name}`);
    console.log(`   ID: ${siteData.id}`);
    console.log(`   URL: ${siteData.url}`);
    console.log(`   Last published: ${siteData.published_deploy?.published_at || 'Never'}`);
    
    // Try to get deploys list
    const deploysUrl = `https://api.netlify.com/api/v1/sites/${siteData.id}/deploys`;
    console.log(`\n📋 Fetching deploys from: ${deploysUrl}`);
    
    const deploysResponse = await fetch(deploysUrl);
    
    if (deploysResponse.ok) {
      const deploys = await deploysResponse.json();
      
      console.log(`\n📊 Recent Deploys (found ${deploys.length}):\n`);
      
      // Show last 5 deploys
      const recentDeploys = deploys.slice(0, 5);
      
      recentDeploys.forEach((deploy, index) => {
        console.log(`Deploy #${index + 1}:`);
        console.log(`   ID: ${deploy.id}`);
        console.log(`   State: ${deploy.state}`);
        console.log(`   Branch: ${deploy.branch}`);
        console.log(`   Commit: ${deploy.commit_ref?.substring(0, 7) || 'N/A'}`);
        console.log(`   Created: ${deploy.created_at}`);
        console.log(`   Deploy time: ${deploy.deploy_time || 'N/A'}s`);
        
        if (deploy.state === 'error' || deploy.state === 'failed') {
          console.log(`   ❌ ERROR: ${deploy.error_message || 'Unknown error'}`);
        }
        
        if (deploy.log_access_attributes) {
          console.log(`   Log URL: ${deploy.log_access_attributes.url}`);
        }
        
        console.log('');
      });
      
      // Check if recent deploys failed
      const failedDeploys = recentDeploys.filter(d => d.state === 'error' || d.state === 'failed');
      if (failedDeploys.length > 0) {
        console.log(`⚠️  Found ${failedDeploys.length} failed deploy(s) in recent history`);
      }
      
    } else {
      console.log('❌ Could not fetch deploys list - may need authentication');
      console.log('Status:', deploysResponse.status, deploysResponse.statusText);
    }
    
    // Try the build status endpoint
    const buildStatusUrl = `https://api.netlify.com/api/v1/sites/${siteData.id}/builds`;
    const buildResponse = await fetch(buildStatusUrl);
    
    if (buildResponse.ok) {
      const builds = await buildResponse.json();
      console.log('\n🏗️  Recent Builds:', builds.length);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Also try to get deploy info from GitHub deployments API
async function checkGitHubDeployments() {
  console.log('\n🐙 Checking GitHub deployment status...\n');
  
  try {
    const response = await fetch('https://api.github.com/repos/Masssa75/monitoor/deployments', {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (response.ok) {
      const deployments = await response.json();
      console.log(`Found ${deployments.length} GitHub deployments`);
      
      if (deployments.length > 0) {
        const recent = deployments.slice(0, 3);
        recent.forEach((deploy, index) => {
          console.log(`\nDeployment #${index + 1}:`);
          console.log(`   Environment: ${deploy.environment}`);
          console.log(`   Created: ${deploy.created_at}`);
          console.log(`   Status URL: ${deploy.statuses_url}`);
        });
      }
    }
  } catch (error) {
    console.log('Could not fetch GitHub deployments');
  }
}

async function main() {
  await checkNetlifyDeploys();
  await checkGitHubDeployments();
}

main();