import { apiClient } from '@/api/client';
import { blogEndpoints } from '@/api-endpoints/blog';
import type { ApiResponse } from '@/types/auth';
import type { Blog, BlogInput, BlogList } from '@/types/content';

function toFormData(input: BlogInput) {
  const form = new FormData();
  form.append('name', input.name);
  form.append('shortDescription', input.shortDescription);
  form.append('longDescription', input.longDescription);

  if (input.image) {
    form.append('image', input.image);
  }

  if (input.removeImage) {
    form.append('removeImage', 'true');
  }

  return form;
}

export async function getBlogs(page: number, limit = 20): Promise<BlogList> {
  const { data } = await apiClient.get<ApiResponse<BlogList>>(
    blogEndpoints.list,
    { params: { page, limit } },
  );
  return data.data;
}

export async function createBlog(input: BlogInput): Promise<Blog> {
  const { data } = await apiClient.post<ApiResponse<{ blog: Blog }>>(
    blogEndpoints.list,
    toFormData(input),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data.blog;
}

export async function updateBlog(
  id: string,
  input: BlogInput,
): Promise<Blog> {
  const { data } = await apiClient.patch<ApiResponse<{ blog: Blog }>>(
    blogEndpoints.byId(id),
    toFormData(input),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data.blog;
}

export async function deleteBlog(id: string): Promise<void> {
  await apiClient.delete(blogEndpoints.byId(id));
}
