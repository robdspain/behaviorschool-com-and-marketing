/**
 * Supabase Admin Client
 * For server-side operations requiring elevated privileges
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Support multiple env var names to accommodate different deployments
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.SUPABASE_SECRECT_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase admin client not configured - missing URL or service key');
}

export const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Helper function to check if admin client is available
export const isSupabaseAdminAvailable = (): boolean => {
  return supabaseAdmin !== null;
};

// Safe wrapper for admin operations
export const withSupabaseAdmin = async <T>(
  operation: (client: typeof supabaseAdmin) => Promise<T>,
  fallback?: T
): Promise<T | undefined> => {
  if (!supabaseAdmin) {
    console.warn('Supabase admin operation attempted but client not available');
    return fallback;
  }
  
  try {
    return await operation(supabaseAdmin);
  } catch (error) {
    console.error('Supabase admin operation failed:', error);
    return fallback;
  }
};

// Function export for compatibility
export const createSupabaseAdminClient = () => {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured - missing URL or service key');
  }
  return supabaseAdmin;
};
