'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, FileText, LayoutGrid, Menu, Search, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

export const NAVBAR_OVERRIDE_ENABLED = true

const NavbarAuthControls = dynamic(() => import('@/components/shared/navbar-auth-controls').then((mod) => mod.NavbarAuthControls), {
  ssr: false,
  loading: () => null,
})

const taskIcons: Partial<Record<TaskKey, any>> = {
  pdf: FileText,
  profile: User,
  social: User,
}

export function NavbarOverride() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false)

  useEffect(() => {
    document.body.classList.add('has-left-rail')
    return () => {
      document.body.classList.remove('has-left-rail')
    }
  }, [])

  const primaryTask = useMemo(
    () => SITE_CONFIG.tasks.find((task) => task.enabled && task.key === 'pdf') || SITE_CONFIG.tasks.find((task) => task.enabled),
    []
  )
  const secondaryTask = useMemo(
    () => SITE_CONFIG.tasks.find((task) => task.enabled && (task.key === 'profile' || task.key === 'social')) || SITE_CONFIG.tasks.find((task) => task.enabled && task.key !== primaryTask?.key),
    [primaryTask?.key]
  )
  const allEnabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const tertiaryTasks = allEnabledTasks.filter((task) => task.key !== primaryTask?.key && task.key !== secondaryTask?.key)

  const topTasks = [primaryTask, secondaryTask].filter(
    (task): task is NonNullable<typeof task> => Boolean(task)
  )

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[var(--left-rail-width)] flex-col border-r border-[rgba(12,43,78,0.16)] bg-[linear-gradient(180deg,#f8fbff_0%,#f4f4f4_100%)] p-5 lg:flex">
        <Link href="/" className="rounded-2xl border border-[rgba(12,43,78,0.15)] bg-white p-4 shadow-[0_14px_40px_rgba(12,43,78,0.08)] transition hover:shadow-[0_18px_48px_rgba(12,43,78,0.12)]">
          <div className="flex items-center gap-3">
            <img src="/favicon.png?v=20260401" alt={`${SITE_CONFIG.name} logo`} width="40" height="40" className="h-10 w-10 rounded-xl border border-[rgba(12,43,78,0.14)] bg-[#f4f7fb] p-1" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1A3D64]">{SITE_CONFIG.name}</p>
              <p className="text-xs text-[#1D546C]">PDF + Social Profile</p>
            </div>
          </div>
        </Link>

        <div className="mt-6">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1D546C]">Priority tasks</p>
          <nav className="mt-3 space-y-2">
            {topTasks.map((task) => {
              const Icon = taskIcons[task.key] || LayoutGrid
              const isActive = pathname.startsWith(task.route)
              return (
                <Link
                  key={task.key}
                  href={task.route}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold transition',
                    isActive
                      ? 'border-[#0C2B4E] bg-[#0C2B4E] text-[#F4F4F4]'
                      : 'border-[rgba(12,43,78,0.12)] bg-white text-[#1A3D64] hover:border-[#1A3D64] hover:bg-[#eff4fa]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{task.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mt-6 rounded-xl border border-[rgba(12,43,78,0.12)] bg-white p-3">
          <Link href="/search" className="flex items-center gap-2 text-sm text-[#1D546C] hover:text-[#0C2B4E]">
            <Search className="h-4 w-4" />
            Search all tools
          </Link>
        </div>

        {tertiaryTasks.length ? (
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setIsSecondaryOpen((value) => !value)}
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[#1D546C] hover:bg-[#e8eef6]"
            >
              More tools
              <ChevronDown className={cn('h-4 w-4 transition', isSecondaryOpen ? 'rotate-180' : '')} />
            </button>
            {isSecondaryOpen ? (
              <div className="mt-2 space-y-1">
                {tertiaryTasks.map((task) => (
                  <Link
                    key={task.key}
                    href={task.route}
                    className={cn(
                      'block rounded-lg px-3 py-2 text-sm transition',
                      pathname.startsWith(task.route)
                        ? 'bg-[#dce8f7] text-[#0C2B4E]'
                        : 'text-[#1D546C] hover:bg-[#edf3fb]'
                    )}
                  >
                    {task.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto rounded-xl border border-[rgba(12,43,78,0.12)] bg-white p-3">
          {isAuthenticated ? (
            <NavbarAuthControls />
          ) : (
            <div className="space-y-2">
              <Button asChild variant="ghost" className="w-full justify-center text-[#1A3D64] hover:bg-[#edf3fb]">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="w-full bg-[#0C2B4E] text-[#F4F4F4] hover:bg-[#1A3D64]">
                <Link href="/register">Create account</Link>
              </Button>
            </div>
          )}
        </div>
      </aside>

      <header data-mobile-header="true" className="sticky top-0 z-50 border-b border-[rgba(12,43,78,0.14)] bg-[rgba(244,244,244,0.95)] px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img src="/favicon.png?v=20260401" alt={`${SITE_CONFIG.name} logo`} width="36" height="36" className="h-9 w-9 rounded-lg border border-[rgba(12,43,78,0.14)] bg-white p-1" />
            <div>
              <p className="text-sm font-semibold text-[#0C2B4E]">{SITE_CONFIG.name}</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#1D546C]">PDF + Social</p>
            </div>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen((value) => !value)} className="text-[#0C2B4E] hover:bg-[#e5edf8]">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        {isMobileMenuOpen ? (
          <div className="mt-3 space-y-2 rounded-xl border border-[rgba(12,43,78,0.14)] bg-white p-3">
            {topTasks.map((task) => (
              <Link key={task.key} href={task.route} onClick={() => setIsMobileMenuOpen(false)} className={cn('block rounded-lg px-3 py-2 text-sm font-semibold', pathname.startsWith(task.route) ? 'bg-[#0C2B4E] text-[#F4F4F4]' : 'text-[#1A3D64] hover:bg-[#edf3fb]')}>
                {task.label}
              </Link>
            ))}
            {tertiaryTasks.map((task) => (
              <Link key={task.key} href={task.route} onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-[#1D546C] hover:bg-[#edf3fb]">
                {task.label}
              </Link>
            ))}
            <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-[#1D546C] hover:bg-[#edf3fb]">
              Search
            </Link>
          </div>
        ) : null}
      </header>
    </>
  )
}
