-- ============================================================================
-- Masterclass Admin Schema
-- ============================================================================
-- Tables for managing dynamic course content through admin interface
-- Created: 2025
-- ============================================================================

-- Course Sections Table
-- Stores editable section information (videos, titles, descriptions)
CREATE TABLE IF NOT EXISTS masterclass_course_sections (
  id SERIAL PRIMARY KEY,
  section_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  duration TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_section_number UNIQUE(section_number),
  CONSTRAINT unique_order_index UNIQUE(order_index)
);

-- Quiz Questions Table
-- Stores editable quiz questions for each section
CREATE TABLE IF NOT EXISTS masterclass_quiz_questions (
  id SERIAL PRIMARY KEY,
  section_number INTEGER NOT NULL REFERENCES masterclass_course_sections(section_number) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  explanation TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_section_question UNIQUE(section_number, question_number),
  CONSTRAINT valid_correct_answer CHECK (correct_answer >= 0 AND correct_answer <= 3)
);

-- Certificate Configuration Table
-- Stores customizable certificate template fields
CREATE TABLE IF NOT EXISTS masterclass_certificate_config (
  id SERIAL PRIMARY KEY,
  course_title TEXT NOT NULL DEFAULT 'School BCBA Mastery Fundamentals',
  ceu_credits DECIMAL(3,1) NOT NULL DEFAULT 1.0,
  bacb_provider_number TEXT NOT NULL DEFAULT 'OP-25-11420',
  certificate_subtitle TEXT,
  completion_statement TEXT NOT NULL DEFAULT 'This certificate verifies successful completion of all course requirements including video content and knowledge assessments.',
  signature_name TEXT,
  signature_title TEXT,
  organization_name TEXT NOT NULL DEFAULT 'Behavior School',
  organization_website TEXT NOT NULL DEFAULT 'behaviorschool.com',
  template_version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_section ON masterclass_quiz_questions(section_number);
CREATE INDEX IF NOT EXISTS idx_course_sections_active ON masterclass_course_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_active ON masterclass_quiz_questions(is_active);

-- Enable Row Level Security
ALTER TABLE masterclass_course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE masterclass_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE masterclass_certificate_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read access, admin write access
CREATE POLICY "Public can read active course sections"
  ON masterclass_course_sections
  FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Public can read active quiz questions"
  ON masterclass_quiz_questions
  FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Public can read active certificate config"
  ON masterclass_certificate_config
  FOR SELECT
  USING (is_active = TRUE);

-- Admin write policies (using authenticated role - adjust as needed)
CREATE POLICY "Authenticated users can manage course sections"
  ON masterclass_course_sections
  FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can manage quiz questions"
  ON masterclass_quiz_questions
  FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can manage certificate config"
  ON masterclass_certificate_config
  FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_masterclass_admin_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_course_sections_updated_at ON masterclass_course_sections;
CREATE TRIGGER update_course_sections_updated_at
  BEFORE UPDATE ON masterclass_course_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_masterclass_admin_updated_at();

DROP TRIGGER IF EXISTS update_quiz_questions_updated_at ON masterclass_quiz_questions;
CREATE TRIGGER update_quiz_questions_updated_at
  BEFORE UPDATE ON masterclass_quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_masterclass_admin_updated_at();

DROP TRIGGER IF EXISTS update_certificate_config_updated_at ON masterclass_certificate_config;
CREATE TRIGGER update_certificate_config_updated_at
  BEFORE UPDATE ON masterclass_certificate_config
  FOR EACH ROW
  EXECUTE FUNCTION update_masterclass_admin_updated_at();

-- ============================================================================
-- Seed Data - Initialize with existing hardcoded content
-- ============================================================================

-- Insert default course sections
INSERT INTO masterclass_course_sections (section_number, title, description, video_url, duration, order_index) VALUES
(1, 'Ethics in School-Based Practice', 'Learn the foundational ethical principles specific to working as a BCBA in educational settings.', 'https://vimeo.com/1050191710', '15 min', 1),
(2, 'Effective IEP Collaboration', 'Master the art of collaborating with educators, parents, and administrators in the IEP process.', 'https://vimeo.com/1050191710', '15 min', 2),
(3, 'Data Collection in Schools', 'Discover practical strategies for collecting meaningful data in busy school environments.', 'https://vimeo.com/1050191710', '15 min', 3),
(4, 'Supervision Best Practices', 'Develop your skills in supervising RBTs and technicians within school settings.', 'https://vimeo.com/1050191710', '15 min', 4)
ON CONFLICT (section_number) DO NOTHING;

-- Insert quiz questions for Section 1 (Ethics)
INSERT INTO masterclass_quiz_questions (section_number, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(1, 1, 'What is the most important ethical consideration when working with students in schools?', 'Meeting billing requirements', 'Maintaining student confidentiality and privacy', 'Following school district policies only', 'Maximizing service hours', 1, 'Student confidentiality is paramount in school settings. While other factors matter, protecting student privacy comes first, especially under FERPA and IDEA regulations.'),
(1, 2, 'When should you involve parents in the behavior intervention process?', 'Only when problems arise', 'From the very beginning and throughout', 'After the first month of intervention', 'Only if the school requests it', 1, 'Family involvement is crucial from day one. The BACB Ethics Code requires ongoing collaboration with families, and research shows better outcomes when parents are engaged partners.'),
(1, 3, 'What should you do if a teacher asks you to share confidential student information without proper authorization?', 'Share it since they work with the student', 'Politely explain confidentiality requirements and proper procedures', 'Ignore the request', 'Share minimal information', 1, 'You must maintain confidentiality even with school staff. Educate colleagues on proper procedures for information sharing while being professional and helpful.')
ON CONFLICT (section_number, question_number) DO NOTHING;

-- Insert quiz questions for Section 2 (IEP Collaboration)
INSERT INTO masterclass_quiz_questions (section_number, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(2, 1, 'What is the best approach when an IEP team member disagrees with your behavioral recommendations?', 'Insist on your expertise as the BCBA', 'Listen to their concerns and find collaborative solutions', 'Withdraw your recommendations', 'Go directly to administration', 1, 'Collaboration requires active listening and respect for all team members. Understanding others'' perspectives leads to better outcomes and maintains positive working relationships.'),
(2, 2, 'How should behavior goals be written in an IEP?', 'Using only technical ABA terminology', 'In clear, measurable terms everyone can understand', 'As vaguely as possible for flexibility', 'Only focusing on problem behaviors', 1, 'IEP goals must be measurable and understandable to all team members, including parents. Use clear language while maintaining behavioral precision.'),
(2, 3, 'When is the best time to start planning for an IEP meeting?', 'The day before the meeting', 'Several weeks in advance with team input', 'During the meeting', 'After reviewing the previous IEP', 1, 'Effective IEP meetings require advance planning, data collection, and input from all team members. This ensures productive discussions and better outcomes for students.')
ON CONFLICT (section_number, question_number) DO NOTHING;

-- Insert quiz questions for Section 3 (Data Collection)
INSERT INTO masterclass_quiz_questions (section_number, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(3, 1, 'What is the most practical data collection method for busy classroom settings?', 'Continuous duration recording', 'Momentary time sampling or interval recording', 'Narrative ABC data only', 'Video recording all day', 1, 'Momentary time sampling and interval recording are practical for school settings because they allow staff to collect data while managing other classroom responsibilities.'),
(3, 2, 'How often should you review data to make instructional decisions?', 'Once per semester', 'Weekly or bi-weekly at minimum', 'Only during IEP meetings', 'Daily without exception', 1, 'Regular data review (weekly or bi-weekly) allows for timely adjustments while being realistic for school schedules. This frequency balances responsiveness with practical constraints.'),
(3, 3, 'What should you do when classroom staff report difficulty collecting data?', 'Tell them it''s required and they must do it', 'Collaborate to simplify the system and provide training', 'Collect all data yourself', 'Reduce data collection requirements to nothing', 1, 'When staff struggle with data collection, it''s an opportunity to simplify systems, provide support, and ensure buy-in. Practical, user-friendly systems get used consistently.')
ON CONFLICT (section_number, question_number) DO NOTHING;

-- Insert quiz questions for Section 4 (Supervision)
INSERT INTO masterclass_quiz_questions (section_number, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(4, 1, 'What is the minimum supervision requirement for RBTs according to BACB standards?', 'Once per month', 'Two contacts per month with one in-person', 'Weekly in-person meetings', 'Quarterly observations', 1, 'BACB requires at least 2 supervisory contacts per month, with at least one being in-person. This ensures adequate oversight while being achievable in school settings.'),
(4, 2, 'How should you address an RBT who is not implementing a behavior plan with fidelity?', 'Immediately report them to administration', 'Provide retraining, modeling, and supportive feedback', 'Remove them from the case', 'Document and ignore until next observation', 1, 'Supervision involves teaching and supporting staff development. Provide immediate feedback, retraining, and modeling to improve implementation fidelity.'),
(4, 3, 'What is the best way to structure supervision time with RBTs in schools?', 'Only observe and critique', 'Combine observation, feedback, training, and collaborative problem-solving', 'Just review data sheets', 'Focus solely on paperwork compliance', 1, 'Effective supervision is multifaceted: observe implementation, provide feedback, train new skills, and collaborate on challenges. This comprehensive approach develops competent, confident staff.')
ON CONFLICT (section_number, question_number) DO NOTHING;

-- Insert default certificate configuration
INSERT INTO masterclass_certificate_config (
  course_title,
  ceu_credits,
  bacb_provider_number,
  certificate_subtitle,
  completion_statement,
  signature_name,
  signature_title,
  organization_name,
  organization_website,
  template_version,
  is_active
) VALUES (
  'School BCBA Mastery Fundamentals',
  1.0,
  'OP-25-11420',
  'Professional Development for School-Based Behavior Analysts',
  'This certificate verifies successful completion of all course requirements including video content and knowledge assessments.',
  'Rob Spain',
  'Founder & Lead Instructor',
  'Behavior School',
  'behaviorschool.com',
  1,
  TRUE
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Helpful Views for Admin Interface
-- ============================================================================

-- View for course overview with question counts
CREATE OR REPLACE VIEW masterclass_admin_course_overview AS
SELECT
  s.id,
  s.section_number,
  s.title,
  s.description,
  s.video_url,
  s.duration,
  s.order_index,
  s.is_active,
  COUNT(q.id) as question_count,
  s.updated_at
FROM masterclass_course_sections s
LEFT JOIN masterclass_quiz_questions q ON s.section_number = q.section_number AND q.is_active = TRUE
GROUP BY s.id, s.section_number, s.title, s.description, s.video_url, s.duration, s.order_index, s.is_active, s.updated_at
ORDER BY s.order_index;

-- ============================================================================
-- End of Admin Schema
-- ============================================================================
