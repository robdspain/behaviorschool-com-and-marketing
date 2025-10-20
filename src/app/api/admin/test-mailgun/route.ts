import { NextRequest, NextResponse } from 'next/server';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const config = {
      hasApiKey: !!process.env.MAILGUN_API_KEY,
      hasDomain: !!process.env.MAILGUN_DOMAIN,
      hasFromEmail: !!process.env.MAILGUN_FROM_EMAIL,
      domain: process.env.MAILGUN_DOMAIN ? process.env.MAILGUN_DOMAIN.substring(0, 3) + '...' : 'missing',
      fromEmail: process.env.MAILGUN_FROM_EMAIL ? process.env.MAILGUN_FROM_EMAIL.split('@')[1] : 'missing',
    };

    // Try to initialize Mailgun client
    let clientError = null;
    try {
      const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY || '',
      });

      // Try to get domain info (this tests if credentials work)
      const domainInfo = await mg.domains.get(process.env.MAILGUN_DOMAIN || '');
      
      return NextResponse.json({
        success: true,
        config,
        mailgunConnected: true,
        domainInfo: {
          name: domainInfo.name,
          state: domainInfo.state,
          type: domainInfo.type,
        }
      });
    } catch (err) {
      clientError = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json({
        success: false,
        config,
        mailgunConnected: false,
        error: clientError,
        message: 'Mailgun credentials are invalid or domain not found'
      });
    }
  } catch (error) {
    console.error('Error testing Mailgun:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

