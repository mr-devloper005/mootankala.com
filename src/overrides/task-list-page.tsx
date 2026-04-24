import type { TaskKey } from '@/lib/site-config'
import Link from 'next/link'
import { FileText, User } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { TaskListClient } from '@/components/tasks/task-list-client'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig } from '@/lib/site-config'
import { normalizeCategory } from '@/lib/categories'

export const TASK_LIST_PAGE_OVERRIDE_ENABLED = true

export async function TaskListPageOverride({ task, category }: { task: TaskKey; category?: string }) {
  const taskConfig = getTaskConfig(task)
  const normalizedCategory = category ? normalizeCategory(category) : 'all'
  const posts = await fetchTaskPosts(task, 30, { allowMockFallback: true, fresh: true })
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || '/posts'}/${post.slug}`,
    name: post.title,
  }))

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f4f4f4_100%)]">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <SchemaJsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
            url: `${baseUrl}${taskConfig?.route || ''}`,
            hasPart: schemaItems,
          }}
        />

        {task === 'pdf' ? (
          <section className="mb-10">
            <div className="rounded-[2rem] border border-[rgba(12,43,78,0.16)] bg-white p-7 shadow-[0_20px_60px_rgba(12,43,78,0.08)] sm:p-9">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#0C2B4E] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F4F4F4]">
                <FileText className="h-3.5 w-3.5" />
                PDF Utility Grid
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[#0C2B4E]">
                Structured document browsing with fast utility-first access.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-[#1D546C]">
                This surface is optimized for scanning, filtering, and opening resources quickly.
              </p>
            </div>
          </section>
        ) : null}

        {task === 'profile' || task === 'social' ? (
          <section className="mb-10 rounded-[2rem] border border-[rgba(12,43,78,0.16)] bg-white p-7 shadow-[0_20px_60px_rgba(12,43,78,0.08)] sm:p-9">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="rounded-[1.6rem] border border-[rgba(12,43,78,0.12)] bg-[linear-gradient(160deg,#0C2B4E_0%,#1A3D64_100%)] p-6 text-[#F4F4F4]">
                <p className="inline-flex items-center gap-2 rounded-full bg-[rgba(244,244,244,0.2)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  <User className="h-3.5 w-3.5" />
                  Social Profile Surface
                </p>
                <p className="mt-4 text-2xl font-semibold">Identity-first layout for profile trust and visibility.</p>
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#0C2B4E]">
                  Profiles with stronger social signals and clearer public identity.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-[#1D546C]">
                  This page prioritizes people and brand presence before feed density.
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {task === 'article' ? (
          <section className="mb-10">
            <div className="rounded-[2rem] border border-[rgba(12,43,78,0.16)] bg-[linear-gradient(180deg,#ffffff_0%,#f4f8fc_100%)] p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D546C]">Editorial rhythm</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-[#0C2B4E]">
                Reading-led stories with slower pacing and cleaner typography.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-[#1D546C]">
                Article surfaces are intentionally calmer than utility pages, so long-form content stays readable.
              </p>
            </div>
          </section>
        ) : null}

        {task !== 'pdf' && task !== 'profile' && task !== 'social' && task !== 'article' ? (
          <section className="mb-10 rounded-[2rem] border border-[rgba(12,43,78,0.16)] bg-white p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D546C]">Task Surface</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#0C2B4E]">
              {taskConfig?.label || task}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[#1D546C]">{taskConfig?.description}</p>
          </section>
        ) : null}

        <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
      </main>
      <Footer />
    </div>
  )
}
