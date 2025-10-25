-- ============================================================================
-- Masterclass Feedback and Evaluation System
-- ============================================================================

-- Feedback responses table
CREATE TABLE IF NOT EXISTS masterclass_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES masterclass_enrollments(id) ON DELETE CASCADE,

  -- Event Information
  participant_email TEXT NOT NULL,
  participant_name TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Overall Ratings (1-5 scale)
  overall_satisfaction INTEGER CHECK (overall_satisfaction BETWEEN 1 AND 5),
  content_quality INTEGER CHECK (content_quality BETWEEN 1 AND 5),
  instructor_effectiveness INTEGER CHECK (instructor_effectiveness BETWEEN 1 AND 5),
  relevance_to_practice INTEGER CHECK (relevance_to_practice BETWEEN 1 AND 5),
  would_recommend INTEGER CHECK (would_recommend BETWEEN 1 AND 5),

  -- Specific Section Ratings (1-5 scale)
  section_1_rating INTEGER CHECK (section_1_rating BETWEEN 1 AND 5),
  section_2_rating INTEGER CHECK (section_2_rating BETWEEN 1 AND 5),
  section_3_rating INTEGER CHECK (section_3_rating BETWEEN 1 AND 5),
  section_4_rating INTEGER CHECK (section_4_rating BETWEEN 1 AND 5),

  -- Open-Ended Responses
  most_valuable_learning TEXT,
  suggestions_for_improvement TEXT,
  topics_for_future_courses TEXT,
  additional_comments TEXT,

  -- Learning Objectives Assessment
  learned_ethics_concepts BOOLEAN DEFAULT FALSE,
  learned_teacher_collaboration BOOLEAN DEFAULT FALSE,
  learned_data_systems BOOLEAN DEFAULT FALSE,
  learned_crisis_management BOOLEAN DEFAULT FALSE,

  -- Application to Practice
  will_apply_immediately BOOLEAN DEFAULT FALSE,
  will_apply_within_month BOOLEAN DEFAULT FALSE,
  will_share_with_team BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Ensure one feedback per enrollment
  CONSTRAINT unique_enrollment_feedback UNIQUE(enrollment_id)
);

-- Indexes for performance
CREATE INDEX idx_masterclass_feedback_enrollment ON masterclass_feedback(enrollment_id);
CREATE INDEX idx_masterclass_feedback_submitted ON masterclass_feedback(submitted_at);
CREATE INDEX idx_masterclass_feedback_email ON masterclass_feedback(participant_email);

-- Enable Row Level Security
ALTER TABLE masterclass_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own feedback
CREATE POLICY "Users can view own feedback" ON masterclass_feedback
  FOR SELECT
  USING (auth.email() = participant_email);

-- Policy: Users can insert their own feedback
CREATE POLICY "Users can insert own feedback" ON masterclass_feedback
  FOR INSERT
  WITH CHECK (auth.email() = participant_email);

-- Policy: Admins can view all feedback
CREATE POLICY "Admins can view all feedback" ON masterclass_feedback
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.email()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_masterclass_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_masterclass_feedback_updated_at
  BEFORE UPDATE ON masterclass_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_masterclass_feedback_updated_at();

-- View for feedback statistics (admin only)
CREATE OR REPLACE VIEW masterclass_feedback_stats AS
SELECT
  COUNT(*) as total_responses,
  ROUND(AVG(overall_satisfaction), 2) as avg_overall_satisfaction,
  ROUND(AVG(content_quality), 2) as avg_content_quality,
  ROUND(AVG(instructor_effectiveness), 2) as avg_instructor_effectiveness,
  ROUND(AVG(relevance_to_practice), 2) as avg_relevance_to_practice,
  ROUND(AVG(would_recommend), 2) as avg_would_recommend,
  ROUND(AVG(section_1_rating), 2) as avg_section_1_rating,
  ROUND(AVG(section_2_rating), 2) as avg_section_2_rating,
  ROUND(AVG(section_3_rating), 2) as avg_section_3_rating,
  ROUND(AVG(section_4_rating), 2) as avg_section_4_rating,
  COUNT(*) FILTER (WHERE would_recommend >= 4) as recommend_count,
  COUNT(*) FILTER (WHERE will_apply_immediately = TRUE) as will_apply_immediately_count,
  COUNT(*) FILTER (WHERE learned_ethics_concepts = TRUE) as learned_ethics_count,
  COUNT(*) FILTER (WHERE learned_teacher_collaboration = TRUE) as learned_collaboration_count,
  COUNT(*) FILTER (WHERE learned_data_systems = TRUE) as learned_data_count,
  COUNT(*) FILTER (WHERE learned_crisis_management = TRUE) as learned_crisis_count
FROM masterclass_feedback;

COMMENT ON TABLE masterclass_feedback IS 'Stores participant feedback and evaluation data for the masterclass';
COMMENT ON VIEW masterclass_feedback_stats IS 'Aggregated statistics for masterclass feedback (admin only)';
