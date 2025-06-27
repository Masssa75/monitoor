# MONITOOR - Twitter Monitoring Service - CLAUDE.md

## 🚨 CRITICAL: WORKING PROCESS GUIDE
**EVERY NEW INSTANCE MUST READ THIS FIRST**: See `/WORKING-PROCESS-GUIDE.md` for the proven systematic debugging approach. This process has been highly effective and should be followed exactly.

## 🚀 CURRENT STATUS (June 26, 2025 - Ready for Development)

### 🎯 PROJECT VISION
**MONITOOR**: A standalone Twitter monitoring service for crypto projects

**Core User Flow**:
1. Sign up → Dashboard with 10 crypto projects
2. Toggle on/off projects to monitor  
3. Set importance threshold slider (1-10, default 9)
4. Connect personal Telegram account to bot
5. View live feed of important tweets filtered by threshold
6. Get Telegram notifications for tweets above threshold

### 📋 MVP SCOPE DEFINITION

**What We're Building (MVP)**:
- ✅ **10 handpicked crypto projects** for initial launch
- ✅ **Single Telegram bot** - users connect individually
- ✅ **Real-time tweet feed** with importance filtering
- ✅ **Interactive threshold slider** - updates feed dynamically
- ✅ **Personal notifications** via Telegram DM
- ✅ **Clean, focused dashboard** for project management

**What We're NOT Building (Yet)**:
- ❌ Monetization features or payments
- ❌ User project suggestions/requests (search UI ready for future)
- ❌ Trending project discovery
- ❌ Multiple bots or group management
- ❌ Historical analytics or charts

### 🎨 DESIGN FINALIZED
**Selected Design**: Midnight blue theme with dot progression (Option 4 from mockups)
**Visual Language**: Dark gradient backgrounds, blue accents, ultra-minimal typography
**Core UX**: Importance slider that dynamically filters feed in real-time
**Wireframes**: Complete app flow designed in `/mockups/app-wireframes-complete.html`

## 🚀 CURRENT STATUS

### ✅ COMPLETED
1. **Project Setup** ✅
   - Created MONITOOR folder structure
   - Comprehensive CLAUDE.md with autonomous setup
   - WORKING-PROCESS-GUIDE.md copied from Sunbeam
   
2. **Design Phase** ✅
   - Created 12 mobile landing page options
   - Selected midnight blue minimal design
   - Created complete app wireframes (8 screens)
   - Added search bar to project selection screen

3. **Planning** ✅
   - Created `AUTONOMOUS-SETUP-PLAN.md` with detailed steps
   - 7 phases covering entire implementation
   - Estimated 6-7 hours for complete setup

### 🚨 READY TO BUILD - START HERE!

**To begin development:**

1. **First, set up API keys:**
```bash
cd /Users/marcschwyn/Desktop/projects/monitoor
cp .env.example .env
# Then copy API keys from Sunbeam's .env file:
# - SCRAPERAPI_KEY
# - GEMINI_API_KEY 
# - CRONJOB_API_KEY
```

2. **Create new Telegram bot:**
   - Message @BotFather on Telegram
   - Create bot: @monitoor_alerts_bot
   - Copy token to .env

3. **Follow the autonomous setup plan:**
```bash
cat AUTONOMOUS-SETUP-PLAN.md
```

Then follow the plan step-by-step. Everything is documented for fully autonomous execution.

## Critical Development Rules
1. **Never create fallback systems without explicit request** - No automatic fallbacks, mockups, or demo content unless specifically requested
2. **Always create backup before major changes** - Complete backup required before database integration, authentication changes, API refactoring, etc.
3. **Do only what's asked; nothing more, nothing less**
4. **Never create files unless absolutely necessary** - Always prefer editing existing files
5. **Never proactively create documentation files unless requested**
6. **API keys go in .env file, never in CLAUDE.md**

## Working Preferences - FULLY AUTONOMOUS MODE

### 🚨 CORE AUTONOMOUS PRINCIPLES (ALWAYS FOLLOW)

#### ✅ Always Do Without Asking:
- Deploy to production (for prototyping/MVP phase)
- Fix bugs and errors  
- Update Edge Functions
- Run tests and diagnostics
- Create automation scripts
- Update documentation
- Try up to 10 different approaches to solve problems
- Deploy via automation server when available
- Test immediately with API calls
- Wait appropriate times (cron: 1-2min, API: immediate)
- Check logs and fix errors autonomously
- Repeat until working (up to 10 attempts)
- Copy working implementations from Sunbeam project
- Create Supabase projects via Management API
- Execute database schemas programmatically
- Set up authentication systems
- Configure environment variables
- Install npm packages as needed
- Create and manage API integrations
- Debug deployment failures
- Wait 90-120 seconds after git push to verify deployment
- Use check-deploy.js to monitor deployment status

