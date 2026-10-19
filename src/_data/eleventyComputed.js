module.exports = {
  // Ride report permalinks are built from the `date` front-matter field
  // (not the filename) so they stay collision-proof even if two reports
  // ever share a title, and even if someone writes a report file without
  // a date-prefixed filename. Computed here (plain JS Date formatting)
  // rather than templated in ride-reports.json because plain .md files
  // without a templateEngineOverride resolve `permalink` with Liquid, and
  // Liquid can't call our Nunjucks `formatDate` filter.
  permalink: (data) => {
    const tags = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [];
    if (!tags.includes("rideReport") || !data.date) return data.permalink;
    const iso = data.date.toISOString().slice(0, 10);
    return `/ride-reports/${iso}-${data.page.fileSlug}/`;
  },

  // Nav's "Ride Reports" link always points at whichever report is
  // currently newest, so it never needs updating by hand.
  latestRideReportUrl: (data) => {
    const reports = data.collections && data.collections.rideReport;
    return reports && reports.length ? reports[reports.length - 1].url : null;
  },

  // Auto-generates a themed meta description for ride report pages that
  // don't set their own `description` — there are too many of these to
  // hand-write a unique one for each.
  description: (data) => {
    if (data.description) return data.description;
    const tags = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [];
    if (tags.includes("rideReport")) {
      return `Ride report: ${data.title} — Edmonton Cycle Club's social, non-competitive leisure cycling around Enfield, Barnet and North London.`;
    }
    return data.description;
  },
};
