// ============================================================================
// ACE Platform - Database Queries (Convex Backend)
// ============================================================================
// Migrated from Supabase to Convex. All queries now use the Convex client.

import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../convex/_generated/dataModel';

// ============================================================================
// PROVIDER QUERIES
// ============================================================================

export async function getProviders() {
  const client = getConvexClient();
  return await client.query(api.aceProviders.getAll, {});
}

export async function getProviderById(id: string) {
  const client = getConvexClient();
  return await client.query(api.aceProviders.getById, {
    id: id as Id<'aceProviders'>,
  });
}

// ============================================================================
// EVENT QUERIES
// ============================================================================

export async function getEvents(providerId?: string) {
  const client = getConvexClient();

  if (providerId) {
    return await client.query(api.aceEvents.getByProvider, {
      providerId: providerId as Id<'aceProviders'>,
    });
  }

  return await client.query(api.aceEvents.getPublic, {});
}

export async function getEventById(id: string) {
  const client = getConvexClient();
  return await client.query(api.aceEvents.getWithDetails, {
    id: id as Id<'aceEvents'>,
  });
}

// ============================================================================
// CERTIFICATE QUERIES
// ============================================================================

export async function getCertificateById(id: string) {
  const client = getConvexClient();
  return await client.query(api.aceCertificates.getById, {
    id: id as Id<'aceCertificates'>,
  });
}

export async function getCertificates(eventId?: string) {
  const client = getConvexClient();

  if (eventId) {
    return await client.query(api.aceCertificates.getByEvent, {
      eventId: eventId as Id<'aceEvents'>,
    });
  }

  return await client.query(api.aceCertificates.getAll, {});
}

export async function getParticipantCertificates(participantId: string) {
  const client = getConvexClient();
  return await client.query(api.aceCertificates.getByParticipant, {
    participantId: participantId as Id<'aceUsers'>,
  });
}

// ============================================================================
// ATTENDANCE QUERIES
// ============================================================================

export async function getAttendanceForEvent(eventId: string) {
  const client = getConvexClient();
  return await client.query(api.aceAttendance.getByEvent, {
    eventId: eventId as Id<'aceEvents'>,
  });
}
