# MONITOOR - Autonomous Setup Plan for Next Instance

## 🚀 COMPLETE AUTONOMOUS SETUP GUIDE

This document provides a step-by-step plan for the next Claude instance to autonomously set up the entire MONITOOR project from scratch. Follow these steps exactly in order.

## 📋 Prerequisites Check

Before starting, ensure:
1. Read `/CLAUDE.md` completely
2. Read `/WORKING-PROCESS-GUIDE.md` for debugging approach
3. Automation server is running (check `automation-server.js`)
4. Copy API tokens from Sunbeam's `.env` file to MONITOOR's `.env`

### Required API Keys Setup:
```bash
# 1. Copy the example file
cp .env.example .env

# 2. Copy these values from Sunbeam's .env:
# - SCRAPERAPI_KEY (for Twitter monitoring)
# - GEMINI_API_KEY (for AI analysis)
# - CRONJOB_API_KEY (for scheduling)
# - SUPABASE_ACCESS_TOKEN (already in .env.example)

# 3. Create new Telegram bot:
# - Message @BotFather on Telegram
# - /newbot
# - Name: MONITOOR Alerts
# - Username: monitoor_alerts_bot
# - Copy the token to TELEGRAM_BOT_TOKEN
```

### Supabase CLI Setup:
The Supabase CLI is ESSENTIAL for this project. You have two options:

#### Option 1: Copy from Sunbeam (FASTEST)
```bash
cp -r ../sunbeam/supabase-cli ./
```

#### Option 2: Fresh Install
```bash
curl -s https://raw.githubusercontent.com/supabase/cli/main/install.sh | bash
```

**What you'll use Supabase CLI for:**
- Running database schemas: `supabase db push`
- Deploying Edge Functions: `supabase functions deploy`
- Setting secrets: `supabase secrets set`
- Managing migrations: `supabase db diff`
- Local development: `supabase start`

## 🎯 Phase 1: Project Foundation (30 minutes)

### 1.1 Initialize Next.js Project
```bash
cd /Users/marcschwyn/Desktop/projects/monitoor
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

### 1.2 Install Additional Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr
npm install lucide-react clsx tailwind-merge
npm install playwright  # for testing
```

### 1.3 Copy Essential Config Files from Sunbeam
```bash
# Copy automation setup
cp ../sunbeam/automation-server.js .
cp ../sunbeam/.env.example .

# Copy deployment scripts structure
mkdir scripts
cp ../sunbeam/scripts/check-deploy.js scripts/
cp ../sunbeam/scripts/test-browser-template.js scripts/
```

### 1.4 Create Initial File Structure
```
monitoor/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   └── api/
│       ├── auth/
│       └── projects/
├── components/
│   ├── ui/           # Basic UI components
│   └── features/     # Feature-specific components
├── lib/
│   ├── supabase/
│   └── utils/
└── supabase/
    ├── schema.sql
    └── functions/
```

## 🎯 Phase 2: Supabase Setup (45 minutes)

### 2.1 Create Supabase Project via API
```javascript
// scripts/create-supabase-project.js
// Copy from sunbeam and modify:
const projectName = 'monitoor';
const databasePassword = generateStrongPassword();
// Use SUPABASE_ACCESS_TOKEN from sunbeam
```

### 2.2 Execute Database Schema

#### Option A: Using Supabase CLI (PREFERRED)
```bash
# Install Supabase CLI if not already installed
curl -s https://raw.githubusercontent.com/supabase/cli/main/install.sh | bash

# Or copy from Sunbeam
cp -r ../sunbeam/supabase-cli ./

# Login to Supabase
./supabase-cli/supabase login

# Link to your project
./supabase-cli/supabase link --project-ref [YOUR_PROJECT_ID]

# Run the schema
./supabase-cli/supabase db push ./supabase/schema.sql
```

#### Option B: Using API (if CLI fails)
```bash
node scripts/execute-schema-via-api.js
```

### 2.3 Set Up Edge Functions

#### Step 1: Copy Edge Functions from Sunbeam
```bash
# Create functions directory
mkdir -p supabase/functions

# Copy all Edge Functions
cp -r ../sunbeam/supabase/functions/monitor-projects ./supabase/functions/
cp -r ../sunbeam/supabase/functions/analyze-tweets ./supabase/functions/
cp -r ../sunbeam/supabase/functions/send-telegram-notification ./supabase/functions/
cp -r ../sunbeam/supabase/functions/telegram-webhook ./supabase/functions/
```

