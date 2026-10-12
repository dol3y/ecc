# Edmonton Cycle Club — site rebuild

Static site built with [Eleventy](https://www.11ty.dev/). This is a
proof-of-concept covering the **home page** and **diary**, structured so it
scales to the rest of the site (see `PLAN.md`).

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
- Months are sorted automatically by the `month` field — no need to keep
  them in file order.

## Structure

- `src/_data/site.js` — site title, tagline, and the nav menu (add an
  `href` to switch a nav item on once that page exists).
- `src/_includes/layouts/base.njk` — shared header/nav/footer.
- `src/_includes/partials/ride-card.njk` — the diary entry card macro.
- `src/diary/*.md` — one data file per month.
- `src/diary.njk` — renders all diary months.
- `src/index.njk` — home page.
- `src/css/style.css` — all styles (mobile-first, single breakpoint at 760px).
