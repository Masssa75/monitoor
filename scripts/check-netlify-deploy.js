const { chromium } = require('playwright');

async function checkNetlifyDeploy() {
  console.log('🧪 Checking Netlify deployment status...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Monitor console for errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console error:', msg.text());
      }
    });
    
    // Monitor network failures
    page.on('requestfailed', request => {
      console.log('❌ Request failed:', request.url());
    });
    
    // Try common Netlify URLs
    const possibleUrls = [
      'https://monitoor-crypto.netlify.app',
      'https://monitoor-app.netlify.app',
      'https://monitoor.netlify.app',
      'https://heroic-pegasus-3e5fb0.netlify.app' // Default Netlify subdomain pattern
    ];
    
    let deployedUrl = null;
    
    for (const url of possibleUrls) {
      console.log(`\n📡 Trying ${url}...`);
      
      try {
        const response = await page.goto(url, { 
          waitUntil: 'domcontentloaded',
          timeout: 10000 
        });
        
        if (response && response.ok()) {
          console.log(`✅ Found deployment at ${url}`);
          deployedUrl = url;
          
          // Take screenshot
          await page.screenshot({ 
            path: 'netlify-deploy-check.png',
            fullPage: true 
          });
          
          // Check for MONITOOR specific content
          const title = await page.title();
          console.log('📄 Page title:', title);
          
          const hasMonitoorContent = await page.evaluate(() => {
            const bodyText = document.body.innerText;
            return bodyText.includes('MONITOOR') || bodyText.includes('Monitor important crypto');
          });
          
          if (hasMonitoorContent) {
            console.log('✅ MONITOOR content found!');
          } else {
            console.log('⚠️  Page loaded but MONITOOR content not found');
          }
          
          break;
        }
      } catch (error) {
        console.log(`❌ Failed to load ${url}:`, error.message);
      }
    }
    
    if (!deployedUrl) {
      console.log('\n❌ Could not find deployed site. The build might still be in progress.');
      console.log('💡 Check https://app.netlify.com for the exact URL');
    } else {
      console.log(`\n🎉 Site is live at: ${deployedUrl}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking deployment:', error);
  } finally {
    await browser.close();
  }
}

checkNetlifyDeploy();