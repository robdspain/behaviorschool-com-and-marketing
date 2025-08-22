// Admin Configuration
// Centralized configuration for admin panel access control

export const AUTHORIZED_ADMIN_EMAILS = [
  'robspain@gmail.com',
  'behaviorschoolcommunity@gmail.com'
] as const;

/**
 * Check if an email address is authorized for admin access
 * @param email - The email address to check
 * @returns boolean - True if the email is authorized
 */
export function isAuthorizedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  
  const normalizedEmail = email.toLowerCase().trim();
  return (AUTHORIZED_ADMIN_EMAILS as readonly string[]).includes(normalizedEmail);
}

/**
 * Get a user-friendly error message for unauthorized access
 */
export function getUnauthorizedMessage(email?: string): string {
  if (email) {
    return `Access denied for ${email}. Only authorized administrators can access this panel.`;
  }
  return 'Access denied. Only authorized administrators can access this panel.';
}

/**
 * Development mode configuration
 */
export const DEV_CONFIG = {
  // Use the first authorized email for development mode
  DEV_ADMIN_EMAIL: AUTHORIZED_ADMIN_EMAILS[0],
  
  // Check if we're in development mode with admin bypass enabled
  isDevelopmentBypass(): boolean {
    return process.env.NODE_ENV === 'development' && 
           process.env.NEXT_PUBLIC_ADMIN_DEV_MODE === 'true';
  }
} as const;

export type AuthorizedAdminEmail = typeof AUTHORIZED_ADMIN_EMAILS[number];