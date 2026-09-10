/**
 * Behavior Study Tools (study.behaviorschool.com) public prices.
 * Confirmed against live Stripe on 2026-09-10 (acct_1QeP6UAHZC9qJnAY).
 *
 * Product: Behavior Study Tools - Subscription Plans (prod_S0nkky3ZYqMepM)
 *   - Monthly:   price_1R6m9HAHZC9qJnAY493ruDfS  $29.99 / month
 *   - Quarterly: price_1R6m9HAHZC9qJnAYFORHC1ZJ  $89.99 / 3 months (default)
 *   - Annual:    price_1R6m9IAHZC9qJnAYbobeaNIo  $288.00 / year
 *
 * Inactive "BehaviorSchool Study Pro" prices ($29.99 / $287.88) are not public.
 * There is no $49 mock-exam SKU, $149/6-month, $199/year, or $249 bundle.
 */
export const STUDY_PRICING = {
  productName: "Behavior Study Tools",
  siteUrl: "https://study.behaviorschool.com/",
  stripeCheckedOn: "September 10, 2026",
  monthly: {
    label: "$29.99",
    per: "/month",
    short: "$29.99/month",
    cents: 2999,
    stripePriceId: "price_1R6m9HAHZC9qJnAY493ruDfS",
  },
  quarterly: {
    label: "$89.99",
    per: "/quarter",
    short: "$89.99/quarter",
    cents: 8999,
    stripePriceId: "price_1R6m9HAHZC9qJnAYFORHC1ZJ",
  },
  annual: {
    label: "$288",
    per: "/year",
    short: "$288/year",
    cents: 28800,
    stripePriceId: "price_1R6m9IAHZC9qJnAYbobeaNIo",
  },
} as const;

export const STUDY_PRICING_LINE = `${STUDY_PRICING.monthly.short}, ${STUDY_PRICING.quarterly.short}, or ${STUDY_PRICING.annual.short}`;
