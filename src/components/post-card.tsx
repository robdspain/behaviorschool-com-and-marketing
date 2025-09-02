"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import type { Post } from "@/lib/ghost";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export interface PostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
  hrefBase?: string;
  useExternalUrl?: boolean;
}

export function PostCard({ post, className, hrefBase = "/blog", useExternalUrl = false, ...props }: PostCardProps) {
  const href = `${hrefBase}/${post.slug}`;
  const primaryTag = post.primary_tag ?? (post.tags && post.tags.length > 0 ? post.tags[0] : null);
  const imageSrc = React.useMemo(() => {
    if (!post.feature_image) return "/thumbnails/hero-thumb.webp";
    try {
      const url = new URL(post.feature_image);
      if (url.protocol === "http:") {
        url.protocol = "https:";
        return url.toString();
      }
      return post.feature_image;
    } catch {
      return post.feature_image.startsWith("/") ? post.feature_image : "/thumbnails/hero-thumb.webp";
    }
  }, [post.feature_image]);

  // Fallback client-side if the remote image fails to load
  const [resolvedSrc, setResolvedSrc] = React.useState(imageSrc);
  React.useEffect(() => {
    setResolvedSrc(imageSrc);
  }, [imageSrc]);

  return (
    <Card className={cn("group overflow-hidden h-full flex flex-col", className)} {...props}>
      {imageSrc ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={resolvedSrc}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={() => setResolvedSrc("/thumbnails/hero-thumb.webp")}
          />
        </div>
      ) : null}
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          {primaryTag ? (
            <Badge variant="secondary" className="truncate max-w-[60%]">
              {primaryTag.name}
            </Badge>
          ) : <span />}
          {post.published_at ? (
            <span className="text-xs text-muted-foreground">{formatDate(post.published_at)}</span>
          ) : null}
        </div>
        <CardTitle className="line-clamp-2 leading-tight">
          {useExternalUrl && post.url ? (
            <a href={post.url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
              {post.title}
            </a>
          ) : (
            <Link href={href} className="hover:underline underline-offset-4">
              {post.title}
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {post.excerpt ? (
          <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
        ) : null}
      </CardContent>
      <CardFooter>
        {useExternalUrl && post.url ? (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
            aria-label={`Read ${post.title}`}
          >
            Read <ArrowRight className="size-4" />
          </a>
        ) : (
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
            aria-label={`Read ${post.title}`}
          >
            Read <ArrowRight className="size-4" />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

export function PostCardSkeleton({ className, withImage = true }: { className?: string; withImage?: boolean }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-card text-card-foreground shadow-xs", className)}>
      {withImage ? <Skeleton className="h-44 w-full" /> : null}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="pt-2">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export default PostCard;


