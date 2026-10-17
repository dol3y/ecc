module.exports = {
  title: "Edmonton Cycle Club",
  tagline: "Friendly, sociable leisure cycling in Enfield & North London",
  buildDate: new Date(),
  showDrafts: process.env.SHOW_DRAFTS === "true",

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
