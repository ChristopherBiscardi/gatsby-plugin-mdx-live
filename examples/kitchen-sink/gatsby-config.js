module.exports = {
  siteMetadata: {
    title: `Gatsby MDX Kitchen Sink`,
    siteUrl: "gatsby-mdx-kitchen-sink.netlify.com",
    description: "everything you can do with gatsby-mdx"
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-mdx`,
      options: {
        extensions: [".mdx", ".md"],
        globalScope: `import { SketchPicker } from 'react-color';
        export default { Picker: SketchPicker }`,
        defaultLayouts: {
          posts: require.resolve("./src/components/default-post-layout.js"),
          default: require.resolve("./src/components/default-page-layout.js"),
          ["non-page-default-layout"]: require.resolve(
            "./src/components/non-page-default-post-layout.js"
          )
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
        name: "non-page-default-layout",
        path: `${__dirname}/content/non-page-default-layout.mdx`
      }
    },
    "gatsby-transformer-remark",
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.edges.map(edge => {
                return {
                  ...edge.node.frontmatter,
                  description: edge.node.excerpt,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }]
                };
              });
            },
            query: `
      {
        allMdx(
          limit: 1000,
          sort: {
            order: DESC,
            fields: [frontmatter___title]
          }
        ) {
          edges {
            node {
              frontmatter {
                title
              }
              fields {slug}
              excerpt
              html
            }
          }
        }
      }
    `,
            output: `rss.xml`
          }
        ]
      }
    }
  ]
};
