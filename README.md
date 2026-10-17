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

## Adding a newsletter

Drop the PDF into `src/documents/`, then add one entry to the front-matter
list at the top of `src/newsletters.njk`:

```yaml
- issue: "Winter 2026"
  file: "newsletter202601.pdf"
```

`src/documents/` is passthrough-copied as-is to `/documents/` — the same
folder is meant to be reused for AGM minutes PDFs once that page is built.

## Editing the Frequent Flyers page

`src/frequent-flyers.md` is plain Markdown on purpose, so the points table
and membership list can be hand-edited without touching any HTML — open the
file, edit the numbers/names in the tables, save. No other file needs to
change.

## Structure

- `src/_data/site.js` — site title, tagline, and the nav list. This one
  list drives *both* the desktop menu bar in the header and the mobile
  hamburger dropdown (`src/_includes/partials/nav.njk`) — add an `href` to
  switch an item on once that page exists.
- `src/_includes/layouts/base.njk` — shared header/nav/footer, favicon.
- `src/_includes/partials/nav.njk` — the mobile hamburger dropdown.
- `src/_includes/partials/ride-card.njk` — the diary entry card macro.
- `src/diary/*.md` — one data file per month.
- `src/diary.njk` — renders all diary months.
- `src/index.njk` — home page.
- `src/about.njk` — About page (club intro, Code of Conduct link, contact
  buttons for WhatsApp/email).
- `src/conduct.njk` — Code of Conduct page.
- `src/newsletters.njk` — Newsletters page (see "Adding a newsletter" above).
- `src/frequent-flyers.md` — Frequent Flyers page (see above).
- `src/documents/` — PDFs served as-is at `/documents/`.
- `src/images/ecc-logo.svg` — club logo; also used as the site favicon.
- `src/css/style.css` — all styles (mobile-first, single breakpoint at 760px).

## Known follow-up

- `src/about.njk`'s "Join our WhatsApp group" button links to a placeholder
  URL (flagged with an HTML comment right above it) — swap in the real
  group invite link before this goes live.
