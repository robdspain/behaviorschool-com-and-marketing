'use client'

import { useCallback } from 'react'

export default function SignOutButton() {
  const onClick = useCallback(async () => {
    // Use server route to clear cookie-based session
    window.location.href = '/auth/signout'
  }, [])

  return (
    <button
      onClick={onClick}
      className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
      aria-label="Sign out"
    >
      Sign out
    </button>
  )
}

