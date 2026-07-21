export const dynamic = 'force-dynamic';

import { GET as getEmailMarketingOverview } from '../email-marketing/overview/route';

export async function GET() {
  return getEmailMarketingOverview();
}
