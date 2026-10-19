module.exports = {
  title: "Edmonton Cycle Club",
  tagline: "Friendly, sociable leisure cycling in Enfield & North London",
  buildDate: new Date(),
  showDrafts: process.env.SHOW_DRAFTS === "true",

  // Origin used to build absolute URLs (canonical links, Open Graph tags,
  // JSON-LD, sitemap.xml). Combine with the `url` filter, which already
  // applies pathPrefix: `{{ site.baseUrl }}{{ page.url | url }}`.
  // Stopgap pointing at the GitHub Pages project-page URL — if/when DNS
  // cuts over to a custom domain, update this (and the Sitemap: line in
  // src/robots.txt, which is a static file and can't use this value).
  baseUrl: "https://dol3y.github.io",

  // Standardised site nav — shown as pills in the header banner on desktop,
  // and inside the hamburger dropdown on mobile (same list, both places).
  // Add an `href` to switch an item on once its page exists; items without
  // `href` render as inactive/greyed labels.
  nav: [
    { label: "Diary", href: "/diary/" },
    { label: "Newsletters", href: "/newsletters/" },
    { label: "AGM" },
    { label: "Frequent Flyers", href: "/frequent-flyers/" },
    { label: "About", href: "/about/" },
  ],
};
