import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "header" | "footer" | "main" | "aside" | "article" | "nav";
}

export function Section({ as: Component = "section", className, ...props }: SectionProps) {
  return (
    <Component
      data-slot="section"
      className={cn("py-12 md:py-16", className)}
      {...props}
    />
  );
}

export default Section;


