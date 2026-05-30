-- ─────────────────────────────────────────────────────────────────────────────
-- GANESH REDDY PORTFOLIO — Initial Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. PROFILES (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email      TEXT,
  role       TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  description      TEXT,
  long_description TEXT,
  tags             TEXT[]  DEFAULT '{}',
  badges           TEXT[]  DEFAULT '{}',
  image_url        TEXT,
  video_url        TEXT,
  github_url       TEXT,
  demo_url         TEXT,
  blog_url         TEXT,
  featured         BOOLEAN DEFAULT FALSE,
  sort_order       INTEGER DEFAULT 0,
  visual_class     TEXT,
  highlights       JSONB   DEFAULT '[]',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SKILL GROUPS
CREATE TABLE IF NOT EXISTS skill_groups (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category   TEXT NOT NULL,
  card_class TEXT,
  items      JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXPERIENCE
CREATE TABLE IF NOT EXISTS experience (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge        TEXT,
  badge_type   TEXT DEFAULT 'intern' CHECK (badge_type IN ('research','industry','intern')),
  title        TEXT NOT NULL,
  organization TEXT,
  period       TEXT,
  bullets      TEXT[] DEFAULT '{}',
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EDUCATION
CREATE TABLE IF NOT EXISTS education (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree     TEXT NOT NULL,
  university TEXT,
  location   TEXT,
  period     TEXT,
  gpa        TEXT,
  ects       TEXT,
  coursework TEXT[] DEFAULT '{}',
  thesis     TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CERTIFICATES
CREATE TABLE IF NOT EXISTS certificates (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  issuer         TEXT,
  issue_date     TEXT,
  credential_url TEXT,
  image_url      TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  role       TEXT,
  company    TEXT,
  content    TEXT NOT NULL,
  image_url  TEXT,
  featured   BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  summary    TEXT,
  content    TEXT,
  image_url  TEXT,
  tags       TEXT[]  DEFAULT '{}',
  published  BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

-- Helper: is the current user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Enable RLS on all tables
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_groups      ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience        ENABLE ROW LEVEL SECURITY;
ALTER TABLE education         ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts        ENABLE ROW LEVEL SECURITY;

-- PROFILES: users can see own, admin sees all
CREATE POLICY "Users can view own profile"  ON profiles FOR SELECT USING (id = auth.uid() OR is_admin());
CREATE POLICY "Admin can update profiles"   ON profiles FOR UPDATE USING (is_admin());

-- PROJECTS: public read, admin write
CREATE POLICY "Public read projects"        ON projects FOR SELECT USING (TRUE);
CREATE POLICY "Admin insert projects"       ON projects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update projects"       ON projects FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete projects"       ON projects FOR DELETE USING (is_admin());

-- SKILL GROUPS: public read, admin write
CREATE POLICY "Public read skills"          ON skill_groups FOR SELECT USING (TRUE);
CREATE POLICY "Admin insert skills"         ON skill_groups FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update skills"         ON skill_groups FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete skills"         ON skill_groups FOR DELETE USING (is_admin());

-- EXPERIENCE: public read, admin write
CREATE POLICY "Public read experience"      ON experience FOR SELECT USING (TRUE);
CREATE POLICY "Admin insert experience"     ON experience FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update experience"     ON experience FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete experience"     ON experience FOR DELETE USING (is_admin());

-- EDUCATION: public read, admin write
CREATE POLICY "Public read education"       ON education FOR SELECT USING (TRUE);
CREATE POLICY "Admin insert education"      ON education FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update education"      ON education FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete education"      ON education FOR DELETE USING (is_admin());

-- CERTIFICATES: public read, admin write
CREATE POLICY "Public read certificates"    ON certificates FOR SELECT USING (TRUE);
CREATE POLICY "Admin insert certificates"   ON certificates FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update certificates"   ON certificates FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete certificates"   ON certificates FOR DELETE USING (is_admin());

-- CONTACT MESSAGES: public insert, admin read/delete
CREATE POLICY "Public insert messages"      ON contact_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin read messages"         ON contact_messages FOR SELECT USING (is_admin());
CREATE POLICY "Admin update messages"       ON contact_messages FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete messages"       ON contact_messages FOR DELETE USING (is_admin());

-- TESTIMONIALS: public read, admin write
CREATE POLICY "Public read testimonials"    ON testimonials FOR SELECT USING (TRUE);
CREATE POLICY "Admin insert testimonials"   ON testimonials FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update testimonials"   ON testimonials FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete testimonials"   ON testimonials FOR DELETE USING (is_admin());

-- BLOG POSTS: public reads published only, admin reads all
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (published = TRUE OR is_admin());
CREATE POLICY "Admin insert posts"          ON blog_posts FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update posts"          ON blog_posts FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete posts"          ON blog_posts FOR DELETE USING (is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE: portfolio bucket for image uploads
-- Run manually in Supabase Dashboard > Storage > New Bucket
-- Name: portfolio  | Public: true
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────────────────
-- AFTER RUNNING THIS SQL:
--   1. Go to Authentication > Users and create your admin account
--   2. Copy the user UUID from the Users table
--   3. Run:  UPDATE profiles SET role = 'admin' WHERE id = '<your-uuid>';
--   4. Go to Storage > New Bucket: name = "portfolio", public = true
-- ─────────────────────────────────────────────────────────────────────────────
