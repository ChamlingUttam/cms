import assert from 'node:assert/strict';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import express from 'express';
import type { RequestHandler } from 'express';
import type {} from '../src/types/express';
import { errorHandler } from '../src/middlewares/errorHandler';
import { createBlogController } from '../src/modules/blog/controller';
import { createBlogRouters } from '../src/modules/blog/routerFactory';
import {
  BlogNotFoundError,
  BlogSlugConflictError,
  createBlogService,
  type BlogCreateInput,
  type BlogInput,
  type BlogRecord,
  type BlogRepository,
  type BlogStorage,
} from '../src/modules/blog/service';

const adminAuthorization = 'admin-test-token';
const jpegBytes = Buffer.from([0xff, 0xd8, 0xff, 0x01]);
const pngBytes = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x01,
]);

function imageUrl(publicId: string) {
  return `https://res.cloudinary.com/test/image/upload/v123/${publicId}.jpg`;
}

function createRecord(
  id: string,
  createdAt: Date,
  changes: Partial<BlogRecord> = {},
): BlogRecord {
  return {
    id,
    name: `Blog ${id}`,
    slug: `blog-${id}`,
    shortDescription: `Short ${id}`,
    longDescription: `Long ${id}`,
    imageUrl: null,
    createdAt,
    updatedAt: createdAt,
    ...changes,
  };
}

function createFixture(
  options: {
    records?: BlogRecord[];
    failCreate?: boolean;
    failUpdate?: boolean;
    failDelete?: boolean;
    failRestore?: boolean;
    failUpload?: boolean;
    failStorageDelete?: boolean;
    slugConflicts?: number;
  } = {},
) {
  const records = new Map(
    (options.records ?? []).map((record) => [record.id, record]),
  );
  const deletedPublicIds: string[] = [];
  const uploadedPublicIds: string[] = [];
  let injectedSlugConflicts = options.slugConflicts ?? 0;

  const repository: BlogRepository = {
    async findMany({ skip, take }) {
      return [...records.values()]
        .sort(
          (first, second) =>
            second.createdAt.getTime() - first.createdAt.getTime() ||
            second.id.localeCompare(first.id),
        )
        .slice(skip, skip + take);
    },
    async count() {
      return records.size;
    },
    async findById(id) {
      return records.get(id) ?? null;
    },
    async findBySlug(slug) {
      return (
        [...records.values()].find((record) => record.slug === slug) ?? null
      );
    },
    async create(input: BlogCreateInput) {
      if (options.failCreate) {
        throw new Error('Database create failed.');
      }
      if (injectedSlugConflicts > 0) {
        injectedSlugConflicts -= 1;
        throw new BlogSlugConflictError();
      }
      if ([...records.values()].some((record) => record.slug === input.slug)) {
        throw new BlogSlugConflictError();
      }

      const now = new Date();
      const record: BlogRecord = {
        id: `blog-${records.size + 1}`,
        name: input.name,
        slug: input.slug,
        shortDescription: input.shortDescription,
        longDescription: input.longDescription,
        imageUrl: input.imageUrl ?? null,
        createdAt: now,
        updatedAt: now,
      };
      records.set(record.id, record);
      return record;
    },
    async update(id: string, input: BlogInput) {
      if (options.failUpdate) {
        throw new Error('Database update failed.');
      }
      const record = records.get(id);
      if (!record) {
        throw new BlogNotFoundError();
      }
      if (
        input.slug &&
        [...records.values()].some(
          (candidate) => candidate.id !== id && candidate.slug === input.slug,
        )
      ) {
        throw new BlogSlugConflictError();
      }

      const updated = { ...record, ...input, updatedAt: new Date() };
      records.set(id, updated);
      return updated;
    },
    async delete(id: string) {
      if (options.failDelete) {
        throw new Error('Database delete failed.');
      }
      const record = records.get(id);
      if (!record) {
        throw new BlogNotFoundError();
      }
      records.delete(id);
      return record;
    },
    async restore(record) {
      if (options.failRestore) {
        throw new Error('Database restore failed.');
      }
      records.set(record.id, record);
    },
  };

  const storage: BlogStorage = {
    async upload(filePath, publicId) {
      uploadedPublicIds.push(publicId);
      if (options.failUpload) {
        throw new Error('Cloudinary upload failed.');
      }
      await readFile(filePath);
      return { imageUrl: imageUrl(publicId), publicId };
    },
    async delete(publicId) {
      deletedPublicIds.push(publicId);
      if (options.failStorageDelete) {
        throw new Error('Cloudinary delete failed.');
      }
    },
  };

  const service = createBlogService(repository, storage);
  const controller = createBlogController(service);
  const authorizeAdmin: RequestHandler = (req, res, next) => {
    if (req.get('authorization') !== adminAuthorization) {
      res
        .status(401)
        .json({ success: false, message: 'Authentication required.' });
      return;
    }
    req.admin = { id: 'admin-1', username: 'admin' };
    next();
  };
  const { adminRouter, publicRouter } = createBlogRouters(
    controller,
    authorizeAdmin,
  );
  const app = express();

  app.use(express.json());
  app.use('/api/v1/admin/blogs', adminRouter);
  app.use('/api/v1/blogs', publicRouter);
  app.use(errorHandler);

  return {
    app,
    records,
    deletedPublicIds,
    uploadedPublicIds,
  };
}

