# Frontend

Minimal Next.js App Router project and folder skeleton for the CMS frontend.

## Local development

```sh
npm ci
npm run dev
```

Run checks:

```sh
npm run lint
npm run typecheck
npm run build
```

## Folders

- `src/app`: Next.js routes and global styles.
- `src/components`: shared UI and layout components.
- `src/features`: future CMS content areas.
- `src/lib`: shared libraries and utilities.
- `src/hooks`: reusable hooks.
- `src/types`: shared TypeScript types.
- `public`: static assets.

Empty folders use `.gitkeep` so Git includes them.

## CI and CD

The CI workflow is at the repository root in
`.github/workflows/frontend-ci.yml`, because GitHub only discovers Actions
workflows from that location. It runs lint, type checking, and a production
build for changes to `frontend/` on `main`.

Use Vercel's GitHub integration for CD: import this repository, set its
project root to `frontend`, and select `main` as the production branch. Vercel
will build and deploy when changes are pushed. Configure branch protection to
require the CI job before merging; deployment itself is not configured here.
