import React, { Component } from 'react'
import { graphql } from 'gatsby'

import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import { MDXProvider } from '@mdx-js/react'

import '../prism.css'

export default class MDXRuntimeTest extends Component {
  render() {
    const { children, __mdxScope, data, ...props } = this.props
    return (
      <MDXProvider components={{}}>
        <div>
          <h1>Uses MDXRenderer</h1>
          <div>{children}</div>
          <MDXRenderer {...props} scope={__mdxScope}>
            {data.mdx.code.body}
          </MDXRenderer>
        </div>
      </MDXProvider>
    )
  }
}

export const pageQuery = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      id
      code {
        body
      }
    }
  }
`
