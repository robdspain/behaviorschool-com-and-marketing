/**** eslint-disable @next/next/no-css-tags ****/
export default function Head() {
	return (
		<>
			<title>ClassroomPilot — Your Co-Pilot for Special Education</title>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="description" content="IEP-aligned planning, progress tracking, and reporting with less paperwork." />
			<meta property="og:title" content="ClassroomPilot — Your Co-Pilot for Special Education" />
			<meta property="og:description" content="IEP-aligned planning, progress tracking, and reporting with less paperwork." />
			<meta property="og:type" content="website" />
			<link rel="stylesheet" href="/assets/css/bs-landing.css" />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: "ClassroomPilot",
						applicationCategory: "EducationalApplication",
						operatingSystem: "Web",
						description:
							"IEP-aligned planning, progress tracking, and reporting with less paperwork.",
						offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
					}),
				}}
			/>
		</>
	);
}