#### ❌ Always Ask Before:
- Deleting data
- Major refactors
- Rolling back changes
- Billing/paid services setup
- Long-term architectural decisions

#### 📋 Always Provide:
- **Running commentary** while working
- **Intermediate failures** and what was tried
- **Final results** with clear success/failure status
- **Documentation updates** in CLAUDE.md

### 🔧 Key Automation Commands:
```bash
# Execute via automation server
echo '[{"action": "execute", "params": {"command": "node script.js", "cwd": "/Users/marcschwyn/Desktop/projects/monitoor"}}]' > automation-commands.json

# Deploy Edge Functions (after supabase login)
./supabase-cli/supabase functions deploy FUNCTION_NAME --project-ref [PROJECT_ID] --no-verify-jwt
```

## 🛠️ Available Tools & Capabilities

### 📁 File System Tools:
- **Read** - Read any file content (including images/screenshots)
- **Write** - Create new files
- **Edit/MultiEdit** - Modify existing files
- **Glob** - Search for files by pattern
- **Grep** - Search file contents with regex
- **LS** - List directory contents

### 🔧 Execution Tools:
- **Bash** - Run shell commands directly
- **Task** - Launch autonomous agents for complex searches
- **TodoRead/TodoWrite** - Track and manage tasks

### 🌐 Web Tools:
- **WebFetch** - Fetch and analyze web content
- **WebSearch** - Search the web for information

### 🤖 Automation Server:
- **Location**: Watches `automation-commands.json`
- **Usage**: `echo '[{"action": "execute", "params": {"command": "cmd", "cwd": "/path"}}]' > automation-commands.json`
- **Results**: Check `latest-result.json` after 2-5 seconds
- **Purpose**: Execute commands that need special permissions

### 📊 APIs Available (configure in .env):
- **Supabase** - Database, Edge Functions, Auth
- **ScraperAPI** - Twitter/Nitter scraping (WORKING IMPLEMENTATION IN SUNBEAM)
- **Gemini AI** - Content analysis & importance scoring
- **Telegram Bot API** - Personal notifications to users
- **CoinGecko API** - Crypto project info and logos
- **Cron-job.org** - Scheduled monitoring

## Technical Stack
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Supabase Edge Functions (Deno)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel/Netlify (frontend), Supabase (backend)
- **APIs**: See above list

## Project Structure
```
monitoor/
├── automation-server.js      # File-based command automation
├── automation-commands.json  # Commands to execute
├── latest-result.json       # Execution results
├── .env                     # API keys (create from .env.example)
├── .env.example            # API key template
├── CLAUDE.md               # This file
├── WORKING-PROCESS-GUIDE.md # Systematic debugging approach
├── package.json            # Node dependencies
├── next.config.js          # Next.js config
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
├── mockups/               # HTML mockups for UX design
│   ├── dashboard-v1.html   # Main dashboard mockup
│   ├── signup-flow.html    # User registration flow
│   └── feed-view.html      # Tweet feed interface
├── src/
│   ├── app/               # Next.js 14 app directory
│   │   ├── dashboard/     # Main user dashboard
│   │   ├── auth/          # Authentication pages
│   │   └── api/           # API routes
│   ├── components/        # React components
│   │   ├── ProjectToggle.tsx    # Project on/off toggle
│   │   ├── ImportanceSlider.tsx # Threshold slider
│   │   ├── TweetFeed.tsx       # Real-time tweet feed
│   │   └── TelegramConnect.tsx # Telegram connection
│   └── lib/              # Utility functions
│       ├── supabase/     # Database client
│       ├── telegram.ts   # Telegram bot integration
│       └── twitter.ts    # Twitter monitoring logic
├── supabase/
│   ├── schema.sql        # Database schema
│   └── functions/        # Edge Functions (COPY FROM SUNBEAM)
│       ├── monitor-projects/  # Twitter monitoring
│       ├── analyze-tweets/    # AI importance scoring
│       ├── send-notification/ # Telegram notifications
│       └── telegram-webhook/  # Bot command handling
├── public/               # Static assets
└── scripts/             # Deployment & test scripts
    ├── deploy-functions.js
    ├── setup-cron.js
    └── test-*.js        # Browser automation tests
```

## Key Features to Build

### 1. User Dashboard
- Simple project grid (10 crypto projects)
- Toggle switches for each project
- Master importance threshold slider (1-10, default 9)
- Live tweet feed that updates as slider moves
- Telegram connection status indicator

### 2. Twitter Monitoring (COPY FROM SUNBEAM)
- Monitor 10 selected crypto projects
- Use proven Nitter/ScraperAPI implementation
- AI importance scoring with Gemini (1-10 scale)
- Round-robin monitoring (1 project per minute)
- Store tweets with timestamps and scores

