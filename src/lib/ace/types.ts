// ============================================================================
// ACE Platform - TypeScript Types
// ============================================================================
// Generated from ace-ceu-platform-schema.sql and ace-2026-requirements-migration.sql
// ============================================================================

// ============================================================================
// ENUMS
// ============================================================================

export type AceUserRole =
  | 'participant'
  | 'instructor'
  | 'co_presenter'
  | 'ace_coordinator'
  | 'admin';

export type AceProviderType = 'individual' | 'organization';

export type AceEventCategory = 'learning' | 'ethics' | 'supervision' | 'teaching';

export type AceEventModality = 'in_person' | 'synchronous' | 'asynchronous';

export type AceEventStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'archived';

export type AceVerificationMethod =
  | 'attendance_log'
  | 'quiz_completion'
  | 'verification_code'
  | 'time_on_task'
  | 'check_in_prompts';

export type AceComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'resolved'
  | 'escalated_to_bacb';

export type AceCertificateStatus = 'pending' | 'issued' | 'revoked';

// 2026 New Enums
export type AceEventType = 'ce' | 'pd';

export type AceEventSubtype = 'standard' | 'journal_club' | 'podcast';

export type AceInstructorQualificationPath =
  | 'active_bcba'
  | 'doctorate_behavior_analysis'
  | 'doctorate_with_coursework'
  | 'doctorate_with_mentorship'
  | 'doctorate_with_publications'
  | 'doctorate_with_postdoc_hours';

export type AceExpertiseBasis =
  | 'five_years_practice'
  | 'three_years_teaching'
  | 'published_research';

// ============================================================================
// DATABASE TYPES
// ============================================================================

export interface AceUser {
  id: string;
  supabase_user_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  bacb_id?: string;
  role: AceUserRole;
  is_active: boolean;
  phone?: string;
  organization?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface AceProvider {
  id: string;
  provider_name: string;
  provider_type: AceProviderType;
  bacb_provider_number?: string;
  
  // Coordinator
  coordinator_id: string;
  coordinator_years_certified: number;
  
  // 2026: Coordinator certification tracking
  coordinator_certification_date?: string;
  coordinator_certification_expires?: string;
  coordinator_certification_verified?: boolean;
  
  // Contact
  primary_email: string;
  primary_phone?: string;
  website?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  
  // Application & Renewal
  application_date?: string;
  approval_date?: string;
  expiration_date?: string;
  is_active: boolean;
  
  // Fees
  application_fee_paid: boolean;
  application_fee_amount?: number;
  application_fee_paid_date?: string;
  renewal_fee_paid: boolean;
  last_renewal_date?: string;
  next_renewal_date?: string;
  renewal_reminder_sent_45_days?: boolean;
  renewal_reminder_sent_15_days?: boolean;
  renewal_reminder_sent_5_days?: boolean;
  
  // 2026: Legal entity verification (organizations)
  ein?: string;
  incorporation_doc_url?: string;
  legal_entity_verified?: boolean;
  legal_entity_verified_at?: string;
  legal_entity_verified_by?: string;
  
  // 2026: Leadership attestation
  leadership_attestation_url?: string;
  leadership_attestation_date?: string;
  leadership_name?: string;
  leadership_title?: string;
  
  // 2026: Renewal grace period
  grace_period_end_date?: string;
  reinstatement_date?: string;
  late_fee_paid?: boolean;
  late_fee_amount?: number;
  late_fee_paid_date?: string;
  
  // 2026: Event publishing control
  can_publish_events?: boolean;
  can_issue_certificates?: boolean;
  lapse_start_date?: string;
  lapse_end_date?: string;
  
  created_at: string;
  updated_at: string;
}

export interface AceInstructorQualification {
  id: string;
  user_id: string;
  provider_id: string;
  
  // Qualification Type (base)
  is_bcba: boolean;
  is_bcba_d: boolean;
  is_phd_aba: boolean;
  is_doctoral_student_ms_complete: boolean;
  
  // Certification Details
  certification_number?: string;
  certification_date?: string;
  certification_expiration?: string;
  
  // Credentials Documentation
  cv_url?: string;
  transcript_url?: string;
  certification_proof_url?: string;
  
  // 2026: New qualification path
  qualification_path?: AceInstructorQualificationPath;
  
  // 2026: Doctorate information
  doctorate_type?: string;
  doctorate_field?: string;
  institution_name?: string;
  graduation_year?: number;
  qualifying_coursework_doc_url?: string;
  
  // 2026: Alternative qualifying experience
  mentorship_documentation_url?: string;
  mentorship_years?: number;
  publications_documentation_url?: string;
  publications_count?: number;
  postdoc_hours_documentation_url?: string;
  postdoc_hours?: number;
  
  // 2026: Subject matter expertise
  expertise_basis?: AceExpertiseBasis;
  years_experience_in_subject?: number;
  years_teaching_subject?: number;
  expertise_documentation_urls?: string[];
  
