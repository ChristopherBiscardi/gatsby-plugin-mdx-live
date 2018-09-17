const { isString, uniq, once } = require("lodash");
const debug = require("debug")("gatsby-mdx:utils/default-options");

const optDebug = once(options => {
  debug("options", options);
});

module.exports = pluginOptions => {
  const options = Object.assign(
    {
      defaultLayouts: {},
      extensions: [".mdx"],
      handleMarkdown: true,
      hastPlugins: [],
      mdPlugins: [],
      root: process.cwd(),
      gatsbyRemarkPlugins: []
    },
    pluginOptions
  );

  /**
   * When `handleMarkdown` is true, we will catch all nodes with the media type
   * of `text/markdown`, in addition to any files with extensions we support.
   * In order for the mdx-loader to properly load markdown files as well,
   * we need to add the markdown file extensions.
   */
  if (options.handleMarkdown) {
    options.extensions = uniq([...options.extensions, ".md", ".markdown"]);
  }

  // support single layout set in the `defaultLayouts` option
  if (options.defaultLayouts && isString(options.defaultLayouts)) {
    options.defaultLayouts = {
      default: options.defaultLayouts
    };
  }

  // backwards compatibility for `defaultLayout`
  if (options.defaultLayout && !options.defaultLayouts.default) {
    options.defaultLayouts.default = options.defaultLayout;
  }

  optDebug(options);
  return options;
};
