// Server-side admin authentication utilities
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

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
    const supabase = await createClient();
    
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

    // For now, any authenticated user is considered admin. 
    // In a real app, you'd check user roles/metadata here.
    // Example: if (user.app_metadata.role !== 'admin') { ... }

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
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // For now, any authenticated user is considered admin. 
    // In a real app, you'd check user roles/metadata here.
    // Example: if (user.app_metadata.role !== 'admin') { ... }

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
