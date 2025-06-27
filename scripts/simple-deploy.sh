#!/bin/bash

echo "🚀 Deploying MONITOOR to Netlify..."

# Create new Netlify site
netlify sites:create --name monitoor-app

# Link to GitHub repo
netlify link --name monitoor-app

# Set environment variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "$NEXT_PUBLIC_SUPABASE_URL"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_ROLE_KEY"
netlify env:set NODE_VERSION "18"

# Deploy
netlify deploy --prod --build

echo "✅ Deployment complete!"