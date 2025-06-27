const { chromium } = require('playwright');

async function checkExploreDirect() {
  console.log('🧪 Checking explore page directly...');
  
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
    
    // Go directly to explore page
    console.log('📡 Loading /explore page directly...');
    const response = await page.goto('https://monitoor.netlify.app/explore', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('📊 Response status:', response.status());
    
    if (response.status() === 404) {
      console.log('❌ Explore page returns 404 - deployment might not be complete');
    } else {
      console.log('✅ Explore page loaded successfully');
      
      // Take screenshot
      await page.screenshot({ 
        path: 'monitoor-explore-direct.png',
        fullPage: true 
      });
      console.log('📸 Screenshot saved');
      
      // Check page content
      const pageContent = await page.content();
      if (pageContent.includes('Select Projects')) {
        console.log('✅ Project selection UI is present');
      } else if (pageContent.includes('Page not found')) {
        console.log('❌ Getting 404 page');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

checkExploreDirect();