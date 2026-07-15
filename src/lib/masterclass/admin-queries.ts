import { api, getConvexClient } from "@/lib/convex";
import type { Id } from "@/lib/convex";
import type {
  MasterclassCourseSection,
  MasterclassQuizQuestion,
  MasterclassResource,
  MasterclassCertificateConfig,
  CourseSectionFormData,
  QuizQuestionFormData,
  CertificateConfigFormData,
  CourseSectionWithQuestionCount,
} from "./admin-types";

type SectionId = Id<"masterclassCourseSections">;
type QuestionId = Id<"masterclassQuizQuestions">;
type ConfigId = Id<"masterclassCertificateConfigs">;

function asSectionId(id: string | number) {
  return String(id) as SectionId;
}

function asQuestionId(id: string | number) {
  return String(id) as QuestionId;
}

function asConfigId(id: string | number) {
  return String(id) as ConfigId;
}

function withSectionDefaults(section: MasterclassCourseSection): MasterclassCourseSection {
  return {
    ...section,
    questionIds: section.questionIds ?? [],
  };
}

// ============================================================================
// Course Sections
// ============================================================================

export async function getAllSections(): Promise<CourseSectionWithQuestionCount[]> {
  const data = await getConvexClient().query(api.masterclassAdmin.listSections, {});
  return (data ?? []).map(withSectionDefaults);
}

export async function getActiveSections(): Promise<MasterclassCourseSection[]> {
  const data = await getConvexClient().query(api.masterclassAdmin.listActiveSections, {});
  return (data ?? []).map(withSectionDefaults);
}

export async function getSectionById(id: string | number): Promise<MasterclassCourseSection | null> {
  const data = await getConvexClient().query(api.masterclassAdmin.getSection, {
    id: asSectionId(id),
  });
  return data ? withSectionDefaults(data) : null;
}

export async function getSectionByNumber(sectionNumber: number): Promise<MasterclassCourseSection | null> {
  const data = await getConvexClient().query(api.masterclassAdmin.getSectionByNumber, {
    sectionNumber,
  });
  return data ? withSectionDefaults(data) : null;
}

export async function createSection(sectionData: CourseSectionFormData): Promise<MasterclassCourseSection> {
  const data = await getConvexClient().mutation(api.masterclassAdmin.createSection, {
    sectionNumber: sectionData.section_number,
    title: sectionData.title,
    description: sectionData.description,
    videoUrl: sectionData.video_url,
    duration: sectionData.duration,
    orderIndex: sectionData.order_index,
    isActive: sectionData.is_active,
  });
  if (!data) throw new Error("Failed to create section");
  return withSectionDefaults(data);
}

export async function updateSection(
  id: string | number,
  sectionData: Partial<CourseSectionFormData>
): Promise<MasterclassCourseSection> {
  const data = await getConvexClient().mutation(api.masterclassAdmin.updateSection, {
    id: asSectionId(id),
    title: sectionData.title,
    description: sectionData.description,
    videoUrl: sectionData.video_url,
    duration: sectionData.duration,
    orderIndex: sectionData.order_index,
    isActive: sectionData.is_active,
  });
  if (!data) throw new Error("Section not found");
  return withSectionDefaults(data);
}

export async function deleteSection(id: string | number): Promise<void> {
  await getConvexClient().mutation(api.masterclassAdmin.deleteSection, {
    id: asSectionId(id),
  });
}

export async function reorderSections(sectionIds: Array<string | number>): Promise<void> {
  await getConvexClient().mutation(api.masterclassAdmin.reorderSections, {
    sectionIds: sectionIds.map(asSectionId),
  });
}

// ============================================================================
// Quiz Questions
// ============================================================================

export async function getQuestionsBySection(sectionNumber: number): Promise<MasterclassQuizQuestion[]> {
  const data = await getConvexClient().query(api.masterclassAdmin.listQuestionsBySection, {
    sectionNumber,
  });
  return data ?? [];
}

export async function getAllActiveQuestions(): Promise<MasterclassQuizQuestion[]> {
  const data = await getConvexClient().query(api.masterclassAdmin.listAllActiveQuestions, {});
  return data ?? [];
}

export async function getQuestionById(id: string | number): Promise<MasterclassQuizQuestion | null> {
  return getConvexClient().query(api.masterclassAdmin.getQuestion, {
    id: asQuestionId(id),
  });
}

