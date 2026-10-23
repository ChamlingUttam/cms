'use client';

import { useState } from 'react';
import { FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ManagementLoadError } from '@/components/admin/_components/management-load-error';
import { ManagementPageHeader } from '@/components/admin/_components/management-page-header';
import { ManagementSkeleton } from '@/components/admin/_components/management-skeleton';
import { Button } from '@/components/ui/button';
import {
  useCreateBlog,
  useDeleteBlog,
  useBlogs,
  useUpdateBlog,
} from '@/hooks/use-content';
import { getApiErrorMessage } from '@/lib/api-error';
import type { Blog, BlogInput } from '@/types/content';
import { BlogFields } from './blog-fields';

export function BlogManager() {
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const blogsQuery = useBlogs(page);
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();
  const deleteMutation = useDeleteBlog();

  if (blogsQuery.isPending) {
    return <ManagementSkeleton />;
  }

  if (blogsQuery.isError) {
    return (
      <ManagementLoadError
        error={blogsQuery.error}
        onRetry={() => void blogsQuery.refetch()}
        title="Could not load blog posts"
      />
    );
  }

  const { blogs, pagination } = blogsQuery.data;

  async function handleCreate(input: BlogInput) {
    try {
      await createMutation.mutateAsync(input);
      setPage(1);
      toast.success('Blog post created.');
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not create the blog post.'));
      return false;
    }
  }

  async function handleUpdate(blog: Blog, input: BlogInput) {
    try {
      await updateMutation.mutateAsync({ id: blog.id, input });
      setEditingId(null);
      toast.success('Blog post updated.');
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not update the blog post.'));
      return false;
    }
  }

  async function handleDelete(blog: Blog) {
    if (!window.confirm(`Delete this blog post?\n\n${blog.name}`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(blog.id);
      if (blogs.length === 1 && page > 1) {
        setPage(page - 1);
      }
      toast.success('Blog post deleted.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not delete the blog post.'));
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <ManagementPageHeader
        description="Create, edit, and organize the articles published on your website."
        title="Blog posts"
      />

      <section className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Plus aria-hidden="true" className="size-4" />
          </span>
          <div>
            <h2 className="font-semibold">Write a blog post</h2>
            <p className="text-sm text-muted-foreground">
              The post URL is generated automatically from its title.
            </p>
          </div>
        </div>
        <BlogFields
          onSubmit={handleCreate}
          pending={createMutation.isPending}
          submitLabel="Publish blog post"
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">All blog posts</h2>
            <p className="text-sm text-muted-foreground">
              {pagination.totalItems}{' '}
              {pagination.totalItems === 1 ? 'article' : 'articles'}
            </p>
          </div>
          <FileText
            aria-hidden="true"
            className="size-5 text-muted-foreground"
          />
        </div>

        {blogs.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card px-6 py-12 text-center">
            <h3 className="font-medium">No blog posts yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first article using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <article
                className="overflow-hidden rounded-xl border bg-card shadow-sm"
                key={blog.id}
              >
                {editingId === blog.id ? (
                  <div className="space-y-4 p-5 sm:p-6">
                    <h3 className="font-semibold">Edit blog post</h3>
                    <BlogFields
                      currentImageUrl={blog.imageUrl}
                      initialValue={{
                        name: blog.name,
                        shortDescription: blog.shortDescription,
                        longDescription: blog.longDescription,
                      }}
                      onCancel={() => setEditingId(null)}
                      onSubmit={(input) => handleUpdate(blog, input)}
                      pending={updateMutation.isPending}
                      submitLabel="Save changes"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row">
                    {blog.imageUrl && (
                      <div className="shrink-0 sm:w-52">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt=""
                          className="h-48 w-full object-cover sm:h-full"
                          src={blog.imageUrl}
                          srcSet={blog.srcSet ?? undefined}
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-3 p-5 sm:p-6">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div className="min-w-0 space-y-1">
                          <h3 className="text-lg font-semibold">{blog.name}</h3>
                          <p className="break-all text-xs text-muted-foreground">
                            /{blog.slug}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Button
                            aria-label={`Edit blog post: ${blog.name}`}
                            disabled={deleteMutation.isPending}
                            onClick={() => setEditingId(blog.id)}
                            size="sm"
                            variant="outline"
                          >
                            <Pencil aria-hidden="true" />
                            Edit
                          </Button>
                          <Button
                            aria-label={`Delete blog post: ${blog.name}`}
                            disabled={deleteMutation.isPending}
                            onClick={() => void handleDelete(blog)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 aria-hidden="true" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {blog.shortDescription}
                      </p>
                      <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6">
                        {blog.longDescription}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created{' '}
                        {new Intl.DateTimeFormat(undefined, {
                          dateStyle: 'medium',
                        }).format(new Date(blog.createdAt))}
                      </p>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <nav
            aria-label="Blog post pagination"
            className="flex items-center justify-between gap-4 pt-2"
          >
            <p aria-live="polite" className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                disabled={page <= 1 || blogsQuery.isFetching}
                onClick={() => {
                  setEditingId(null);
                  setPage((current) => current - 1);
                }}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                disabled={
                  page >= pagination.totalPages || blogsQuery.isFetching
                }
                onClick={() => {
                  setEditingId(null);
                  setPage((current) => current + 1);
                }}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </nav>
        )}
      </section>
    </div>
  );
}
