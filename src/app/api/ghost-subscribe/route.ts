import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getGhostAdminAPI } from '@/lib/ghost-admin';

const SubscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1).max(100).optional(),
  source: z.string().optional(), // e.g., 'supervisors-landing', 'study-landing'
  honeypot: z.string().max(0).optional(), // Anti-spam field
});

// Rate limiting
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // Max 5 subscriptions per minute per IP
const ipToHits: Map<string, { count: number; windowStart: number }> = new Map();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipToHits.get(ip);
  
  if (!entry) {
    ipToHits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipToHits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate input
    const parsed = SubscribeSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      return NextResponse.json(
        { error: firstError?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, name, source, honeypot } = parsed.data;

    // Check honeypot field (anti-spam)
    if (honeypot && honeypot.length > 0) {
      // Silently reject spam
      return NextResponse.json({ success: true });
    }

    // Check if Ghost is configured
    const ghostUrl = process.env.GHOST_ADMIN_URL || process.env.GHOST_CONTENT_URL;
    const ghostKey = process.env.GHOST_ADMIN_KEY;

    if (!ghostUrl || !ghostKey) {
      // Fallback to existing subscribe endpoint if Ghost Admin API is not configured
      const fallbackEndpoint = process.env.MAILGUN_ENDPOINT;
      if (fallbackEndpoint) {
        try {
          const res = await fetch(fallbackEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, ip, source }),
            cache: 'no-store',
          });

          if (!res.ok) {
            throw new Error('Fallback subscription failed');
          }

          return NextResponse.json({ 
            success: true,
            message: 'Successfully subscribed to our newsletter!' 
          });
        } catch {
          return NextResponse.json(
            { error: 'Failed to subscribe. Please try again later.' },
            { status: 500 }
          );
        }
      }

      // No subscription service available
      console.error('Neither Ghost Admin API nor fallback subscription service is configured');
      return NextResponse.json(
        { error: 'Newsletter service is not configured' },
        { status: 503 }
      );
    }

    // Subscribe via Ghost Admin API
    try {
      const ghostAdmin = getGhostAdminAPI();
      const member = await ghostAdmin.subscribeMember(email, name, source);

      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to our newsletter!',
        member: {
          email: member.email,
          name: member.name,
        },
      });
    } catch (error) {
      console.error('Ghost subscription error:', error);
      
      // Check if it's a duplicate subscription
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed to our newsletter!',
        });
      }

      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in ghost-subscribe:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}