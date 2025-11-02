/**
 * TypeScript Types for Masterclass System
 *
 * These types correspond to the database schema in sql/masterclass-schema.sql
 */

// ============================================================================
// DATABASE TYPES
// ============================================================================

export interface MasterclassEnrollment {
  id: string;
  email: string;
  name: string;
  bacb_cert_number: string;
  created_at: string;
  completed_at: string | null;
  last_accessed_at: string;
  certificate_issued: boolean;
  certificate_id: string | null;
  certificate_generated_at: string | null;
  certificate_emailed: boolean;
  certificate_emailed_at: string | null;
  ip_address: string | null;
  user_agent: string | null;
  referral_source: string | null;
}

export interface MasterclassProgress {
  id: string;
  enrollment_id: string;
  section_number: number; // 1-4
  video_completed: boolean;
  video_watched_percentage: number; // 0-100
  video_watch_time_seconds: number;
  video_completed_at: string | null;
  quiz_attempts: number;
  quiz_score: number | null;
  quiz_total: number | null;
  quiz_passed: boolean;
  quiz_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MasterclassQuizResponse {
  id: string;
  enrollment_id: string;
  section_number: number; // 1-4
  attempt_number: number;
  question_number: number;
  question_id: string;
  selected_answer: number;
  correct_answer: number;
  is_correct: boolean;
  time_spent_seconds: number | null;
  created_at: string;
}

export interface MasterclassCertificate {
  id: string;
  certificate_id: string;
  enrollment_id: string;
  recipient_name: string;
  recipient_email: string;
  bacb_cert_number: string;
  course_title: string;
  ceu_credits: number;
  completion_date: string;
  pdf_url: string | null;
  pdf_generated: boolean;
  created_at: string;
  verification_count: number;
  last_verified_at: string | null;
}

export interface MasterclassAnalyticsEvent {
  id: string;
  enrollment_id: string | null;
  event_type: string;
  event_data: Record<string, unknown> | null;
  section_number: number | null;
  session_id: string | null;
  created_at: string;
}

// ============================================================================
// APPLICATION TYPES
// ============================================================================

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-based)
  explanation?: string; // Show after submission
}

export interface CourseSection {
  id: number; // 1-4
  title: string;
  description: string;
  videoUrl: string;
  duration: string; // e.g., "15 min"
  quiz: QuizQuestion[];
  resources?: CourseResource[];
}

export interface CourseResource {
  id: number;
  name: string;
  url: string;
  fileType: string;
}

export interface MasterclassCourse {
  title: string;
  description: string;
  duration: string; // e.g., "1 hour"
  ceuCredits: number;
  bacbProvider: string;
  sections: CourseSection[];
}

export interface QuizSubmission {
  sectionNumber: number;
  answers: number[]; // Array of selected answer indices
  attemptNumber: number;
}

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  results: {
    questionId: string;
    questionNumber: number;
    selected: number;
    correct: number;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

export interface EnrollmentFormData {
  email: string;
  name: string;
  bacbCertNumber: string;
}

export interface CertificateData {
  certificateId: string;
  recipientName: string;
  recipientEmail: string;
  bacbCertNumber: string;
  courseTitle: string;
  ceuCredits: number;
  completionDate: string;
  bacbProvider: string;
}

// ============================================================================
// STATE MANAGEMENT TYPES
// ============================================================================

export interface MasterclassState {
  // Enrollment info
  enrollment: {
    id: string;
    email: string;
    name: string;
    bacbNumber: string;
  } | null;

  // Course progress
  sections: {
    id: number;
    title: string;
    videoUrl: string;
    videoCompleted: boolean;
    quizAttempts: number;
    quizPassed: boolean;
    quizScore: number | null;
    quizTotal: number | null;
  }[];

  // Navigation
  currentSection: number; // 1-4
  overallProgress: number; // 0-100
  canGenerateCertificate: boolean;

  // Loading states
  isLoading: boolean;
  isSaving: boolean;
}

export interface MasterclassActions {
  // Enrollment
  enroll: (data: EnrollmentFormData) => Promise<void>;
  loadEnrollment: (email: string) => Promise<void>;

  // Video tracking
  markVideoComplete: (sectionNumber: number) => Promise<void>;
  updateVideoProgress: (sectionNumber: number, percentage: number) => Promise<void>;

  // Quiz handling
  submitQuiz: (submission: QuizSubmission) => Promise<QuizResult>;

  // Navigation
  goToSection: (sectionNumber: number) => void;

  // Certificate
  generateCertificate: () => Promise<CertificateData>;
  emailCertificate: () => Promise<void>;
}

export type MasterclassContextValue = MasterclassState & MasterclassActions;

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EnrollmentResponse {
  enrollmentId: string;
  email: string;
  name: string;
}

export interface ProgressResponse {
  sections: MasterclassProgress[];
  overallProgress: number;
  canGenerateCertificate: boolean;
}

export interface CertificateResponse {
  certificateId: string;
  pdfUrl: string;
  emailSent: boolean;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export type AnalyticsEventType =
  | 'page_view'
  | 'enrollment_started'
  | 'enrollment_completed'
  | 'section_started'
  | 'video_started'
  | 'video_paused'
  | 'video_resumed'
  | 'video_completed'
  | 'quiz_started'
  | 'quiz_submitted'
  | 'quiz_passed'
  | 'quiz_failed'
  | 'quiz_retried'
  | 'course_completed'
  | 'certificate_generated'
  | 'certificate_downloaded'
  | 'certificate_emailed';

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  enrollmentId?: string;
  sectionNumber?: number;
  eventData?: Record<string, unknown>;
  sessionId?: string;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export type SectionNumber = 1 | 2 | 3 | 4;

export interface LocalStorageProgress {
  enrollmentId: string;
  email: string;
  currentSection: number;
  sectionsCompleted: number[];
  quizzesPassed: number[];
  lastUpdated: string;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
}
