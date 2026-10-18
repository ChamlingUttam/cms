import assert from 'node:assert/strict';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import express from 'express';
import type { RequestHandler } from 'express';
import type {} from '../src/types/express';
import { errorHandler } from '../src/middlewares/errorHandler';
import { createTestimonialController } from '../src/modules/testimonial/controller';
import { createTestimonialRouters } from '../src/modules/testimonial/routerFactory';
import {
  createTestimonialService,
  getTestimonialPublicId,
  type TestimonialCreateInput,
  type TestimonialInput,
  type TestimonialRecord,
  type TestimonialRepository,
  type TestimonialStorage,
} from '../src/modules/testimonial/service';

const adminAuthorization = 'Bearer testimonial-test-token';
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
  changes: Partial<TestimonialRecord> = {},
): TestimonialRecord {
  return {
    id,
    name: `Name ${id}`,
    description: `Description ${id}`,
    imageUrl: null,
    profession: null,
    createdAt,
    updatedAt: createdAt,
    ...changes,
  };
}

function createFixture(
  options: {
    records?: TestimonialRecord[];
    failCreate?: boolean;
    failUpdate?: boolean;
    failDelete?: boolean;
    failRestore?: boolean;
    failUpload?: boolean;
    failStorageDelete?: boolean;
  } = {},
) {
  const records = new Map(
    (options.records ?? []).map((record) => [record.id, record]),
  );
  const deletedPublicIds: string[] = [];
  const uploadedPublicIds: string[] = [];
  const repository: TestimonialRepository = {
    async findMany() {
      return [...records.values()].sort(
        (first, second) =>
          second.createdAt.getTime() - first.createdAt.getTime() ||
          second.id.localeCompare(first.id),
      );
    },
    async findById(id) {
      return records.get(id) ?? null;
    },
    async create(input: TestimonialCreateInput) {
      if (options.failCreate) {
        throw new Error('Database create failed.');
      }

      const now = new Date();
      const record: TestimonialRecord = {
        id: `testimonial-${records.size + 1}`,
        name: input.name,
        description: input.description,
        imageUrl: input.imageUrl ?? null,
        profession: input.profession ?? null,
        createdAt: now,
        updatedAt: now,
      };
      records.set(record.id, record);
      return record;
    },
    async update(id, input: TestimonialInput) {
      if (options.failUpdate) {
        throw new Error('Database update failed.');
      }

      const record = records.get(id);
      if (!record) {
        throw new Error('Testimonial missing.');
      }

      const updated = { ...record, ...input, updatedAt: new Date() };
      records.set(id, updated);
      return updated;
    },
    async delete(id) {
      if (options.failDelete) {
        throw new Error('Database delete failed.');
      }

      const record = records.get(id);
      if (!record) {
        throw new Error('Testimonial missing.');
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

  const storage: TestimonialStorage = {
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

  const service = createTestimonialService(repository, storage);
  const controller = createTestimonialController(service);
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
  const { adminRouter, publicRouter } = createTestimonialRouters(
    controller,
    authorizeAdmin,
  );
  const app = express();

  app.use(express.json());
  app.use('/api/v1/admin/testimonials', adminRouter);
  app.use('/api/v1/testimonials', publicRouter);
  app.use(errorHandler);

  return { app, records, deletedPublicIds, uploadedPublicIds };
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

test('admin creates testimonial with and without an image; public listing is newest first', async () => {
  const fixture = createFixture({
    records: [
      createRecord('older', new Date('2026-01-01T00:00:00Z')),
      createRecord('newer', new Date('2026-02-01T00:00:00Z')),
    ],
  });

  await withServer(fixture.app, async (baseUrl) => {
    const unauthorized = await fetch(`${baseUrl}/api/v1/admin/testimonials`);
    assert.equal(unauthorized.status, 401);

    const deniedCreate = await fetch(`${baseUrl}/api/v1/admin/testimonials`, {
      method: 'POST',
      body: multipart({ name: 'Unauthorized', description: 'No auth' }),
    });
    assert.equal(deniedCreate.status, 401);

    const created = await fetch(`${baseUrl}/api/v1/admin/testimonials`, {
      method: 'POST',
      headers: { authorization: adminAuthorization },
      body: multipart(
        {
          name: 'Parent',
          description: 'A positive school experience.',
          profession: 'Parent',
        },
        { bytes: jpegBytes, type: 'image/jpeg', filename: 'parent.jpg' },
      ),
    });
    const createBody = (await created.json()) as {
      data: { testimonial: TestimonialRecord & { srcSet: string } };
    };

    assert.equal(created.status, 201);
    assert.equal(createBody.data.testimonial.name, 'Parent');
    assert.match(createBody.data.testimonial.imageUrl ?? '', /f_auto,q_auto/);
    assert.match(createBody.data.testimonial.srcSet, /w_320,c_limit/);
    assert.equal('publicId' in createBody.data.testimonial, false);

    const publicList = await fetch(`${baseUrl}/api/v1/testimonials`);
    const publicBody = (await publicList.json()) as {
      data: { testimonials: TestimonialRecord[] };
    };
    assert.equal(publicList.status, 200);
    assert.equal(
      publicBody.data.testimonials[0].id,
      createBody.data.testimonial.id,
    );
    assert.equal(publicBody.data.testimonials[1].id, 'newer');

    const adminList = await fetch(`${baseUrl}/api/v1/admin/testimonials`, {
      headers: { authorization: adminAuthorization },
    });
    assert.equal(adminList.status, 200);
  });
});

test('validates required fields, lengths, unknown fields, MIME type, and file signatures', async () => {
  const fixture = createFixture();

  await withServer(fixture.app, async (baseUrl) => {
    const missingFields = await fetch(`${baseUrl}/api/v1/admin/testimonials`, {
      method: 'POST',
      headers: { authorization: adminAuthorization },
      body: JSON.stringify({ name: 'Missing description' }),
    });
    assert.equal(missingFields.status, 400);

    const longDescription = await fetch(
      `${baseUrl}/api/v1/admin/testimonials`,
      {
        method: 'POST',
        headers: {
          authorization: adminAuthorization,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ name: 'Name', description: 'x'.repeat(1001) }),
      },
    );
    assert.equal(longDescription.status, 400);

    const unknownField = await fetch(`${baseUrl}/api/v1/admin/testimonials`, {
      method: 'POST',
      headers: {
        authorization: adminAuthorization,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Name',
        description: 'Text',
        rating: 5,
      }),
    });
    assert.equal(unknownField.status, 400);

    const invalidFiles = await Promise.all([
      fetch(`${baseUrl}/api/v1/admin/testimonials`, {
        method: 'POST',
        headers: { authorization: adminAuthorization },
        body: multipart(
          { name: 'Invalid', description: 'Wrong MIME.' },
          { bytes: Buffer.from('gif'), type: 'image/gif', filename: 'bad.gif' },
        ),
      }),
      fetch(`${baseUrl}/api/v1/admin/testimonials`, {
        method: 'POST',
        headers: { authorization: adminAuthorization },
        body: multipart(
          { name: 'Invalid', description: 'Wrong signature.' },
          {
            bytes: Buffer.from('not png'),
            type: 'image/png',
            filename: 'fake.png',
          },
        ),
      }),
    ]);
    assert.deepEqual(
      invalidFiles.map((response) => response.status),
      [400, 400],
    );
    assert.equal(fixture.uploadedPublicIds.length, 0);
  });
});

test('accepts 5 MiB image and rejects oversized or multiple image uploads', async () => {
  const fixture = createFixture();
  const maxBytes = Buffer.alloc(5 * 1024 * 1024);
  pngBytes.subarray(0, 8).copy(maxBytes);

  await withServer(fixture.app, async (baseUrl) => {
    const maxUpload = await fetch(`${baseUrl}/api/v1/admin/testimonials`, {
      method: 'POST',
      headers: { authorization: adminAuthorization },
      body: multipart(
        { name: 'Maximum image', description: 'Within limit.' },
        { bytes: maxBytes, type: 'image/png', filename: 'max.png' },
      ),
    });
    assert.equal(maxUpload.status, 201);

    const tooLarge = await fetch(`${baseUrl}/api/v1/admin/testimonials`, {
      method: 'POST',
      headers: { authorization: adminAuthorization },
      body: multipart(
        { name: 'Large image', description: 'Above limit.' },
        {
          bytes: Buffer.alloc(5 * 1024 * 1024 + 1),
          type: 'image/jpeg',
          filename: 'large.jpg',
        },
      ),
    });
    assert.equal(tooLarge.status, 413);

    const multiple = new FormData();
    multiple.append('name', 'Multiple');
    multiple.append('description', 'Not supported.');
    for (const filename of ['one.jpg', 'two.jpg']) {
      multiple.append(
        'image',
        new Blob([toBlobPart(jpegBytes)], { type: 'image/jpeg' }),
        filename,
      );
    }
    const multipleResponse = await fetch(
      `${baseUrl}/api/v1/admin/testimonials`,
      {
        method: 'POST',
        headers: { authorization: adminAuthorization },
        body: multiple,
      },
    );
    assert.equal(multipleResponse.status, 400);
  });
});

test('admin can partially update fields, replace or remove image, and delete testimonial', async () => {
  const existing = createRecord('existing', new Date(), {
    imageUrl: imageUrl('testimonials/old-photo'),
  });
  const fixture = createFixture({ records: [existing] });

  await withServer(fixture.app, async (baseUrl) => {
    const partial = await fetch(
      `${baseUrl}/api/v1/admin/testimonials/existing`,
      {
        method: 'PATCH',
        headers: {
          authorization: adminAuthorization,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ profession: 'Teacher' }),
      },
    );
    const partialBody = (await partial.json()) as {
      data: { testimonial: TestimonialRecord };
    };
    assert.equal(partial.status, 200);
    assert.equal(partialBody.data.testimonial.name, existing.name);
    assert.equal(partialBody.data.testimonial.profession, 'Teacher');

    const replacement = await fetch(
      `${baseUrl}/api/v1/admin/testimonials/existing`,
      {
        method: 'PATCH',
        headers: { authorization: adminAuthorization },
        body: multipart(
          { description: 'Updated after replacing photo.' },
          { bytes: pngBytes, type: 'image/png', filename: 'new.png' },
        ),
      },
    );
    assert.equal(replacement.status, 200);
    assert.deepEqual(fixture.deletedPublicIds, ['testimonials/old-photo']);

    const removeImage = await fetch(
      `${baseUrl}/api/v1/admin/testimonials/existing`,
      {
        method: 'PATCH',
        headers: {
          authorization: adminAuthorization,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ removeImage: true }),
      },
    );
    const removeBody = (await removeImage.json()) as {
      data: { testimonial: TestimonialRecord };
    };
    assert.equal(removeImage.status, 200);
    assert.equal(removeBody.data.testimonial.imageUrl, null);

    const imageOnlyUpdate = await fetch(
      `${baseUrl}/api/v1/admin/testimonials/existing`,
      {
        method: 'PATCH',
        headers: { authorization: adminAuthorization },
        body: multipart(
          {},
          { bytes: jpegBytes, type: 'image/jpeg', filename: 'only-image.jpg' },
        ),
      },
    );
    assert.equal(imageOnlyUpdate.status, 200);

    const deleteNoAuth = await fetch(
      `${baseUrl}/api/v1/admin/testimonials/existing`,
      { method: 'DELETE' },
    );
    assert.equal(deleteNoAuth.status, 401);

    const deleted = await fetch(
      `${baseUrl}/api/v1/admin/testimonials/existing`,
      {
        method: 'DELETE',
        headers: { authorization: adminAuthorization },
      },
    );
    assert.equal(deleted.status, 200);
    assert.equal(fixture.records.has('existing'), false);
  });
});

test('database failures clean uploaded Cloudinary images and do not expose details', async () => {
  const createFailure = createFixture({ failCreate: true });

  await withServer(createFailure.app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/admin/testimonials`, {
      method: 'POST',
      headers: { authorization: adminAuthorization },
      body: multipart(
        { name: 'Failure', description: 'Database should fail.' },
        { bytes: jpegBytes, type: 'image/jpeg', filename: 'failure.jpg' },
      ),
    });
    const body = await response.text();

    assert.equal(response.status, 500);
    assert.doesNotMatch(body, /Database create failed/);
    assert.equal(createFailure.deletedPublicIds.length, 1);
  });

  const updateFailure = createFixture({
    records: [
      createRecord('update', new Date(), {
        imageUrl: imageUrl('testimonials/original'),
      }),
    ],
    failUpdate: true,
  });
  await withServer(updateFailure.app, async (baseUrl) => {
    const response = await fetch(
      `${baseUrl}/api/v1/admin/testimonials/update`,
      {
        method: 'PATCH',
        headers: { authorization: adminAuthorization },
        body: multipart(
          { name: 'Should not save' },
          { bytes: jpegBytes, type: 'image/jpeg', filename: 'replacement.jpg' },
        ),
      },
    );

    assert.equal(response.status, 500);
    assert.equal(updateFailure.deletedPublicIds.length, 1);
    assert.equal(
      updateFailure.records.get('update')?.imageUrl,
      imageUrl('testimonials/original'),
    );
  });
});

test('Cloudinary upload failures are reported safely and leave no testimonial record', async () => {
  const fixture = createFixture({ failUpload: true });

  await withServer(fixture.app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/admin/testimonials`, {
      method: 'POST',
      headers: { authorization: adminAuthorization },
      body: multipart(
        { name: 'Upload failure', description: 'Cloudinary failure.' },
        { bytes: jpegBytes, type: 'image/jpeg', filename: 'failure.jpg' },
      ),
    });
    const body = await response.text();

    assert.equal(response.status, 500);
    assert.doesNotMatch(body, /Cloudinary upload failed/);
    assert.equal(fixture.records.size, 0);
    assert.equal(fixture.deletedPublicIds.length, 1);
  });
});

