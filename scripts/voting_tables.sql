-- SQL to create voting and rewards related tables
-- Run this in your Supabase SQL Editor

-- Table for idea favorites
CREATE TABLE IF NOT EXISTS idea_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

-- Table for idea likes (separate from upvotes if needed)
CREATE TABLE IF NOT EXISTS idea_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

-- Table for idea copies
CREATE TABLE IF NOT EXISTS idea_copies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for idea views (separate from view_count if needed)
CREATE TABLE IF NOT EXISTS idea_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Allow anonymous views
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for idea ratings
CREATE TABLE IF NOT EXISTS idea_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

-- Table for votes (user votes on ideas)
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
  reward_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

-- Enable RLS
ALTER TABLE idea_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_copies ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see/modify their own records)
CREATE POLICY "Users can view all favorites" ON idea_favorites FOR SELECT USING (true);
CREATE POLICY "Users can insert their own favorites" ON idea_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON idea_favorites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all likes" ON idea_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes" ON idea_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON idea_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all copies" ON idea_copies FOR SELECT USING (true);
CREATE POLICY "Users can insert their own copies" ON idea_copies FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all views" ON idea_views FOR SELECT USING (true);
CREATE POLICY "Users can insert views" ON idea_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view all ratings" ON idea_ratings FOR SELECT USING (true);
CREATE POLICY "Users can insert their own ratings" ON idea_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ratings" ON idea_ratings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own votes" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own votes" ON votes FOR UPDATE USING (auth.uid() = user_id);