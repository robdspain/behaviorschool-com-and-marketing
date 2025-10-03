export const dynamic = "force-dynamic";
import Link from "next/link";
import { getPosts, type Post } from "@/lib/ghost-hybrid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

function PostRow({ post }: { post: Post }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h3>
      {post.excerpt ? <p className="text-slate-600 text-sm">{post.excerpt}</p> : null}
    </div>
  );
}

export default async function ResourcesPage() {
  const { posts } = await getPosts({ limit: 24, tag: "resources", order: "published_at desc" });
  return (
    <div className="min-h-screen bg-bs-background">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 pt-24 pb-12">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs 
            items={[
              { label: "Resources" }
            ]}
          />
        </div>
      
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Resources</h1>
      <div>
        {posts.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </div>
      </div>
    </div>
  );
}


