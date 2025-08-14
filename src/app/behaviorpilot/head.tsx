/* eslint-disable @next/next/no-css-tags */
export default function Head() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BehaviorPilot",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
      "From FBA to BIP to progress monitoring — centralized, fast, and AI-assisted.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  } as const;

  return (
    <>
      <link rel="stylesheet" href="/assets/css/bs-landing.css" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}