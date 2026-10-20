# Admin dashboard

Next.js App Router application for the CMS admin dashboard.

## Local development

```sh
npm ci
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the backend API base URL when it is not
`http://localhost:3000/api`.

Run checks:

```sh
npm run lint
npm run typecheck
npm run build
```

## Project structure

- `src/app`: routes, layouts, and route-specific admin components.
- `src/components/ui`: shared shadcn UI primitives.
- `src/api`, `src/api-endpoints`, `src/service`: API client and integrations.
- `src/hooks`, `src/types`, `src/lib`: shared hooks, types, and utilities.
- `public`: static assets.

## CI and CD

The CI workflow is at the repository root in
`.github/workflows/frontend-ci.yml`, because GitHub only discovers Actions
workflows from that location. It runs lint, type checking, and a production
build for changes to `frontend/` on `main`.

Use Vercel's GitHub integration for CD: import this repository, set its
project root to `frontend/admin-dashboard`, and select `main` as the production
branch. Vercel will build and deploy when changes are pushed. Configure branch
protection to require the CI job before merging; deployment itself is not
configured here.
