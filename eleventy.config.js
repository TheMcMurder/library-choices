import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addWatchTarget("src/css/");

  return {
    dir: {
      input: "src",
      output: "_site",
    },
    pathPrefix: "/library-choices/",
  };
}
