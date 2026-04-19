/*
  # Create Core Tables for Kurmitola High School & College

  ## Summary
  This migration creates the foundational tables for the school website CMS.

  ## New Tables

  ### 1. profiles
  - Stores student profile information linked to Supabase auth users
  - Fields: id (auth ref), full_name, email, avatar_url, batch, roll_number

  ### 2. reviews
  - Student-submitted reviews/testimonials
  - Admin approval system via is_approved flag
  - Fields: id, student_name, batch, rating, content, is_approved, created_at

  ### 3. notices
  - Admin-managed notice board entries
  - Fields: id, title, content, category, is_pinned, attachment_url, created_at

  ### 4. faculty
  - All faculty and staff profiles
  - type: 'teacher' | 'staff' | 'principal' | 'ex_principal' | 'ex_chairman'
  - Fields: id, name, designation, subject, photo_url, type, bio, sort_order, is_active

  ### 5. academic_files
  - Uploadable academic documents managed by admin
  - type: 'routine' | 'syllabus' | 'calendar'
  - Fields: id, title, type, class_level, file_url, uploaded_at

  ### 6. gallery
  - Photo and video gallery items
  - Fields: id, title, media_url, media_type, category, is_featured, created_at

  ### 7. site_content
  - Key-value store for CMS-managed text content
  - Fields: key, value, updated_at

  ## Security
  - RLS enabled on all tables
  - Public read access for approved/active content
  - Write access restricted to authenticated admin role
  - Students can only manage their own profiles and reviews
*/

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  avatar_url text DEFAULT '',
  batch text DEFAULT '',
  roll_number text DEFAULT '',
  class_level text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Students can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Students can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL DEFAULT '',
  batch text DEFAULT '',
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL DEFAULT '',
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

CREATE POLICY "Anyone can submit a review"
  ON reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ============================================================
-- NOTICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  is_pinned boolean DEFAULT false,
  attachment_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read notices"
  ON notices FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- FACULTY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  designation text NOT NULL DEFAULT '',
  subject text DEFAULT '',
  photo_url text DEFAULT '',
  faculty_type text NOT NULL DEFAULT 'teacher',
  bio text DEFAULT '',
  email text DEFAULT '',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active faculty"
  ON faculty FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- ============================================================
-- ACADEMIC FILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS academic_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  file_type text NOT NULL DEFAULT 'routine',
  class_level text DEFAULT 'All',
  file_url text NOT NULL DEFAULT '',
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE academic_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read academic files"
  ON academic_files FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- GALLERY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  media_url text NOT NULL DEFAULT '',
  media_type text NOT NULL DEFAULT 'photo',
  category text DEFAULT 'general',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gallery"
  ON gallery FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- SITE CONTENT TABLE (CMS)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_content (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site content"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- SEED DEFAULT SITE CONTENT
-- ============================================================
INSERT INTO site_content (key, value) VALUES
  ('hero_title', 'Kurmitola High School & College'),
  ('hero_subtitle', 'Nurturing Excellence Since 1948 — A Legacy of Education, Character, and Achievement in the Heart of Dhaka'),
  ('principal_message', 'Welcome to Kurmitola High School & College. Our institution has been a beacon of quality education for over 75 years. We are committed to developing well-rounded individuals who excel academically and morally.'),
  ('admission_notice', 'Online admission is not available at this time. Please download our prospectus for offline admission information.')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- SEED SAMPLE NOTICES
-- ============================================================
INSERT INTO notices (title, content, category, is_pinned) VALUES
  ('SSC Result 2025 Published', 'The SSC examination results for 2025 have been published. Students can check their results on the official board website. Congratulations to all successful candidates!', 'result', true),
  ('HSC Admission 2025-26 Open', 'Applications are now open for HSC admission for the academic year 2025-26. Eligible SSC graduates may apply in person at the school office.', 'admission', true),
  ('Annual Sports Day 2026', 'The Annual Sports Day will be held on 25th November 2026 at the school ground. All students and parents are cordially invited.', 'event', false),
  ('Half-Yearly Examination Schedule', 'The Half-Yearly Examination will commence from 22th april 2026. Students are requested to prepare accordingly.', 'exam', false),
  ('Parent-Teacher Meeting', 'A Parent-Teacher meeting is scheduled for 10th may 2026 at 10:00 AM in the school auditorium.', 'general', false)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED SAMPLE FACULTY
-- ============================================================
INSERT INTO faculty (name, designation, subject, faculty_type, sort_order) VALUES
  ('Md. Shahjahan', 'Headmaster', 'Administration', 'principal', 1),
  ('Md. Ibrahim Khalil', 'Lecturer', 'Physics', 'teacher', 2),
  ('Md. Shamim Khondaker', 'Assistant Teacher', 'Chemistry', 'teacher', 3),
  ('Md. Jamiul Haque', 'Lecturer', 'Biology', 'teacher', 4),
  ('Md. Jahangir Alam', 'Senior Teacher', 'Mathematics', 'teacher', 5),
  ('Md. Sayfullah Zoardar', 'Lecturer', 'Bangla', 'teacher', 7),
  ('Afroza Islam', 'Office Staff', 'Office', 'staff', 9),
  ('Moslem Uddin', 'Accounts Assistant', 'account', 'staff', 10),
  ('Md. Abdul Khalek', 'Former Principal (2014-2023)', 'Administration', 'ex_principal', 1),
  ('Additional District Commissioner (S.I.)', 'Former Chairman (2024-2025)', 'Administration', 'ex_chairman', 1)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED SAMPLE APPROVED REVIEWS
-- ============================================================
INSERT INTO reviews (student_name, batch, rating, content, is_approved) VALUES
  ('Rakibul Hasan', 'SSC 2022', 5, 'Kurmitola High School gave me the foundation to pursue my dreams. The teachers here are incredibly dedicated and always push students to be their best.', true),
  ('Sadia Akter', 'HSC 2023', 5, 'The academic environment here is outstanding. I got GPA 5.00 in HSC, and I owe it entirely to the brilliant faculty at KHSC.', true),
  ('Tanvir Ahmed', 'SSC 2021', 4, 'Great institution with excellent teaching staff. The discipline and moral values taught here will stay with me forever.', true),
  ('Nusrat Jahan', 'HSC 2022', 5, 'Best school in Khilkhet! The teachers go above and beyond to ensure every student understands the curriculum thoroughly.', true)
ON CONFLICT DO NOTHING;
