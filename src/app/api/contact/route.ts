import { NextResponse } from 'next/server'
import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Valid email is required').max(320),
  subject: z.string().trim().max(200).optional().default(''),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(10000),
  phone: z.string().trim().max(80).optional().default(''),
  honeypot: z.string().trim().max(1).optional().default(''),
})

const getMasterContactUrl = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_MASTER_API_URL ||
    process.env.NEXT_PUBLIC_MASTER_API_BASE_URL ||
    process.env.NEXT_PUBLIC_MASTER_PANEL_URL
  const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || '9xo1in07t2'

  if (!baseUrl || !siteCode) return null
  return `${baseUrl.replace(/\/$/, '')}/api/v1/public/${siteCode}/contact`
}

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    const message =
      errors.name?.[0] || errors.email?.[0] || errors.subject?.[0] || errors.message?.[0] || 'Invalid input'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: false, error: 'Invalid contact request' }, { status: 400 })
  }

  const targetUrl = getMasterContactUrl()
  if (!targetUrl) {
    return NextResponse.json({ ok: false, error: 'Contact endpoint is not configured' }, { status: 500 })
  }

  const sourceUrl = request.headers.get('referer') || process.env.NEXT_PUBLIC_SITE_URL || 'https://mootankala.com/contact'

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        subject: parsed.data.subject || 'Mootankala contact request',
        message: parsed.data.message,
        sourceUrl,
        meta: {
          site: 'mootankala.com',
          form: 'contact-page',
        },
      }),
      cache: 'no-store',
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok || result?.success === false) {
      return NextResponse.json(
        { ok: false, error: result?.message || result?.error || 'Could not submit your message' },
        { status: response.status || 502 },
      )
    }

    return NextResponse.json({ ok: true, data: result?.data || null })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'We could not send your message right now. Please try again shortly.' },
      { status: 502 },
    )
  }
}
