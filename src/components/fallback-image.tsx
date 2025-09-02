"use client";

import Image, { type ImageProps } from "next/image";
import * as React from "react";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
  fallbackSrc?: string;
};

function normalizeUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  try {
    const url = new URL(input);
    if (url.protocol === "http:") {
      url.protocol = "https:";
    }
    return url.toString();
  } catch {
    return input.startsWith("/") ? input : null;
  }
}

export function FallbackImage({ src, alt, fallbackSrc = "/thumbnails/hero-thumb.webp", ...rest }: Props) {
  const [hadError, setHadError] = React.useState(false);
  const normalized = React.useMemo(() => normalizeUrl(src), [src]);

  const effectiveSrc = hadError || !normalized ? fallbackSrc : normalized;

  return (
    <Image
      {...rest}
      src={effectiveSrc}
      alt={alt}
      onError={() => setHadError(true)}
      unoptimized
    />
  );
}

export default FallbackImage;