### 3. Telegram Integration
- Single bot for all users (@monitoor_alerts_bot)
- Personal DM notifications (not groups)
- User connects via unique token system
- Notifications for tweets above user's threshold
- Bot commands: /start, /status, /settings, /disconnect

### 4. Real-time Feed
- Show tweets from user's selected projects
- Filter by importance threshold in real-time
- Infinite scroll with pagination
- Project icons and clean tweet formatting
- "Live" indicator when new tweets arrive

### 5. Authentication System
- Simple email/password signup
- Email verification
- Secure session management
- User profile with settings

## Database Schema (Initial)
```sql
-- Core user accounts
CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences and project selections
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_projects JSONB DEFAULT '[]'::jsonb,    -- Array of project IDs
  importance_threshold INTEGER DEFAULT 9,          -- 1-10 scale
  telegram_chat_id BIGINT,                        -- Connected Telegram
  telegram_username VARCHAR,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitored crypto projects (10 initial projects)
CREATE TABLE projects (
  id VARCHAR PRIMARY KEY,                          -- e.g., 'bitcoin', 'ethereum'
  name VARCHAR NOT NULL,                          -- 'Bitcoin', 'Ethereum'
  symbol VARCHAR NOT NULL,                        -- 'BTC', 'ETH'
  twitter_username VARCHAR NOT NULL,              -- 'bitcoin', 'ethereum'
  logo_url TEXT,                                  -- CoinGecko logo
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tweet monitoring and analysis (COPY FROM SUNBEAM)
CREATE TABLE tweet_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR REFERENCES projects(id),
  tweet_id VARCHAR UNIQUE NOT NULL,
  tweet_url TEXT NOT NULL,
  tweet_text TEXT NOT NULL,
  author_username VARCHAR NOT NULL,
  importance_score INTEGER NOT NULL,              -- 1-10 from AI
  ai_summary TEXT,                               -- Brief summary
  tweet_date TIMESTAMP WITH TIME ZONE NOT NULL,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for fast queries
  INDEX idx_project_importance (project_id, importance_score DESC),
  INDEX idx_tweet_date (tweet_date DESC)
);

-- Notification tracking
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tweet_id UUID REFERENCES tweet_analyses(id),
  notification_type VARCHAR DEFAULT 'telegram',   -- 'telegram', 'web'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Prevent duplicate notifications
  UNIQUE(user_id, tweet_id, notification_type)
);
```

## Initial 10 Crypto Projects (MVP)
1. **Bitcoin** (@bitcoin) - The original cryptocurrency
2. **Ethereum** (@ethereum) - Smart contract platform
3. **Solana** (@solana) - High-speed blockchain
4. **Kaspa** (@KaspaCurrency) - BlockDAG technology
5. **Chainlink** (@chainlink) - Decentralized oracles
6. **Polygon** (@0xPolygon) - Ethereum scaling
7. **Avalanche** (@avalancheavax) - Multi-chain platform
8. **Sui** (@SuiNetwork) - Move-based blockchain
9. **Arbitrum** (@arbitrum) - Layer 2 scaling
10. **The Graph** (@graphprotocol) - Blockchain indexing

## Implementation Priority

### Phase 1: HTML Mockups & UX Design (TODAY)
1. Dashboard mockup with 10 project toggles
2. Importance slider with live feed filtering
3. Telegram connection flow
4. Signup/login pages
5. Mobile responsive design

### Phase 2: Core Platform (TOMORROW)
1. Set up Next.js project with TypeScript
2. Create Supabase project and deploy schema
3. Copy Twitter monitoring from Sunbeam
4. Implement authentication system
5. Build project toggle dashboard

### Phase 3: Twitter Integration
1. Deploy Edge Functions for monitoring
2. Set up cron jobs for project monitoring
3. Test AI importance scoring
4. Verify tweet collection working

### Phase 4: Telegram Bot
1. Create @monitoor_alerts_bot
2. Implement connection token system
3. Set up notification sending
4. Test end-to-end notification flow

### Phase 5: Real-time Feed
1. Build tweet feed component
2. Implement real-time filtering
3. Add infinite scroll
4. Polish UI/UX

## Working From Sunbeam Project

### 🚨 CRITICAL RULE: ALWAYS COPY FROM SUNBEAM!
**When implementing ANY feature or fixing ANY bug, FIRST check if it exists in Sunbeam and copy the EXACT implementation.**

**ALWAYS CHECK SUNBEAM FIRST** for working implementations:
- `/Users/marcschwyn/Desktop/projects/sunbeam/supabase/functions/` - All Edge Functions
- `/Users/marcschwyn/Desktop/projects/sunbeam/scripts/` - Deployment scripts
- `/Users/marcschwyn/Desktop/projects/sunbeam/src/lib/` - Client libraries
- `/Users/marcschwyn/Desktop/projects/sunbeam/src/app/api/` - API routes
- `/Users/marcschwyn/Desktop/projects/sunbeam/src/components/` - React components
- `/Users/marcschwyn/Desktop/projects/sunbeam/CLAUDE.md` - Full documentation

