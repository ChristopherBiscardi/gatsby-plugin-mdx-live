/* eslint-disable react/jsx-key */
import React, { Component } from "react";
import { graphql } from "gatsby";

import MDXRenderer from "gatsby-mdx/mdx-renderer";
import { MDXProvider } from "@mdx-js/tag";

import Highlight, { defaultProps } from "prism-react-renderer";
import { ThemeProvider } from "emotion-theming";
import { Container, components, Pre } from "./components";

const theme = {
  fonts: {
    mono: '"SF Mono", "Roboto Mono", Menlo, monospace'
  }
};

const CodeBlock = ({ children: exampleCode }) => (
  <Highlight {...defaultProps} code={exampleCode} language="jsx">
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <Pre className={className} style={style} p={3}>
        {tokens.map((line, i) => (
          <div {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </Pre>
    )}
  </Highlight>
);

export default class MDXRuntimeTest extends Component {
  render() {
    const { children, data, tableOfContents } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <MDXProvider
          components={{
            ...components,
            code: CodeBlock
          }}
        >
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
