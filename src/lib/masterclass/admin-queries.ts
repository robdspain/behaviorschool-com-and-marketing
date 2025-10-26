/**
 * Supabase query helpers for Masterclass Admin operations
 */

import { createClient } from '@/lib/supabase-server';
import type {
  MasterclassCourseSection,
  MasterclassQuizQuestion,
  MasterclassCertificateConfig,
  CourseSectionFormData,
  QuizQuestionFormData,
  CertificateConfigFormData,
  CourseSectionWithQuestionCount,
} from './admin-types';



// ============================================================================
// Course Sections
// ============================================================================

/**
 * Get all course sections with question counts
 */
export async function getAllSections(): Promise<CourseSectionWithQuestionCount[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('masterclass_admin_course_overview')
    .select('*')
    .order('order_index');

  if (error) throw new Error(`Failed to fetch sections: ${error.message}`);
  return data || [];
}

/**
 * Get active course sections for public display
 */
export async function getActiveSections(): Promise<MasterclassCourseSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('masterclass_course_sections')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error) throw new Error(`Failed to fetch active sections: ${error.message}`);
  return data || [];
}

/**
 * Get section by ID
 */
export async function getSectionById(id: number): Promise<MasterclassCourseSection | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('masterclass_course_sections')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch section: ${error.message}`);
  }
  return data;
}

/**
 * Get section by section number
 */
export async function getSectionByNumber(sectionNumber: number): Promise<MasterclassCourseSection | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('masterclass_course_sections')
    .select('*')
    .eq('section_number', sectionNumber)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch section: ${error.message}`);
  }
  return data;
}

/**
 * Create new course section
 */
export async function createSection(sectionData: CourseSectionFormData): Promise<MasterclassCourseSection> {
  const supabase = await createClient();
  // Get next section number if not provided
  if (!sectionData.section_number) {
    const { data: maxSection } = await supabase
      .from('masterclass_course_sections')
      .select('section_number')
      .order('section_number', { ascending: false })
      .limit(1)
      .single();

    sectionData.section_number = (maxSection?.section_number || 0) + 1;
  }

  // Get next order index if not provided
  if (!sectionData.order_index) {
    const { data: maxOrder } = await supabase
      .from('masterclass_course_sections')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    sectionData.order_index = (maxOrder?.order_index || 0) + 1;
  }

  const { data, error } = await supabase
    .from('masterclass_course_sections')
    .insert({
      section_number: sectionData.section_number,
      title: sectionData.title,
      description: sectionData.description,
      video_url: sectionData.video_url,
      duration: sectionData.duration,
      order_index: sectionData.order_index,
      is_active: sectionData.is_active ?? true,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create section: ${error.message}`);
  return data;
}

/**
 * Update existing course section
 */
export async function updateSection(
  id: number,
  sectionData: Partial<CourseSectionFormData>
): Promise<MasterclassCourseSection> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('masterclass_course_sections')
    .update({
      title: sectionData.title,
      description: sectionData.description,
      video_url: sectionData.video_url,
      duration: sectionData.duration,
      order_index: sectionData.order_index,
      is_active: sectionData.is_active,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update section: ${error.message}`);
  return data;
}

/**
 * Delete course section (soft delete by setting is_active = false)
 */
export async function deleteSection(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('masterclass_course_sections')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw new Error(`Failed to delete section: ${error.message}`);
}

/**
 * Reorder sections
 */
export async function reorderSections(sectionIds: number[]): Promise<void> {
  const supabase = await createClient();
  const updates = sectionIds.map((id, index) => ({
    id,
    order_index: index + 1,
  }));

  for (const update of updates) {
    await supabase
      .from('masterclass_course_sections')
      .update({ order_index: update.order_index })
      .eq('id', update.id);
  }
}

// ============================================================================
// Quiz Questions
// ============================================================================

/**
 * Get all questions for a section
 */
export async function getQuestionsBySection(sectionNumber: number): Promise<MasterclassQuizQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('masterclass_quiz_questions')
    .select('*')
    .eq('section_number', sectionNumber)
    .eq('is_active', true)
    .order('question_number');

  if (error) throw new Error(`Failed to fetch questions: ${error.message}`);
  return data || [];
}

/**
 * Get all active questions (for course display)
 */
export async function getAllActiveQuestions(): Promise<MasterclassQuizQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('masterclass_quiz_questions')
    .select('*')
    .eq('is_active', true)
    .order('section_number, question_number');

  if (error) throw new Error(`Failed to fetch questions: ${error.message}`);
  return data || [];
}

/**
 * Get question by ID
 */
