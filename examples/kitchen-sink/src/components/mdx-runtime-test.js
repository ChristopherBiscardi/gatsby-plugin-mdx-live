import React, { Component } from "react";
import { graphql } from "gatsby";

import MDXRenderer from "gatsby-mdx/mdx-renderer";
import { MDXProvider } from "@mdx-js/react";

export default class MDXRuntimeTest extends Component {
  render() {
    const { children, data, ...props } = this.props;

    return (
      <MDXProvider
        components={{
          h1: ({ children, ...props }) => (
            <h1 {...props}>Provided: {children}</h1>
          ),
          wrapper: "article"
        }}
      >
        <div>
          <h1>Uses MDXRenderer</h1>
          <div>{children}</div>
          <MDXRenderer {...props}>{data.mdx.code.body}</MDXRenderer>
        </div>
      </MDXProvider>
    );
  }
}

export const pageQuery = graphql`
  query MDXRuntimeQuery($id: String!) {
    mdx(id: { eq: $id }) {
      id
      code {
        body
      }
    }
  }
`;
