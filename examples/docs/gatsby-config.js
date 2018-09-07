module.exports = {
  siteMetadata: {
    title: `gatsby-mdx docs`,
    description: `gatsby-mdx documentation`,
    docsLocation: `https://github.com/ChristopherBiscardi/gatsby-mdx/tree/master/examples/docs/content`
  },
  plugins: [
    `gatsby-plugin-emotion`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-offline`,
    `gatsby-mdx`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "docs",
        path: `${__dirname}/content/`
      }
    }
  ]
};
