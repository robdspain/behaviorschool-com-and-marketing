import type { Metadata } from "next";
import { getPosts } from "@/lib/ghost";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { PostList } from "@/components/post-list";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

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
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
        <Breadcrumbs 
          items={[
            { label: "Blog" }
          ]}
        />
      </div>
      
      <Section>
        <Container>
          <div className="mb-8">
            {/* Removed Blog heading and description while maintaining spacing */}
          </div>
        {posts.length > 0 ? (
          <PostList posts={posts} columns={3} useExternalUrl={false} />
        ) : (
          <p className="text-muted-foreground">No posts found.</p>
        )}
        </Container>
      </Section>
    </div>
  );
}


