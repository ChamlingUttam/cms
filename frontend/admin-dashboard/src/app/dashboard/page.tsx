import Link from 'next/link';
import {
  ArrowRight,
  BookOpenText,
  FileText,
  FolderOpen,
  MessageSquareQuote,
  Users,
} from 'lucide-react';

const sections = [
  { title: 'Blog posts', href: '/blogs', icon: FileText },
  { title: 'FAQs', href: '/faqs', icon: BookOpenText },
  { title: 'Gallery', href: '/gallery', icon: FolderOpen },
  {
    title: 'Testimonials',
    href: '/testimonials',
    icon: MessageSquareQuote,
  },
  { title: 'Contacts', href: '/contacts', icon: Users },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a section to manage your website content.
        </p>
      </div>
      <section
        aria-label="Admin sections"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {sections.map(({ title, href, icon: Icon }) => (
          <Link
            className="group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:bg-muted/50"
            href={href}
            key={href}
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
              />
            </div>
            <h3 className="mt-5 font-medium">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Open {title.toLowerCase()} workspace
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
