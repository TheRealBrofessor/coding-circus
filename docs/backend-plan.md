# Coding Circus Backend Plan

## Decision

Use **Supabase Free** as the first official backend for Coding Circus.

Coding Circus should remain a static Vite/GitHub Pages frontend, but connect to Supabase for account, cloud-save, and project-gallery features.

## Why Supabase first

Supabase provides the pieces Coding Circus needs without requiring a custom server on day one:

- Postgres database
- Auth
- Storage
- Realtime APIs
- Edge Functions
- Row Level Security
- JavaScript client support for a static React app

This lets Coding Circus become an official app while keeping the frontend deployable as a static site.

## Target architecture

```text
GitHub Pages / Vite static frontend
        |
        | @supabase/supabase-js
        v
Supabase Free project
  - Auth
  - Postgres
  - Storage
  - Row Level Security
  - Edge Functions later
```

## MVP backend features

1. User accounts
2. User profiles
3. Cloud project saves
4. Public project publishing
5. Project gallery
6. Fork/remix tracking
7. Likes/stars
8. Project reports for moderation

## Tables

Initial tables:

- `profiles`
- `projects`
- `project_versions`
- `project_likes`
- `project_reports`

Optional later tables:

- `tags`
- `project_tags`
- `collections`
- `classrooms`
- `assignments`

## Environment variables

The static frontend should use these public Vite variables:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

The anon key is intended for browser use, but Row Level Security must be configured correctly. Never expose the Supabase service-role key in the frontend, GitHub repo, or GitHub Pages build.

## Implementation phases

### Phase 1 — Backend scaffold

- Add Supabase client wrapper.
- Add environment example.
- Add database schema SQL.
- Add project repository/service functions.
- Keep localStorage as fallback when Supabase is not configured.

### Phase 2 — Accounts and cloud save

- Sign up/sign in/sign out.
- Create profile row on user registration.
- Save private projects to Supabase.
- Load user projects from Supabase.

### Phase 3 — Public showcase

- Publish/unpublish projects.
- Public gallery route/page.
- Project detail route/page.
- Fork/remix from public project.
- Like/star project.
- Report project.

### Phase 4 — Moderation and platform features

- Admin/moderation view.
- Featured projects.
- Tags/search.
- Classroom support.
- VS Code sync path.

## Security rules

- Enable Row Level Security on all app tables.
- Users can read public projects.
- Users can read/write their own private projects.
- Users cannot edit other users' projects.
- Reports can be created by signed-in users.
- Likes are unique per user/project.
- Service-role key stays server-side only.

## Static-site compatibility

The frontend must continue to build as a static Vite site. Supabase integration should not require a Node server, server-rendering, or backend code running inside GitHub Pages.
