import React from "react";
import { StaticQuery, graphql } from "gatsby";
import styled from "react-emotion";
import flatten from "lodash.flatten";
import { ExternalLink } from "react-feather";
import Link from "./link";

// prettier-ignore
const nav = [
  "/",
  "/docs",
  [
    "/docs/installation",
    "/docs/guides",
    [
      "/docs/guides/creating-interactive-code-blocks",
      "/docs/guides/mdx-file-extensions",
      "/docs/guides/programmatically-creating-pages",
      "/docs/guides/querying-mdx-content-via-graphql",
      "/docs/guides/using-design-system-components",
      "/docs/guides/using-mdx-layouts",
      "/docs/guides/writing-pages-in-mdx",
    ]
  ],
  "/docs/api-reference",
  "/docs/extensions",
  [
    "/docs/extensions/mdx-deck"
  ],
  "/help",
  "/repl"
];

const Logo = styled(props => (
  <h1 {...props}>
    <Link to="/">
      <span>Gatsby</span>
      <span>MDX</span>
    </Link>
  </h1>
))`
  padding: 0.75rem 0 0.75rem 2rem;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  border-bottom: 1px solid #ede7f3;

  a {
    text-decoration: none;
  }

  span:first-child {
    color: #663399;
    color: black;
    margin-right: 0.35rem;
  }

  span:last-child {
    color: #f9ac00;
  }
`;

const Sidebar = styled.aside`
  width: 20rem;
  background: #fbfafc;
  border-right: 1px solid #ede7f3;
  height: 100vh;
  overflow: auto;
  position: fixed;
`;

// eslint-disable-next-line no-unused-vars
const ListItem = styled(({ className, active, level, ...props }) => (
  <li className={className}>
    <Link {...props} />
  </li>
))`
  list-style: none;

  a {
    color: inherit;
    text-decoration: none;
    font-weight: 700;
    padding: 0.45rem 0 0.45rem ${props => 2 + (props.level || 0) * 1}rem;
    display: block;
    position: relative;

    &:hover {
      color: #663399;
    }

    ${props =>
      props.stub &&
      `
      color: #666;
      font-weight: 500;
    `} ${props =>
      props.active &&
      `
      color: #663399;

      &:before {
        content: "";
        display: block;
        height: .35rem;
        width: .35rem;
        border-radius: 50%;
        background: #663399;
        position: absolute;
        left: 1rem;
        top: 52%;
        transform: translateY(-50%);
      }
    `}

    // external link icon
    svg {
      float: right;
      margin-right: 1rem;
    }
  }
`;

const Divider = styled(props => (
  <li {...props}>
    <hr />
  </li>
))`
  list-style: none;
  padding: 0.5rem 0;

  hr {
    margin: 0;
    padding: 0;
    border: 0;
    border-bottom: 1px solid #ede7f3;
  }
`;

const SidebarLayout = ({ location }) => (
  <StaticQuery
    query={graphql`
      query {
        allMdx {
          edges {
            node {
              frontmatter {
                title
                stub
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `}
    render={({ allMdx }) => {
      const renderNavItem = (navItem, level = 0) => {
        if (Array.isArray(navItem)) {
          return navItem.map(navItem => renderNavItem(navItem, level + 1));
        }

        const { node } = allMdx.edges.find(
          ({ node }) => node.fields.slug === navItem
        );

        return (
          <ListItem
            to={`/${node.fields.slug}`}
            level={level}
            active={location.pathname === node.fields.slug}
            stub={node.frontmatter.stub}
          >
            {node.frontmatter.title}
          </ListItem>
        );
      };

      const navItems = flatten(nav.map(navItem => renderNavItem(navItem)));

      return (
        <Sidebar>
          <Logo />
          <ul>
            {navItems}
            <Divider />
            <ListItem to="https://mdxjs.com/">
              MDX Docs
              <ExternalLink size={14} />
            </ListItem>
            <ListItem to="https://next.gatsbyjs.org/docs">
              Gatsby Docs
              <ExternalLink size={14} />
            </ListItem>
          </ul>
        </Sidebar>
      );
    }}
  />
);

export default SidebarLayout;