  // Verification
  verified_by?: string;
  verified_at?: string;
  is_approved: boolean;
  qualification_review_notes?: string;
  expertise_review_notes?: string;
  
  created_at: string;
  updated_at: string;
}

export interface AceEvent {
  id: string;
  provider_id: string;
  
  // Basic Info
  title: string;
  description?: string;
  
  // CE Details
  total_ceus: number;
  ce_category: AceEventCategory;
  modality: AceEventModality;
  
  // 2026: Event type (CE vs PD)
  event_type?: AceEventType;
  event_subtype?: AceEventSubtype;
  
  // Dates
  start_date: string;
  end_date?: string;
  registration_deadline?: string;
  
  // Capacity
  max_participants?: number;
  current_participants?: number;
  
  // Location/Access
  location?: string;
  online_meeting_url?: string;
  
  // Status
  status: AceEventStatus;
  
  // 2026: RBT alignment (for PD events)
  rbt_alignment_checklist?: Record<string, unknown>;
  aligns_with_rbt_2026_outline?: boolean;
  aligns_with_ethics_code_2_0?: boolean;
  
  // 2026: Marketing & transparency
  instructor_qualifications_summary?: string;
  instructor_affiliations?: string;
  conflicts_of_interest?: string;
  publication_date?: string;
  learning_objectives?: string[];
  
  // 2026: Minimum questions for async
  minimum_questions_required?: number;
  actual_questions_count?: number;
  
  // 2026: Journal club / podcast limits
  content_item_count?: number;
  max_ceu_per_item?: number;
  
  created_at: string;
  updated_at: string;
}

export interface AceCertificate {
  id: string;
  event_id: string;
  participant_id: string;
  
  // Certificate Details
  certificate_number: string;
  participant_name: string;
  participant_email: string;
  participant_bacb_id?: string;
  
  // Event Details
  event_title: string;
  event_date: string;
  instructor_name: string;
  
  // CE Details
  total_ceus: number;
  ce_category: AceEventCategory;
  
  // 2026: Instructor per subcategory
  instructor_subcategories?: Record<string, {instructor_name: string; ceus: number}>;
  
  // 2026: Certificate issuance timeline
  must_be_issued_by?: string;
  days_until_due?: number;
  
  // 2026: Feedback requirement
  feedback_completed?: boolean;
  feedback_completed_at?: string;
  
  // Status
  status: AceCertificateStatus;
  
  // Files
  certificate_url?: string;
  
  // Metadata
  issued_at?: string;
  revoked_at?: string;
  revoked_by?: string;
  revocation_reason?: string;
  
  created_at: string;
}

export interface AceAttendanceRecord {
  id: string;
  event_id: string;
  participant_id: string;
  session_id?: string;
  
  // Verification
  verification_method: AceVerificationMethod;
  verified: boolean;
  verified_at?: string;
  verified_by?: string;
  
  // 2026: Timestamped sign-in/out
  sign_in_timestamp?: string;
  sign_out_timestamp?: string;
  ip_address?: string;
  user_agent?: string;
  
  // 2026: Engagement checks
  engagement_checks_completed?: number;
  engagement_checks_required?: number;
  engagement_check_timestamps?: string[];
  
  // 2026: Quiz completion for async
  quiz_questions_answered?: number;
  quiz_questions_required?: number;
  quiz_attempts?: number;
  
  created_at: string;
  updated_at: string;
}

export interface AceFeedbackResponse {
  id: string;
  event_id: string;
  participant_id: string;
  
  // Feedback
  rating?: number;
  comments?: string;
  
  // 2026: Coordinator review
  coordinator_reviewed_at?: string;
  coordinator_review_due_date?: string;
  coordinator_notes?: string;
  coordinator_action_taken?: string;
  days_until_review_due?: number;
  
  submitted_at: string;
}

export interface AceComplaint {
  id: string;
  provider_id: string;
  event_id?: string;
  
  // Submitter
  submitter_name: string;
  submitter_email: string;
  submitter_bacb_id?: string;
  submitter_phone?: string;
  
  // Complaint
  complaint_text: string;
  
  // 2026: NAV notification
  nav_escalation_notified?: boolean;
  nav_escalation_notified_at?: string;
  nav_notification_method?: string;
  
  // 2026: Response timeline
  response_due_date?: string;
  days_until_response_due?: number;
  is_overdue?: boolean;
  
  // Resolution
  status: AceComplaintStatus;
  resolution_notes?: string;
  resolved_at?: string;
  resolved_by?: string;
  
  submitted_at: string;
}

// ============================================================================
// 2026 NEW TABLES
// ============================================================================

export interface AceLeadershipAttestation {
  id: string;
  provider_id: string;
  
  // Attestation details
  attested_by_name: string;
  attested_by_title: string;
  attested_by_email: string;
  
  // What they're attesting to
  attests_legal_entity: boolean;
  attests_coordinator_appointment: boolean;
  attests_compliance_commitment: boolean;
  
  // Signatures & Documents
  signature_url?: string;
  attestation_document_url?: string;
  ip_address?: string;
  
