const { chromium } = require('playwright');

async function checkGitHubStatus() {
  console.log('🧪 Checking GitHub repository and recent commits...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Go to the GitHub repository
    console.log('📡 Loading GitHub repository...');
    await page.goto('https://github.com/Masssa75/monitoor', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Take screenshot of repo
    await page.screenshot({ 
      path: 'github-repo-status.png',
      fullPage: false 
    });
    
    // Check for recent commits
    const recentCommit = await page.evaluate(() => {
      const commitMessage = document.querySelector('[data-testid="latest-commit-details"] a')?.textContent;
      const commitTime = document.querySelector('relative-time')?.getAttribute('datetime');
      return { message: commitMessage?.trim(), time: commitTime };
    });
    
    if (recentCommit.message) {
      console.log('📝 Latest commit:', recentCommit.message);
      console.log('🕒 Commit time:', recentCommit.time);
    }
    
    // Check if there are any status indicators (CI/CD)
    const hasStatusIndicator = await page.evaluate(() => {
      return !!document.querySelector('.branch-status-icon');
    });
    
    if (hasStatusIndicator) {
      console.log('✅ Found CI/CD status indicator');
    }
    
    console.log('\n✅ GitHub repository is accessible');
    console.log('🔗 URL: https://github.com/Masssa75/monitoor');
    
  } catch (error) {
    console.error('❌ Error checking GitHub:', error.message);
  } finally {
    await browser.close();
  }
}

checkGitHubStatus();