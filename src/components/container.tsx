import * as React from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(
        "mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    />
  );
}

export default Container;


