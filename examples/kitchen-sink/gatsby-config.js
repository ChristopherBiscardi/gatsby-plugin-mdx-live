const path = require("path");

module.exports = {
  siteMetadata: {
    title: `Gatsby MDX Kitchen Sink`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-mdx`,
      options: {
        extensions: [".mdx", ".md"],
        decks: [path.resolve("./decks")],
        defaultLayouts: {
          posts: require.resolve("./src/components/default-post-layout.js"),
          default: require.resolve("./src/components/default-page-layout.js"),
          slides: require.resolve("./src/components/default-slide-layout.js")
        }
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/content/`
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "slides",
        path: `${__dirname}/decks/`
      }
    },
    `gatsby-plugin-offline`
  ]
};
