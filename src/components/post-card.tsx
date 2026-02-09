"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

import type { Post } from "@/lib/ghost-hybrid";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase-client";

function formatDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function decodeHtmlEntities(text: string): string {
  if (typeof window === 'undefined') {
    // Server-side: use a basic regex replacement for common entities
    return text
      .replace(/&apos;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&#x22;/g, '"')
      .replace(/&#34;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&#x26;/g, '&')
      .replace(/&#38;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&#x3C;/g, '<')
      .replace(/&#60;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#x3E;/g, '>')
      .replace(/&#62;/g, '>')
      .replace(/&#x2014;/g, '\u2014') // em dash
      .replace(/&#8212;/g, '\u2014')
      .replace(/&#x2013;/g, '\u2013') // en dash
      .replace(/&#8211;/g, '\u2013')
      .replace(/&#x2019;/g, '\u2019') // right single quote
      .replace(/&#8217;/g, '\u2019')
      .replace(/&#x201C;/g, '\u201C') // left double quote
      .replace(/&#8220;/g, '\u201C')
      .replace(/&#x201D;/g, '\u201D') // right double quote
      .replace(/&#8221;/g, '\u201D');
  }

  // Client-side: use DOM parser for complete decoding
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export interface PostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
  hrefBase?: string;
  useExternalUrl?: boolean;
}

export function PostCard({ post, className, hrefBase = "/blog", useExternalUrl = false, ...props }: PostCardProps) {
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => {
    const run = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthed(!!session);
      } catch {
        setIsAuthed(false);
      }
    };
    run();
  }, []);

  const href = `${hrefBase}/${post.slug}`;
  const primaryTag = post.primary_tag ?? (post.tags && post.tags.length > 0 ? post.tags[0] : null);
  const imageSrc = React.useMemo(() => {
    const fallback = "/thumbnails/hero-thumb.webp";
    let src = post.feature_image || fallback;

    // Handle protocol-relative URLs
    if (src.startsWith("//")) src = `https:${src}`;

    // Ensure HTTPS
    if (src.startsWith("http://")) src = src.replace(/^http:/, "https:");

    // Transform Ghost content images to use proxy with WebP optimization
    if (src.includes('/content/images/')) {
      const pathMatch = src.match(/\/content\/images\/.+$/);
      if (pathMatch && !src.includes('/media/ghost')) {
        // Use proxy with WebP optimization for thumbnail images
        src = `/media/ghost${pathMatch[0]}?w=800&q=75&f=webp`;
      }
    }

    return src;
  }, [post.feature_image]);

  return (
    <Card className={cn("group overflow-hidden h-full flex flex-col", className)} {...props}>
      {imageSrc ? (
        <div className="w-full bg-slate-50 h-48 sm:h-56 lg:h-64 flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
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
          <p className="text-sm text-muted-foreground line-clamp-3">{decodeHtmlEntities(post.excerpt)}</p>
        ) : null}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
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
        {isAuthed ? (
          <Link
            href={`/admin/blog/editor?slug=${encodeURIComponent(post.slug)}`}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
            aria-label={`Edit ${post.title}`}
          >
            Edit
          </Link>
        ) : null}
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
