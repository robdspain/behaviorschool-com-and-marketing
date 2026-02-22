// ============================================================================
// ACE Platform - CEU/PDU Calculation Engine
// ============================================================================
// Implements BACB ACE provider requirements for CEU calculations
// Rule: FLOOR(duration_minutes / 25) * 0.5
// ============================================================================

/**
 * Calculate CEUs/PDUs from event duration in minutes.
 * BACB Rule: FLOOR(duration_minutes / 25) * 0.5
 *
 * @param durationMinutes - Total event duration in minutes
 * @returns Number of CEUs/PDUs earned
 */
export function calculateCEUs(durationMinutes: number): number {
  if (durationMinutes < 0) return 0;
  return Math.floor(durationMinutes / 25) * 0.5;
}

/**
 * Calculate the minimum number of quiz questions required for an event.
 * Rule: 3 questions per CEU/PDU
 * - 0.5 CEU = 3 questions
 * - 1.0 CEU = 6 questions
 * - 1.5 CEU = 9 questions
 *
 * @param ceus - Total CEUs/PDUs for the event
 * @returns Minimum number of questions required
 */
export function calculateMinimumQuestions(ceus: number): number {
  if (ceus <= 0) return 0;
  // 3 questions per CEU, with minimum of 3 for any event that awards CEUs
  return Math.max(3, Math.ceil(ceus / 0.5) * 3);
}

/**
 * Validate that journal club CEUs do not exceed the per-article maximum.
 * Journal clubs are capped at 1 CEU per article reviewed.
 *
 * @param ceus - Total CEUs requested for a single journal club article
 * @returns Whether the CEUs are within the allowed limit
 */
export function validateJournalClubCEUs(ceus: number): boolean {
  return ceus <= 1.0;
}

/**
 * Validate that podcast CEUs do not exceed the per-episode maximum.
 * Podcasts are capped at 1 CEU per episode.
 *
 * @param ceus - Total CEUs requested for a single podcast episode
 * @returns Whether the CEUs are within the allowed limit
 */
export function validatePodcastCEUs(ceus: number): boolean {
  return ceus <= 1.0;
}

/**
 * Validate event duration and return validation result with messaging.
 *
 * @param minutes - Event duration in minutes
 * @returns Validation result with message if invalid
 */
export function validateDuration(minutes: number): {
  valid: boolean;
  message?: string;
} {
  if (minutes < 0) {
    return { valid: false, message: "Duration cannot be negative." };
  }

  if (minutes === 0) {
    return { valid: false, message: "Duration must be greater than 0 minutes." };
  }

  if (minutes < 25) {
    return {
      valid: false,
      message:
        "Duration must be at least 25 minutes to earn any CEUs/PDUs. Events shorter than 25 minutes will award 0 credits.",
    };
  }

  if (minutes > 480) {
    return {
      valid: true,
      message:
        "Events longer than 8 hours (480 minutes) should typically be split into multiple sessions.",
    };
  }

  return { valid: true };
}

/**
 * Suggests quiz question distribution intervals throughout an event.
 * Useful for asynchronous events that need periodic engagement checks.
 *
 * @param durationMinutes - Total event duration in minutes
 * @param totalQuestions - Total number of quiz questions
 * @returns Suggested distribution with interval and placement suggestions
 */
export function getQuizDistributionSuggestion(
  durationMinutes: number,
  totalQuestions: number
): {
  interval: number;
  suggested: string[];
} {
  if (totalQuestions <= 0 || durationMinutes <= 0) {
    return { interval: 0, suggested: [] };
  }

  // Calculate interval in minutes between questions
  const interval = Math.floor(durationMinutes / totalQuestions);

  const suggested: string[] = [];
  for (let i = 0; i < totalQuestions; i++) {
    const minuteMark = Math.round(interval * (i + 0.5));
    const hours = Math.floor(minuteMark / 60);
    const mins = minuteMark % 60;

    if (hours > 0) {
      suggested.push(
        `Question ${i + 1}: at ${hours}h ${mins}m mark`
      );
    } else {
      suggested.push(`Question ${i + 1}: at ${mins}m mark`);
    }
  }

  return { interval, suggested };
}

/**
 * Format CEU/PDU value for display.
 * Ensures consistent display of credit values.
 *
 * @param ceus - CEU/PDU value
 * @param eventType - Whether this is a CE or PD event
 * @returns Formatted string like "1.5 CEUs" or "2.0 PDUs"
 */
export function formatCredits(
  ceus: number,
  eventType: "ce" | "pd" = "ce"
): string {
  const unit = eventType === "pd" ? "PDU" : "CEU";
  const plural = ceus !== 1.0 ? "s" : "";
  return `${ceus.toFixed(1)} ${unit}${plural}`;
}

/**
 * Get a summary of CEU calculation for display in forms.
 *
 * @param durationMinutes - Event duration in minutes
 * @param eventType - CE or PD event
 * @param eventSubtype - Standard, journal_club, or podcast
 * @returns Summary object with calculated values and messages
 */
export function getCEUCalculationSummary(
  durationMinutes: number,
  eventType: "ce" | "pd" = "ce",
  eventSubtype: "standard" | "journal_club" | "podcast" = "standard"
): {
  ceus: number;
  minimumQuestions: number;
  durationValidation: { valid: boolean; message?: string };
  warnings: string[];
  label: string;
} {
  const ceus = calculateCEUs(durationMinutes);
  const minimumQuestions = calculateMinimumQuestions(ceus);
  const durationValidation = validateDuration(durationMinutes);
  const warnings: string[] = [];
  const label = eventType === "pd" ? "PDUs" : "CEUs";

  // Check subtype-specific limits
  if (eventSubtype === "journal_club" && !validateJournalClubCEUs(ceus)) {
    warnings.push(
      `Journal club events are capped at 1.0 ${label} per article. Current calculation yields ${ceus.toFixed(1)} ${label}.`
    );
  }

  if (eventSubtype === "podcast" && !validatePodcastCEUs(ceus)) {
    warnings.push(
      `Podcast events are capped at 1.0 ${label} per episode. Current calculation yields ${ceus.toFixed(1)} ${label}.`
    );
  }

  if (durationValidation.message) {
    warnings.push(durationValidation.message);
  }

  return {
    ceus:
      (eventSubtype === "journal_club" || eventSubtype === "podcast") &&
      ceus > 1.0
        ? 1.0
        : ceus,
    minimumQuestions,
    durationValidation,
    warnings,
    label,
  };
}
