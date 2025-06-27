-- MONITOOR Database Schema
-- Twitter monitoring service for crypto projects

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core user accounts (handled by Supabase Auth)
-- Using auth.users table

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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
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
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_project_importance ON tweet_analyses(project_id, importance_score DESC);
CREATE INDEX idx_tweet_date ON tweet_analyses(tweet_date DESC);
CREATE INDEX idx_analyzed_at ON tweet_analyses(analyzed_at DESC);

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

-- Telegram connection tokens
CREATE TABLE telegram_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token VARCHAR UNIQUE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour')
);

-- Insert initial 10 crypto projects
INSERT INTO projects (id, name, symbol, twitter_username, description) VALUES
('bitcoin', 'Bitcoin', 'BTC', 'bitcoin', 'The original cryptocurrency'),
('ethereum', 'Ethereum', 'ETH', 'ethereum', 'Smart contract platform'),
('solana', 'Solana', 'SOL', 'solana', 'High-speed blockchain'),
('kaspa', 'Kaspa', 'KAS', 'KaspaCurrency', 'BlockDAG technology'),
('chainlink', 'Chainlink', 'LINK', 'chainlink', 'Decentralized oracles'),
('polygon', 'Polygon', 'MATIC', '0xPolygon', 'Ethereum scaling'),
('avalanche', 'Avalanche', 'AVAX', 'avalancheavax', 'Multi-chain platform'),
('sui', 'Sui', 'SUI', 'SuiNetwork', 'Move-based blockchain'),
('arbitrum', 'Arbitrum', 'ARB', 'arbitrum', 'Layer 2 scaling'),
('thegraph', 'The Graph', 'GRT', 'graphprotocol', 'Blockchain indexing');

-- Row Level Security (RLS) Policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_tokens ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON user_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON user_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see and use their own tokens
CREATE POLICY "Users can view own tokens" ON telegram_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tokens" ON telegram_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access to projects and tweets
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view tweets" ON tweet_analyses
  FOR SELECT USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_settings updated_at
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();