/**
 * Registration Validation for CE vs PD Event Types
 * Enforces 2026 BACB requirement #7: Separate CE and PD events
 */

import type { AceCredentialType, AceEventType } from './types';

export interface RegistrationEligibility {
  eligible: boolean;
  reason?: string;
  requiresCredentialVerification?: boolean;
}

/**
 * Validates if a user with a specific credential type can register for an event type
 * 
 * Rules:
 * - CE events: Only BCBA, BCaBA can register
 * - PD events: Only RBTs can register
 * - Users with 'pending' or 'other' credentials need to verify first
 */
export function validateRegistrationEligibility(
  credentialType: AceCredentialType,
  eventType: AceEventType
): RegistrationEligibility {
  // Check for pending or unverified credentials
  if (credentialType === 'pending') {
    return {
      eligible: false,
      reason: 'Please verify your credential before registering for events.',
      requiresCredentialVerification: true,
    };
  }

  if (credentialType === 'other') {
    return {
      eligible: false,
      reason: 'Your credential type does not meet the requirements for this event type.',
      requiresCredentialVerification: true,
    };
  }

  // CE event validation
  if (eventType === 'ce') {
    if (credentialType === 'bcba' || credentialType === 'bcaba') {
      return { eligible: true };
    }
    
    return {
      eligible: false,
      reason: 'CE (Continuing Education) events are only available for BCBAs and BCaBAs. This is a PD (Professional Development) restriction per 2026 BACB requirements.',
    };
  }

  // PD event validation
  if (eventType === 'pd') {
    if (credentialType === 'rbt') {
      return { eligible: true };
    }
    
    return {
      eligible: false,
      reason: 'PD (Professional Development) events are only available for RBTs. Please register for CE events instead.',
    };
  }

  // Unknown event type (shouldn't happen, but be safe)
  return { eligible: true };
}

/**
 * Get a user-friendly credential type label
 */
export function getCredentialTypeLabel(credentialType: AceCredentialType): string {
  const labels: Record<AceCredentialType, string> = {
    bcba: 'Board Certified Behavior Analyst (BCBA)',
    bcaba: 'Board Certified Assistant Behavior Analyst (BCaBA)',
    rbt: 'Registered Behavior Technician (RBT)',
    other: 'Other Credential',
    pending: 'Pending Verification',
  };
  
  return labels[credentialType] || credentialType;
}

/**
 * Get a user-friendly event type label
 */
export function getEventTypeLabel(eventType: AceEventType): string {
  const labels: Record<AceEventType, string> = {
    ce: 'CE - Continuing Education (for BCBAs, BCaBAs)',
    pd: 'PD - Professional Development (for RBTs)',
  };
  
  return labels[eventType] || eventType;
}

/**
 * Get eligible event types for a credential
 */
export function getEligibleEventTypes(credentialType: AceCredentialType): AceEventType[] {
  if (credentialType === 'bcba' || credentialType === 'bcaba') {
    return ['ce'];
  }
  
  if (credentialType === 'rbt') {
    return ['pd'];
  }
  
  return [];
}

