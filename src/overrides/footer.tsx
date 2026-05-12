export const FOOTER_OVERRIDE_ENABLED = true

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'

export function FooterOverride() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src="/favicon.png?v=20260401" alt={`${SITE_CONFIG.name} logo`} width="40" height="40" className="h-10 w-10 rounded-xl border border-slate-200 bg-slate-50 p-1" />
              <span className="text-lg font-semibold text-slate-900">{SITE_CONFIG.name}</span>
            </div>
            <p className="mt-4 text-sm text-slate-600">{SITE_CONFIG.description}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium text-slate-900">Company</p>
            <Link href="/about" className="text-sm text-slate-600 hover:text-slate-900">
              About Us
            </Link>
            <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-900">
              Contact Us
            </Link>
            <Link href="/help" className="text-sm text-slate-600 hover:text-slate-900">
              Help Center
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium text-slate-900">Explore</p>
            <Link href="/pdf" className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100">
              PDF
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