#### Step 2: Deploy Edge Functions using Supabase CLI
```bash
# Deploy each function
./supabase-cli/supabase functions deploy monitor-projects --project-ref [PROJECT_ID]
./supabase-cli/supabase functions deploy analyze-tweets --project-ref [PROJECT_ID]
./supabase-cli/supabase functions deploy send-telegram-notification --project-ref [PROJECT_ID]
./supabase-cli/supabase functions deploy telegram-webhook --project-ref [PROJECT_ID]

# Or deploy all at once
for func in monitor-projects analyze-tweets send-telegram-notification telegram-webhook; do
  ./supabase-cli/supabase functions deploy $func --project-ref [PROJECT_ID]
done
```

### 2.4 Configure Secrets in Supabase

#### Using Supabase CLI (PREFERRED)
```bash
# Set Edge Function secrets
./supabase-cli/supabase secrets set TELEGRAM_BOT_TOKEN=your_telegram_token --project-ref [PROJECT_ID]
./supabase-cli/supabase secrets set SCRAPERAPI_KEY=your_scraperapi_key --project-ref [PROJECT_ID]
./supabase-cli/supabase secrets set GEMINI_API_KEY=your_gemini_key --project-ref [PROJECT_ID]
./supabase-cli/supabase secrets set CRON_SECRET=$(openssl rand -base64 32) --project-ref [PROJECT_ID]

# Verify secrets are set
./supabase-cli/supabase secrets list --project-ref [PROJECT_ID]
```

#### Alternative: Using Management API
```javascript
// scripts/setup-edge-secrets.js
// Copy from Sunbeam if CLI method fails
```

## 🎯 Phase 3: Core Features Implementation (2 hours)

### 3.1 Authentication System
1. Copy auth utilities from Sunbeam:
   - `/lib/supabase/client.ts`
   - `/lib/supabase/server.ts`
   - `/middleware.ts` for route protection

2. Implement auth pages following wireframes:
   - Sign up page (email/password)
   - Sign in page
   - Email verification handling

### 3.2 Project Selection Feature
```typescript
// components/features/ProjectSelector.tsx
interface Project {
  id: string;
  name: string;
  symbol: string;
  twitter_username: string;
  logo_url: string;
}

// Implement:
- Search functionality
- Selection state management
- 3 minimum validation
- Visual feedback
```

### 3.3 Importance Threshold Slider
```typescript
// components/features/ImportanceSlider.tsx
// Range: 1-10, default: 9
// Real-time preview of what this means
// Store in user_settings table
```

### 3.4 Telegram Connection
```typescript
// Copy from Sunbeam:
- Token generation system
- Connection flow
- Webhook handling
```

## 🎯 Phase 4: Twitter Monitoring System (1 hour)

### 4.1 Copy Edge Functions
```bash
# Copy these files from sunbeam/supabase/functions/
- monitor-projects/index.ts
- analyze-tweets/index.ts
```

### 4.2 Set Up Cron Job
```javascript
// scripts/setup-cronjob.js
// Use cron-job.org API
// Schedule: Every minute
// Endpoint: monitor-projects Edge Function
```

### 4.3 Initial Project Data
```sql
-- Insert 10 crypto projects
INSERT INTO projects (id, name, symbol, twitter_username, logo_url) VALUES
('bitcoin', 'Bitcoin', 'BTC', 'bitcoin', 'logo_url'),
('ethereum', 'Ethereum', 'ETH', 'ethereum', 'logo_url'),
-- ... etc
```

## 🎯 Phase 5: Main Dashboard Implementation (1.5 hours)

### 5.1 Tweet Feed Component
```typescript
// components/features/TweetFeed.tsx
- Real-time updates via Supabase subscriptions
- Score-based filtering
- Infinite scroll
- Link to Twitter
```

### 5.2 Navigation Structure
```typescript
// components/features/BottomNav.tsx
- Three tabs: Feed, Projects, Profile
- Active state management
- Icon consistency with wireframes
```

### 5.3 Project Management Grid
```typescript
// components/features/ProjectGrid.tsx
- Toggle on/off functionality
- Show daily alert counts
- Real-time updates
```

## 🎯 Phase 6: Testing & Deployment (1 hour)

### 6.1 Create Test Scripts
```javascript
// scripts/test-full-flow.js
// Use Playwright to test:
1. Sign up flow
2. Project selection (3+)
3. Threshold setting
4. Telegram connection
5. Tweet feed loading
```

