import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import express from 'express';
import type { RequestHandler } from 'express';
import type {} from '../src/types/express';
import { errorHandler } from '../src/middlewares/errorHandler';
import { createGalleryController } from '../src/modules/gallery/controller';
import { getImageDelivery } from '../src/modules/gallery/delivery';
import { createGalleryRouters } from '../src/modules/gallery/routerFactory';
import {
  createGalleryService,
  type GalleryImageRecord,
  type GalleryImageUpload,
  type GalleryRepository,
  type GalleryStorage,
} from '../src/modules/gallery/service';

const adminAuthorization = 'Bearer test-admin-token';
const secureImageUrl =
  'https://res.cloudinary.com/test/image/upload/v123/gallery/test.jpg';
const jpegBytes = Buffer.from([0xff, 0xd8, 0xff, 0x01]);
const pngBytes = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x01,
]);

function createRecord(
  id: string,
  createdAt: Date,
  publicId = `gallery/${id}`,
): GalleryImageRecord {
  return {
    id,
    imageUrl: secureImageUrl,
    publicId,
    width: 800,
    height: 600,
    format: 'jpg',
    bytes: 4,
    createdAt,
    updatedAt: createdAt,
  };
}

function createFixture(
  options: {
    records?: GalleryImageRecord[];
    failUploadFilename?: string;
    failCreateAt?: number;
    failDelete?: Error;
    failStorageDelete?: Error;
    failList?: Error;
    delayUploads?: boolean;
  } = {},
) {
  const records = new Map(
    (options.records ?? []).map((record) => [record.id, record]),
  );
  const deletedPublicIds: string[] = [];
  const uploadPublicIds: string[] = [];
  const listQueries: Array<{ skip: number; take: number }> = [];
  let createAttempts = 0;
  let activeUploads = 0;
  let maximumActiveUploads = 0;

  const repository: GalleryRepository = {
    async findMany({ skip, take }) {
      listQueries.push({ skip, take });

      if (options.failList) {
        throw options.failList;
      }

      const ordered = [...records.values()].sort(
        (first, second) =>
          second.createdAt.getTime() - first.createdAt.getTime() ||
          second.id.localeCompare(first.id),
      );
      return ordered.slice(skip, skip + take);
    },
    async count() {
      return records.size;
    },
    async findById(id) {
      return records.get(id) ?? null;
    },
    async create(image: GalleryImageUpload) {
      createAttempts += 1;

      if (createAttempts === options.failCreateAt) {
        throw new Error('Database write failed.');
      }

      const createdAt = new Date();
      const record: GalleryImageRecord = {
        id: image.publicId.split('/').pop() ?? `image-${records.size + 1}`,
        ...image,
        createdAt,
        updatedAt: createdAt,
      };
      records.set(record.id, record);
      return record;
    },
    async delete(id) {
      if (options.failDelete) {
        throw options.failDelete;
      }

      const record = records.get(id);
      assert.ok(record);
      records.delete(id);
      return record;
    },
  };

  const storage: GalleryStorage = {
    async upload(filePath, publicId) {
      uploadPublicIds.push(publicId);
      activeUploads += 1;
      maximumActiveUploads = Math.max(maximumActiveUploads, activeUploads);

      try {
        const { readFile } = await import('node:fs/promises');
        const bytes = await readFile(filePath);
        const filename = bytes.toString('hex');

        if (options.delayUploads) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        if (
          filename === Buffer.from('fail-cloudinary').toString('hex') ||
          filename === options.failUploadFilename
        ) {
          throw new Error('Cloudinary upload failed.');
        }

        return {
          imageUrl: `https://res.cloudinary.com/test/image/upload/v123/${publicId}.jpg`,
          publicId,
          width: 800,
          height: 600,
          format: 'jpg',
          bytes: bytes.length,
        };
      } finally {
        activeUploads -= 1;
      }
    },
    async delete(publicId) {
      deletedPublicIds.push(publicId);

      if (options.failStorageDelete) {
        throw options.failStorageDelete;
      }
    },
  };

  const service = createGalleryService(repository, storage);
  const controller = createGalleryController(service);
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
  const { adminRouter, publicRouter } = createGalleryRouters(
    controller,
    authorizeAdmin,
  );
  const app = express();

  app.use('/api/v1/admin/gallery', adminRouter);
  app.use('/api/v1/gallery', publicRouter);
  app.use(errorHandler);

  return {
    app,
    records,
    deletedPublicIds,
    uploadPublicIds,
    listQueries,
    getMaximumActiveUploads: () => maximumActiveUploads,
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

function imageForm(
  images: Array<{
    bytes: Buffer;
    type?: string;
    filename: string;
    field?: 'image' | 'images';
  }>,
) {
  const form = new FormData();

  for (const image of images) {
    form.append(
      image.field ?? 'images',
      new Blob([toBlobPart(image.bytes)], {
        type: image.type ?? 'image/jpeg',
      }),
      image.filename,
    );
  }

  return form;
}

async function postImages(
  baseUrl: string,
  images: Array<{
    bytes: Buffer;
    type?: string;
    filename: string;
    field?: 'image' | 'images';
  }>,
) {
  return fetch(`${baseUrl}/api/v1/admin/gallery`, {
    method: 'POST',
    headers: { authorization: adminAuthorization },
    body: imageForm(images),
  });
}

test('public listing uses default pagination, newest-first ordering, stable ties, and safe fields', async () => {
  const sameTime = new Date('2026-02-01T00:00:00Z');
  const newer = createRecord('newer', new Date('2026-03-01T00:00:00Z'));
  const tiedB = createRecord('tie-b', sameTime);
  const tiedA = createRecord('tie-a', sameTime);
  const older = createRecord('older', new Date('2026-01-01T00:00:00Z'));
  const fixture = createFixture({ records: [older, tiedA, newer, tiedB] });

  await withServer(fixture.app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/gallery`);
    const body = (await response.json()) as {
      data: {
        images: Array<Record<string, unknown>>;
        pagination: Record<string, number>;
      };
    };

    assert.equal(response.status, 200);
    assert.deepEqual(
      body.data.images.map((image) => image.id),
      ['newer', 'tie-b', 'tie-a', 'older'],
    );
    assert.deepEqual(body.data.pagination, {
      page: 1,
      limit: 12,
      totalItems: 4,
      totalPages: 1,
    });
    assert.equal('publicId' in body.data.images[0], false);
    assert.match(String(body.data.images[0].imageUrl), /f_auto,q_auto/);
    assert.match(String(body.data.images[0].srcSet), /w_320,c_limit/);
    assert.equal(body.data.images[0].loading, 'lazy');
    assert.deepEqual(fixture.listQueries, [{ skip: 0, take: 12 }]);
  });
});

test('admin listing requires auth and defaults to 20 items', async () => {
  const fixture = createFixture();

  await withServer(fixture.app, async (baseUrl) => {
    const unauthorized = await fetch(`${baseUrl}/api/v1/admin/gallery`);
    assert.equal(unauthorized.status, 401);

    const response = await fetch(`${baseUrl}/api/v1/admin/gallery`, {
      headers: { authorization: adminAuthorization },
    });

    assert.equal(response.status, 200);
    assert.deepEqual(fixture.listQueries, [{ skip: 0, take: 20 }]);
  });
});

test('pagination accepts page and maximum limit and rejects invalid values', async () => {
  const fixture = createFixture();

  await withServer(fixture.app, async (baseUrl) => {
    const maxLimit = await fetch(`${baseUrl}/api/v1/gallery?page=2&limit=50`);
    assert.equal(maxLimit.status, 200);
    assert.deepEqual(fixture.listQueries[0], { skip: 50, take: 50 });

    for (const query of [
      'page=0',
      'page=-1',
      'page=1.5',
      'page=1&page=2',
      'limit=0',
      'limit=51',
      'limit=abc',
      'page=9007199254740991&limit=50',
    ]) {
      const response = await fetch(`${baseUrl}/api/v1/gallery?${query}`);
      assert.equal(response.status, 400, query);
    }
  });
});

test('empty and out-of-range pages return empty images with metadata', async () => {
  const empty = createFixture();

  await withServer(empty.app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/gallery`);
    const body = (await response.json()) as {
      data: { images: unknown[]; pagination: Record<string, number> };
    };

    assert.equal(response.status, 200);
    assert.deepEqual(body.data.images, []);
    assert.deepEqual(body.data.pagination, {
      page: 1,
      limit: 12,
      totalItems: 0,
      totalPages: 0,
    });
  });

  const records = Array.from({ length: 3 }, (_, index) =>
    createRecord(`${index}`, new Date(2026, 0, index + 1)),
  );
  const beyondLast = createFixture({ records });

  await withServer(beyondLast.app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/gallery?page=4&limit=1`);
    const body = (await response.json()) as {
      data: { images: unknown[]; pagination: Record<string, number> };
    };

    assert.deepEqual(body.data.images, []);
    assert.deepEqual(body.data.pagination, {
      page: 4,
      limit: 1,
      totalItems: 3,
      totalPages: 3,
    });
    assert.deepEqual(beyondLast.listQueries, [{ skip: 3, take: 1 }]);
  });
});

test('database listing failures use the centralized generic error response', async () => {
  const fixture = createFixture({
    failList: new Error('Database connection details must not be exposed.'),
  });

  await withServer(fixture.app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/gallery`);
    const body = await response.text();

    assert.equal(response.status, 500);
    assert.doesNotMatch(body, /Database connection details/);
    assert.match(body, /Internal Server Error/);
  });
});

