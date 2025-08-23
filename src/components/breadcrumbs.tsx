import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Create structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://behaviorschool.com"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.name,
        ...(item.href && { "item": `https://behaviorschool.com${item.href}` })
      }))
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
        <Link 
          href="/" 
          className="flex items-center hover:text-emerald-600 transition-colors"
          aria-label="Go to homepage"
        >
          <Home className="w-4 h-4" />
          <span className="sr-only">Home</span>
        </Link>
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-slate-400" />
            {item.href ? (
              <Link 
                href={item.href}
                className="hover:text-emerald-600 transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-slate-900 font-medium">{item.name}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}