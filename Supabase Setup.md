# Amal (أمل) - Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Wait for the database to be provisioned

## 2. Get Your Credentials

1. Go to **Project Settings** → **API**
2. Copy your:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (the `anon` key)
3. Update `app.js` with these values:
   ```javascript
   const SUPABASE_URL = 'your-project-url';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

## 3. Create Database Tables

Go to **SQL Editor** in Supabase and run these commands:

### Table 1: User Preferences
```sql
CREATE TABLE user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ar')),
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'midnight')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own preferences
CREATE POLICY "Users can view own preferences"
    ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
    ON user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
    ON user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

### Table 2: Habits
```sql
CREATE TABLE habits (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    translation_key TEXT,
    custom_name TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT habits_unique_user_id UNIQUE (user_id, id)
);

-- Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own habits"
    ON habits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
    ON habits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
    ON habits FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
    ON habits FOR DELETE
    USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_sort_order ON habits(user_id, sort_order);
```

### Table 3: Completions
```sql
CREATE TABLE completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    habit_id TEXT NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 0 AND month <= 11),
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 31),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT completions_unique UNIQUE (user_id, habit_id, year, month, day)
);

-- Enable Row Level Security
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own completions"
    ON completions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
    ON completions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own completions"
    ON completions FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for faster queries
CREATE INDEX idx_completions_user_id ON completions(user_id);
CREATE INDEX idx_completions_date ON completions(user_id, year, month);
CREATE INDEX idx_completions_habit ON completions(user_id, habit_id);
```

## 4. Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. (Optional) Enable **Magic Link** if you want passwordless login
4. Configure email templates if desired

## 5. Test Your Setup

1. Try signing up with a test email
2. Check if default habits are created
3. Try checking/unchecking habits
4. Verify data persists after refresh

## 6. Security Notes

✅ **Row Level Security (RLS)** is enabled on all tables
✅ Users can only access their own data
✅ All foreign keys have CASCADE DELETE for data cleanup
✅ Input validation via CHECK constraints

## 7. Optional: Set Up Email Templates

Go to **Authentication** → **Email Templates** to customize:
- Confirmation email
- Magic link email
- Password reset email

Make them match the Islamic/minimalist theme of your app.

## 8. Monitoring

Use the **Table Editor** in Supabase to:
- View user data
- Check table contents
- Monitor database size
- Debug issues

## 9. Deployment (See DEPLOYMENT.md)

Once your database is set up:
1. Update `app.js` with your credentials
2. Deploy to Vercel/Netlify (free hosting)
3. Your app is live!

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Discord Community: https://discord.supabase.com
- GitHub Issues: Create an issue in your repo