const { chromium } = require('playwright')

async function testAuthFlow() {
  console.log('🧪 Testing MONITOOR auth flow...')
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const context = await browser.newContext()
  const page = await context.newPage()
  
  try {
    // Test 1: Landing page
    console.log('\n1. Testing landing page...')
    await page.goto('http://localhost:3001')
    await page.waitForLoadState('networkidle')
    
    const title = await page.title()
    console.log('   ✅ Page title:', title)
    
    // Check for key elements
    const heroText = await page.locator('h1').textContent()
    console.log('   ✅ Hero text:', heroText)
    
    // Take screenshot
    await page.screenshot({ path: 'test-landing.png' })
    console.log('   ✅ Screenshot saved: test-landing.png')
    
    // Test 2: Navigate to sign up
    console.log('\n2. Testing sign up page...')
    await page.click('text=Get Started')
    await page.waitForURL('**/auth/signup')
    
    const signupUrl = page.url()
    console.log('   ✅ Navigated to:', signupUrl)
    
    // Check for sign up form
    const emailInput = await page.locator('input[type="email"]').count()
    console.log('   ✅ Email input found:', emailInput > 0)
    
    await page.screenshot({ path: 'test-signup.png' })
    console.log('   ✅ Screenshot saved: test-signup.png')
    
    // Test 3: Navigate to sign in
    console.log('\n3. Testing sign in page...')
    await page.click('text=Sign in')
    await page.waitForURL('**/auth/signin')
    
    const signinUrl = page.url()
    console.log('   ✅ Navigated to:', signinUrl)
    
    await page.screenshot({ path: 'test-signin.png' })
    console.log('   ✅ Screenshot saved: test-signin.png')
    
    console.log('\n✅ All basic tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    await page.screenshot({ path: 'test-error.png' })
  } finally {
    await browser.close()
  }
}

// Run the test
testAuthFlow().catch(console.error)