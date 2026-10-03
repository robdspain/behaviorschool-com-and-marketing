const FBA_EVENT_PATH = '/events/fba-in-a-school-setting';

const FBA_DEFAULT_UTM_PARAMS = {
  utm_source: 'calaba',
  utm_medium: 'slide',
  utm_campaign: 'fba-20261009',
} as const;

export function buildFbaShortLinkDestination(requestUrl: string): string {
  const url = new URL(requestUrl);

  for (const [key, value] of Object.entries(FBA_DEFAULT_UTM_PARAMS)) {
    if (!url.searchParams.get(key)) {
      url.searchParams.set(key, value);
    }
  }

  url.pathname = FBA_EVENT_PATH;
  return url.toString();
}
