// Admin Configuration
// Centralized configuration for admin panel access control

export const AUTHORIZED_ADMIN_EMAILS = [
  'robspain@gmail.com',
  'behaviorschoolcommunity@gmail.com',
  'rob@behaviorschool.com'
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
  
  // Check if admin bypass is enabled (development mode OR explicit bypass flag)
  isDevelopmentBypass(): boolean {
    return process.env.NODE_ENV === 'development' || 
           process.env.NEXT_PUBLIC_ADMIN_DEV_MODE === 'true' ||
           process.env.ADMIN_BYPASS === 'true';
  }
} as const;

/**
 * Simple password-based authentication for admin access
 * This provides a fallback when OAuth is not configured
 */
export const SIMPLE_AUTH_CONFIG = {
  // Simple password for admin access (should be set via environment variable)
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'behavior-school-admin-2024',
  
  // Session timeout in milliseconds (24 hours)
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000,
  
  // Maximum login attempts before temporary lockout
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Lockout duration in milliseconds (15 minutes)
  LOCKOUT_DURATION: 15 * 60 * 1000,
  
  // Check if simple auth is enabled
  isSimpleAuthEnabled(): boolean {
    return process.env.USE_SIMPLE_ADMIN_AUTH === 'true' || 
           !process.env.NEXT_PUBLIC_SUPABASE_URL ||
           !process.env.GOOGLE_CLIENT_ID;
  },
  
  // Validate password strength (basic check)
  isPasswordStrong(password: string): boolean {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password);
  }
} as const;

export type AuthorizedAdminEmail = typeof AUTHORIZED_ADMIN_EMAILS[number];
