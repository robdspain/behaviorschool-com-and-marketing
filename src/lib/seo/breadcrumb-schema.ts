/**
 * Generate BreadcrumbList JSON-LD schema for SEO
 *
 * @param items - Array of breadcrumb items with label and optional href
 * @param baseUrl - Base URL for the site (defaults to behaviorschool.com)
 * @returns BreadcrumbList schema object ready for JSON-LD injection
 *
 * @example
 * ```typescript
 * const breadcrumbs = [
 *   { label: "Home", href: "/" },
 *   { label: "Products", href: "/products" },
 *   { label: "IEP Goals" } // Current page, no href
 * ];
 *
 * const schema = generateBreadcrumbSchema(breadcrumbs);
 *
 * // In component:
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 * />
 * ```
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbSchema {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  baseUrl: string = "https://behaviorschool.com"
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const listItem: {
        "@type": string;
        position: number;
        name: string;
        item?: string;
      } = {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
      };

      // Only add 'item' property if href is provided (not for current page)
      if (item.href) {
        listItem.item = `${baseUrl}${item.href}`;
      }

      return listItem;
    }),
  };
}

/**
 * Helper function to create breadcrumb schema directly from route
 * Automatically generates items based on URL path segments
 *
 * @param pathname - Current pathname (e.g., "/school-bcba/job-guide-2025")
 * @param labels - Optional custom labels for each segment
 * @param baseUrl - Base URL for the site
 * @returns BreadcrumbList schema object
 *
 * @example
 * ```typescript
 * const schema = generateBreadcrumbSchemaFromPath(
 *   "/school-bcba/job-guide-2025",
 *   {
 *     "school-bcba": "School BCBA Hub",
 *     "job-guide-2025": "Job Guide 2025"
 *   }
 * );
 * ```
 */
export function generateBreadcrumbSchemaFromPath(
  pathname: string,
  labels?: Record<string, string>,
  baseUrl: string = "https://behaviorschool.com"
): BreadcrumbSchema {
  const segments = pathname.split("/").filter(Boolean);

  const items: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
  ];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLastSegment = index === segments.length - 1;

    items.push({
      label: labels?.[segment] || formatSegmentLabel(segment),
      // Don't include href for the last segment (current page)
      href: isLastSegment ? undefined : currentPath,
    });
  });

  return generateBreadcrumbSchema(items, baseUrl);
}

/**
 * Format URL segment into readable label
 * Converts kebab-case to Title Case
 *
 * @param segment - URL segment (e.g., "school-bcba" or "job-guide-2025")
 * @returns Formatted label (e.g., "School BCBA" or "Job Guide 2025")
 */
function formatSegmentLabel(segment: string): string {
  return segment
    .split("-")
    .map((word) => {
      // Don't capitalize common acronyms
      const upperWord = word.toUpperCase();
      if (["BCBA", "IEP", "FBA", "BIP", "ACT", "MTSS", "PBIS"].includes(upperWord)) {
        return upperWord;
      }
      // Capitalize first letter of other words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
