module.exports = {
  title: "Edmonton Cycle Club",
  tagline: "Friendly, sociable leisure cycling in Enfield & North London",
  buildDate: new Date(),
  showDrafts: process.env.SHOW_DRAFTS === "true",

  // Full site map lives here so the nav is data-driven. Add an `href` to
  // switch an item on once its page exists; items without `href` render
  // as inactive/greyed labels so the menu structure is visible now without
  // dangling links. See PLAN.md — diary + home is the current build; the
  // rest of this list is what the next pass fills in.
  nav: [
    { label: "Home", href: "/" },
    { label: "Diary", href: "/diary/" },
    { label: "Ride reports" },
    { label: "Guidance" },
    { label: "Activities" },
    { label: "Newsletters" },
    { label: "AGM Minutes" },
    { label: "Links" },
    { label: "Archive" },
    { label: "Contact us" },
  ],
};
