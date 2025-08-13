import type { Metadata } from "next";
import { getPosts } from "@/lib/ghost";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { PostList } from "@/components/post-list";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Behavior School",
  description: "Articles and resources from Behavior School.",
};

export default async function BlogPage() {
  // Try tagged posts first; if none, fall back to all posts
  const tagged = await getPosts({ limit: 24, tag: "blog", order: "published_at desc", include: "tags,authors" });
  const posts = tagged.posts.length > 0
    ? tagged.posts
    : (await getPosts({ limit: 24, order: "published_at desc", include: "tags,authors" })).posts;

  return (
    <Section>
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
          <p className="mt-2 text-muted-foreground">Latest posts from our Ghost CMS.</p>
        </div>
        {posts.length > 0 ? (
          <PostList posts={posts} columns={3} />
        ) : (
          <p className="text-muted-foreground">No posts found.</p>
        )}
      </Container>
    </Section>
  );
}


