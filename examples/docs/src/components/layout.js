import React from "react";
import styled from "react-emotion";
import { MDXProvider } from "@mdx-js/tag";
import ThemeProvider from "./themeProvider";
import mdxComponents from "./mdxComponents";
import Sidebar from "./sidebar";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Content = styled.main`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  margin: 3rem 0 0 0;
  margin-left: 20rem;
`;

const MaxWidth = styled.div`
  max-width: 100%;
  width: 50rem;
`;

const Layout = ({ children, location }) => (
  <ThemeProvider>
    <MDXProvider components={mdxComponents}>
      <Wrapper>
        <Sidebar location={location} />
        <Content>
          <MaxWidth>{children}</MaxWidth>
        </Content>
      </Wrapper>
    </MDXProvider>
  </ThemeProvider>
);

export default Layout;
