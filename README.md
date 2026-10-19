# Edmonton Cycle Club — site rebuild

Static site built with [Eleventy](https://www.11ty.dev/). Current pages:
Home, Diary, About, Code of Conduct, Newsletters, Frequent Flyers. The rest
of the original site (ride reports, guidance/activities pages, links,
archive) is still to come — see `PLAN.md` for the full roadmap.

## Working locally

```
npm install
npm start          # dev server at http://localhost:8080, drafts hidden
npm run build:drafts  # dev server with draft/unpublished entries visible
npm run build       # production build to _site/
```

## Adding this month's rides

Create `src/diary/YYYY-MM.md` (e.g. `src/diary/2026-10.md`):

```yaml
---
tags: diaryMonth
month: 2026-10
rides:
  - date: 2026-10-04
    time: "9:30"
    place:
      name: "Venue name"
      mapUrl: "https://..."
      w3w: "three.word.code"
    info: "Ride description."
    leader: Name
    status: confirmed   # confirmed | cancelled | postponed
    draft: false        # true = hidden from the published site until ready
---
```

- Leave out `time`/`place`/`leader` for meetings or informational entries.
- For a cancelled or postponed ride, set `status` and add a `statusNote`
  (shown in place of the strikethrough note the old site used inline) —
  the card automatically gets struck through and badged.
- `draft: true` replaces the old commented-out-HTML staging trick: draft
  entries are built but hidden unless the site is built with
  `SHOW_DRAFTS=true` (`npm run build:drafts`), so you can prep a future
  month ride-by-ride without it going live early.
- Months are sorted automatically by the `month` field, newest first — no
  need to keep them in file order.
- The diary page itself splits rides into two sections: **"Upcoming rides
  and events"** (every non-past ride across all months, flattened and
  sorted chronologically, soonest first) and **"Past rides and events"**
  (unchanged month-grouped, newest-month-first layout). The cutoff between
  the two is today's date *as of the last build* — the site rebuilds daily
  via a scheduled GitHub Actions run (see `PLAN.md`) so this advances on
  its own without needing a content push.

## Adding a newsletter

Drop the PDF into `src/documents/`, then add one entry to the front-matter
list at the top of `src/newsletters.njk`:

```yaml
- issue: "Winter 2026"
  file: "newsletter202601.pdf"
```

`src/documents/` is passthrough-copied as-is to `/documents/` — the same
folder is meant to be reused for AGM minutes PDFs once that page is built.

## Adding a ride report

Ride reports are a blog: one Markdown file per report in `src/ride-reports/`,
newest rendered first. Create `src/ride-reports/YYYY-MM-DD-slug.md`:

```yaml
---
title: "Ride Title"
date: 2026-11-01
leader: Name
riders: "Name, Name, Name"
backstop: Name
images:
  - src: "some-photo.jpg"        # filename only; the file itself goes in src/images/ride-reports/
    alt: "Accessible description of the photo"
    caption: "Caption shown under the photo"
    credit: Name
    align: left                   # or right; omit to default to left
---
Report text as plain Markdown. Multiple paragraphs are fine, and so are
multiple accounts of the same ride (the site has precedent for this — see
`src/ride-reports/2026-07-26-bricket-wood.md`).
```

- `leader`/`riders`/`backstop` are free text, not a structured list — copy
  however the club phrases it (e.g. two co-leaders, a "part ride" note).
  Omit any of the three entirely for a non-ride event (see
  `2026-09-10-presentation-evening.md`, which has no leader/riders/backstop
  at all).
