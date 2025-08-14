"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export const dynamic = "force-dynamic";

export default function AdminIndex() {
  const { status } = useSession();
  const authed = status === "authenticated";
  return (
    <div className="min-h-[calc(100vh-64px-64px)] flex items-center justify-center px-6 py-12">
      {!authed ? (
        <div className="w-full max-w-[440px]">
          <div className="rounded-2xl border shadow-sm bg-white/70 backdrop-blur px-6 py-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Sign in</h1>
              <p className="mt-2 text-slate-600">Access the Behavior School admin dashboard</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => signIn("google")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-slate-800 hover:bg-slate-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 29.083 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 14 24 14c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 29.083 4 24 4c-7.9 0-14.605 4.575-17.694 10.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.193l-6.192-5.238C29.117 35.091 26.715 36 24 36c-5.202 0-9.616-3.317-11.274-7.946l-6.524 5.027C9.254 39.26 16.044 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.094 5.57l.003-.002 6.192 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"/></svg>
                Continue with Google
              </button>
            </div>
            <div className="mt-6 text-center text-xs text-slate-500">
              By continuing, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </div>
            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-slate-600 hover:text-slate-800">Back to site</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Marketing Admin</h1>
              <p className="text-slate-600 mt-1">Authenticated</p>
            </div>
            <button onClick={() => signOut()} className="inline-flex items-center rounded-md border px-4 py-2 text-slate-700 hover:bg-slate-50">Sign out</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h2 className="font-semibold mb-1">Traffic</h2>
              <p className="text-sm text-slate-600">Hook up Plausible/Umami here</p>
            </div>
            <div className="rounded-lg border p-4">
              <h2 className="font-semibold mb-1">Email</h2>
              <p className="text-sm text-slate-600">Connect Mailgun statistics</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


