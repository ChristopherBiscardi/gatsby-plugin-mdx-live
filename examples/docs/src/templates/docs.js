import React, { Component } from "react";
import { graphql } from "gatsby";
import MDXRenderer from "gatsby-mdx/mdx-renderer";
import styled, { injectGlobal } from "react-emotion";
import { Edit3 } from "react-feather";
import { Layout, Link } from "$components";

injectGlobal`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      "Roboto",
      "Roboto Light",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      sans-serif,
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol";

    font-size: 16px;
  }

  a {
    transition: color 0.15s;
    color: #663399;
  }
`;

const Edit = styled.div`
  width: 100%;
  margin: 4rem 0 2rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #ddd;
  text-align: right;

  a {
    text-decoration: none;
    color: #555;

    &:hover {
      color: #663399;
    }
  }
`;

export default class MDXRuntimeTest extends Component {
  render() {
    const { data } = this.props;
    const {
      mdx,
      site: {
        siteMetadata: { docsLocation }
      }
    } = data;

    return (
      <Layout {...this.props}>
        <h1 css={{ fontSize: `2.5rem`, marginBottom: `2rem` }}>
          {mdx.frontmatter.title}
        </h1>
        <MDXRenderer>{mdx.code.body}</MDXRenderer>
        <Edit>
          <Link to={`${docsLocation}/${mdx.parent.relativePath}`}>
            <Edit3 size={16} /> edit this page on GitHub
          </Link>
        </Edit>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query($id: String!) {
    site {
      siteMetadata {
        docsLocation
      }
    }
    mdx(id: { eq: $id }) {
      id
      frontmatter {
        title
      }
      code {
        body
      }
      tableOfContents
      parent {
        ... on File {
          relativePath
        }
      }
    }
  }
`;
