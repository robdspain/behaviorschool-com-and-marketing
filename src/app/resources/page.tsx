export const dynamic = "force-dynamic";
import Link from "next/link";
import { getPosts, type Post } from "@/lib/ghost";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources for School‑based BCBAs | Behavior School",
  description: "Free behavior analysis resources, guides, and tools for school‑based BCBAs and educators.",
  alternates: { canonical: "/resources" },
};

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
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Behavior Analysis Resources for School‑based BCBAs</h1>
      <div>
        {posts.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </div>
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Resources FAQ</h2>
        <div className="space-y-4 text-slate-700">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Where can I find BCBA exam prep resources?</h3>
            <p>Visit our Study Tools page for AI‑powered BCBA exam prep, practice tests, and analytics.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Do you publish resources for BCBA supervision in schools?</h3>
            <p>Yes—browse posts tagged supervision for templates, checklists, and guidance tailored to school‑based BCBA supervision.</p>
          </div>
        </div>
      </section>
    </div>
  );
}


