import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addWatchTarget("src/css/");

  eleventyConfig.addFilter("toLocaleString", (num) =>
    Number(num).toLocaleString("en-US")
  );

  eleventyConfig.addFilter("formatDays", (daysStr, locale) => {
    locale = locale || "en-US";
    const REFERENCE_MONDAY = new Date("2024-01-01T12:00:00Z");
    const fmt = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" });
    const parts = daysStr.split("-").map(Number);
    if (parts.length === 1) {
      const d = new Date(REFERENCE_MONDAY);
      d.setUTCDate(d.getUTCDate() + (parts[0] - 1));
      return fmt.format(d);
    }
    const startDate = new Date(REFERENCE_MONDAY);
    startDate.setUTCDate(startDate.getUTCDate() + (parts[0] - 1));
    const endDate = new Date(REFERENCE_MONDAY);
    endDate.setUTCDate(endDate.getUTCDate() + (parts[1] - 1));
    return fmt.format(startDate) + "\u2013" + fmt.format(endDate);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
    pathPrefix: "/library-choices/",
    htmlTemplateEngine: "njk",
  };
}
