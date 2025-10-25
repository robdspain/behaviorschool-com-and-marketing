"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { useEffect, useState } from "react";
import { Edit } from "lucide-react";

export function EditPostButton({ ghostId, slug }: { ghostId: string; slug: string }) {
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

  if (!isAuthed) return null;

  const ghostBase = (process.env.NEXT_PUBLIC_GHOST_CONTENT_URL || "https://ghost.behaviorschool.com").replace(/\/ghost\/api\/content$/, "");

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col gap-2">
        <Link
          href={`/admin/blog/editor?id=${encodeURIComponent(ghostId)}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border-2 border-emerald-200 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
          title="Edit this post in Admin"
        >
          <Edit className="w-4 h-4" />
          Edit Post
        </Link>
        <a
          href={`${ghostBase}/ghost/#/editor/post`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
          title="Open Ghost Admin"
        >
          Ghost Admin
        </a>
      </div>
    </div>
  );
}