test('admin bulk upload, legacy single upload, listing, and deletion require authorization', async () => {
  const fixture = createFixture();

  await withServer(fixture.app, async (baseUrl) => {
    const deniedUpload = await fetch(`${baseUrl}/api/v1/admin/gallery`, {
      method: 'POST',
      body: imageForm([{ bytes: jpegBytes, filename: 'unauthorized.jpg' }]),
    });
    assert.equal(deniedUpload.status, 401);
    assert.equal(fixture.uploadPublicIds.length, 0);

    const bulkResponse = await postImages(baseUrl, [
      { bytes: jpegBytes, filename: 'first.jpg' },
      { bytes: pngBytes, type: 'image/png', filename: 'second.png' },
    ]);
    const bulkBody = (await bulkResponse.json()) as {
      data: { results: Array<{ success: boolean; image?: { id: string } }> };
    };
    assert.equal(bulkResponse.status, 201);
    assert.equal(bulkBody.data.results.length, 2);
    assert.ok(bulkBody.data.results.every((result) => result.success));

    const legacyResponse = await fetch(`${baseUrl}/api/v1/admin/gallery`, {
      method: 'POST',
      headers: { authorization: adminAuthorization },
      body: imageForm([
        { bytes: jpegBytes, filename: 'legacy.jpg', field: 'image' },
      ]),
    });
    const legacyBody = (await legacyResponse.json()) as {
      data: { image: { id: string } };
    };
    assert.equal(legacyResponse.status, 201);
    assert.ok(legacyBody.data.image.id);

    const list = await fetch(`${baseUrl}/api/v1/admin/gallery`, {
      headers: { authorization: adminAuthorization },
    });
    assert.equal(list.status, 200);

    const unauthorizedDelete = await fetch(
      `${baseUrl}/api/v1/admin/gallery/${legacyBody.data.image.id}`,
      { method: 'DELETE' },
    );
    assert.equal(unauthorizedDelete.status, 401);

    const deletion = await fetch(
      `${baseUrl}/api/v1/admin/gallery/${legacyBody.data.image.id}`,
      {
        method: 'DELETE',
        headers: { authorization: adminAuthorization },
      },
    );
    assert.equal(deletion.status, 200);
  });
});

