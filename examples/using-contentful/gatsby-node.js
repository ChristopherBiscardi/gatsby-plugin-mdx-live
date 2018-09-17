const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const componentWithMDXScope = require('gatsby-mdx/component-with-mdx-scope')
const slugify = require('slugify')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allMdx(
              sort: { fields: [fields___date], order: DESC }
              limit: 1000
            ) {
              edges {
                node {
                  code {
                    scope
                  }
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors) // eslint-disable-line no-console
          reject(result.errors)
        }

        // Create blog posts pages.
        const posts = result.data.allMdx.edges

        _.each(posts, (post, index) => {
          const previous =
            index === posts.length - 1 ? null : posts[index + 1].node
          const next = index === 0 ? null : posts[index - 1].node

          createPage({
            path: post.node.fields.slug,
            component: componentWithMDXScope(
              blogPost,
              post.node.code.scope,
              __dirname
            ),
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = async ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    let slug, title, date
    if (node.fileAbsolutePath) {
      // from file node
      slug = createFilePath({ node, getNode })
      title = node.frontmatter.title
      date = node.frontmatter.date
    } else {
      // from contentful node
      const parent = getNode(node.parent)
      const contentfulNode = getNode(parent.parent)

      slug = `/contentful/${slugify(contentfulNode.title, { lower: true })}`
      title = contentfulNode.title
      date = contentfulNode.createdAt
    }

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })

    createNodeField({
      node,
      name: `title`,
      value: title,
    })

    createNodeField({
      node,
      name: `date`,
      value: date,
    })
  }
}
