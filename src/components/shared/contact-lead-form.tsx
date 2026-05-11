'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

type Tone = {
  action: string
  muted: string
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function ContactLeadForm({ tone }: { tone: Tone }) {
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setState('submitting')

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      subject: String(formData.get('subject') || ''),
      message: String(formData.get('message') || ''),
      honeypot: String(formData.get('company_website') || ''),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string }

      if (!response.ok || !result.ok) {
        setError(result.error || 'Something went wrong. Please try again.')
        setState('error')
        return
      }

      form.reset()
      setState('success')
    } catch {
      setError('Network error. Please check your connection and try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-[1.5rem] border border-emerald-500/25 bg-emerald-500/10 p-5" role="status">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <div>
            <h3 className="text-lg font-semibold">Message received</h3>
            <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>
              Thanks for reaching out. Our team has received your request and will contact you if more details are needed.
            </p>
            <button
              type="button"
              className="mt-4 rounded-full border border-current/15 px-4 py-2 text-sm font-semibold"
              onClick={() => setState('idle')}
            >
              Send another message
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4" noValidate>
      <input className="hidden" name="company_website" tabIndex={-1} autoComplete="off" />
      <input
        className="h-12 rounded-xl border border-current/10 bg-transparent px-4 text-sm outline-none transition focus:border-current/35"
        name="name"
        placeholder="Your name"
        required
        autoComplete="name"
        disabled={state === 'submitting'}
      />
      <input
        className="h-12 rounded-xl border border-current/10 bg-transparent px-4 text-sm outline-none transition focus:border-current/35"
        name="email"
        type="email"
        placeholder="Email address"
        required
        autoComplete="email"
        disabled={state === 'submitting'}
      />
      <input
        className="h-12 rounded-xl border border-current/10 bg-transparent px-4 text-sm outline-none transition focus:border-current/35"
        name="phone"
        type="tel"
        placeholder="Phone number (optional)"
        autoComplete="tel"
        disabled={state === 'submitting'}
      />
      <input
        className="h-12 rounded-xl border border-current/10 bg-transparent px-4 text-sm outline-none transition focus:border-current/35"
        name="subject"
        placeholder="What do you need help with?"
        maxLength={200}
        disabled={state === 'submitting'}
      />
      <textarea
        className="min-h-[180px] rounded-2xl border border-current/10 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-current/35"
        name="message"
        placeholder="Share the full context so we can respond with the right next step."
        required
        minLength={10}
        disabled={state === 'submitting'}
      />
      {error ? <p className="text-sm text-red-500" role="alert">{error}</p> : null}
      <button
        type="submit"
        disabled={state === 'submitting'}
        className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 ${tone.action}`}
      >
        {state === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {state === 'submitting' ? 'Sending...' : 'Send message'}
      </button>
    </form>
  )
}
