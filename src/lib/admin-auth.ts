import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { isValidAdminSessionToken } from '@/lib/adminSession';

const COOKIE_NAME = 'bs_admin_session';

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

function authenticatedAdmin(): AuthenticatedUser {
  return {
    id: 'admin-session',
    email: 'admin@behaviorschool.com',
    isAdmin: true,
  };
}

export async function verifyAdminAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const bearerToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
  const token = bearerToken || cookieToken;

  if (!isValidAdminSessionToken(token)) {
    throw new AdminAuthError('Invalid or expired admin session');
  }

  return authenticatedAdmin();
}

export async function verifyAdminSession(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return isValidAdminSessionToken(token) ? authenticatedAdmin() : null;
}

export function createAdminAuthMiddleware() {
  return async (request: NextRequest) => {
    try {
      await verifyAdminAuth(request);
      return null;
    } catch (error) {
      if (error instanceof AdminAuthError) {
        return new Response(
          JSON.stringify({
            success: false,
            message: error.message,
          }),
          {
            status: error.statusCode,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Authentication failed',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}
