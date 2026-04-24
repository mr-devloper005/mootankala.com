import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";

const highlights = [
  { label: "PDF resources published", value: "2,400+" },
  { label: "Public profiles created", value: "900+" },
  { label: "Monthly active readers", value: "35k+" },
];

const values = [
  { title: "Document-first publishing", description: "We help teams publish useful PDFs with clear structure and fast access." },
  { title: "Profile-led trust", description: "Every contributor and brand can build a reliable public profile with context." },
  { title: "Simple discovery", description: "Users can move from documents to people quickly without friction." },
];

const companySections = [
  {
    title: "What Mootankala Does",
    description:
      "Mootankala is a focused PDF + Social Profile platform where organizations publish resources and build trusted profile presence in one place.",
  },
  {
    title: "Who It Is For",
    description:
      "Built for agencies, creators, consultants, and teams that want documents and profile identity to work together as a single experience.",
  },
  {
    title: "Our Product Direction",
    description:
      "Keep the experience utility-first, mobile-ready, and fast while preserving a clear visual priority for PDF and profile workflows.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      title={`About Us - ${SITE_CONFIG.name}`}
      description={`${SITE_CONFIG.name} is a focused PDF + Social Profile platform for teams, creators, and businesses.`}
      actions={
        <>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/pdf">Open PDF Library</Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border bg-card">
          <CardContent className="space-y-4 p-6">
            <Badge variant="secondary">Our Story</Badge>
            <h2 className="text-2xl font-semibold text-foreground">
              A single home for documents, profiles, and discoverable expertise.
            </h2>
            <p className="text-sm text-muted-foreground">
              {SITE_CONFIG.name} brings together PDF publishing and profile identity so businesses and creators can share useful knowledge with confidence.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-secondary/40 p-4">
                  <div className="text-2xl font-semibold text-foreground">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {values.map((value) => (
            <Card key={value.title} className="border-border bg-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {companySections.map((section) => (
          <Card key={section.title} className="border-border bg-card transition-transform hover:-translate-y-1">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{section.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
