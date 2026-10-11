# RateIt

A social ratings app built with Next.js (App Router) and Supabase — think
letterboxd-style rating/review posts, but generalized to arbitrary Topics and
Items, with a full Blade Runner-inspired visual theme.

## Features

- **Auth** — sign up, email confirmation, log in/out, password reset, all via
  Supabase Auth (PKCE flow) and Next.js Server Actions.
- **Topics & Items** — browse Topics (e.g. "Movies"), drill into Items within
  a Topic, and see/write Posts (ratings 1–5, half-points allowed, plus a
  written review and photo) for any Item.
- **Social graph** — follow Topics, pin up to 4 Topics/Items to your profile,
  add friends, and see a personalized Feed of posts from people you follow.
- **Engagement** — like and comment on posts, see "Booming Topics" ranked by
  recent engagement, jump to a random Item within a Topic.
- **Search** — search Users, Topics, and Items (including scoped to a single
  Topic) from a shared search bar.
- **Profile management** — edit your username (uniqueness-checked), profile
  picture, and pinned Topics/Items from an EditUser page.

## Stack

- Next.js 14 (App Router, Server Components, Server Actions, Route Handlers)
- Supabase (Postgres, Auth, Storage, RPC functions)
- Tailwind CSS
- TypeScript

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Under **Project Settings → API**, copy the Project URL and `anon` public
   key into a `.env.local` file:

   ```bash
   cp .env.example .env.local
   ```

3. Under **Authentication → Email Templates**, the default "Confirm signup"
   template works as-is (PKCE flow) — it's handled by
   [`app/auth/confirm/route.ts`](app/auth/confirm/route.ts).
4. Run the SQL files in this repo's root (`supabase_*.sql`) in the Supabase
   SQL editor — they set up the `UserInfo` table's RLS policies and a couple
   of RPC functions (random item lookup, booming posts). Note: this repo
   doesn't yet include every RPC function the app calls (e.g.
   `get_recent_posts`, `get_feed`, `get_booming_topics`) or the full table
   schema (`Topics`, `Items`, `Posts`, `UserInfo`, likes/comments tables,
   `PinnedTopics`/`PinnedItems`) — those were created directly in the
   Supabase dashboard during development and would need to be recreated for
   a from-scratch setup.
5. Create two public Storage buckets: `post-images` and `ProfilePic-images`.

### 3. Run it

```bash
npm run dev
```

Visit http://localhost:3000.

## Notable implementation details

- **PKCE auth flow end-to-end**: signup defers creating the app-level
  `UserInfo` row until the user actually clicks the email confirmation link
  (not at signup time), handled in
  [`app/auth/confirm/route.ts`](app/auth/confirm/route.ts) — including
  working around a `@supabase/ssr` quirk where a session established via
  `exchangeCodeForSession` wasn't reliably used for a write later in the same
  request, by issuing that write through a separately, explicitly
  Bearer-authenticated client instead.
- **Row Level Security**: see
  [`supabase_userinfo_rls_policies.sql`](supabase_userinfo_rls_policies.sql)
  for the policies gating reads/writes on `UserInfo`.

## Deploying

Push to GitHub, import into [Vercel](https://vercel.com), and add
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment
variables in the Vercel project settings.
