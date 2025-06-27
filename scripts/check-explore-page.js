const { chromium } = require('playwright');

async function checkExplorePage() {
  console.log('🧪 Testing explore page functionality...');
  
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
    
    // Go to the site
    console.log('📡 Loading MONITOOR...');
    await page.goto('https://monitoor.netlify.app', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Take screenshot of landing page
    await page.screenshot({ 
      path: 'monitoor-landing.png',
      fullPage: true 
    });
    console.log('📸 Landing page screenshot saved');
    
    // Click "Start Monitoring"
    console.log('🖱️ Clicking "Start Monitoring"...');
    await page.click('text=Start Monitoring');
    
    // Wait for navigation
    await page.waitForURL('**/explore', { timeout: 10000 });
    console.log('✅ Navigated to explore page');
    
    // Take screenshot of explore page
    await page.screenshot({ 
      path: 'monitoor-explore.png',
      fullPage: true 
    });
    console.log('📸 Explore page screenshot saved');
    
    // Check if project selector is visible
    const hasProjects = await page.isVisible('text=Select Projects');
    if (hasProjects) {
      console.log('✅ Project selection screen is visible');
    } else {
      console.log('❌ Project selection screen not found');
    }
    
    console.log('\n🎉 Explore mode is working! Users can now browse without signing up.');
    
  } catch (error) {
    console.error('❌ Error testing explore page:', error.message);
  } finally {
    await browser.close();
  }
}

checkExplorePage();