export async function getQuestionById(id: number): Promise<MasterclassQuizQuestion | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('masterclass_quiz_questions')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch question: ${error.message}`);
  }
  return data;
}

/**
 * Create new quiz question
 */
export async function createQuestion(questionData: QuizQuestionFormData): Promise<MasterclassQuizQuestion> {
  const supabase = await createClient();
  // Get next question number if not provided
  if (!questionData.question_number) {
    const { data: maxQuestion } = await supabase
      .from('masterclass_quiz_questions')
      .select('question_number')
      .eq('section_number', questionData.section_number)
      .order('question_number', { ascending: false })
      .limit(1)
      .single();

    questionData.question_number = (maxQuestion?.question_number || 0) + 1;
  }

  const { data, error } = await supabase
    .from('masterclass_quiz_questions')
    .insert({
      section_number: questionData.section_number,
      question_number: questionData.question_number,
      question_text: questionData.question_text,
      option_a: questionData.option_a,
      option_b: questionData.option_b,
      option_c: questionData.option_c,
      option_d: questionData.option_d,
      correct_answer: questionData.correct_answer,
      explanation: questionData.explanation || null,
      is_active: questionData.is_active ?? true,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create question: ${error.message}`);
  return data;
}

/**
 * Update existing quiz question
 */
export async function updateQuestion(
  id: number,
  questionData: Partial<QuizQuestionFormData>
): Promise<MasterclassQuizQuestion> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('masterclass_quiz_questions')
    .update({
      question_text: questionData.question_text,
      option_a: questionData.option_a,
      option_b: questionData.option_b,
      option_c: questionData.option_c,
      option_d: questionData.option_d,
      correct_answer: questionData.correct_answer,
      explanation: questionData.explanation,
      is_active: questionData.is_active,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update question: ${error.message}`);
  return data;
}

/**
 * Delete quiz question (soft delete)
 */
export async function deleteQuestion(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('masterclass_quiz_questions')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw new Error(`Failed to delete question: ${error.message}`);
}

/**
 * Reorder questions within a section
 */
export async function reorderQuestions(questionIds: number[]): Promise<void> {
  const supabase = await createClient();
  const updates = questionIds.map((id, index) => ({
    id,
    question_number: index + 1,
  }));

  for (const update of updates) {
    await supabase
      .from('masterclass_quiz_questions')
      .update({ question_number: update.question_number })
      .eq('id', update.id);
  }
}

// ============================================================================
// Certificate Configuration
// ============================================================================

/**
 * Get active certificate configuration
 */
export async function getActiveCertificateConfig(): Promise<MasterclassCertificateConfig | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('masterclass_certificate_config')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch certificate config: ${error.message}`);
  }
  return data;
}

/**
 * Get certificate configuration by ID
 */
export async function getCertificateConfigById(id: number): Promise<MasterclassCertificateConfig | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('masterclass_certificate_config')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch certificate config: ${error.message}`);
  }
  return data;
}

/**
 * Create new certificate configuration
 */
export async function createCertificateConfig(
  configData: CertificateConfigFormData
): Promise<MasterclassCertificateConfig> {
  const supabase = await createClient();
  // Deactivate all existing configs
  await supabase
    .from('masterclass_certificate_config')
    .update({ is_active: false })
    .eq('is_active', true);

  const { data, error } = await supabase
    .from('masterclass_certificate_config')
    .insert({
      course_title: configData.course_title,
      ceu_credits: configData.ceu_credits,
      bacb_provider_number: configData.bacb_provider_number,
      certificate_subtitle: configData.certificate_subtitle || null,
      completion_statement: configData.completion_statement,
      signature_name: configData.signature_name || null,
      signature_title: configData.signature_title || null,
      organization_name: configData.organization_name,
      organization_website: configData.organization_website,
      template_version: 1,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create certificate config: ${error.message}`);
  return data;
}

/**
 * Update certificate configuration
 */
export async function updateCertificateConfig(
  id: number,
  configData: Partial<CertificateConfigFormData>
): Promise<MasterclassCertificateConfig> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('masterclass_certificate_config')
    .update({
      course_title: configData.course_title,
      ceu_credits: configData.ceu_credits,
      bacb_provider_number: configData.bacb_provider_number,
      certificate_subtitle: configData.certificate_subtitle,
      completion_statement: configData.completion_statement,
      signature_name: configData.signature_name,
      signature_title: configData.signature_title,
      organization_name: configData.organization_name,
      organization_website: configData.organization_website,
      introduction_video_url: configData.introduction_video_url,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update certificate config: ${error.message}`);
  return data;
}
