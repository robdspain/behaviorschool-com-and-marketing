import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
  
  // Create full breadcrumb list with Home
  const fullBreadcrumbs = [
    { label: "Home", href: "/" },
    ...items
  ];

  // Generate structured data for Google
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": fullBreadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `${SITE_URL}${item.href}` })
    }))
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className={`flex items-center space-x-1 text-sm text-slate-600 ${className}`}>
        {fullBreadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-slate-400" />}
            
            {item.href ? (
              <Link 
                href={item.href}
                className="hover:text-emerald-700 transition-colors flex items-center"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-medium flex items-center">
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
      
      {/* Structured Data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />
    </>
  );
}