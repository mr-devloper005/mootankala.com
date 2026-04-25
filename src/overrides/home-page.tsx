import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'
import { fetchTaskPosts } from '@/lib/task-data'

export const HOME_PAGE_OVERRIDE_ENABLED = true

export async function HomePageOverride() {
  const pdfTask = SITE_CONFIG.tasks.find((task) => task.enabled && task.key === 'pdf')
  const profileTask =
    SITE_CONFIG.tasks.find((task) => task.enabled && task.key === 'profile') ||
    SITE_CONFIG.tasks.find((task) => task.enabled && task.key === 'social')

  const secondaryTasks = SITE_CONFIG.tasks.filter(
    (task) => task.enabled && task.key !== pdfTask?.key && task.key !== profileTask?.key
  )

  const [pdfPosts, profilePosts, articlePosts] = await Promise.all([
    pdfTask ? fetchTaskPosts('pdf', 6, { allowMockFallback: true, fresh: true }) : Promise.resolve([]),
    profileTask ? fetchTaskPosts(profileTask.key, 6, { allowMockFallback: true, fresh: true }) : Promise.resolve([]),
    fetchTaskPosts('article', 3, { allowMockFallback: true, fresh: true }).catch(() => []),
  ])

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
            <p className="inline-flex items-center gap-2 rounded-full bg-[#0C2B4E] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F4F4F4]">
              <FileText className="h-3.5 w-3.5" />
              Premium workflow
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Deliver polished PDF resources and strong social profiles from one focused workspace.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#1D546C]">
              The experience is built around two clear lanes: structured document publishing and profile-first social presence.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {pdfTask ? (
                <Link href={pdfTask.route} className="inline-flex items-center gap-2 rounded-xl bg-[#0C2B4E] px-5 py-3 text-sm font-semibold text-[#F4F4F4] transition hover:bg-[#1A3D64]">
                  Open PDF lane
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
              {profileTask ? (
                <Link href={profileTask.route} className="inline-flex items-center gap-2 rounded-xl border border-[rgba(12,43,78,0.18)] bg-[#f2f6fc] px-5 py-3 text-sm font-semibold text-[#1A3D64] transition hover:bg-[#e8f0fa]">
                  Open Social Profile lane
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

        {profileTask ? (
          <section className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-10">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-[rgba(12,43,78,0.18)] pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D546C]">Secondary lane</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#0C2B4E]">Social Profile Surface</h2>
            </div>
            <Link href={profileTask.route} className="text-sm font-semibold text-[#1A3D64] hover:text-[#0C2B4E]">
              View all profiles
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {profilePosts.slice(0, 6).map((post) => (
              <TaskPostCard key={post.id} post={post} href={`${profileTask.route}/${post.slug}`} taskKey={profileTask.key} />
            ))}
          </div>
          </section>
        ) : null}

        {articlePosts.length ? (
          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
          <div className="rounded-[2rem] border border-[rgba(12,43,78,0.14)] bg-[rgba(255,255,255,0.7)] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D546C]">Low-emphasis editorial shelf</p>
            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              {articlePosts.map((post) => (
                <TaskPostCard key={post.id} post={post} href={`/articles/${post.slug}`} taskKey="article" compact />
              ))}
            </div>
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
