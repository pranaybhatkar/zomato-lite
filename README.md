# Zomato lite 🍴

A small, real, restaurant-review web app — a "Zomato" for three favourite neighbourhood restaurants. Built step by step to show how a production-style app fits together: a data-driven homepage, restaurant pages with colour-coded reviews, and a review-writing flow that writes straight into a real database.

> **Live demo:** https://zomato-lite-beryl-omega.vercel.app

## What it is

The app has three screens:

1. **Homepage** — lists the restaurants with photo thumbnails, cuisine and area. Tap a card to open its page.
2. **Restaurant page** — an HD hero photo, an average-rating bubble, and review cards coloured by rating (5 stars = dark green → 1 star = red). The newest review is highlighted with a "Latest review" label.
3. **Review page** — pick a star rating, write a comment, hit submit. The review is saved to the database, and the restaurant page reflects it immediately.

Every screen is **data-driven**: pages fetch small API routes, those routes query a real Postgres database, and the frontend simply renders whatever the backend returns — it never invents answers.

## Tech stack & tools

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | [Neon Postgres](https://neon.tech) (serverless) |
| DB access | Raw SQL via `@neondatabase/serverless` — no ORM |
| Deployment | [Vercel](https://vercel.com) |
| Version control | Git + GitHub |

**Deliberate omissions:** no authentication, no state-management library, no search, no ORM, and no calculations in the frontend — averages are rounded in SQL on the backend, and rating → colour mapping is a lookup table, not arithmetic.

## How it works

```
Browser pages ──fetch──▶ API routes (/api/...) ──SQL──▶ Neon Postgres
```

| Endpoint | What it does |
| --- | --- |
| `GET /api/restaurants` | The homepage list: id, name, cuisine, area, photo. |
| `GET /api/restaurants/:id` | One restaurant: name, cuisine, area, photo, average rating, review count, latest review, and older reviews. Returns 404 for unknown ids. |
| `POST /api/reviews` | Saves a new review. Re-validates the rating (1–5) and comment on the backend; 400 on bad input. |

The database has two tables:

- **restaurants** — id, name, cuisine, area, photo URL.
- **reviews** — id, restaurant reference, rating (1–5), comment, created timestamp.

Everything that matters is a fact in the database — **including each restaurant's photo** — so changing data (like swapping a photo) is a database edit, not a code edit.

### Design rules that kept it honest

- The frontend does **zero maths** — averages are rounded in the backend; colours come from lookup tables.
- The backend **re-validates** everything the frontend sends.
- **No computed columns** in the database — the average rating is calculated on the fly with `AVG()`.
- The seed is **idempotent** — running it repeatedly never duplicates rows, so live user reviews are never wiped.
- Only the Unsplash image host is whitelisted in `next.config.ts` (a deliberate remote-image security choice).

## Project structure

```
app/
  page.tsx                     # Homepage (fetches /api/restaurants)
  restaurant/[id]/page.tsx     # Restaurant page: hero photo, average, colour-coded reviews
  review/[restaurantId]/       # Review-writing page
  api/
    restaurants/route.ts       # List endpoint
    restaurants/[id]/route.ts  # Detail endpoint
    reviews/route.ts           # POST new review
db/
  schema.sql                   # Table definitions (safe to re-run)
  seed.sql                     # Guarded, idempotent restaurant + review seed
  setup.mjs                    # Applies schema and seed
```

## Run it locally

Prerequisites: Node.js 20+, a [Neon](https://neon.tech) Postgres database.

```bash
# 1. Install dependencies
npm install

# 2. Point the app at your database
#    create a file called .env.local containing:
#    DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# 3. Create the tables and seed the data
npm run db:setup

# 4. Start the dev server
npm run dev
```

Open http://localhost:3000.

> `.env.local` holds your database URL and is git-ignored — it never reaches GitHub.

## Deployment

The app is deployed on Vercel and wired to the GitHub repo: every push to `main` triggers a build and, when ready, a new production deployment. The **same Neon database is shared** between local development and the live site.

## How we built it (the journey)

Built one milestone at a time, with a commit per milestone and a plain-English message each time. This is the whole story, in order:

1. **First snapshot** — the app with its database, both API routes, and the two core screens.
2. **Homepage → restaurant page** — the first link connecting the screens.
3. **The Zomato look** — red-and-white branding, an HD hero photo, rating-coloured review cards.
4. **Hero photo iterations** — swapping in free, licence-safe Unsplash shots until the cut-in-half sandwich landed.
5. **A real homepage** — a data-driven list API, plus two new restaurants (Ludhiana Burrito, Kong City), each with three seeded reviews.
6. **Photos become data** — a `photo_url` column, so every restaurant owns its photo and the frontend renders what the backend sends.
7. **Polish** — Home buttons, a redesigned review page, photo thumbnails on the homepage.
8. **Hand-picked photos** — each restaurant's hero swapped to a vetted, free Unsplash image.

Every change was explained before it was made and shipped as its own commit — the git log reads as a readable history of the whole build.

## Photo credits

Food photography from [Unsplash](https://unsplash.com), all free to use under the [Unsplash License](https://unsplash.com/license):

- **Bombay Sandwich Co.** — "a sandwich cut in half" by [Eiliv Aceron](https://unsplash.com/photos/a-sandwich-cut-in-half-Z7X1PPL_r2k)
- **Ludhiana Burrito** — "a burrito cut in half on a plate" by [Snappr](https://unsplash.com/photos/a-burrito-cut-in-half-on-a-plate-BqV9zOdio6A)
- **Kong City** — "stir-fried noodles with vegetables" by [Orijit Chatterjee](https://unsplash.com/photos/stir-fried-noodles-with-vegetables-wEBg_pYtynw)