async function withServer(
  app: express.Express,
  run: (baseUrl: string) => Promise<void>,
) {
  const server = app.listen(0);
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address !== 'string');

  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    server.close();
    await once(server, 'close');
  }
}

function toBlobPart(buffer: Buffer) {
  const bytes = new Uint8Array(new ArrayBuffer(buffer.length));
  bytes.set(buffer);
  return bytes;
}

function multipart(
  fields: Record<string, string>,
  file?: { bytes: Buffer; type: string; filename: string },
) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  if (file) {
    form.append(
      'image',
      new Blob([toBlobPart(file.bytes)], { type: file.type }),
      file.filename,
    );
  }
  return form;
}

const sampleBlog = {
  name: 'A School Day',
  shortDescription: 'A short overview',
  longDescription: 'The full article content.',
};

test('admin blog CRUD is authenticated and public slug retrieval works', async () => {
  const fixture = createFixture();

  await withServer(fixture.app, async (baseUrl) => {
    assert.equal((await fetch(`${baseUrl}/api/v1/admin/blogs`)).status, 401);

    const createResponse = await fetch(`${baseUrl}/api/v1/admin/blogs`, {
      method: 'POST',
      headers: {
        authorization: adminAuthorization,
        'content-type': 'application/json',
      },
      body: JSON.stringify(sampleBlog),
    });
    assert.equal(createResponse.status, 201);
    const created = (await createResponse.json()) as {
      data: { blog: BlogRecord };
    };
    assert.equal(created.data.blog.slug, 'a-school-day');

    const adminGet = await fetch(
      `${baseUrl}/api/v1/admin/blogs/${created.data.blog.id}`,
      { headers: { authorization: adminAuthorization } },
    );
    assert.equal(adminGet.status, 200);

    const publicGet = await fetch(
      `${baseUrl}/api/v1/blogs/${created.data.blog.slug}`,
    );
    assert.equal(publicGet.status, 200);

    const updateResponse = await fetch(
      `${baseUrl}/api/v1/admin/blogs/${created.data.blog.id}`,
      {
        method: 'PATCH',
        headers: {
          authorization: adminAuthorization,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Updated title',
          shortDescription: 'Updated summary',
        }),
      },
    );
    assert.equal(updateResponse.status, 200);
    const updated = (await updateResponse.json()) as {
      data: { blog: BlogRecord };
    };
    assert.equal(updated.data.blog.name, 'Updated title');
    assert.equal(updated.data.blog.slug, 'updated-title');
    assert.equal(updated.data.blog.shortDescription, 'Updated summary');

    const deleteResponse = await fetch(
      `${baseUrl}/api/v1/admin/blogs/${created.data.blog.id}`,
      { method: 'DELETE', headers: { authorization: adminAuthorization } },
    );
    assert.equal(deleteResponse.status, 200);
    assert.equal(fixture.records.size, 0);
    assert.equal(
      (await fetch(`${baseUrl}/api/v1/blogs/${created.data.blog.slug}`)).status,
      404,
    );
  });
});

