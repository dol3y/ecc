# Edmonton Cycle Club website rebuild — working plan

## Goal
Replace the live site at https://www.edmontoncycleclub.org with a new static
site. `index.html`/homepage content may change, but the main ongoing
maintenance burden is `diary.html`, which gets updated ~monthly with that
month's rides/events. We want an authoring workflow that's easy to repeat
every month.

Note: despite the domain name, this is a real UK cycling club (London area —
Winchmore Hill, Enfield, Trent Park, etc.), not Edmonton, Alberta/Canada.
Real content: named ride leaders, ~30 years of club history, a WhatsApp
group, AGM minutes, newsletters. Treat content changes carefully — this is
someone's live, actively-used club site.

## Decisions made so far
- **Static site generator: Eleventy (11ty)**, chosen over Jekyll/Hugo/Astro.
  Reasoning: plain Node toolchain (no Ruby like Jekyll), simple templating,
  outputs plain HTML, no framework lock-in. Jekyll would deploy natively on
  GitHub Pages with zero CI config, but needs Ruby/bundler maintained
  locally — judged not worth it for a small club site.
- **Authoring format: Markdown/data files + SSG**, not hand-edited raw HTML.
  User explicitly chose this over "plain HTML, no build step."
- **Hosting: GitHub Pages**, deployed via a GitHub Actions workflow that
  builds the Eleventy site and publishes it (since Eleventy isn't natively
  built by GitHub Pages the way Jekyll is). Current site is presumably on
  some other host today (confirmed: current site is plain hand-written
  HTML, not a CMS) — actual DNS cutover to GitHub Pages was NOT yet
  discussed/confirmed with the user.

## What we learned from the live site (fetched and saved to
`research/live-site/`)