### 6.2 GitHub Repository Setup
```bash
# Create repo via API
node scripts/create-github-repo.js monitoor

# Initial commit
git init
git add .
git commit -m "Initial MONITOOR setup"
git remote add origin https://github.com/YourUsername/monitoor
git push -u origin main
```

### 6.3 Deploy to Vercel/Netlify
```javascript
// scripts/deploy-to-netlify.js
// Copy from sunbeam and modify
// Set environment variables
// Configure build settings
```

## 🎯 Phase 7: Final Testing (30 minutes)

### 7.1 End-to-End Test
```javascript
// scripts/test-e2e-complete.js
async function testCompleteUserJourney() {
  // 1. Visit landing page
  // 2. Sign up new account
  // 3. Select 3 projects
  // 4. Set threshold to 9
  // 5. Connect Telegram
  // 6. Verify feed loads
  // 7. Check project management
  // 8. Test settings
}
```

### 7.2 Monitor First Tweets
- Verify cron job is running
- Check tweet collection
- Confirm AI scoring
- Test importance filtering

## 📝 Important Notes for Autonomous Execution

### Always Do Without Asking:
- Create all files and folders
- Install all dependencies
- Set up Supabase project
- Deploy Edge Functions
- Configure cron jobs
- Create test scripts
- Deploy to production
- Fix any errors encountered

### Key Commands to Use:
```bash
# For special permissions
echo '[{"action": "execute", "params": {"command": "cmd", "cwd": "/path"}}]' > automation-commands.json

# Check results
cat latest-result.json

# Deploy Edge Functions
./supabase-cli/supabase functions deploy FUNCTION_NAME --project-ref [PROJECT_ID]
```

### Testing Approach:
1. Test each component in isolation first
2. Use Playwright for visual testing
3. Take screenshots at each step
4. If something fails, debug and retry (up to 10 times)

## 🚨 CRITICAL: When Facing ANY Issues

### ALWAYS CHECK SUNBEAM FIRST!
Before trying to fix any bug or implement any feature from scratch:

1. **Check if it works in Sunbeam**:
```bash
cd /Users/marcschwyn/Desktop/projects/sunbeam
# Test the feature there first
```

2. **Copy the EXACT working implementation**:
```bash
# Examples of what to copy:
cp ../sunbeam/supabase/functions/monitor-projects/* ./supabase/functions/monitor-projects/
cp ../sunbeam/src/lib/supabase/* ./lib/supabase/
cp ../sunbeam/src/app/api/auth/* ./app/api/auth/
```

3. **Key places to check in Sunbeam**:
- **Authentication issues**: `/src/app/api/auth/` and `/src/lib/supabase/server-auth.ts`
- **Twitter monitoring**: `/supabase/functions/monitor-projects/` and `/analyze-tweets/`
- **Telegram integration**: `/supabase/functions/telegram-webhook/` and `/send-telegram-notification/`
- **Database queries**: `/src/lib/supabase/` folder
- **API routes**: `/src/app/api/` folder
- **Edge Function deployment**: `/scripts/deploy-*.js`

### Common Issues & Solutions

### Issue: Authentication not working
**Solution**: Copy EXACT implementation from:
- `/src/app/api/auth/session/route.ts`
- `/src/lib/supabase/server.ts`
- `/src/middleware.ts`

### Issue: Twitter monitoring failing
**Solution**: Copy EXACT Edge Functions from:
- `/supabase/functions/monitor-projects/index.ts`
- Check ScraperAPI configuration
- Verify Nitter instance URLs

### Issue: Telegram notifications not sending
**Solution**: Copy EXACT implementation from:
- `/supabase/functions/send-telegram-notification/index.ts`
- Check webhook setup in `/scripts/setup-telegram-webhook.js`

### Issue: Database queries failing
**Solution**: 
- Check RLS policies in Sunbeam
- Copy exact table structures
- Use service role key for admin operations

### REMEMBER: Sunbeam has ALL these features working perfectly. Don't reinvent - just copy!

## ✅ Success Criteria

The project is complete when:
1. User can sign up and select projects
2. Tweet feed shows real tweets
3. Importance filtering works
4. Telegram notifications functional
5. All tests passing
6. Deployed to production

## 🎯 Estimated Total Time: 6-7 hours

Remember: Work autonomously, fix issues as they arise, and document everything in CLAUDE.md as you progress!