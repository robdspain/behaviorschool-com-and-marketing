export const dynamic = "force-dynamic";
import Link from "next/link";
import { getPosts, type Post } from "@/lib/ghost";
import { GhostSignup } from "@/components/ghost-signup";

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
    <div className="mx-auto max-w-4xl px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Resources</h1>
      <div>
        {posts.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </div>
      <div className="mt-12">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-slate-900">Get new resources in your inbox</h2>
          <p className="text-slate-600 mt-2">Join the newsletter for fresh posts, tools, and actionable insights.</p>
        </div>
        <div className="max-w-md mx-auto">
          <GhostSignup />
        </div>
      </div>
    </div>
  );
}


