const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  // PDFs (newsletters, AGM minutes, etc.) — drop a new file in here and
  // it's served as-is at /documents/<filename>.
  eleventyConfig.addPassthroughCopy({ "src/documents": "documents" });

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