test('deleting testimonial with image removes its Cloudinary asset', async () => {
  const fixture = createFixture({
    records: [
      createRecord('with-image', new Date(), {
        imageUrl: imageUrl('testimonials/to-remove'),
      }),
    ],
  });

  await withServer(fixture.app, async (baseUrl) => {
    const response = await fetch(
      `${baseUrl}/api/v1/admin/testimonials/with-image`,
      {
        method: 'DELETE',
        headers: { authorization: adminAuthorization },
      },
    );

    assert.equal(response.status, 200);
    assert.equal(fixture.records.has('with-image'), false);
    assert.deepEqual(fixture.deletedPublicIds, ['testimonials/to-remove']);
  });
});

test('Cloudinary replacement/deletion failures roll back database image changes', async () => {
  const replacementFixture = createFixture({
    records: [
      createRecord('replace', new Date(), {
        imageUrl: imageUrl('testimonials/original'),
      }),
    ],
    failStorageDelete: true,
  });

  await withServer(replacementFixture.app, async (baseUrl) => {
    const response = await fetch(
      `${baseUrl}/api/v1/admin/testimonials/replace`,
      {
        method: 'PATCH',
        headers: { authorization: adminAuthorization },
        body: multipart(
          { name: 'Replacement' },
          { bytes: jpegBytes, type: 'image/jpeg', filename: 'replacement.jpg' },
        ),
      },
    );

    assert.equal(response.status, 500);
    assert.equal(
      replacementFixture.records.get('replace')?.imageUrl,
      imageUrl('testimonials/original'),
    );
    assert.equal(replacementFixture.deletedPublicIds.length, 2);
  });

  const deleteFixture = createFixture({
    records: [
      createRecord('delete', new Date(), {
        imageUrl: imageUrl('testimonials/to-delete'),
      }),
    ],
    failStorageDelete: true,
  });

  await withServer(deleteFixture.app, async (baseUrl) => {
    const response = await fetch(
      `${baseUrl}/api/v1/admin/testimonials/delete`,
      {
        method: 'DELETE',
        headers: { authorization: adminAuthorization },
      },
    );

    assert.equal(response.status, 500);
    assert.equal(deleteFixture.records.has('delete'), true);
  });
});

test('Cloudinary public IDs are derived from original and transformed URLs', () => {
  assert.equal(
    getTestimonialPublicId(
      'https://res.cloudinary.com/test/image/upload/v123/testimonials/photo.png',
    ),
    'testimonials/photo',
  );
  assert.equal(
    getTestimonialPublicId(
      'https://res.cloudinary.com/test/image/upload/f_auto,q_auto/v123/testimonials/photo.png',
    ),
    'testimonials/photo',
  );
});
