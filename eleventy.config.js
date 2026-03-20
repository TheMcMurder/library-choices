import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addWatchTarget("src/css/");

  eleventyConfig.addFilter("toLocaleString", (num) =>
    Number(num).toLocaleString("en-US")
  );

  return {
    dir: {
      input: "src",
      output: "_site",
    },
    pathPrefix: "/library-choices/",
  };
}