- `images` is optional and can have any number of entries, or none.
- The permalink is built from the `date` front-matter field plus a slug
  derived from the filename, e.g. `2026-11-01-some-ride.md` becomes
  `/ride-reports/2026-11-01-some-ride/` (computed in
  `src/_data/eleventyComputed.js`, not from the filename directly, so a
  future rename or an unconventional filename can't break it). Including
  the date keeps URLs collision-proof even as the archive grows — the
  filename's own slug only needs to be unique *within that date*, e.g.
  the two Les Bailey Memorial rides both on 2026-06-14 just need
  different slugs from each other.
- No `draft` flag like the diary has — a report either exists or it
  doesn't, since by definition you're writing about a ride that already
  happened.
- The nav's "Ride Reports" link and each report's Newer/Older pager are all
  computed automatically from the `date` field — nothing else to wire up.

## Editing the Frequent Flyers page

`src/frequent-flyers.md` is plain Markdown on purpose, so the points table
and membership list can be hand-edited without touching any HTML — open the
file, edit the numbers/names in the tables, save. No other file needs to
change.

## Structure

- `src/_data/site.js` — site title, tagline, and the nav list. This one
  list drives *both* the desktop menu bar in the header and the mobile
  hamburger dropdown (`src/_includes/partials/nav.njk`) — add an `href` to
  switch an item on once that page exists. "Ride Reports" is a special
  case with `dynamicHref` instead of `href` — see `src/_data/eleventyComputed.js`.
- `src/_data/eleventyComputed.js` — build-time computed data: the nav's
  "Ride Reports" link (always the newest report) and the auto-generated
  meta description for ride report pages that don't set their own.
- `src/_includes/layouts/base.njk` — shared header/nav/footer, favicon.
- `src/_includes/partials/nav.njk` — the mobile hamburger dropdown.
- `src/_includes/partials/ride-card.njk` — the diary entry card macro.
- `src/diary/*.md` — one data file per month.
- `src/diary.njk` — renders all diary months.
- `src/ride-reports/*.md` — one file per ride report (see "Adding a ride
  report" above); `ride-reports.json` sets the shared tag/layout/permalink.
- `src/_includes/layouts/ride-report.njk` — renders a single report (photos,
  body, leader/riders/backstop, Newer/Older pager).
- `src/index.njk` — home page.
- `src/about.njk` — About page (club intro, Code of Conduct link, contact
  buttons for WhatsApp/email).
- `src/conduct.njk` — Code of Conduct page.
- `src/newsletters.njk` — Newsletters page (see "Adding a newsletter" above).
- `src/frequent-flyers.md` — Frequent Flyers page (see above).
- `src/documents/` — PDFs served as-is at `/documents/`.
- `src/images/ecc-logo.svg` — club logo; also used as the site favicon.
- `src/images/ride-reports/` — photos referenced by ride reports.
- `src/css/style.css` — all styles (mobile-first, single breakpoint at 760px).
- `src/sitemap.njk` — generates `/sitemap.xml` from every page that has a URL.
- `src/robots.txt` — passthrough-copied as-is; allows all crawling and
  points at the sitemap.

## SEO

- Every page sets a unique `description` in its front matter (falls back to
  `site.tagline` if omitted) — used for `<meta name="description">`, Open
  Graph, and Twitter Card tags in `base.njk`.
- `site.baseUrl` (`src/_data/site.js`) is the absolute origin used to build
  canonical links, Open Graph URLs, JSON-LD, and `sitemap.xml` — currently
  the GitHub Pages URL (`https://dol3y.github.io`). **If/when DNS cuts over
  to a custom domain, update this value and the `Sitemap:` line in
  `src/robots.txt`** (a static file, so it can't reference `site.baseUrl`).
- The homepage (`src/index.njk`) carries a `SportsOrganization` JSON-LD
  block naming the sport and area served (Enfield, Barnet, North London).
- **Known follow-up:** there's no Open Graph image (`og:image`) yet — only
  an SVG logo exists, and social platforms (WhatsApp, Facebook) generally
  need a raster image for link previews. Add a PNG/JPG share image (e.g.
  1200×630) and wire it into `base.njk`'s OG/Twitter tags when one exists.

## Known follow-up

- `src/about.njk`'s "Join our WhatsApp group" button links to a placeholder
  URL (flagged with an HTML comment right above it) — swap in the real
  group invite link before this goes live.
