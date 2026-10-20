import { FolderOpen, type LucideIcon } from 'lucide-react';

export function SectionPage({
  title,
  description,
  icon: Icon = FolderOpen,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <section className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-12 text-center">
        <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <h3 className="font-medium">{title} workspace</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          This page is ready for managing your {title.toLowerCase()}. Content
          management tools can be added here.
        </p>
      </section>
    </div>
  );
}
