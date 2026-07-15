import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ============================================================================
// ACE CEU Platform Schema
// ============================================================================
// Converted from SQL to Convex for the ACE continuing education platform
// ============================================================================

export default defineSchema({
  auditLogs: defineTable({
    timestamp: v.number(),
    category: v.union(
      v.literal("auth"),
      v.literal("student_data"),
      v.literal("admin_action")
    ),
    actionType: v.string(),
    resource: v.string(),
    status: v.union(v.literal("success"), v.literal("failure")),
    actorUserId: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
    resourceId: v.optional(v.string()),
    method: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    metadata: v.optional(v.any()),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_category", ["category"])
    .index("by_actor_user_id", ["actorUserId"]),

  // ============================================================================
  // ACE USERS
  // ============================================================================
  aceUsers: defineTable({
    // Identity
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    bacbId: v.optional(v.string()),
    
    // Role
    role: v.union(
      v.literal("participant"),
      v.literal("instructor"),
      v.literal("co_presenter"),
      v.literal("ace_coordinator"),
      v.literal("admin")
    ),
    
    // Credentials
    credentialType: v.optional(v.union(
      v.literal("bcba"),
      v.literal("bcaba"),
      v.literal("rbt"),
      v.literal("other"),
      v.literal("pending")
    )),
    credentialNumber: v.optional(v.string()),
    credentialVerified: v.optional(v.boolean()),
    credentialVerifiedAt: v.optional(v.number()),
    credentialExpiresAt: v.optional(v.number()),
    
    // Contact
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
    
    // Status
    isActive: v.boolean(),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_bacb_id", ["bacbId"])
    .index("by_role", ["role"]),

  // ============================================================================
  // ACE PROVIDERS
  // ============================================================================
  aceProviders: defineTable({
    providerName: v.string(),
    providerType: v.union(v.literal("individual"), v.literal("organization")),
    bacbProviderNumber: v.optional(v.string()),
    
    // Coordinator
    coordinatorId: v.id("aceUsers"),
    coordinatorYearsCertified: v.number(),
    coordinatorCertificationDate: v.optional(v.number()),
    coordinatorCertificationExpires: v.optional(v.number()),
    coordinatorCertificationVerified: v.optional(v.boolean()),
    
    // Contact
    primaryEmail: v.string(),
    primaryPhone: v.optional(v.string()),
    website: v.optional(v.string()),
    addressLine1: v.optional(v.string()),
    addressLine2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    
    // Application & Status
    applicationDate: v.optional(v.number()),
    approvalDate: v.optional(v.number()),
    expirationDate: v.optional(v.number()),
    isActive: v.boolean(),
    
    // Fees
    applicationFeePaid: v.boolean(),
    applicationFeeAmount: v.optional(v.number()),
    applicationFeePaidDate: v.optional(v.number()),
    renewalFeePaid: v.boolean(),
    lastRenewalDate: v.optional(v.number()),
    nextRenewalDate: v.optional(v.number()),
    
    // Grace period & lapse
    gracePeriodEndDate: v.optional(v.number()),
    reinstatementDate: v.optional(v.number()),
    lateFeePaid: v.optional(v.boolean()),
    lateFeeAmount: v.optional(v.number()),
    lateFeePaidDate: v.optional(v.number()),
    canPublishEvents: v.optional(v.boolean()),
    canIssueCertificates: v.optional(v.boolean()),
    lapseStartDate: v.optional(v.number()),
    lapseEndDate: v.optional(v.number()),
    
    // Legal entity (for organizations)
    ein: v.optional(v.string()),
    incorporationDocUrl: v.optional(v.string()),
    legalEntityVerified: v.optional(v.boolean()),
    legalEntityVerifiedAt: v.optional(v.number()),
    legalEntityVerifiedBy: v.optional(v.id("aceUsers")),
    
    // Leadership attestation
    leadershipAttestationUrl: v.optional(v.string()),
    leadershipAttestationDate: v.optional(v.number()),
    leadershipName: v.optional(v.string()),
    leadershipTitle: v.optional(v.string()),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_coordinator", ["coordinatorId"])
    .index("by_provider_number", ["bacbProviderNumber"])
    .index("by_active", ["isActive"]),

  // ============================================================================
  // ACE EVENTS
  // ============================================================================
  aceEvents: defineTable({
    providerId: v.id("aceProviders"),
    
    // Basic Info
    title: v.string(),
    description: v.optional(v.string()),
    
    // CE Details
    totalCeus: v.number(),
    ceCategory: v.union(
      v.literal("learning"),
      v.literal("ethics"),
      v.literal("supervision"),
      v.literal("teaching")
    ),
    modality: v.union(
      v.literal("in_person"),
      v.literal("synchronous"),
      v.literal("asynchronous")
    ),
    
    // Event type
    eventType: v.optional(v.union(v.literal("ce"), v.literal("pd"))),
    eventSubtype: v.optional(v.union(
      v.literal("standard"),
      v.literal("journal_club"),
      v.literal("podcast")
    )),
    
    // Schedule
    startDate: v.number(),
    endDate: v.optional(v.number()),
    registrationDeadline: v.optional(v.number()),
    
    // Capacity
    maxParticipants: v.optional(v.number()),
    currentParticipants: v.optional(v.number()),
    
    // Location/Access
    location: v.optional(v.string()),
    onlineMeetingUrl: v.optional(v.string()),
    
    // Pricing
    fee: v.optional(v.number()),
    
    // Verification
    verificationMethod: v.optional(v.union(
      v.literal("attendance_log"),
      v.literal("quiz_completion"),
      v.literal("verification_code"),
      v.literal("time_on_task"),
      v.literal("check_in_prompts")
    )),
    passingScorePercentage: v.optional(v.number()),
    
    // Status
    status: v.union(
      v.literal("draft"),
      v.literal("pending_approval"),
      v.literal("approved"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("archived")
    ),
    
    // Quiz requirements
    minimumQuestionsRequired: v.optional(v.number()),
    actualQuestionsCount: v.optional(v.number()),
    
    // Learning objectives
    learningObjectives: v.optional(v.array(v.string())),
    instructorQualificationsSummary: v.optional(v.string()),
    instructorAffiliations: v.optional(v.string()),
    conflictsOfInterest: v.optional(v.string()),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_provider", ["providerId"])
    .index("by_status", ["status"])
    .index("by_start_date", ["startDate"])
    .index("by_category", ["ceCategory"]),

  // ============================================================================
  // ACE EVENT INSTRUCTORS
  // ============================================================================
  aceEventInstructors: defineTable({
    eventId: v.id("aceEvents"),
    userId: v.id("aceUsers"),
    role: v.union(v.literal("lead"), v.literal("co_presenter")),
    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"]),

  // ============================================================================
  // ACE REGISTRATIONS
  // ============================================================================
  aceRegistrations: defineTable({
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
    
    // Confirmation
    confirmationCode: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
    cancellationDate: v.optional(v.number()),
    cancellationReason: v.optional(v.string()),
    
    // Payment
    feeAmount: v.optional(v.number()),
    feePaid: v.boolean(),
    paymentDate: v.optional(v.number()),
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    
    // Credential
    credentialType: v.optional(v.string()),
    
    // Completion tracking
    attendanceVerified: v.boolean(),
    quizCompleted: v.boolean(),
    feedbackCompleted: v.boolean(),
    certificateIssued: v.boolean(),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_participant", ["participantId"])
    .index("by_event_participant", ["eventId", "participantId"])
    .index("by_confirmation_code", ["confirmationCode"]),

  // ============================================================================
  // ACE QUIZZES
  // ============================================================================
  aceQuizzes: defineTable({
    eventId: v.id("aceEvents"),
    title: v.string(),
    description: v.optional(v.string()),
    passingScorePercentage: v.number(),
    maxAttempts: v.optional(v.number()),
    timeLimitMinutes: v.optional(v.number()),
    shuffleQuestions: v.boolean(),
    showCorrectAnswers: v.boolean(),
    isRequired: v.boolean(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_event", ["eventId"]),

  // ============================================================================
  // ACE QUIZ QUESTIONS
  // ============================================================================
  aceQuizQuestions: defineTable({
    quizId: v.id("aceQuizzes"),
    questionText: v.string(),
    questionType: v.union(
      v.literal("multiple_choice"),
      v.literal("true_false"),
      v.literal("multiple_select")
    ),
    options: v.array(v.object({
      id: v.string(),
      text: v.string(),
    })),
    correctAnswers: v.array(v.string()),
    explanation: v.optional(v.string()),
    points: v.number(),
    orderIndex: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_quiz", ["quizId"])
    .index("by_quiz_order", ["quizId", "orderIndex"]),

  // ============================================================================
  // ACE QUIZ SUBMISSIONS
  // ============================================================================
  aceQuizSubmissions: defineTable({
    quizId: v.id("aceQuizzes"),
    participantId: v.id("aceUsers"),
    eventId: v.id("aceEvents"),
    attemptNumber: v.number(),
    answers: v.any(), // Record<string, string[]>
    score: v.number(),
    totalQuestions: v.number(),
    scorePercentage: v.number(),
    passed: v.boolean(),
    submittedAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_quiz", ["quizId"])
    .index("by_participant", ["participantId"])
    .index("by_event", ["eventId"])
    .index("by_quiz_participant", ["quizId", "participantId"]),

  // ============================================================================
  // ACE ATTENDANCE RECORDS
  // ============================================================================
  aceAttendanceRecords: defineTable({
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
    
    // Verification
    verificationMethod: v.union(
      v.literal("attendance_log"),
      v.literal("quiz_completion"),
      v.literal("verification_code"),
      v.literal("time_on_task"),
      v.literal("check_in_prompts")
    ),
    verified: v.boolean(),
    verifiedAt: v.optional(v.number()),
    verifiedBy: v.optional(v.id("aceUsers")),
    
    // Sign in/out
    signInTimestamp: v.optional(v.number()),
    signOutTimestamp: v.optional(v.number()),
    
    // Verification code
    verificationCodeEntered: v.optional(v.string()),
    verificationCodeTimestamp: v.optional(v.number()),
    
    // Metadata
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_participant", ["participantId"])
    .index("by_event_participant", ["eventId", "participantId"]),

  // ============================================================================
  // ACE FEEDBACK RESPONSES
  // ============================================================================
  aceFeedbackResponses: defineTable({
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
    
    // Ratings
    rating: v.optional(v.number()),
    instructorRating: v.optional(v.number()),
    contentRating: v.optional(v.number()),
    relevanceRating: v.optional(v.number()),
    
    // Comments
    comments: v.optional(v.string()),
    suggestions: v.optional(v.string()),
    wouldRecommend: v.optional(v.boolean()),
    applicationPlan: v.optional(v.string()),
    
    // Metadata
    submittedAt: v.number(),
    coordinatorReviewDueDate: v.optional(v.number()),
    coordinatorReviewedAt: v.optional(v.number()),
    coordinatorNotes: v.optional(v.string()),
    coordinatorActionTaken: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_event", ["eventId"])
    .index("by_participant", ["participantId"]),

  // ============================================================================
  // ACE CERTIFICATES
  // ============================================================================
  aceCertificates: defineTable({
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
    providerId: v.optional(v.id("aceProviders")),
    
    // Certificate Details
    certificateNumber: v.string(),
    participantName: v.string(),
    participantEmail: v.string(),
    participantBacbId: v.optional(v.string()),
    
    // Event Details
    eventTitle: v.string(),
    eventDate: v.string(),
    instructorName: v.string(),
    
    // Provider Details
    providerName: v.optional(v.string()),
    providerNumber: v.optional(v.string()),
    
    // CE Details
    totalCeus: v.number(),
    ceCategory: v.string(),
    
    // Status
    status: v.union(
      v.literal("pending"),
      v.literal("issued"),
      v.literal("revoked")
    ),
    
    // PDF
    certificateUrl: v.optional(v.string()),
    pdfStorageId: v.optional(v.id("_storage")),
    
    // Timestamps
    issuedAt: v.optional(v.number()),
    revokedAt: v.optional(v.number()),
    revokedBy: v.optional(v.id("aceUsers")),
    revocationReason: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_participant", ["participantId"])
    .index("by_certificate_number", ["certificateNumber"])
    .index("by_provider", ["providerId"]),

  // ============================================================================
  // ACE COMPLAINTS
  // ============================================================================
  aceComplaints: defineTable({
    providerId: v.id("aceProviders"),
    eventId: v.optional(v.id("aceEvents")),
    
    // Submitter
    submitterName: v.string(),
    submitterEmail: v.string(),
    submitterBacbId: v.optional(v.string()),
    submitterPhone: v.optional(v.string()),
    
    // Complaint
    complaintText: v.string(),
    
    // Status
    status: v.union(
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("resolved"),
      v.literal("escalated_to_bacb")
    ),
    
    // Resolution
    resolutionNotes: v.optional(v.string()),
    resolvedAt: v.optional(v.number()),
    resolvedBy: v.optional(v.id("aceUsers")),
    responseDueDate: v.optional(v.number()),
    navEscalationNotified: v.optional(v.boolean()),
    navEscalationNotifiedAt: v.optional(v.number()),
    navNotificationMethod: v.optional(v.string()),
    
    // Metadata
    submittedAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_provider", ["providerId"])
    .index("by_event", ["eventId"])
    .index("by_status", ["status"]),

  // ============================================================================
  // ACE INSTRUCTOR QUALIFICATIONS
  // ============================================================================
  aceInstructorQualifications: defineTable({
    userId: v.id("aceUsers"),
    providerId: v.id("aceProviders"),
    
    // Certification
    isBcba: v.boolean(),
    isBcbaD: v.boolean(),
    isPhDAba: v.boolean(),
    certificationNumber: v.optional(v.string()),
    certificationDate: v.optional(v.number()),
    certificationExpiration: v.optional(v.number()),
    
    // Documentation
    cvUrl: v.optional(v.string()),
    transcriptUrl: v.optional(v.string()),
    certificationProofUrl: v.optional(v.string()),
    
    // Qualification path
    qualificationPath: v.optional(v.union(
      v.literal("active_bcba"),
      v.literal("doctorate_behavior_analysis"),
      v.literal("doctorate_with_coursework"),
      v.literal("doctorate_with_mentorship"),
      v.literal("doctorate_with_publications"),
      v.literal("doctorate_with_postdoc_hours")
    )),
    
    // Expertise
    expertiseBasis: v.optional(v.union(
      v.literal("five_years_practice"),
      v.literal("three_years_teaching"),
      v.literal("published_research")
    )),
    yearsExperienceInSubject: v.optional(v.number()),
    yearsTeachingSubject: v.optional(v.number()),
    
    // Verification
    verifiedBy: v.optional(v.id("aceUsers")),
    verifiedAt: v.optional(v.number()),
    isApproved: v.boolean(),
    qualificationReviewNotes: v.optional(v.string()),
    expertiseReviewNotes: v.optional(v.string()),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_provider", ["providerId"]),

  // ============================================================================
  // CRM
  // ============================================================================
  crmContacts: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    emailLower: v.string(),
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
    role: v.optional(v.string()),
    caseloadSize: v.optional(v.number()),
    status: v.union(
      v.literal("lead"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("onboarding"),
      v.literal("customer"),
      v.literal("churned"),
      v.literal("inactive")
    ),
    leadSource: v.optional(v.string()),
    tags: v.array(v.string()),
    notes: v.optional(v.string()),
    leadScore: v.number(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    lastContactedAt: v.optional(v.string()),
    followUpDate: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    revenue: v.number(),
    isArchived: v.boolean(),
    archivedAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_email_lower", ["emailLower"])
    .index("by_status", ["status"])
    .index("by_archived", ["isArchived"]),

  crmTasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    contactId: v.id("crmContacts"),
    discoveryCallId: v.optional(v.id("crmDiscoveryCalls")),
    dueDate: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("overdue")
    ),
    taskType: v.string(),
    completedAt: v.optional(v.string()),
    isArchived: v.boolean(),
    archivedAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_contact", ["contactId"])
    .index("by_status", ["status"])
    .index("by_due_date", ["dueDate"])
    .index("by_archived", ["isArchived"]),

  crmDeals: defineTable({
    title: v.string(),
    contactId: v.id("crmContacts"),
    discoveryCallId: v.optional(v.id("crmDiscoveryCalls")),
    value: v.number(),
    stage: v.string(),
    probability: v.number(),
    expectedCloseDate: v.optional(v.string()),
    paymentOption: v.optional(v.string()),
    isArchived: v.boolean(),
    archivedAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_contact", ["contactId"])
    .index("by_stage", ["stage"])
    .index("by_archived", ["isArchived"]),

  crmActivities: defineTable({
    contactId: v.optional(v.id("crmContacts")),
    taskId: v.optional(v.id("crmTasks")),
    dealId: v.optional(v.id("crmDeals")),
    discoveryCallId: v.optional(v.id("crmDiscoveryCalls")),
    activityType: v.string(),
    subject: v.string(),
    body: v.optional(v.string()),
    activityDate: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.string(),
  })
    .index("by_contact", ["contactId"])
    .index("by_activity_date", ["activityDate"])
    .index("by_discovery_call", ["discoveryCallId"]),

  crmDiscoveryCalls: defineTable({
    contactId: v.id("crmContacts"),
    callDateTime: v.string(),
    role: v.string(),
    schoolSettingNotes: v.string(),
    fitAssessment: v.union(
      v.literal("perfect_fit"),
      v.literal("strong_fit"),
      v.literal("not_fit"),
      v.literal("needs_follow_up")
    ),
    programDiscussed: v.string(),
    paymentOptionDiscussed: v.union(
      v.literal("pay_in_full"),
      v.literal("payment_plan"),
      v.literal("both"),
      v.literal("not_discussed"),
      v.literal("other")
    ),
    nextStep: v.string(),
    checkoutLink: v.optional(v.string()),
    followUpStatus: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("not_required")
    ),
    followUpTaskId: v.optional(v.id("crmTasks")),
    followUpEmailLogId: v.optional(v.id("crmEmailLogs")),
    dealId: v.optional(v.id("crmDeals")),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_contact", ["contactId"])
    .index("by_call_date", ["callDateTime"])
    .index("by_follow_up_status", ["followUpStatus"]),

  crmEmailLogs: defineTable({
    contactId: v.id("crmContacts"),
    discoveryCallId: v.optional(v.id("crmDiscoveryCalls")),
    taskId: v.optional(v.id("crmTasks")),
    recipient: v.string(),
    subject: v.string(),
    checkoutLink: v.optional(v.string()),
    providerMessageId: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("failed")
    ),
    sentAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_contact", ["contactId"])
    .index("by_discovery_call", ["discoveryCallId"])
    .index("by_status", ["status"]),

  emailTemplates: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    subject: v.string(),
    bodyText: v.optional(v.string()),
    bodyHtml: v.optional(v.string()),
    category: v.string(),
    sendDelayMinutes: v.number(),
    isActive: v.boolean(),
    archived: v.boolean(),
    archivedAt: v.optional(v.string()),
    archivedBy: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_name", ["name"])
    .index("by_category", ["category"])
    .index("by_archived", ["archived"])
    .index("by_updated_at", ["updatedAt"]),

  emailLogs: defineTable({
    templateId: v.optional(v.id("emailTemplates")),
    templateName: v.optional(v.string()),
    recipientEmail: v.string(),
    recipientName: v.optional(v.string()),
    subject: v.string(),
    status: v.string(),
    sentAt: v.optional(v.string()),
    sentBy: v.optional(v.string()),
    mailgunId: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_recipient_email", ["recipientEmail"])
    .index("by_template_name", ["templateName"])
    .index("by_status", ["status"])
    .index("by_sent_at", ["sentAt"]),

  signupSubmissions: defineTable({
    legacyId: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    emailLower: v.string(),
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
    role: v.string(),
    caseloadSize: v.optional(v.string()),
    currentChallenges: v.optional(v.string()),
    bcbaCertNumber: v.optional(v.string()),
    status: v.string(),
    submittedAt: v.string(),
    archived: v.boolean(),
    archivedAt: v.optional(v.string()),
    archivedBy: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_email_lower", ["emailLower"])
    .index("by_status", ["status"])
    .index("by_archived", ["archived"])
    .index("by_submitted_at", ["submittedAt"]),

  downloadSubmissions: defineTable({
    legacyId: v.optional(v.string()),
    email: v.string(),
    emailLower: v.string(),
    name: v.optional(v.string()),
    resource: v.string(),
    source: v.string(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_email_lower", ["emailLower"])
    .index("by_resource", ["resource"])
    .index("by_created_at", ["createdAt"]),

  archivedActivities: defineTable({
    activityType: v.string(),
    activityId: v.string(),
    title: v.string(),
    description: v.string(),
    originalTimestamp: v.string(),
    archivedAt: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_activity", ["activityType", "activityId"])
    .index("by_archived_at", ["archivedAt"]),

  contentCalendarPosts: defineTable({
    legacyId: v.optional(v.string()),
    title: v.string(),
    caption: v.optional(v.string()),
    platforms: v.array(v.string()),
    contentType: v.string(),
    mediaUrl: v.optional(v.string()),
    scheduledDate: v.string(),
    timezone: v.string(),
    status: v.string(),
    tags: v.array(v.string()),
    notes: v.optional(v.string()),
    characterCounts: v.optional(v.any()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_status", ["status"])
    .index("by_content_type", ["contentType"])
    .index("by_scheduled_date", ["scheduledDate"]),

  postingTimeRecommendations: defineTable({
    legacyId: v.optional(v.string()),
    platform: v.string(),
    dayOfWeek: v.number(),
    timeWindow: v.string(),
    priority: v.string(),
    reason: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_platform", ["platform"])
    .index("by_day", ["dayOfWeek"]),

  pageIndexSettings: defineTable({
    path: v.string(),
    index: v.boolean(),
    inSitemap: v.boolean(),
    deleted: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_path", ["path"])
    .index("by_index", ["index"])
    .index("by_in_sitemap", ["inSitemap"])
    .index("by_deleted", ["deleted"]),

  analyticsEvents: defineTable({
    legacyId: v.optional(v.string()),
    eventType: v.string(),
    eventName: v.string(),
    sourcePage: v.string(),
    userEmail: v.optional(v.string()),
    resourceName: v.optional(v.string()),
    value: v.number(),
    additionalData: v.optional(v.any()),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_created_at", ["createdAt"])
    .index("by_event_type", ["eventType"]),

  behaviorStudyToolsMarketingActivity: defineTable({
    legacyId: v.optional(v.string()),
    activityDate: v.string(),
    channel: v.string(),
    primaryAction: v.string(),
    publishedUrl: v.string(),
    customerSignal: v.string(),
    competitorSignal: v.string(),
    seoImprovement: v.string(),
    nextStep: v.string(),
    status: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_activity_date", ["activityDate"])
    .index("by_created_at", ["createdAt"]),

  behaviorStudyToolsMarketingEvents: defineTable({
    legacyId: v.optional(v.string()),
    eventName: v.string(),
    source: v.string(),
    pagePath: v.optional(v.string()),
    pageUrl: v.optional(v.string()),
    pageTitle: v.optional(v.string()),
    visitorId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    location: v.optional(v.string()),
    intent: v.optional(v.string()),
    destination: v.optional(v.string()),
    payload: v.optional(v.any()),
    receivedAt: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_received_at", ["receivedAt"])
    .index("by_event_name", ["eventName"])
    .index("by_source", ["source"]),

  behaviorStudyToolsSocialPosts: defineTable({
    legacyId: v.optional(v.string()),
    postDate: v.string(),
    scheduledAt: v.string(),
    platform: v.string(),
    status: v.string(),
    hook: v.string(),
    body: v.string(),
    ctaLabel: v.optional(v.string()),
    ctaUrl: v.optional(v.string()),
    asset: v.optional(v.string()),
    source: v.string(),
    sourceSignalId: v.optional(v.string()),
    externalUrl: v.optional(v.string()),
    publishResult: v.optional(v.any()),
    feedbackMetrics: v.optional(v.any()),
    errorMessage: v.optional(v.string()),
    publishedAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_post_date", ["postDate"])
    .index("by_scheduled_at", ["scheduledAt"])
    .index("by_status", ["status"])
    .index("by_external_url", ["externalUrl"]),

  behaviorStudyToolsGrowthSignals: defineTable({
    legacyId: v.optional(v.string()),
    signalDate: v.string(),
    source: v.string(),
    signalType: v.string(),
    channel: v.optional(v.string()),
    url: v.optional(v.string()),
    keyword: v.optional(v.string()),
    topic: v.optional(v.string()),
    metricName: v.optional(v.string()),
    metricValue: v.optional(v.number()),
    previousValue: v.optional(v.number()),
    changeValue: v.optional(v.number()),
    changePercent: v.optional(v.number()),
    metadata: v.optional(v.any()),
    recommendation: v.optional(v.string()),
    status: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_signal_date", ["signalDate"])
    .index("by_source", ["source"])
    .index("by_signal_type", ["signalType"])
    .index("by_created_at", ["createdAt"]),

  masterclassResources: defineTable({
    legacyId: v.optional(v.string()),
    sectionId: v.optional(v.string()),
    name: v.string(),
    url: v.string(),
    fileType: v.string(),
    orderIndex: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_section_id", ["sectionId"])
    .index("by_order_index", ["orderIndex"]),

  masterclassCourseSections: defineTable({
    legacyId: v.optional(v.string()),
    sectionNumber: v.number(),
    title: v.string(),
    description: v.string(),
    videoUrl: v.string(),
    duration: v.string(),
    orderIndex: v.number(),
    isActive: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_active", ["isActive"])
    .index("by_section_number", ["sectionNumber"])
    .index("by_order_index", ["orderIndex"]),

  masterclassQuizQuestions: defineTable({
    legacyId: v.optional(v.string()),
    sectionNumber: v.number(),
    questionNumber: v.number(),
    questionText: v.string(),
    optionA: v.string(),
    optionB: v.string(),
    optionC: v.string(),
    optionD: v.string(),
    correctAnswer: v.number(),
    explanation: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_active", ["isActive"])
    .index("by_section_number", ["sectionNumber"]),

  masterclassEnrollments: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    emailLower: v.optional(v.string()),
    name: v.optional(v.string()),
    bacbCertNumber: v.optional(v.string()),
    createdAt: v.string(),
    completedAt: v.optional(v.string()),
    lastAccessedAt: v.optional(v.string()),
    certificateIssued: v.boolean(),
    certificateId: v.optional(v.string()),
    certificateGeneratedAt: v.optional(v.string()),
    certificateEmailed: v.optional(v.boolean()),
    certificateEmailedAt: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    feedbackSubmitted: v.optional(v.boolean()),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_email_lower", ["emailLower"])
    .index("by_certificate_id", ["certificateId"])
    .index("by_created_at", ["createdAt"])
    .index("by_certificate_issued", ["certificateIssued"]),

  masterclassProgress: defineTable({
    enrollmentId: v.string(),
    sectionNumber: v.number(),
    videoCompleted: v.boolean(),
    videoWatchedPercentage: v.number(),
    videoWatchTimeSeconds: v.number(),
    videoCompletedAt: v.optional(v.string()),
    quizAttempts: v.number(),
    quizScore: v.optional(v.number()),
    quizTotal: v.optional(v.number()),
    quizPassed: v.boolean(),
    quizCompletedAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_enrollment", ["enrollmentId"])
    .index("by_enrollment_section", ["enrollmentId", "sectionNumber"]),

  masterclassQuizResponses: defineTable({
    enrollmentId: v.string(),
    sectionNumber: v.number(),
    attemptNumber: v.number(),
    questionNumber: v.number(),
    questionId: v.string(),
    selectedAnswer: v.number(),
    correctAnswer: v.number(),
    isCorrect: v.boolean(),
    timeSpentSeconds: v.optional(v.number()),
    createdAt: v.string(),
  })
    .index("by_enrollment", ["enrollmentId"])
    .index("by_enrollment_section", ["enrollmentId", "sectionNumber"]),

  masterclassCertificates: defineTable({
    certificateId: v.string(),
    enrollmentId: v.string(),
    recipientName: v.string(),
    recipientEmail: v.string(),
    bacbCertNumber: v.string(),
    courseTitle: v.string(),
    ceuCredits: v.number(),
    completionDate: v.string(),
    pdfUrl: v.optional(v.string()),
    pdfGenerated: v.boolean(),
    verificationCount: v.number(),
    lastVerifiedAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_certificate_id", ["certificateId"])
    .index("by_enrollment", ["enrollmentId"]),

  masterclassAnalyticsEvents: defineTable({
    enrollmentId: v.optional(v.string()),
    eventType: v.string(),
    eventData: v.optional(v.any()),
    sectionNumber: v.optional(v.number()),
    sessionId: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_enrollment", ["enrollmentId"])
    .index("by_created_at", ["createdAt"]),

  masterclassFeedback: defineTable({
    enrollmentId: v.string(),
    participantEmail: v.string(),
    participantName: v.string(),
    overallSatisfaction: v.optional(v.number()),
    contentQuality: v.optional(v.number()),
    instructorEffectiveness: v.optional(v.number()),
    relevanceToPractice: v.optional(v.number()),
    wouldRecommend: v.optional(v.number()),
    section1Rating: v.optional(v.number()),
    section2Rating: v.optional(v.number()),
    section3Rating: v.optional(v.number()),
    section4Rating: v.optional(v.number()),
    mostValuableLearning: v.optional(v.string()),
    suggestionsForImprovement: v.optional(v.string()),
    topicsForFutureCourses: v.optional(v.string()),
    additionalComments: v.optional(v.string()),
    learnedEthicsConcepts: v.optional(v.boolean()),
    learnedTeacherCollaboration: v.optional(v.boolean()),
    learnedDataSystems: v.optional(v.boolean()),
    learnedCrisisManagement: v.optional(v.boolean()),
    willApplyImmediately: v.optional(v.boolean()),
    willApplyWithinMonth: v.optional(v.boolean()),
    willShareWithTeam: v.optional(v.boolean()),
    submittedAt: v.string(),
  })
    .index("by_enrollment", ["enrollmentId"])
    .index("by_submitted_at", ["submittedAt"]),

  presentationDocs: defineTable({
    title: v.string(),
    template: v.string(),
    data: v.any(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_updated_at", ["updatedAt"])
    .index("by_created_at", ["createdAt"]),

  masterclassCertificateConfigs: defineTable({
    legacyId: v.optional(v.string()),
    courseTitle: v.string(),
    ceuCredits: v.number(),
    bacbProviderNumber: v.string(),
    certificateSubtitle: v.optional(v.string()),
    completionStatement: v.string(),
    signatureName: v.optional(v.string()),
    signatureTitle: v.optional(v.string()),
    organizationName: v.string(),
    organizationWebsite: v.string(),
    introductionVideoUrl: v.optional(v.string()),
    templateVersion: v.number(),
    isActive: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_active", ["isActive"])
    .index("by_created_at", ["createdAt"]),

  checkoutSettings: defineTable({
    settingKey: v.string(),
    settingValue: v.string(),
    description: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_setting_key", ["settingKey"]),

  checkoutAccess: defineTable({
    email: v.string(),
    emailLower: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    approvedBy: v.optional(v.string()),
    notes: v.optional(v.string()),
    isActive: v.boolean(),
    expiresAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_email_lower", ["emailLower"])
    .index("by_active", ["isActive"]),

  checkoutAccessLogs: defineTable({
    accessType: v.string(),
    identifier: v.string(),
    success: v.boolean(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_success", ["success"]),

  // ============================================================================
  // FERPA A4: Password history for reuse prevention (last 12 passwords)
  // ============================================================================
  passwordHistory: defineTable({
    userId: v.string(),
    passwordHash: v.string(),
    createdAt: v.number(),
  }).index("by_user_created", ["userId", "createdAt"]),
});
