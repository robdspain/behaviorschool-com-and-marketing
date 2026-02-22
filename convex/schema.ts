import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ============================================================================
// ACE CEU Platform Schema
// ============================================================================
// Converted from SQL to Convex for the ACE continuing education platform
// ============================================================================

export default defineSchema({
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
    createdAt: v.number(),
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
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_provider", ["providerId"]),
});
