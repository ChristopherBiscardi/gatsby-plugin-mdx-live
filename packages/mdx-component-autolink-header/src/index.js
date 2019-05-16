import React, { useEffect, useMemo } from "./node_modules/react";
import GHSlugger from "../node_modules/github-slugger";

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
