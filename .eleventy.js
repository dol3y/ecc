const { DateTime } = require("luxon");

// Build-time cutoff for the diary's upcoming/past split — fixed once per
// build, so a ride crosses over the next time the site rebuilds (push to
// main, or a scheduled rebuild), not live in the browser.
const todayISO = DateTime.now().toISODate();

const rideDateISO = (date) =>
  (date instanceof Date ? DateTime.fromJSDate(date, { zone: "utc" }) : DateTime.fromISO(date, { zone: "utc" })).toISODate();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  // PDFs (newsletters, AGM minutes, etc.) — drop a new file in here and
  // it's served as-is at /documents/<filename>.
  eleventyConfig.addPassthroughCopy({ "src/documents": "documents" });
  // robots.txt is plain static text (no templating available to it), so
  // its Sitemap: line has the baseUrl hardcoded — keep in sync with
  // site.js's `baseUrl` if that ever changes (e.g. DNS cutover).
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // Diary months are plain data files tagged "diaryMonth"; collecting them
  // this way means a new month is just a new file, no template changes.
  // Sorted newest/upcoming month first, then progressively older.
  eleventyConfig.addCollection("diaryMonth", (collectionApi) =>
    collectionApi.getFilteredByTag("diaryMonth").sort((a, b) => b.data.month.localeCompare(a.data.month))
  );

  eleventyConfig.addFilter("formatDate", (date, format = "cccc d LLLL yyyy") => {
    if (!date) return "";
    const dt = date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date, { zone: "utc" });
    return dt.toFormat(format);
  });

  eleventyConfig.addFilter("published", (rides) => (rides || []).filter((r) => !r.draft));
  eleventyConfig.addFilter("draftsOnly", (rides) => (rides || []).filter((r) => r.draft));

  // Flattens the diaryMonth collection's per-month ride lists into one
  // array, so upcoming rides can be sorted chronologically across months.
  eleventyConfig.addFilter("flattenRides", (months) => (months || []).flatMap((m) => m.data.rides || []));

  eleventyConfig.addFilter("upcoming", (rides) => (rides || []).filter((r) => rideDateISO(r.date) >= todayISO));
  eleventyConfig.addFilter("past", (rides) => (rides || []).filter((r) => rideDateISO(r.date) < todayISO));
  eleventyConfig.addFilter("sortByDate", (rides) =>
    [...(rides || [])].sort((a, b) => rideDateISO(a.date).localeCompare(rideDateISO(b.date)))
  );

  eleventyConfig.addFilter("formatMonth", (isoMonth) => {
    return DateTime.fromISO(isoMonth, { zone: "utc" }).toFormat("LLLL yyyy");
  });

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
