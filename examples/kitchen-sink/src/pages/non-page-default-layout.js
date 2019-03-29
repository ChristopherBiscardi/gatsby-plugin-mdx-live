import React, { Fragment } from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-mdx";

export default function NonPageDefaultLayout({ data: { allMdx } }) {
  const node = allMdx.edges[0];

  return (
    <Fragment>
      <MDXRenderer>{node.code.body}</MDXRenderer>
    </Fragment>
  );
}

export const pageQuery = graphql`
  {
    allMdx(
      filter: {
        fileAbsolutePath: { regex: "/content/non-page-default-layout.mdx$/" }
      }
    ) {
      edges {
        node {
          id
          code {
            body
          }
        }
      }
    }
  }
`;
