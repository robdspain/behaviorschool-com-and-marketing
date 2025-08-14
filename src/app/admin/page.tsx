"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export const dynamic = "force-dynamic";

export default function AdminIndex() {
  const { status } = useSession();
  const authed = status === "authenticated";
  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Marketing Admin</h1>
      <p className="text-slate-600 mb-8">Sign in with Google to access dashboards and tools.</p>
      {!authed ? (
        <div className="flex gap-3">
          <button onClick={() => signIn("google") } className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Sign in</button>
          <Link href="/" className="inline-flex items-center rounded-md border px-4 py-2 text-slate-700 hover:bg-slate-50">Back to site</Link>
        </div>
      ) : (
        <div className="flex gap-3">
          <button onClick={() => signOut() } className="inline-flex items-center rounded-md border px-4 py-2 text-slate-700 hover:bg-slate-50">Sign out</button>
          <Link href="/" className="inline-flex items-center rounded-md border px-4 py-2 text-slate-700 hover:bg-slate-50">Back to site</Link>
        </div>
      )}
      {authed && (
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-1">Traffic</h2>
          <p className="text-sm text-slate-600">Hook up Plausible/Umami here</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-1">Email</h2>
          <p className="text-sm text-slate-600">Connect Mailgun statistics</p>
        </div>
      </div>
      )}
    </div>
  );
}