export async function createQuestion(questionData: QuizQuestionFormData): Promise<MasterclassQuizQuestion> {
  const data = await getConvexClient().mutation(api.masterclassAdmin.createQuestion, {
    sectionNumber: questionData.section_number,
    questionNumber: questionData.question_number,
    questionText: questionData.question_text,
    optionA: questionData.option_a,
    optionB: questionData.option_b,
    optionC: questionData.option_c,
    optionD: questionData.option_d,
    correctAnswer: questionData.correct_answer,
    explanation: questionData.explanation,
    isActive: questionData.is_active,
  });
  if (!data) throw new Error("Failed to create question");
  return data;
}

export async function updateQuestion(
  id: string | number,
  questionData: Partial<QuizQuestionFormData>
): Promise<MasterclassQuizQuestion> {
  const data = await getConvexClient().mutation(api.masterclassAdmin.updateQuestion, {
    id: asQuestionId(id),
    questionText: questionData.question_text,
    optionA: questionData.option_a,
    optionB: questionData.option_b,
    optionC: questionData.option_c,
    optionD: questionData.option_d,
    correctAnswer: questionData.correct_answer,
    explanation: questionData.explanation,
    isActive: questionData.is_active,
  });
  if (!data) throw new Error("Question not found");
  return data;
}

export async function deleteQuestion(id: string | number): Promise<void> {
  await getConvexClient().mutation(api.masterclassAdmin.deleteQuestion, {
    id: asQuestionId(id),
  });
}

export async function reorderQuestions(questionIds: Array<string | number>): Promise<void> {
  await getConvexClient().mutation(api.masterclassAdmin.reorderQuestions, {
    questionIds: questionIds.map(asQuestionId),
  });
}

// ============================================================================
// Resources
// ============================================================================

export async function getResourcesBySectionIds(sectionIds: Array<string | number>): Promise<MasterclassResource[]> {
  if (!sectionIds.length) return [];
  const data = await getConvexClient().query(api.masterclassAdmin.listResourcesBySectionIds, {
    sectionIds: sectionIds.map(String),
  });
  return data ?? [];
}

// ============================================================================
// Certificate Configuration
// ============================================================================

export async function getActiveCertificateConfig(): Promise<MasterclassCertificateConfig | null> {
  return getConvexClient().query(api.masterclassAdmin.getActiveCertificateConfig, {});
}

export async function getCertificateConfigById(id: string | number): Promise<MasterclassCertificateConfig | null> {
  return getConvexClient().query(api.masterclassAdmin.getCertificateConfig, {
    id: asConfigId(id),
  });
}

export async function createCertificateConfig(
  configData: CertificateConfigFormData
): Promise<MasterclassCertificateConfig> {
  const data = await getConvexClient().mutation(api.masterclassAdmin.createCertificateConfig, {
    courseTitle: configData.course_title,
    ceuCredits: configData.ceu_credits,
    bacbProviderNumber: configData.bacb_provider_number,
    certificateSubtitle: configData.certificate_subtitle,
    completionStatement: configData.completion_statement,
    signatureName: configData.signature_name,
    signatureTitle: configData.signature_title,
    organizationName: configData.organization_name,
    organizationWebsite: configData.organization_website,
    introductionVideoUrl: configData.introduction_video_url,
  });
  if (!data) throw new Error("Failed to create certificate configuration");
  return data;
}

export async function updateCertificateConfig(
  id: string | number,
  configData: Partial<CertificateConfigFormData>
): Promise<MasterclassCertificateConfig> {
  const data = await getConvexClient().mutation(api.masterclassAdmin.updateCertificateConfig, {
    id: asConfigId(id),
    courseTitle: configData.course_title,
    ceuCredits: configData.ceu_credits,
    bacbProviderNumber: configData.bacb_provider_number,
    certificateSubtitle: configData.certificate_subtitle,
    completionStatement: configData.completion_statement,
    signatureName: configData.signature_name,
    signatureTitle: configData.signature_title,
    organizationName: configData.organization_name,
    organizationWebsite: configData.organization_website,
    introductionVideoUrl: configData.introduction_video_url,
  });
  if (!data) throw new Error("Certificate configuration not found");
  return data;
}
