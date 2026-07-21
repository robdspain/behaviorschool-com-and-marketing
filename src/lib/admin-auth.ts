import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { isValidAdminSessionToken } from '@/lib/adminSession';

const COOKIE_NAME = 'bs_admin_auth';

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
  const cookieTokens = request.cookies.getAll(COOKIE_NAME).map((cookie) => cookie.value);
  const authenticated = bearerToken
    ? isValidAdminSessionToken(bearerToken)
    : cookieTokens.some((token) => isValidAdminSessionToken(token));

  if (!authenticated) {
    throw new AdminAuthError('Invalid or expired admin session');
  }

  return authenticatedAdmin();
}

export async function verifyAdminSession(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const authenticated = cookieStore
    .getAll(COOKIE_NAME)
    .some((cookie) => isValidAdminSessionToken(cookie.value));
  return authenticated ? authenticatedAdmin() : null;
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
