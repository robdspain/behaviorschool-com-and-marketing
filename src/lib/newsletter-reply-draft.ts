export type NewsletterReaderResponse = {
  id: string
  email: string
  answer: string
  rating?: number | null
  createdAt: number
}

export function newsletterReplyDraftHref(response: NewsletterReaderResponse, issueSubject: string) {
  const answer = response.answer.trim().slice(0, 500)
  const subject = `Re: ${issueSubject.trim()}`
  const body = `Hi,\n\nThank you for taking the time to respond to The Weekly Research Brief. You wrote:\n\n"${answer}"\n\n`

  return `mailto:${encodeURIComponent(response.email.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
