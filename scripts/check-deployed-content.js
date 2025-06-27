const { chromium } = require('playwright');

async function checkDeployedContent() {
  console.log('🧪 Checking what\'s actually deployed...\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Check main page
    console.log('📡 Checking main page...');
    await page.goto('https://monitoor.netlify.app');
    
    // Look for the Start Monitoring link
    const startLink = await page.locator('a:has-text("Start Monitoring")').first();
    if (startLink) {
      const href = await startLink.getAttribute('href');
      console.log(`✅ Found "Start Monitoring" link pointing to: ${href}`);
      
      if (href === '/explore') {
        console.log('✅ Link correctly points to /explore');
      } else if (href === '/auth/signup') {
        console.log('❌ Link still points to old /auth/signup route');
        console.log('   This means the latest code hasn\'t deployed');
      }
    }
    
    // Check page source for clues
    const pageContent = await page.content();
    
    // Check if it's using old or new code
    if (pageContent.includes('href="/explore"')) {
      console.log('✅ Page source contains new /explore route');
    } else {
      console.log('❌ Page source doesn\'t contain /explore route');
    }
    
    // Try different potential URLs
    console.log('\n📡 Testing various routes...');
    const routes = ['/explore', '/auth/signup', '/auth/signin', '/dashboard', '/api/health'];
    
    for (const route of routes) {
      const response = await page.goto(`https://monitoor.netlify.app${route}`, {
        waitUntil: 'domcontentloaded'
      });
      console.log(`${route}: ${response.status()}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

checkDeployedContent();