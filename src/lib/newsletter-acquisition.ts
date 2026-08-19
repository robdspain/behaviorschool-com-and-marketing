export const NEWSLETTER_GROWTH_LAUNCH_AT = Date.parse('2026-08-19T00:47:08Z')
export const NEWSLETTER_CONFIRMED_TARGET = 50

export type NewsletterSubscriberRecord = {
  source?: string
  confirmedAt?: number
  updatedAt: number
}

export function summarizeNewsletterAcquisition(
  confirmedTotal: number,
  confirmedContacts: NewsletterSubscriberRecord[],
  pendingContacts: NewsletterSubscriberRecord[],
  launchAt = NEWSLETTER_GROWTH_LAUNCH_AT,
  targetConfirmed = NEWSLETTER_CONFIRMED_TARGET,
) {
  const confirmedSinceLaunch = confirmedContacts.filter((contact) => (contact.confirmedAt ?? 0) >= launchAt)
  const pendingSinceLaunch = pendingContacts.filter((contact) => contact.updatedAt >= launchAt)
  const sources = new Map<string, { requested: number; confirmed: number; pending: number }>()

  for (const contact of confirmedSinceLaunch) {
    const source = contact.source?.trim() || 'unknown'
    const current = sources.get(source) ?? { requested: 0, confirmed: 0, pending: 0 }
    current.requested += 1
    current.confirmed += 1
    sources.set(source, current)
  }
  for (const contact of pendingSinceLaunch) {
    const source = contact.source?.trim() || 'unknown'
    const current = sources.get(source) ?? { requested: 0, confirmed: 0, pending: 0 }
    current.requested += 1
    current.pending += 1
    sources.set(source, current)
  }

  return {
    launchAt,
    targetConfirmed,
    confirmedTotal,
    confirmedSinceLaunch: confirmedSinceLaunch.length,
    remainingToTarget: Math.max(0, targetConfirmed - confirmedTotal),
    pendingSinceLaunch: pendingSinceLaunch.length,
    sources: [...sources.entries()]
      .map(([source, counts]) => ({
        source,
        ...counts,
        confirmationRate: counts.requested ? counts.confirmed / counts.requested : null,
      }))
      .sort((left, right) => right.confirmed - left.confirmed || right.requested - left.requested || left.source.localeCompare(right.source)),
  }
}
