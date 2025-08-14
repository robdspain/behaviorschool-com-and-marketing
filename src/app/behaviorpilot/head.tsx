export default function Head() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BehaviorPilot",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description: "From FBA to BIP to progress monitoring — centralized, fast, and AI-assisted.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  } as const;

  return (
    <>
      <title>BehaviorPilot — The Behavior Analyst OS for Schools</title>
      <meta name="description" content="From FBA to BIP to progress monitoring — centralized, fast, and AI-assisted." />
      <meta property="og:title" content="BehaviorPilot — The Behavior Analyst OS for Schools" />
      <meta property="og:description" content="From FBA to BIP to progress monitoring — centralized, fast, and AI-assisted." />
      <meta property="og:type" content="website" />
      <link rel="stylesheet" href="/assets/css/bs-landing.css" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}