  // Metadata
  attested_at: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

export interface AceComplianceReport {
  id: string;
  provider_id: string;
  
  // Report metadata
  report_type: string;
  report_period_start: string;
  report_period_end: string;
  
  // Compliance score
  compliance_score?: number;
  total_checks?: number;
  passed_checks?: number;
  failed_checks?: number;
  
  // Report data
  attendance_data?: Record<string, unknown>;
  instructor_qualifications_data?: Record<string, unknown>;
  feedback_data?: Record<string, unknown>;
  certificate_data?: Record<string, unknown>;
  complaint_data?: Record<string, unknown>;
  
  // Findings
  findings?: string[];
  recommendations?: string[];
  action_items?: string[];
  
  // Generated by
  generated_by?: string;
  generated_at: string;
  
  // Export
  report_url?: string;
  exported_at?: string;
  
  created_at: string;
}

export interface AceRenewalHistory {
  id: string;
  provider_id: string;
  
  // Renewal details
  renewal_date: string;
  previous_expiration_date: string;
  new_expiration_date: string;
  
  // Timing
  renewed_within_45_day_window?: boolean;
  renewed_during_grace_period?: boolean;
  days_past_expiration?: number;
  
  // Fees
  renewal_fee_amount: number;
  late_fee_amount?: number;
  total_amount_paid: number;
  payment_date?: string;
  payment_method?: string;
  payment_reference?: string;
  
  // Metadata
  renewed_by?: string;
  notes?: string;
  created_at: string;
}

export interface AceEngagementCheck {
  id: string;
  event_id: string;
  participant_id: string;
  
  // Check details
  check_number: number;
  prompt_text: string;
  prompt_shown_at: string;
  
  // Response
  response_text?: string;
  responded_at?: string;
  response_time_seconds?: number;
  
  // Verification
  is_correct?: boolean;
  is_timely?: boolean;
  
  created_at: string;
}

export interface AceRbtAlignmentCriteria {
  id: string;
  event_id: string;
  
  // RBT 2026 40-Hour Training Outline alignment
  training_outline_section?: string;
  training_outline_competency?: string;
  alignment_notes?: string;
  
  // Ethics Code 2.0 alignment
  ethics_code_section?: string;
  ethics_code_reference?: string;
  ethics_alignment_notes?: string;
  
  // Verification
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// VIEW TYPES
// ============================================================================

export interface AceComplianceDashboard {
  provider_id: string;
  provider_name: string;
  provider_type: AceProviderType;
  is_active: boolean;
  
  // Coordinator certification status
  coordinator_certification_expires?: string;
  coordinator_cert_expiring_soon?: boolean;
  
  // Legal entity compliance
  legal_entity_compliant?: boolean;
  
  // Renewal status
  expiration_date?: string;
  grace_period_end_date?: string;
  can_publish_events?: boolean;
  can_issue_certificates?: boolean;
  provider_status: 'Active' | 'Grace Period' | 'Lapsed';
  
  // Compliance metrics
  overdue_certificates?: number;
  overdue_feedback_reviews?: number;
  overdue_complaint_responses?: number;
  
  // Overall compliance score (0-100)
  compliance_score?: number;
}

export interface AceEventRequiringAttention {
  event_id: string;
  title: string;
  provider_id: string;
  provider_name: string;
  start_date: string;
  status: AceEventStatus;
  
  // Issues
  question_issue?: string;
  ceu_limit_issue?: string;
  objectives_issue?: string;
  rbt_alignment_issue?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CreateProviderForm {
  provider_name: string;
  provider_type: AceProviderType;
  coordinator_id: string;
  coordinator_years_certified: number;
  coordinator_certification_date?: string;
  coordinator_certification_expires?: string;
  primary_email: string;
  primary_phone?: string;
  website?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  
  // For organizations
  ein?: string;
  incorporation_doc?: File;
  leadership_name?: string;
  leadership_title?: string;
}

export interface CreateEventForm {
  provider_id: string;
  title: string;
  description?: string;
  total_ceus: number;
  ce_category: AceEventCategory;
  modality: AceEventModality;
  event_type: AceEventType;
  event_subtype?: AceEventSubtype;
  start_date: string;
  end_date?: string;
  registration_deadline?: string;
  max_participants?: number;
  location?: string;
  online_meeting_url?: string;
  learning_objectives: string[];
  instructor_affiliations?: string;
  conflicts_of_interest?: string;
}

export interface UpdateProviderForm extends Partial<CreateProviderForm> {
  id: string;
}

export interface UpdateEventForm extends Partial<CreateEventForm> {
  id: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ProviderStatus = 'Active' | 'Grace Period' | 'Lapsed' | 'Pending Approval';

export type ComplianceLevel = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';

export interface CoordinatorCertificationAlert {
  provider_id: string;
  provider_name: string;
  coordinator_name: string;
  expires_at: string;
  days_until_expiration: number;
  severity: 'critical' | 'warning' | 'info';
}
