export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { RESEND_FROM_SUPPORT } from '@/lib/resend';
import { supabaseAdmin } from '@/lib/supabase-admin';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function mapCategory(value: unknown) {
  const category = typeof value === 'string' ? value : 'general';
  const categories: Record<string, string> = {
    account: 'account',
    billing: 'billing',
    bug: 'bug',
    feature: 'feature_request',
    'study-tools': 'technical',
    'school-tools': 'content',
    general: 'general',
  };
  return categories[category] || 'general';
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, category, page_url, platform } = await request.json();

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    const cleanName = typeof name === 'string' && name.trim() ? name.trim() : 'Support visitor';
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanMessage = String(message).trim();
    const mappedCategory = mapCategory(category);
    const subject = mappedCategory.replace(/_/g, ' ') + ' support request';
    let ticketNumber: string | null = null;

    if (supabaseAdmin) {
      const { data: ticket, error: ticketError } = await supabaseAdmin
        .from('support_tickets')
        .insert({
          source: 'contact_form',
          category: mappedCategory,
          product_area: mappedCategory === 'technical' ? 'Behavior Study Tools' : null,
          name: cleanName,
          email: cleanEmail,
          subject,
          message: cleanMessage,
          page_url: typeof page_url === 'string' ? page_url.slice(0, 2000) : null,
          user_agent: request.headers.get('user-agent'),
          platform: typeof platform === 'string' ? platform.slice(0, 80) : null,
          metadata: { origin: 'behaviorschool.com/support' },
          tags: mappedCategory === 'bug' ? ['bug-report'] : [],
        })
        .select('id, ticket_number')
        .single();

      if (ticketError) {
        console.error('Support ticket creation failed:', ticketError);
      } else if (ticket) {
        ticketNumber = ticket.ticket_number;
        const { error: eventError } = await supabaseAdmin.from('support_ticket_events').insert({
          ticket_id: ticket.id,
          actor_type: 'customer',
          actor_email: cleanEmail,
          event_type: 'created',
          body: cleanMessage,
          metadata: { origin: 'behaviorschool.com/support' },
        });
        if (eventError) console.error('Support ticket creation event failed:', eventError);
      }
    }

    console.log('=== SUPPORT REQUEST ===');
    console.log('Ticket: ' + (ticketNumber || 'not-created'));
    console.log('Name: ' + cleanName);
    console.log('Email: ' + cleanEmail);
    console.log('Category: ' + mappedCategory);
    console.log('Message: ' + cleanMessage);
    console.log('Timestamp: ' + new Date().toISOString());
    console.log('=======================');

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey !== 'placeholder') {
      try {
        const safeName = escapeHtml(cleanName);
        const safeEmail = escapeHtml(cleanEmail);
        const safeCategory = escapeHtml(mappedCategory);
        const safeMessage = escapeHtml(cleanMessage).replace(/\\n/g, '<br>');
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + resendKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: RESEND_FROM_SUPPORT,
            to: ['rob@behaviorschool.com'],
            subject: '[Support' + (ticketNumber ? ' ' + ticketNumber : '') + '] ' + mappedCategory + ': ' + cleanMessage.slice(0, 60),
            html: '<h2>New Support Request</h2>' +
              '<p><strong>Ticket:</strong> ' + escapeHtml(ticketNumber || 'Not created') + '</p>' +
              '<p><strong>From:</strong> ' + safeName + ' (' + safeEmail + ')</p>' +
              '<p><strong>Category:</strong> ' + safeCategory + '</p>' +
              '<p><strong>Message:</strong></p>' +
              '<blockquote style="border-left:3px solid #10b981;padding-left:12px;color:#334155;">' +
              safeMessage +
              '</blockquote>' +
              '<p style="color:#94a3b8;font-size:12px;">Sent from behaviorschool.com/support at ' +
              new Date().toISOString() +
              '</p>',
            reply_to: cleanEmail,
          }),
        });
      } catch (emailError) {
        console.error('Resend email failed:', emailError);
      }
    }

    return NextResponse.json({ success: true, ticketNumber });
  } catch (error) {
    console.error('Support form error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
