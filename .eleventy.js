const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

  // Diary months are plain data files tagged "diaryMonth"; collecting them
  // this way means a new month is just a new file, no template changes.
  eleventyConfig.addCollection("diaryMonth", (collectionApi) =>
    collectionApi.getFilteredByTag("diaryMonth").sort((a, b) => a.data.month.localeCompare(b.data.month))
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
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