Files saved (raw, as fetched from the live site):
- `index.html` — homepage stub
- `diary.html` — the diary/rides page
- `home.html` — the *actual* homepage content
- `conduct.html` — Code of Conduct page
- `ecc.css` — site stylesheet
- `peterLib.js` — helper JS (defines `textDate()` used in footer "last
  revised" stamp, etc.)
- `ecc_menu.js` — defines `eccHeader()` and `eccMenu()`, which
  `document.write()` the banner and dropdown nav on every page

### `index.html` behavior
Not real content — it's a JS redirect stub:
- Checks a hardcoded "kill date" (`new Date(2027,0,1)`, i.e. 1 Jan 2027).
- If past kill date: shows "This site is no longer maintained."
- Otherwise: `window.open("./home.html","_self","","")` — i.e. immediately
  redirects to `home.html`, which is the real homepage.
- `<noscript>` fallback tells users to enable JS.

This redirect-stub/kill-date pattern is legacy cruft; a rebuilt site should
just serve the homepage directly at `/` and drop the kill-date gimmick
(open question: confirm with user before removing).

### `diary.html` structure
- Uses `eccHeader()` + `eccMenu('Diary','')` for shared nav (loaded via
  `peterLib.js` + `ecc_menu.js`, both `document.write`-based — old-school
  but functional).
- A `headlinebox` div with the standing disclaimer/rules list (rides may
  change at short notice, code of conduct link, under-18 policy, Cycling UK
  guidance link). This is boilerplate that repeats at the top of the diary
  every year, not per-entry content.
- Content is organized as `<h2>Month Year</h2><hr/>` headers, followed by
  a sequence of `<table>` blocks, one per event, separated by `<hr/>`.
- Each event table has rows for (all optional except Date/Information):
  - `Date:` — free text, inconsistently formatted (e.g. "Sunday 13th
    September 2026", "15-Feb-2026", "Sunday 17th May-2026" — typos/
    inconsistency in the real data, not a format spec to replicate exactly)
  - `Time:` — e.g. "9:30", "20:00", sometimes with timezone note like
    "9:30 BST"
  - `Place:` — an `<a>` link to streetmap.co.uk (or occasionally another
    site) with the venue name, plus a separate what3words (`W3W`) link
  - `Information:` — free-text ride description (distance, difficulty,
    route notes, links to destinations)
  - `Leader:` — ride leader's first name (omitted for meetings/non-rides)
- **Cancelled/postponed rides are NOT deleted** — the whole `<tr>` gets
  `style="text-decoration: line-through"` and a final unstriped `<tr>` row
  is added explaining the change (e.g. "Postponed to next Sunday due to
  forecast rain"). This history is kept visible.
- **Future months are pre-drafted and wrapped in `<!-- ... -->` HTML
  comments**, then uncommented as the club firms up plans (verified in the
  raw file: comment block from source line 68 to line 536 covering
  Jan–Aug 2026 planning-stage content; then a second, smaller commented
  block for early Sept meetings that get uncommented closer to the date).
  This is effectively a manual "draft" mechanism.
- There's also a known content bug in the live page worth noting (not
  fixing on the live site, just don't replicate it): a stray unclosed
  `<a>` tag in the 20th September entry
  (`London Festival of Cycling<a>` instead of `</a>`).
- Footer writes a "Last revised: <date>" line using
  `document.lastModified` via `peterLib.js`'s `textDate()` — this only
  reflects file mtime, which won't mean much once served via a build
  pipeline/CI; will need a different approach (e.g. inject build date at
  build time) if we want to keep this feature.

### Full site map (from `ecc_menu.js`)
The real site is bigger than just index+diary. Menu structure:
- Home → `home.html`
- Diary → `diary.html`
- Ride reports → (cascade) `rides_2026.html`, `rides_2025.html`,
  `rides_2024.html`, `rides_2023.html`, `rides_2022.html`, `rides_2021.html`
- Guidance → (cascade) `conduct.html` (Code of Conduct), `leader.html`
  (Ride Leaders' Guide)
- Activities → (cascade) `day_rides.html`, `weekends.html`, `social.html`,
  `faq.html`, `history.html`, `tools.html`
- Newsletters → (cascade, PDFs) `./documents/newsletter202510.pdf`,
  `newsletter202503.pdf`, `newsletter202411.pdf`, `newsletter202407.pdf`
- AGM Minutes → (cascade, PDFs) `./documents/AGM2025.pdf`, `AGM2024.pdf`,
  `AGM2023.pdf`
- Links → (cascade) `local_links.html`, `web_links.html`
- Archive pages → `archive.html`
- Contact us → `contact.html`

None of these other pages have been fetched yet except `home.html` and
`conduct.html` (saved for reference/style purposes). The user has not yet
confirmed whether this rebuild should cover the whole site or just
diary+home for now.

## Decisions made 2026-09-25

1. **Scope:** proof-of-concept first (diary + home only), but explicitly
   architected so it scales up to the whole site later without rework —
   nav is data-driven (`src/_data/site.js`) so turning on new pages is
   just adding an `href`; diary months are one data file each so the
   pattern extends without template changes.
2. **Cancelled/postponed/draft handling:** structured fields, as
   recommended — each ride entry gets `status: confirmed | cancelled |
   postponed` (template auto-applies strikethrough + badge) and
   `draft: true/false` (draft entries build but are hidden unless built
   with `SHOW_DRAFTS=true`, replacing the old HTML-comment staging).
3. **Rest of the site:** deferred. Only home + diary built now.
4. **Also specified:** must work well on both desktop browser and mobile
   (mobile-first responsive CSS, single breakpoint at 760px); visual
   design should be a genuine refresh, not a copy of the current dated
   look (new palette, card-based diary entries instead of HTML tables,
   no-JS `<details>`-based mobile nav instead of the old `document.write`
   menu).

## Status: proof-of-concept built

Eleventy project scaffolded at the repo root (not yet a git repo — not
initialized, not deployed, not connected to GitHub Pages). Structure and
authoring workflow documented in `README.md`.

- `src/index.njk` — home page, content adapted from `home.html`.
- `src/diary.njk` + `src/diary/2026-01.md`, `src/diary/2026-09.md` —
  diary page and two sample months of real content from the live site
  (Jan demonstrates cancelled/postponed status; Sept demonstrates normal
  entries plus draft:true entries carried over from the site's commented-
  out staging block).
- `src/_includes/layouts/base.njk`, `partials/nav.njk`,
  `partials/ride-card.njk` — shared layout, nav, and the diary entry card
  macro.
- `src/css/style.css` — mobile-first design (card-based diary layout,
  `<details>`-based nav needing no JS).
- Verified: `npm run build` and `npm run build:drafts` both produce
  correct output (checked generated HTML directly — draft entries
  correctly excluded/included, cancelled/postponed styling and badges
  render as expected).

## Decisions made 2026-09-26 (visual review in browser)
User ran `npm start` and reviewed the site live in a browser for the first
time. Feedback:
1. **Colour scheme: use the original site's palette**, not a new one.
   Reverted the earlier "genuine refresh" palette — `src/css/style.css`
   custom properties `--green-700/600/100` now hold the *original* site's
   three blues (kept the old variable names to minimize churn, but they're
   blues now, not greens): `#17375D` (old menu bar, dark navy — used for
   header/nav bg initially, see correction below), `#538ED5` (old
   `div.header` title-block blue), `#C5D9F1` (old menu hover highlight).
   Footer background restored to the original's `#cccccc` (`--footer-bg`).
2. **Logo added**: `ecc-logo-final.svg` (found at repo root, provided by
   user) copied to `src/images/`, passthrough-copied by Eleventy, and
   placed in the header banner (`base.njk`), right-aligned via
   `margin-left: auto`, clipped to a circle in CSS (the source SVG has
   transparent square corners around a circular badge). Placeholder 🚴
   emoji removed now that the real logo is there.
3. **Correction after first pass**: initially set the banner
   (`.site-header` background) to the dark navy `--green-700`, i.e. the
   original *menu bar's* colour. User pointed out this was wrong — the
   banner in the original site used the lighter/mid blue `#538ED5` from
   `div.header`, not the menu's navy. Fixed: `.site-header` background is
   now `var(--green-600)` (`#538ED5`). Dark navy (`--green-700`) is still
   used elsewhere (links, skip-link, nav hover text on the light-blue
   highlight) — only the banner background itself was wrong.
   **Note for next session:** since header+nav are combined into one bar
   in this rebuild (unlike the original's separate title-block/menu bars),
   double check the *current* rendered banner colour against
   `research/live-site/ecc.css` before making further palette tweaks —
   don't assume the mapping above still matches without looking, in case
   it's adjusted again.
4. Not yet done: no automated visual regression check exists for this
   (checked by human eyeballing the dev server only) — if colours are
   touched again, re-verify visually, don't just trust the CSS variable
   names.

## Status update 2026-10-12

- Git repo was initialized and the proof-of-concept committed (see git log
  — "Initial commit"). The "no git repo" risk noted previously is
  resolved.
- Repo now has a real GitHub remote (`git@github.com:dol3y/ecc.git`) and
  has been pushed — `main` locally matches `origin/main`.
- **GitHub Actions deploy workflow added**: `.github/workflows/deploy.yml`.
  Builds with Eleventy (`npm ci` + `npm run build`) on Node 20, then
  deploys `_site/` to GitHub Pages using the native
  `actions/upload-pages-artifact` + `actions/deploy-pages` flow (no
  `gh-pages` branch needed). Triggers on push to `main` plus manual
  `workflow_dispatch`.
  - **Found and fixed a bug**: the workflow was still triggering on push
    to `master`, a leftover from before the repo's branch was renamed to
    `main` — so despite being pushed to GitHub, the workflow had never
    once run. Fixed to trigger on `main`.
  - **Found and fixed the subpath issue flagged in the previous update**:
    `dol3y/ecc` is a project repo (not `dol3y.github.io`), so Pages serves
    by default from `https://dol3y.github.io/ecc/`, a subpath — root-
    relative asset paths would have 404'd. User chose (over custom-domain-
    now or leave-for-later) to add a `pathPrefix` for now. Implemented as:
    `.eleventy.js` reads `pathPrefix` from `process.env.PATH_PREFIX`
    (defaults to `/` for local dev/build, unaffected); the CI workflow
    sets `PATH_PREFIX: /ecc/` on the build step; every internal
    href/src in `base.njk`, `nav.njk`, `index.njk`, `diary.njk` now goes
    through Eleventy's `url` filter so the prefix actually applies.
    Verified both a plain local build and a `PATH_PREFIX=/ecc/` build
    produce correct output (checked generated HTML directly). This is a
    stopgap — if/when DNS cutover to a custom domain happens, drop the
    `PATH_PREFIX` env var from the workflow (and optionally the
    `pathPrefix` plumbing in `.eleventy.js`) since root-relative paths are
    then correct without a prefix.
  - **Confirmed working 2026-10-12**: user set Pages source to "GitHub
    Actions" in repo settings and confirmed the deployed site at
    `https://dol3y.github.io/ecc/` displays correctly (styles/logo load,
    pathPrefix stopgap is doing its job). End-to-end deploy pipeline is
    now verified on real infrastructure, not just locally.

## Outstanding / not yet done
- Rest of the site's pages (ride reports, guidance, activities,
  newsletters/AGM PDFs, links, archive, contact) — deferred, home+diary
  only so far.
- DNS cutover to GitHub Pages — not discussed/confirmed, do not do this
  without explicit user sign-off. If/when it happens, remove the
  `PATH_PREFIX` stopgap described above (see deploy.yml + .eleventy.js).

## Next step when resuming
Deploy pipeline is live and verified — no infra work left. Next up is
deferred content: build out the rest of the site's pages (ride reports,
guidance, activities, newsletters/AGM PDFs, links, archive, contact),
following the same pattern as home+diary. DNS cutover stays a separate,
later, explicit-sign-off step.
