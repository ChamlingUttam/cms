# Backend

## Prisma with Neon

1. Copy `.env.example` to `.env` and replace the sample database URLs with the
   connection strings from your Neon project. Use the pooled endpoint for
   `DATABASE_URL` and the direct endpoint for `DIRECT_URL`. Do not commit `.env`.
2. Generate Prisma Client:

   ```sh
   npm run prisma:generate
   ```

3. Add your models to `prisma/schema.prisma`, then create/apply a development
   migration:

   ```sh
   npm run db:migrate -- --name init
   ```

4. Import the shared client from `src/lib/prisma.ts`:

   ```ts
   import { prisma } from './lib/prisma';
   ```

`DATABASE_URL` is used by the Neon driver adapter at runtime. Prisma CLI
migrations use `DIRECT_URL`, which should be the non-pooled Neon connection.
