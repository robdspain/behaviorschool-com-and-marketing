import AboutContent from "./AboutContent";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function AboutPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs 
          items={[
            { label: "About" }
          ]}
        />
      </div>
      <AboutContent />
    </div>
  );
}