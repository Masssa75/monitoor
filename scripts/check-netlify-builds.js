const fetch = require('node-fetch');

async function checkNetlifyBuilds() {
  console.log('🔍 Checking Netlify build status...\n');
  
  // Try to get site info without auth first
  try {
    // Check public deploy badge API
    const badgeUrl = 'https://api.netlify.com/api/v1/badges/monitoor/deploy-status';
    const siteUrls = [
      'https://api.netlify.com/api/v1/sites/monitoor.netlify.app',
      'https://api.netlify.com/api/v1/sites/monitoor-app.netlify.app',
      'https://api.netlify.com/api/v1/sites/monitoor-crypto.netlify.app'
    ];
    
    // Try different site URLs
    for (const url of siteUrls) {
      try {
        console.log(`📡 Trying ${url}...`);
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Found site information:');
          console.log(`   Site ID: ${data.id}`);
          console.log(`   Name: ${data.name}`);
          console.log(`   URL: ${data.url}`);
          console.log(`   Deploy URL: ${data.deploy_url}`);
          console.log(`   Updated: ${data.updated_at}`);
          
          // Try to get deploy info
          if (data.deploy_id) {
            const deployUrl = `https://api.netlify.com/api/v1/deploys/${data.deploy_id}`;
            const deployResponse = await fetch(deployUrl);
            
            if (deployResponse.ok) {
              const deployData = await deployResponse.json();
              console.log('\n📦 Latest Deploy:');
              console.log(`   State: ${deployData.state}`);
              console.log(`   Error: ${deployData.error_message || 'None'}`);
              console.log(`   Created: ${deployData.created_at}`);
              console.log(`   Deploy time: ${deployData.deploy_time}s`);
            }
          }
          
          return;
        }
      } catch (error) {
        // Continue to next URL
      }
    }
    
    console.log('\n❌ Could not fetch Netlify build info via API');
    console.log('💡 To check build status:');
    console.log('   1. Go to https://app.netlify.com');
    console.log('   2. Find your MONITOOR site');
    console.log('   3. Click on "Deploys" tab');
    console.log('   4. Check the latest deploy status');
    
  } catch (error) {
    console.error('❌ Error checking Netlify builds:', error.message);
  }
}

// Also check if the site is accessible
async function checkSiteStatus() {
  console.log('\n🌐 Checking site accessibility...\n');
  
  const urls = [
    'https://monitoor.netlify.app',
    'https://monitoor.netlify.app/explore'
  ];
  
  for (const url of urls) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      console.log(`${url}: ${response.status} ${response.statusText}`);
      
      if (response.status === 404) {
        console.log('   ❌ Page not found');
      } else if (response.status === 200) {
        console.log('   ✅ Page is accessible');
      } else if (response.status >= 300 && response.status < 400) {
        console.log(`   ↩️  Redirects to: ${response.headers.get('location')}`);
      }
    } catch (error) {
      console.log(`${url}: ❌ ${error.message}`);
    }
  }
}

async function main() {
  await checkNetlifyBuilds();
  await checkSiteStatus();
}

main();