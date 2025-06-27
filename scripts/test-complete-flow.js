const { chromium } = require('playwright')

async function testCompleteFlow() {
  console.log('🧪 Testing MONITOOR complete user flow...')
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const context = await browser.newContext()
  const page = await context.newPage()
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Browser console error:', msg.text())
    }
  })
  
  try {
    // Test 1: Landing page
    console.log('\n1. Testing landing page...')
    await page.goto('http://localhost:3001')
    await page.waitForLoadState('networkidle')
    
    const title = await page.title()
    console.log('   ✅ Page title:', title)
    
    await page.screenshot({ path: 'test-1-landing.png' })
    
    // Test 2: Sign up flow
    console.log('\n2. Testing sign up page...')
    await page.click('text=Get Started')
    await page.waitForURL('**/auth/signup')
    
    // Fill out sign up form
    const testEmail = `test${Date.now()}@example.com`
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', 'testpassword123')
    
    await page.screenshot({ path: 'test-2-signup-filled.png' })
    
    // Note: We won't actually submit to avoid creating test accounts
    console.log('   ✅ Sign up form rendered correctly')
    
    // Test 3: Sign in page
    console.log('\n3. Testing sign in page...')
    await page.click('text=Sign in')
    await page.waitForURL('**/auth/signin')
    
    await page.screenshot({ path: 'test-3-signin.png' })
    console.log('   ✅ Sign in page loaded')
    
    // Test 4: Protected route redirect
    console.log('\n4. Testing protected route redirect...')
    await page.goto('http://localhost:3001/dashboard')
    await page.waitForURL('**/auth/signin')
    console.log('   ✅ Correctly redirected to sign in')
    
    // Test 5: Check homepage components
    console.log('\n5. Testing homepage features...')
    await page.goto('http://localhost:3001')
    
    const features = await page.locator('.bg-slate-800\\/50').count()
    console.log('   ✅ Feature cards found:', features)
    
    await page.screenshot({ path: 'test-5-features.png' })
    
    console.log('\n✅ All tests passed!')
    console.log('\nScreenshots saved:')
    console.log('  - test-1-landing.png')
    console.log('  - test-2-signup-filled.png')
    console.log('  - test-3-signin.png')
    console.log('  - test-5-features.png')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    await page.screenshot({ path: 'test-error.png' })
  } finally {
    await browser.close()
  }
}

// Run the test
testCompleteFlow().catch(console.error)