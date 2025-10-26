/**
 * TypeScript types for Masterclass Admin Interface
 */

// ============================================================================
// Database Table Types
// ============================================================================

export interface MasterclassCourseSection {
  id: number;
  section_number: number;
  title: string;
  description: string;
  video_url: string;
  duration: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MasterclassQuizQuestion {
  id: number;
  section_number: number;
  question_number: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: number; // 0-3
  explanation: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MasterclassCertificateConfig {
  id: number;
  course_title: string;
  ceu_credits: number;
  bacb_provider_number: string;
  certificate_subtitle: string | null;
  completion_statement: string;
  signature_name: string | null;
  signature_title: string | null;
  organization_name: string;
  organization_website: string;
  introduction_video_url: string | null;
  template_version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Form Input Types
// ============================================================================

export interface CourseSectionFormData {
  section_number?: number;
  title: string;
  description: string;
  video_url: string;
  duration: string;
  order_index?: number;
  is_active?: boolean;
}

export interface QuizQuestionFormData {
  section_number: number;
  question_number?: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: number;
  explanation?: string;
  is_active?: boolean;
}

export interface CertificateConfigFormData {
  course_title: string;
  ceu_credits: number;
  bacb_provider_number: string;
  certificate_subtitle?: string;
  completion_statement: string;
  signature_name?: string;
  signature_title?: string;
  organization_name: string;
  organization_website: string;
  introduction_video_url?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface AdminApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CourseSectionWithQuestionCount extends MasterclassCourseSection {
  question_count: number;
}

export interface QuizQuestionWithSection extends MasterclassQuizQuestion {
  section_title?: string;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface SectionEditorState {
  mode: 'create' | 'edit';
  section: MasterclassCourseSection | null;
  isOpen: boolean;
}

export interface QuestionEditorState {
  mode: 'create' | 'edit';
  question: MasterclassQuizQuestion | null;
  sectionNumber: number | null;
  isOpen: boolean;
}

export interface CertificateEditorState {
  config: MasterclassCertificateConfig | null;
  isEditing: boolean;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ============================================================================
// Helper function types for converting between formats
// ============================================================================

/**
 * Convert database quiz question to QuizQuestion type used in course
 */
export function dbQuestionToQuizQuestion(dbQuestion: MasterclassQuizQuestion): {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
} {
  return {
    id: `q${dbQuestion.section_number}-${dbQuestion.question_number}`,
    question: dbQuestion.question_text,
    options: [
      dbQuestion.option_a,
      dbQuestion.option_b,
      dbQuestion.option_c,
      dbQuestion.option_d,
    ],
    correctAnswer: dbQuestion.correct_answer,
    explanation: dbQuestion.explanation || undefined,
  };
}

/**
 * Convert database section to CourseSection type used in course
 */
export function dbSectionToCourseSection(
  dbSection: MasterclassCourseSection,
  questions: MasterclassQuizQuestion[]
): {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  quiz: ReturnType<typeof dbQuestionToQuizQuestion>[];
} {
  const sectionQuestions = questions
    .filter(q => q.section_number === dbSection.section_number)
    .sort((a, b) => a.question_number - b.question_number)
    .map(dbQuestionToQuizQuestion);

  return {
    id: dbSection.section_number,
    title: dbSection.title,
    description: dbSection.description,
    videoUrl: dbSection.video_url,
    duration: dbSection.duration,
    quiz: sectionQuestions,
  };
}