test('validation rejects missing fields, client slugs, and invalid pagination', async () => {
  const fixture = createFixture();
  await withServer(fixture.app, async (baseUrl) => {
    const missingFields = await fetch(`${baseUrl}/api/v1/admin/blogs`, {
      method: 'POST',
      headers: {
        authorization: adminAuthorization,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ name: 'Incomplete' }),
    });
    assert.equal(missingFields.status, 400);

    const clientSlug = await fetch(`${baseUrl}/api/v1/admin/blogs`, {
      method: 'POST',
      headers: {
        authorization: adminAuthorization,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ ...sampleBlog, slug: 'manual-slug' }),
    });
    assert.equal(clientSlug.status, 400);

    for (const query of ['?page=0', '?limit=51', '?page=1.5']) {
      const response = await fetch(`${baseUrl}/api/v1/blogs${query}`);
      assert.equal(response.status, 400);
    }

    const publicList = await fetch(`${baseUrl}/api/v1/blogs`);
    assert.equal(publicList.status, 200);
    const result = (await publicList.json()) as {
      data: { pagination: { page: number; limit: number } };
    };
    assert.deepEqual(result.data.pagination, {
      page: 1,
      limit: 9,
      totalItems: 0,
      totalPages: 0,
    });
  });
});

test('duplicate titles receive unique slugs and slug conflicts are retried', async () => {
  const fixture = createFixture({ slugConflicts: 1 });
  await withServer(fixture.app, async (baseUrl) => {
    const create = () =>
      fetch(`${baseUrl}/api/v1/admin/blogs`, {
        method: 'POST',
        headers: {
          authorization: adminAuthorization,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ ...sampleBlog, name: 'Same Title' }),
      });

    const firstResponse = await create();
    const secondResponse = await create();
    const first = (await firstResponse.json()) as {
      data: { blog: BlogRecord };
    };
    const second = (await secondResponse.json()) as {
      data: { blog: BlogRecord };
    };

    assert.equal(first.data.blog.slug, 'same-title');
    assert.equal(second.data.blog.slug, 'same-title-2');
  });
});

test('admin and public listings use page limits and newest-first ordering', async () => {
  const fixture = createFixture({
    records: Array.from({ length: 12 }, (_, index) =>
      createRecord(`entry-${index}`, new Date(Date.UTC(2026, 0, index + 1))),
    ),
  });

  await withServer(fixture.app, async (baseUrl) => {
    const publicResponse = await fetch(`${baseUrl}/api/v1/blogs`);
    const publicResult = (await publicResponse.json()) as {
      data: { blogs: BlogRecord[]; pagination: { limit: number } };
    };
    assert.equal(publicResult.data.blogs.length, 9);
    assert.equal(publicResult.data.pagination.limit, 9);
    assert.equal(publicResult.data.blogs[0].id, 'entry-11');

    const adminResponse = await fetch(`${baseUrl}/api/v1/admin/blogs`, {
      headers: { authorization: adminAuthorization },
    });
    const adminResult = (await adminResponse.json()) as {
      data: { blogs: BlogRecord[]; pagination: { limit: number } };
    };
    assert.equal(adminResult.data.blogs.length, 12);
    assert.equal(adminResult.data.pagination.limit, 20);
  });
});

