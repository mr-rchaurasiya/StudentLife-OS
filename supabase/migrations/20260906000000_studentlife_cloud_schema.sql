-- ============================================================================
-- STUDENTLIFE OS 2.0 - SUPABASE CLOUD POSTGRESQL SCHEMA & MIGRATIONS
-- Automated production deployment migration with Row-Level Security (RLS)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  college TEXT,
  degree TEXT,
  field_of_study TEXT,
  academic_year INT DEFAULT 1,
  target_exams TEXT[] DEFAULT '{}',
  skill_tags TEXT[] DEFAULT '{}',
  career_aspirations TEXT[] DEFAULT '{}',
  daily_study_goal_minutes INT DEFAULT 180,
  streak_count INT DEFAULT 1,
  xp_points INT DEFAULT 100,
  level INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STUDY PLANNER TASKS TABLE
CREATE TABLE IF NOT EXISTS public.study_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject_name TEXT NOT NULL,
  subject_color TEXT DEFAULT '#6366f1',
  due_date DATE NOT NULL,
  due_time TEXT,
  priority TEXT CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')) DEFAULT 'MEDIUM',
  status TEXT CHECK (status IN ('TODO', 'IN_PROGRESS', 'COMPLETED')) DEFAULT 'TODO',
  estimated_minutes INT DEFAULT 30,
  actual_minutes INT DEFAULT 0,
  pomodoro_sessions_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SYLLABUS & TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.syllabus_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  color_code TEXT DEFAULT '#6366f1',
  total_weightage_percent NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.syllabus_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES public.syllabus_subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')) DEFAULT 'MEDIUM',
  weightage_percent NUMERIC(5,2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SMART NOTES & RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  word_count INT DEFAULT 0,
  read_time_minutes INT DEFAULT 1,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SPACED REPETITION FLASHCARDS (SUPERMEMO SM-2)
CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  note_id UUID REFERENCES public.notes(id) ON DELETE SET NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  repetition_step INT DEFAULT 0,
  ease_factor NUMERIC(4,2) DEFAULT 2.50,
  interval_days INT DEFAULT 1,
  next_review_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. QUESTION BANK & PYQS
CREATE TABLE IF NOT EXISTS public.question_bank (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_category TEXT NOT NULL,
  year INT NOT NULL,
  subject_name TEXT NOT NULL,
  topic_title TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_index INT NOT NULL,
  step_by_step_solution TEXT NOT NULL,
  latex_formula_snippet TEXT,
  difficulty TEXT CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD', 'EXPERT')) DEFAULT 'MEDIUM',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MOCK TEST ATTEMPTS & ANALYTICS
CREATE TABLE IF NOT EXISTS public.mock_test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  test_title TEXT NOT NULL,
  total_questions INT NOT NULL,
  correct_count INT DEFAULT 0,
  incorrect_count INT DEFAULT 0,
  skipped_count INT DEFAULT 0,
  total_score NUMERIC(6,2) DEFAULT 0,
  accuracy_percent NUMERIC(5,2) DEFAULT 0,
  speed_seconds_per_question NUMERIC(6,2) DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ATS RESUMES
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin TEXT,
  github TEXT,
  summary TEXT,
  education JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  ats_score INT DEFAULT 85,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SOCIAL STUDY ROOMS
CREATE TABLE IF NOT EXISTS public.study_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  host_name TEXT NOT NULL,
  active_students_count INT DEFAULT 1,
  max_participants INT DEFAULT 15,
  is_private BOOLEAN DEFAULT FALSE,
  vibe TEXT DEFAULT 'Lo-Fi Chill',
  pomodoro_phase TEXT DEFAULT 'WORK',
  pomodoro_seconds_left INT DEFAULT 1500,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own data
CREATE POLICY "Users can view and update own profile" ON public.profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tasks" ON public.study_tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notes" ON public.notes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own flashcards" ON public.flashcards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and create study rooms" ON public.study_rooms
  FOR ALL USING (true);