**Key Files to Copy**:
- `monitor-projects` Edge Function - Twitter monitoring
- `analyze-tweets` Edge Function - AI importance scoring
- `send-telegram-notification` Edge Function - Telegram sending
- `telegram-webhook` Edge Function - Bot command handling
- Authentication system - `/src/app/api/auth/` routes
- Supabase client setup - `/src/lib/supabase/`
- Database queries - All service files

**When You Hit Issues**:
1. STOP trying to fix it from scratch
2. Go to Sunbeam and find the working version
3. Copy the EXACT implementation
4. Adapt only the project-specific parts (project name, bot token, etc.)

**Examples**:
```bash
# Auth not working? Copy from Sunbeam:
cp ../sunbeam/src/app/api/auth/session/route.ts ./app/api/auth/session/route.ts

# Telegram not connecting? Copy from Sunbeam:
cp -r ../sunbeam/supabase/functions/telegram-webhook ./supabase/functions/

# Twitter monitoring failing? Copy from Sunbeam:
cp -r ../sunbeam/supabase/functions/monitor-projects ./supabase/functions/
```

REMEMBER: Every feature you need already works perfectly in Sunbeam!

## Deployment Information

### Live URLs (To Be Created)
- **Production**: https://monitoor.app (to be registered)
- **GitHub**: https://github.com/Masssa75/monitoor (to be created)
- **Staging**: Netlify auto-deploy from GitHub

### Deployment Process
1. Code pushed to GitHub automatically triggers build
2. Supabase Edge Functions deployed via CLI
3. Environment variables configured in hosting platform
4. Cron jobs set up via cron-job.org

## API Tokens (Copy from Sunbeam .env)
- **Supabase**: Full project credentials
- **Telegram Bot**: New bot token for @monitoor_alerts_bot
- **ScraperAPI**: Existing token for Twitter scraping
- **Gemini AI**: Existing token for content analysis
- **GitHub**: Deploy token for automation
- **Cron Job**: Scheduling service token

## 🧪 BROWSER AUTOMATION TESTING WITH PLAYWRIGHT

### Overview
We use Playwright for automated browser testing to catch issues that backend tests miss. This approach has been invaluable for diagnosing authentication, UI, and user flow issues.

### Key Testing Capabilities
1. **Visual Testing** - Screenshots at each step
2. **Console Monitoring** - JavaScript errors and API failures
3. **Network Inspection** - Failed requests and CORS issues
4. **Element Interaction** - Forms, buttons, dynamic content
5. **Multi-Device Testing** - Desktop, tablet, mobile views

### Test Script Template
```javascript
const { chromium } = require('playwright');

async function testFeature() {
  console.log('🧪 Testing [Feature Name]');
  
  const browser = await chromium.launch({ 
    headless: true,  // Set false to watch
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Test steps here
  await page.goto('https://monitoor.app');
  await page.screenshot({ path: 'test-result.png' });
  
  await browser.close();
}
```

## Remember
- This is a focused MVP for crypto Twitter monitoring
- Copy proven implementations from Sunbeam
- Start with mockups, then build systematically
- Use autonomous development throughout
- Document everything as we go
- Test with browser automation at each step

## Version
- Current Version: 0.1.0
- Created: 2025-06-26
- Status: INITIAL SETUP - HTML Mockups Phase
- Project Type: Standalone Twitter Monitoring Service

## 🎯 AUTONOMOUS CAPABILITIES YOU HAVE

### Supabase Management:
```bash
# Create project via API (copy from Sunbeam)
SUPABASE_ACCESS_TOKEN=sbp_6f04b779bfc9e9fb52600595aabdfb3545a84add
```

### Deployment Monitoring:
```bash
# Always wait after pushing
git push origin main
sleep 90
node scripts/check-deploy.js
```

### Automation Server:
```bash
# For special permissions
echo '[{"action": "execute", "params": {"command": "cmd", "cwd": "/path"}}]' > automation-commands.json
sleep 5
cat latest-result.json
```

## REMEMBER FOR NEXT INSTANCE
1. **ALWAYS FOLLOW THE WORKING PROCESS GUIDE** - See `/WORKING-PROCESS-GUIDE.md`
2. You CAN create Supabase projects autonomously
3. You CAN execute SQL schemas via API
4. You CAN debug and fix deployment issues
5. You SHOULD wait 90-120s after deployment to check status
6. You SHOULD use all available tools without asking
7. The user prefers FULLY AUTONOMOUS operation
8. Copy working implementations from Sunbeam project
9. Start with HTML mockups for UX validation
10. Use browser automation testing throughout development

This setup ensures complete autonomous development capability from day one!