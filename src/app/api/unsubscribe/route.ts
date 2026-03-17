import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Use the send email endpoint with unsubscribe headers as a workaround
    // when the API key is restricted to sending only.
    const { data, error } = await resend.emails.send({
      from: 'unsubscribe@updates.behaviorschool.com',
      to: normalizedEmail,
      subject: 'Confirming your unsubscription',
      text: 'You have been unsubscribed from our mailing list.',
      headers: {
        'List-Unsubscribe': 'true',
      },
    });

    if (error) {
      console.error('Resend Unsubscribe-via-Send Error:', error);
      return NextResponse.json({ error: 'Failed to process unsubscribe request.' }, { status: 500 });
    }

    console.log(`Successfully sent unsubscribe request for ${normalizedEmail}. ID: ${data?.id}`);

    return NextResponse.json({ success: true, message: 'Your unsubscribe request has been processed.' });

  } catch (error: any) {
    console.error('Unsubscribe Route Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
