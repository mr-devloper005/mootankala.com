import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'
import { fetchTaskPosts } from '@/lib/task-data'

export const HOME_PAGE_OVERRIDE_ENABLED = true

export async function HomePageOverride() {
  const pdfTask = SITE_CONFIG.tasks.find((task) => task.enabled && task.key === 'pdf')

  const secondaryTasks = SITE_CONFIG.tasks.filter(
    (task) => task.enabled && task.key !== pdfTask?.key
  )

  const pdfPosts = pdfTask
    ? await fetchTaskPosts('pdf', 6, { allowMockFallback: true, fresh: true })
    : []

  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${SITE_CONFIG.defaultOgImage}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7faff_0%,#f4f4f4_100%)] text-[#0C2B4E]">
      <NavbarShell />
      <main>
        <SchemaJsonLd data={schemaData} />
        <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pt-14">
          <div className="rounded-[2rem] border border-[rgba(12,43,78,0.14)] bg-white p-7 shadow-[0_22px_62px_rgba(12,43,78,0.09)] sm:p-10">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Deliver polished PDF resources from one focused workspace.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#1D546C]">
              A clean, utility-first experience built specifically for PDF document publishing and discovery.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {pdfTask ? (
                <Link href={pdfTask.route} className="inline-flex items-center gap-2 rounded-xl bg-[#0C2B4E] px-5 py-3 text-sm font-semibold text-[#F4F4F4] transition hover:bg-[#1A3D64]">
                  Open PDF lane
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        {pdfTask ? (
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-[rgba(12,43,78,0.18)] pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D546C]">Primary lane</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#0C2B4E]">PDF Library Surface</h2>
            </div>
            <Link href={pdfTask.route} className="text-sm font-semibold text-[#1A3D64] hover:text-[#0C2B4E]">
              View all PDFs
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {pdfPosts.slice(0, 6).map((post) => (
              <TaskPostCard key={post.id} post={post} href={`${pdfTask.route}/${post.slug}`} taskKey="pdf" />
            ))}
          </div>
          </section>
        ) : null}

        {secondaryTasks.length ? (
          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
          <div className="rounded-2xl border border-[rgba(12,43,78,0.14)] bg-[rgba(244,244,244,0.86)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1D546C]">All available tools</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {secondaryTasks.map((task) => (
                <Link key={task.key} href={task.route} className="rounded-full border border-[rgba(12,43,78,0.16)] bg-white px-3 py-1.5 text-xs font-medium text-[#1A3D64] hover:bg-[#ebf2fb]">
                  {task.label}
                </Link>
              ))}
            </div>
          </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  )
}
