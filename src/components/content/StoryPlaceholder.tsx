"use client";

import { useEffect, useState } from "react";

const PRODUCTION_HOSTS = new Set(["behaviorschool.com", "www.behaviorschool.com"]);

type Candidate = { label: string; href: string };

/**
 * Draft-only reminder for Rob's real personal story.
 * Renders nothing on the server and nothing on behaviorschool.com, so it never
 * reaches production HTML or search engines. It shows on Netlify previews and localhost.
 * Never put an invented story here. Rob replaces this with his own words.
 */
export function StoryPlaceholder({ topic, candidates = [] }: { topic: string; candidates?: Candidate[] }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!PRODUCTION_HOSTS.has(window.location.hostname));
  }, []);

  if (!show) return null;

  return (
    <aside
      role="note"
      aria-label="Draft only: Rob's story goes here"
      data-draft-only="story"
      className="my-8 rounded-xl border-2 border-dashed p-5"
      style={{ borderColor: "#1f4d3f", background: "#f4efe5", color: "#171f1d" }}
    >
      <p className="text-sm font-semibold uppercase tracking-wide">Draft only. Not shown on behaviorschool.com</p>
      <p className="mt-2 text-base">Rob&apos;s real story goes here: {topic}. Do not publish an invented story.</p>
      {candidates.length > 0 ? (
        <ul className="mt-3 list-disc pl-5 text-base">
          {candidates.map((candidate) => (
            <li key={candidate.href}>
              <a href={candidate.href} className="inline-flex min-h-11 items-center underline" style={{ color: "#1f4d3f" }}>
                {candidate.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}

export default StoryPlaceholder;
