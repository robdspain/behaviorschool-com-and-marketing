import type { Metadata } from "next";

const DEFAULT_OG_IMAGE = "https://behaviorschool.com/optimized/og-image.webp";

type PageMetadataOptions = {
  title: string;
  description: string;
  canonical: string;
  keywords?: Metadata["keywords"];
  type?: "website" | "article";
  image?: string;
  imageAlt?: string;
};

export function buildPageMetadata({
  title,
  description,
  canonical,
  keywords,
  type = "website",
  image = DEFAULT_OG_IMAGE,
  imageAlt = "Behavior School",
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Behavior School",
      locale: "en_US",
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
