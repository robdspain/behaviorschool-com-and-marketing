import { buildPageMetadata } from "@/lib/seo/metadata";
import { fbaFaqs } from "./faqs";
import { FbaGuide } from "./guide";

const canonical = "https://behaviorschool.com/functional-behavior-assessment-guide";
const headline = "Functional Behavior Assessment in Schools: Examples, Template and Steps";
const description =
  "Plain FBA steps for school BCBAs, with 12 hypothesis statement examples, a printable FBA template, two worked cases, and sources for every claim.";

export const metadata = buildPageMetadata({
  title: "FBA Examples, Template and Steps for School BCBAs",
  description,
  canonical,
  type: "article",
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://behaviorschool.com/about#rob-spain",
      name: "Rob Spain",
      honorificSuffix: "M.S., BCBA, IBA",
      jobTitle: "BCBA",
      url: "https://behaviorschool.com/about",
    },
    {
      "@type": "Article",
      headline,
      description,
      url: canonical,
      dateModified: "2026-10-04",
      author: { "@id": "https://behaviorschool.com/about#rob-spain" },
      reviewedBy: { "@id": "https://behaviorschool.com/about#rob-spain" },
      publisher: {
        "@type": "Organization",
        name: "Behavior School",
        url: "https://behaviorschool.com",
      },
      mainEntityOfPage: canonical,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://behaviorschool.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "FBA guide",
          item: canonical,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: fbaFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <FbaGuide />
    </>
  );
}