test('batch rejects more than 10 images and accepts exactly 5 MiB per image', async () => {
  const fixture = createFixture();
  const maximumSize = Buffer.alloc(5 * 1024 * 1024);
  pngBytes.subarray(0, 8).copy(maximumSize);

  await withServer(fixture.app, async (baseUrl) => {
    const maxSizeResponse = await postImages(baseUrl, [
      { bytes: maximumSize, type: 'image/png', filename: 'max.png' },
    ]);
    assert.equal(maxSizeResponse.status, 201);

    const tooMany = await postImages(
      baseUrl,
      Array.from({ length: 11 }, (_, index) => ({
        bytes: jpegBytes,
        filename: `image-${index}.jpg`,
      })),
    );
    assert.equal(tooMany.status, 400);
  });
});

test('per-image size, MIME type, and file signature are validated independently', async () => {
  const fixture = createFixture();
  const oversized = Buffer.alloc(5 * 1024 * 1024 + 1);

  await withServer(fixture.app, async (baseUrl) => {
    const tooLarge = await postImages(baseUrl, [
      { bytes: oversized, filename: 'large.jpg' },
    ]);
    assert.equal(tooLarge.status, 413);

    const invalidImages = await postImages(baseUrl, [
      { bytes: Buffer.from('gif'), type: 'image/gif', filename: 'bad.gif' },
      {
        bytes: Buffer.from('fake png'),
        type: 'image/png',
        filename: 'fake.png',
      },
      { bytes: jpegBytes, type: 'image/png', filename: 'wrong-type.png' },
      { bytes: pngBytes, type: 'image/png', filename: 'valid.png' },
    ]);
    const body = (await invalidImages.json()) as {
      data: { results: Array<{ success: boolean; filename: string }> };
    };

    assert.equal(invalidImages.status, 207);
    assert.deepEqual(
      body.data.results.map(({ success }) => success),
      [false, false, false, true],
    );
    assert.equal(fixture.uploadPublicIds.length, 1);
  });
});

