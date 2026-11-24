# UMCine — Next.js Migration

## Run locally

Use Node.js 22 or newer (`ky` v2 requires Node.js 22). The included lockfile is for npm.

```bash
npm ci
cp .env.example .env.local
```

Copy values from the **original** `week08_mission01/.env.local` into the new `.env.local` using these names. Do not commit this file.

| Original | New |
| --- | --- |
| `VITE_TMDB_API_BASE_URL` | `TMDB_API_BASE_URL` |
| `VITE_TMDB_ACCESS_TOKEN` | `TMDB_ACCESS_TOKEN` |
| `VITE_API_BASE_URL` | `NEXT_PUBLIC_API_BASE_URL` |

```bash
npm run dev
```

Open `http://localhost:3000`. If the UMCine API restricts CORS, it must allow the new frontend origin. Set `NEXT_PUBLIC_API_BASE_URL` before running a production build because Next.js inlines it into the client bundle.

## Verification

`npm run typecheck` and `npm run build` passed with Next.js 16.4.6. To verify with a configured backend and browser:

1. Open `/`, search a title from `/search`, reload the query URL and open a movie detail from the results.
2. Open `/mypage/edit` while signed out; expect `/login`. Sign in, reload `/mypage`, and check the signed-in state. Open `/login` again; expect `/`.
3. Test adding/removing a favorite, creating/updating/deleting a rating, and confirm that local search bookmarks survive reload. Check profile image preview and save using the original local profile behavior.

The browser checks and live API requests were not executed in the build verification. The client-side auth gate only controls page presentation; the external backend must enforce authorization.
