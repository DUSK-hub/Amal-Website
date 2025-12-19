# Supabase Database Setup for Amal

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details and create

## Step 2: Run SQL Migrations

Go to **SQL Editor** in your Supabase dashboard and run these commands:

### Create Profiles Table
```sql
-- Profiles table for user settings
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Create Habits Table
```sql
-- Habits table
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  habit_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Policies for habits
CREATE POLICY "Users can view own habits"
  ON public.habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON public.habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON public.habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON public.habits FOR DELETE
  USING (auth.uid() = user_id);

-- Index for better performance
CREATE INDEX habits_user_id_idx ON public.habits(user_id);
CREATE INDEX habits_order_idx ON public.habits(habit_order);
```

### Create Task Completions Table
```sql
-- Task completions table
CREATE TABLE IF NOT EXISTS public.task_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 31),
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, habit_id, day, month, year)
);

-- Enable Row Level Security
ALTER TABLE public.task_completions ENABLE ROW LEVEL SECURITY;

-- Policies for task_completions
CREATE POLICY "Users can view own completions"
  ON public.task_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
  ON public.task_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own completions"
  ON public.task_completions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own completions"
  ON public.task_completions FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX task_completions_user_id_idx ON public.task_completions(user_id);
CREATE INDEX task_completions_habit_id_idx ON public.task_completions(habit_id);
CREATE INDEX task_completions_date_idx ON public.task_completions(year, month, day);
```

### Create Updated_At Trigger Function
```sql
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to task_completions
CREATE TRIGGER update_task_completions_updated_at
  BEFORE UPDATE ON public.task_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Step 3: Configure Authentication

1. Go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Configure email templates (optional)
4. Under **URL Configuration**:
   - Set **Site URL** to your deployed URL (e.g., `https://your-app.vercel.app`)
   - Add redirect URLs if needed

## Step 4: Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)
3. Replace in `app.js`:
   ```javascript
   const SUPABASE_URL = 'YOUR_PROJECT_URL';
   const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
   ```

## Step 5: Enable Realtime (Optional)

If you want real-time sync across devices:

1. Go to **Database** → **Replication**
2. Enable replication for:
   - `habits`
   - `task_completions`
   - `profiles`

## Verification

To verify your setup:

1. Go to **Table Editor**
2. You should see these tables:
   - `profiles`
   - `habits`
   - `task_completions`
3. Each table should have RLS enabled (green shield icon)

## Security Notes

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Anon key is safe to use in frontend code
- Never expose your service_role key publicly

Your Supabase database is now ready! 🎉