test('partial Cloudinary and database failures return per-image outcomes and clean orphaned assets', async () => {
  const cloudinaryFailureBytes = Buffer.concat([
    jpegBytes,
    Buffer.from('fail-cloudinary'),
  ]);
  const cloudinaryFailure = createFixture({
    failUploadFilename: cloudinaryFailureBytes.toString('hex'),
  });

  await withServer(cloudinaryFailure.app, async (baseUrl) => {
    const response = await postImages(baseUrl, [
      { bytes: jpegBytes, filename: 'success.jpg' },
      {
        bytes: cloudinaryFailureBytes,
        filename: 'cloudinary-fail.jpg',
      },
      { bytes: pngBytes, type: 'image/png', filename: 'success.png' },
    ]);
    const body = (await response.json()) as {
      data: { results: Array<{ success: boolean; message?: string }> };
    };

    assert.equal(response.status, 207);
    assert.deepEqual(
      body.data.results.map((result) => result.success),
      [true, false, true],
    );
    assert.match(body.data.results[1].message ?? '', /could not be uploaded/);
    assert.equal(cloudinaryFailure.deletedPublicIds.length, 1);
  });

  const databaseFailure = createFixture({ failCreateAt: 1 });
  await withServer(databaseFailure.app, async (baseUrl) => {
    const response = await postImages(baseUrl, [
      { bytes: jpegBytes, filename: 'db-fail.jpg' },
      { bytes: pngBytes, type: 'image/png', filename: 'saved.png' },
    ]);
    const body = (await response.json()) as {
      data: { results: Array<{ success: boolean }> };
    };

    assert.equal(response.status, 207);
    assert.deepEqual(
      body.data.results.map((result) => result.success),
      [false, true],
    );
    assert.equal(databaseFailure.deletedPublicIds.length, 1);
  });
});

test('Cloudinary uploads are limited to three concurrent operations', async () => {
  const fixture = createFixture({ delayUploads: true });

  await withServer(fixture.app, async (baseUrl) => {
    const response = await postImages(
      baseUrl,
      Array.from({ length: 10 }, (_, index) => ({
        bytes: jpegBytes,
        filename: `image-${index}.jpg`,
      })),
    );

    assert.equal(response.status, 201);
    assert.equal(fixture.uploadPublicIds.length, 10);
    assert.equal(fixture.getMaximumActiveUploads(), 3);
  });
});

test('upload and delete failures do not expose internal errors or delete database rows prematurely', async () => {
  const cloudinaryFailureBytes = Buffer.concat([
    jpegBytes,
    Buffer.from('fail-cloudinary'),
  ]);
  const cloudinaryFailure = createFixture({
    failUploadFilename: cloudinaryFailureBytes.toString('hex'),
  });

  await withServer(cloudinaryFailure.app, async (baseUrl) => {
    const response = await postImages(baseUrl, [
      { bytes: cloudinaryFailureBytes, filename: 'fail.jpg' },
    ]);
    const body = (await response.json()) as {
      data: { results: Array<{ message: string }> };
    };

    assert.equal(response.status, 207);
    assert.doesNotMatch(JSON.stringify(body), /Cloudinary upload failed/);
  });

  const storageFailure = createFixture({
    records: [createRecord('image-1', new Date())],
    failStorageDelete: new Error('Cloudinary delete failed.'),
  });

  await withServer(storageFailure.app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/admin/gallery/image-1`, {
      method: 'DELETE',
      headers: { authorization: adminAuthorization },
    });
    const body = await response.text();

    assert.equal(response.status, 500);
    assert.doesNotMatch(body, /Cloudinary delete failed/);
    assert.equal(storageFailure.records.size, 1);
  });

  const databaseFailure = createFixture({
    records: [createRecord('image-1', new Date())],
    failDelete: new Error('Database delete failed.'),
  });

  await withServer(databaseFailure.app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/admin/gallery/image-1`, {
      method: 'DELETE',
      headers: { authorization: adminAuthorization },
    });

    assert.equal(response.status, 500);
    assert.equal(databaseFailure.records.size, 1);
  });
});

test('delivery URLs include automatic format, quality, and responsive widths', () => {
  const delivery = getImageDelivery(secureImageUrl);

  assert.match(delivery.imageUrl, /f_auto,q_auto/);
  assert.match(delivery.srcSet, /w_320,c_limit/);
  assert.match(delivery.srcSet, /w_640,c_limit/);
  assert.match(delivery.srcSet, /w_960,c_limit/);
  assert.match(delivery.srcSet, /w_1280,c_limit/);
});
