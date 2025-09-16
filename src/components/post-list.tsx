"use client";

import * as React from "react";
import type { Post } from "@/lib/ghost-hybrid";
import { PostCard, PostCardSkeleton } from "@/components/post-card";
import { cn } from "@/lib/utils";

export interface PostListProps extends React.HTMLAttributes<HTMLDivElement> {
  posts: Post[];
  hrefBase?: string;
  columns?: 1 | 2 | 3 | 4;
  useExternalUrl?: boolean;
}

export function PostList({ posts, className, hrefBase = "/blog", columns = 3, useExternalUrl = false, ...props }: PostListProps) {
  const gridCols =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : columns === 4
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={cn("grid gap-6", gridCols, className)} {...props}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} hrefBase={hrefBase} useExternalUrl={useExternalUrl} />
      ))}
    </div>
  );
}

export function PostListSkeleton({ count = 6, className, withImage = true }: { count?: number; className?: string; withImage?: boolean }) {
  return (
    <div className={cn("grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <PostCardSkeleton key={index} withImage={withImage} />
      ))}
    </div>
  );
}

export default PostList;


