import React, { Component } from "react";
import { graphql } from "gatsby";

import MDXRenderer from "gatsby-mdx/mdx-renderer";
import { MDXProvider } from "@mdx-js/tag";

import { ThemeProvider } from "emotion-theming";
import { Container, theme, mdxProviderComponents } from "./components";

export default class MDXRuntimeTest extends Component {
  render() {
    const { children, data, tableOfContents } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <MDXProvider components={mdxProviderComponents}>
          <Container>
            {children}
            <MDXRenderer tableOfContents={tableOfContents}>
              {data.mdx.code.body}
            </MDXRenderer>
          </Container>
        </MDXProvider>
      </ThemeProvider>
    );
  }
}

export const pageQuery = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      id
      code {
        body
      }
      tableOfContents
    }
  }
`;