test('images are signature checked, replacements clean old assets, and deletion failures restore records', async () => {
  const old = createRecord('old-image', new Date(), {
    imageUrl: imageUrl('blogs/old-image'),
  });
  const fixture = createFixture({ records: [old] });

  await withServer(fixture.app, async (baseUrl) => {
    const invalidSignature = await fetch(
      `${baseUrl}/api/v1/admin/blogs/${old.id}`,
      {
        method: 'PATCH',
        headers: { authorization: adminAuthorization },
        body: multipart(
          { shortDescription: 'Keep existing image' },
          {
            bytes: Buffer.from('not an image'),
            type: 'image/jpeg',
            filename: 'fake.jpg',
          },
        ),
      },
    );
    assert.equal(invalidSignature.status, 400);
    assert.equal(fixture.uploadedPublicIds.length, 0);

    const replacement = await fetch(`${baseUrl}/api/v1/admin/blogs/${old.id}`, {
      method: 'PATCH',
      headers: { authorization: adminAuthorization },
      body: multipart(
        {},
        {
          bytes: pngBytes,
          type: 'image/png',
          filename: 'replacement.png',
        },
      ),
    });
    assert.equal(replacement.status, 200);
    assert.ok(fixture.records.get(old.id)?.imageUrl?.includes('blogs/'));
    assert.ok(fixture.deletedPublicIds.includes('blogs/old-image'));

    const removeImage = await fetch(`${baseUrl}/api/v1/admin/blogs/${old.id}`, {
      method: 'PATCH',
      headers: {
        authorization: adminAuthorization,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ removeImage: true }),
    });
    assert.equal(removeImage.status, 200);
    assert.equal(fixture.records.get(old.id)?.imageUrl, null);
  });

  const deleteFailureFixture = createFixture({
    records: [old],
    failStorageDelete: true,
  });
  await withServer(deleteFailureFixture.app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/admin/blogs/${old.id}`, {
      method: 'DELETE',
      headers: { authorization: adminAuthorization },
    });
    assert.equal(response.status, 500);
    assert.ok(deleteFailureFixture.records.has(old.id));
  });
});

test('upload and database failures do not leave newly uploaded blog images referenced', async () => {
  const uploadFailure = createFixture({ failUpload: true });
  await withServer(uploadFailure.app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/admin/blogs`, {
      method: 'POST',
      headers: { authorization: adminAuthorization },
      body: multipart(sampleBlog, {
        bytes: jpegBytes,
        type: 'image/jpeg',
        filename: 'cover.jpg',
      }),
    });
    assert.equal(response.status, 500);
    assert.equal(uploadFailure.records.size, 0);
  });

  const databaseFailure = createFixture({ failCreate: true });
  await withServer(databaseFailure.app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/admin/blogs`, {
      method: 'POST',
      headers: { authorization: adminAuthorization },
      body: multipart(sampleBlog, {
        bytes: jpegBytes,
        type: 'image/jpeg',
        filename: 'cover.jpg',
      }),
    });
    assert.equal(response.status, 500);
    assert.equal(databaseFailure.records.size, 0);
    assert.equal(databaseFailure.uploadedPublicIds.length, 1);
    assert.deepEqual(
      databaseFailure.deletedPublicIds,
      databaseFailure.uploadedPublicIds,
    );
  });

  const existing = createRecord('existing-blog', new Date(), {
    imageUrl: imageUrl('blogs/existing-blog'),
  });
  const updateFailure = createFixture({
    records: [existing],
    failUpdate: true,
  });
  await withServer(updateFailure.app, async (baseUrl) => {
    const response = await fetch(
      `${baseUrl}/api/v1/admin/blogs/${existing.id}`,
      {
        method: 'PATCH',
        headers: { authorization: adminAuthorization },
        body: multipart(
          {},
          {
            bytes: jpegBytes,
            type: 'image/jpeg',
            filename: 'replacement.jpg',
          },
        ),
      },
    );
    assert.equal(response.status, 500);
    assert.equal(
      updateFailure.records.get(existing.id)?.imageUrl,
      existing.imageUrl,
    );
    assert.equal(updateFailure.uploadedPublicIds.length, 1);
    assert.deepEqual(
      updateFailure.deletedPublicIds,
      updateFailure.uploadedPublicIds,
    );
  });
});
