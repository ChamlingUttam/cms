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

## Admin authentication

Set `JWT_SECRET` in `.env` to a securely generated random value of at least 32
bytes. Generate one with:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Apply the checked-in admin-table migration:

```sh
npm run db:migrate
```

Create the initial admin privately by setting `ADMIN_USERNAME` and
`ADMIN_PASSWORD` in `.env` (passwords must be at least 12 characters), then run:

```sh
npm run seed:admin
```

The seed command refuses to overwrite an existing admin. Admin login is
`POST /api/admin/login` with a JSON `username` and `password`; it returns a
one-hour bearer token:

```json
{ "username": "your-admin-username", "password": "your-admin-password" }
```

Send the token as `Authorization: Bearer <token>`. Protect future admin routes
with the `requireAdmin` middleware. `GET /api/admin/me` demonstrates the
protected route. Login is limited to five attempts per IP per 15 minutes using
the default in-memory rate-limit store.

Update credentials with `PATCH /api/admin/change-fields`, authenticated
with the bearer token. Send `currentPassword` and at least one of `newUsername`
or `newPassword` (new passwords must be at least 12 characters). The endpoint
returns a replacement token and invalidates tokens issued before the change:

```json
{
  "currentPassword": "your-current-password",
  "newUsername": "your-new-username",
  "newPassword": "your-new-password"
}
```
