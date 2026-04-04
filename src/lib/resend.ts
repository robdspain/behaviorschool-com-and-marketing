import { Resend } from 'resend';

export const RESEND_FROM_NO_REPLY = 'Behavior School <noreply@updates.behaviorschool.com>';
export const RESEND_FROM_ROB = 'Rob Spain, BCBA <rob@updates.behaviorschool.com>';
export const RESEND_FROM_SUPPORT = 'Behavior School Support <support@updates.behaviorschool.com>';

export const RESEND_REPLY_TO_ROB = 'rob@behaviorschool.com';
export const RESEND_REPLY_TO_SUPPORT = 'support@behaviorschool.com';

const NEWSLETTER_SEGMENT_ID =
  process.env.RESEND_SUBSCRIBERS_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID || '';

export function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder');
}

function splitName(name?: string) {
  const trimmedName = name?.trim();

  if (!trimmedName) {
    return { firstName: undefined, lastName: undefined };
  }

  const [firstName, ...rest] = trimmedName.split(/\s+/);

  return {
    firstName,
    lastName: rest.length > 0 ? rest.join(' ') : undefined,
  };
}

export async function upsertNewsletterSubscriber(email: string, name?: string) {
  if (!process.env.RESEND_API_KEY || !NEWSLETTER_SEGMENT_ID) {
    return {
      ok: false,
      skipped: true,
      reason: !process.env.RESEND_API_KEY ? 'missing_resend_api_key' : 'missing_newsletter_segment_id',
    };
  }

  const resend = getResend();
  const normalizedEmail = email.trim().toLowerCase();
  const { firstName, lastName } = splitName(name);

  const createResponse = await resend.contacts.create({
    email: normalizedEmail,
    firstName,
    lastName,
    unsubscribed: false,
    segments: [{ id: NEWSLETTER_SEGMENT_ID }],
  });

  if (!createResponse.error) {
    return { ok: true, created: true };
  }

  const addSegmentResponse = await resend.contacts.segments.add({
    email: normalizedEmail,
    segmentId: NEWSLETTER_SEGMENT_ID,
  });

  if (addSegmentResponse.error) {
    console.error('Failed to sync newsletter contact to Resend:', {
      email: normalizedEmail,
      createError: createResponse.error,
      addSegmentError: addSegmentResponse.error,
    });

    return { ok: false, skipped: false, error: addSegmentResponse.error };
  }

  await resend.contacts.update({
    email: normalizedEmail,
    firstName: firstName ?? null,
    lastName: lastName ?? null,
    unsubscribed: false,
  });

  return { ok: true, created: false };
}
