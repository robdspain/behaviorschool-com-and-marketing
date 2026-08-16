export type PublishingTier = "A" | "B" | "C" | "social-derivative";

export type SpecificityAnchor = {
  type: string;
  detail: string;
  verifiedByRob: boolean;
};

export type PublishingStandardInput = {
  title: string;
  contentKey: string;
  contentHash: string;
  tier: PublishingTier;
  audienceNeed: string;
  firstPartyInputReference: string;
  distinctiveThesis: string;
  specificityAnchors: SpecificityAnchor[];
  evidenceInterpretationSeparated: boolean;
  informationGain: string;
  detectorOptimizationUsed: boolean;
  claimsReviewed: boolean;
  canonicalSource?: string;
  sourceApprovalReference?: string;
};

const HASH_PATTERN = /^[a-f0-9]{64}$/i;

function hasText(value: string | undefined) {
  return Boolean(value?.trim());
}

export function minimumVerifiedAnchors(tier: PublishingTier) {
  if (tier === "A") return 2;
  if (tier === "social-derivative") return 0;
  return 1;
}

export function publishingStandardFailures(input: PublishingStandardInput) {
  const failures: string[] = [];
  const verifiedAnchors = input.specificityAnchors.filter(
    (anchor) => hasText(anchor.type) && hasText(anchor.detail) && anchor.verifiedByRob,
  );

  if (!hasText(input.title)) failures.push("Add the working title.");
  if (!hasText(input.contentKey)) failures.push("Add a stable content key.");
  if (!HASH_PATTERN.test(input.contentHash.trim())) failures.push("Attach a valid SHA-256 content fingerprint.");
  if (!hasText(input.audienceNeed)) failures.push("State the specific audience need or decision.");
  if (!hasText(input.firstPartyInputReference)) failures.push("Record Rob's first-party input or review source.");
  if (!hasText(input.distinctiveThesis)) failures.push("State the distinctive thesis in plain language.");
  if (!hasText(input.informationGain)) failures.push("Explain what this adds beyond existing coverage.");
  if (!input.evidenceInterpretationSeparated) failures.push("Separate sourced evidence from interpretation.");
  if (!input.claimsReviewed) failures.push("Complete the claims and accuracy review.");
  if (input.detectorOptimizationUsed) failures.push("Remove detector-targeted wording tactics; optimize for readers and truth instead.");

  const minimum = minimumVerifiedAnchors(input.tier);
  if (verifiedAnchors.length < minimum) {
    failures.push(`Add ${minimum} verified specificity anchor${minimum === 1 ? "" : "s"} for Tier ${input.tier}.`);
  }

  if (input.tier === "social-derivative") {
    if (!hasText(input.canonicalSource)) failures.push("Link the approved canonical source for this derivative.");
    if (!hasText(input.sourceApprovalReference)) failures.push("Record the canonical source approval reference.");
  }

  return failures;
}

export function releaseMatches(
  status: string,
  contentHash: string,
  approvedContentHash?: string,
) {
  return status === "approved"
    && HASH_PATTERN.test(contentHash)
    && contentHash === approvedContentHash;
}

export function approvalStatusAfterSave(
  currentStatus: "draft" | "approved" | "stale" | "revoked",
  contentChanged: boolean,
  reviewHasFailures: boolean,
) {
  return currentStatus === "approved" && (contentChanged || reviewHasFailures)
    ? "stale" as const
    : currentStatus;
}
