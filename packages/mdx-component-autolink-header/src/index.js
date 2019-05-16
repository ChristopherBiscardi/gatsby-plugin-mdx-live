import React, { useEffect, useMemo } from "react";
import GHSlugger from "github-slugger";

const slugger = new GHSlugger();

const SluggerReseter = ({ children }) => {
  useEffect(() => {
    slugger.reset();
  }, []);

  return children;
};

const AutoLinkHeader = ({ as: Component = "h2", id, ...props }) => {
  const autoId = useMemo(() => slugger.slug(id || props.children), [
    id,
    props.children
  ]);

  return <Component id={autoId} {...props} />;
};

export { SluggerReseter, AutoLinkHeader };
export default AutoLinkHeader;
