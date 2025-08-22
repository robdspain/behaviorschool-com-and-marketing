// Server-side admin authentication utilities
import { NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-server';
import { isAuthorizedAdmin } from '@/lib/admin-config';

export interface AuthenticatedUser {
  id: string;
  email: string;
  isAdmin: true;
}

export class AdminAuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AdminAuthError';
  }
}

/**
 * Verify admin authentication for API routes
 * This should be called at the beginning of admin API routes
 */
export async function verifyAdminAuth(request: NextRequest): Promise<AuthenticatedUser> {
  try {
    const supabase = createSupabaseAdminClient();
    
    // Get the session from the request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      throw new AdminAuthError('No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw new AdminAuthError('Invalid or expired token');
    }

    // Check if the user's email is authorized for admin access
    if (!isAuthorizedAdmin(user.email)) {
      throw new AdminAuthError(`Unauthorized: ${user.email} is not authorized for admin access`, 403);
    }

    return {
      id: user.id,
      email: user.email!,
      isAdmin: true
    };
  } catch (error) {
    if (error instanceof AdminAuthError) {
      throw error;
    }
    throw new AdminAuthError('Authentication verification failed');
  }
}

/**
 * Alternative method for routes that use session-based auth
 * This checks the session cookie instead of Authorization header
 */
export async function verifyAdminSession(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const supabase = createSupabaseAdminClient();
    
    // For now, we'll implement a basic check
    // In production, you might want to verify session cookies more thoroughly
    
    // This is a simplified approach - you might need to adjust based on your auth setup
    const sessionCookie = request.cookies.get('sb-access-token')?.value;
    
    if (!sessionCookie) {
      return null;
    }

    const { data: { user }, error } = await supabase.auth.getUser(sessionCookie);
    
    if (error || !user) {
      return null;
    }

    // Check if the user's email is authorized for admin access
    if (!isAuthorizedAdmin(user.email)) {
      throw new AdminAuthError(`Unauthorized: ${user.email} is not authorized for admin access`, 403);
    }

    return {
      id: user.id,
      email: user.email!,
      isAdmin: true
    };
  } catch (error) {
    if (error instanceof AdminAuthError) {
      throw error;
    }
    return null;
  }
}

/**
 * Middleware helper to protect admin routes
 */
export function createAdminAuthMiddleware() {
  return async (request: NextRequest) => {
    try {
      await verifyAdminAuth(request);
      return null; // Continue to the route handler
    } catch (error) {
      if (error instanceof AdminAuthError) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: error.message 
          }),
          { 
            status: error.statusCode,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Authentication failed' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}