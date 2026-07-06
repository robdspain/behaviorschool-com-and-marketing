import { redirect } from 'next/navigation'

export default async function LaunchPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const resolvedSearchParams = await searchParams
  const mode = (resolvedSearchParams.mode || 'mini').toLowerCase()
  const url = mode === 'full'
    ? 'https://study.behaviorschool.com/quiz/guest?limit=185'
    : 'https://study.behaviorschool.com/quiz/guest?limit=10'
  // In a fuller build, call our API to record attempt before redirecting.
  redirect(url)
}
