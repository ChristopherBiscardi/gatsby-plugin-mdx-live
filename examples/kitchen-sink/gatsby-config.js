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

        defaultLayouts: {
          posts: require.resolve("./src/components/default-post-layout.js"),
          default: require.resolve("./src/components/default-page-layout.js")
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
    "gatsby-transformer-remark",
    `gatsby-plugin-offline`
  ]
};
