import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, UserPlus } from "lucide-react";
import { Footer } from "@/components/shared/footer";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { ContentImage } from "@/components/shared/content-image";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Button } from "@/components/ui/button";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ShareButton } from "@/components/shared/share-button";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { buildPostUrl } from "@/lib/task-data";
import { buildPostMetadata, buildTaskMetadata } from "@/lib/seo";
import { fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG } from "@/lib/site-config";

export const revalidate = 3;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeRichHtml = (html: string) =>
  html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\shref\s*=\s*(['"])javascript:.*?\1/gi, ' href="#"');

const formatRichHtml = (raw?: string | null, fallback = "Profile details will appear here once available.") => {
  const source = typeof raw === "string" ? raw.trim() : "";
  if (!source) return `<p>${escapeHtml(fallback)}</p>`;
  if (/<[a-z][\s\S]*>/i.test(source)) return sanitizeRichHtml(source);
  return source
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.replace(/\n/g, " ").trim())}</p>`)
    .join("");
};

export async function generateStaticParams() {
  const posts = await fetchTaskPosts("profile", 50);
  if (!posts.length) {
    return [{ username: "placeholder" }];
  }
  return posts.map((post) => ({ username: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  try {
    const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
    return post ? await buildPostMetadata("profile", post) : await buildTaskMetadata("profile");
  } catch (error) {
    console.warn("Profile metadata lookup failed", error);
    return await buildTaskMetadata("profile");
  }
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
  if (!post) {
    notFound();
  }
  const content = (post.content || {}) as Record<string, any>;
  const logoUrl = typeof content.logo === "string" ? content.logo : undefined;
  const brandName =
    (content.brandName as string | undefined) ||
    (content.companyName as string | undefined) ||
    (content.name as string | undefined) ||
    post.title;
  const website = content.website as string | undefined;
  const domain = website ? website.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : undefined;
  const description =
    (content.description as string | undefined) ||
    post.summary ||
    "Profile details will appear here once available.";
  const descriptionHtml = formatRichHtml(description);
  const suggestedArticles = await fetchTaskPosts("article", 6);
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Profiles",
        item: `${baseUrl}/profile`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brandName,
        item: `${baseUrl}/profile/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={breadcrumbData} />

        <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
          {/* Left Column - Profile Card */}
          <section className="rounded-2xl border border-border bg-card p-6">
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border border-border/70 bg-muted">
                {logoUrl ? (
                  <ContentImage
                    src={logoUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="112px"
                    intrinsicWidth={112}
                    intrinsicHeight={112}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                    {post.title.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Brand Info */}
            <div className="mt-4 text-center">
              <h1 className="text-xl font-bold text-foreground">{brandName}</h1>
              {domain && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {domain}
                </a>
              )}
              <p className="mt-1 text-sm text-muted-foreground">No reviews</p>
            </div>

            {/* Description */}
            <div className="mt-4">
              <article
                className="text-sm leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <Button asChild className="flex-1">
                <Link href="/login">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </Link>
              </Button>
              <ShareButton
                title={brandName}
                url={`${baseUrl}/profile/${post.slug}`}
                className="px-3"
              />
            </div>

          </section>

          {/* Right Column - Reviews & Lists */}
          <section className="min-w-0">
            <ProfileTabs
              reviewsContent={
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-foreground">No reviews written</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                    This user hasn&apos;t written any reviews yet. Once they do, you&apos;ll be able to see all of their reviews here.
                  </p>
                </div>
              }
            />

            {/* Suggested Articles below tabs */}
            {suggestedArticles.length ? (
              <div className="mt-10 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Suggested articles</h2>
                  <Link href="/articles" className="text-sm font-medium text-primary hover:underline">
                    View all
                  </Link>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {suggestedArticles.slice(0, 2).map((article) => (
                    <TaskPostCard
                      key={article.id}
                      post={article}
                      href={buildPostUrl("article", article.slug)}
                      compact
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
