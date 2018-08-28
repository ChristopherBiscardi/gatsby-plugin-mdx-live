/* eslint-disable react/display-name */

import * as React from "react";
import system from "system-components/emotion";

export const Pre = system(
  {
    is: "pre",
    fontSize: 1,
    fontFamily: "mono",
    m: 0
  },
  {
    overflow: "auto"
  },
  "fontFamily",
  "space",
  "color"
);

export const Code = system(
  {
    is: "code",
    fontSize: 1,
    fontFamily: "mono"
  },
  "fontFamily",
  "space",
  "color"
);

export const Heading = system(
  {
    is: "h2",
    fontSize: 5,
    fontWeight: "bold",
    lineHeight: 1.25,
    mt: 4,
    mb: 3
  },
  "fontFamily",
  "color",
  "textAlign"
);

Heading.displayName = "Heading";

export const Container = system(
  {
    is: "div",
    px: 3,
    mx: "auto",
    maxWidth: 1024
  },
  "maxWidth"
);

export const Text = system(
  {
    m: 0
  },
  "space",
  "color",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "textAlign",
  "lineHeight"
);

export const components = {
  h1: props => <Heading {...props} is="h1" fontSize={[5, 6]} />,
  h2: props => <Heading {...props} is="h2" fontSize={[4, 5]} />,
  h3: props => <Heading {...props} is="h3" fontSize={3} />,
  h4: props => <Heading {...props} is="h4" fontSize={2} />,
  h5: props => <Heading {...props} is="h5" fontSize={1} />,
  h6: props => <Heading {...props} is="h6" fontSize={0} />,
  p: props => <Text {...props} is="p" lineHeight={1.625} mt={3} mb={4} />,
  pre: Pre,
  code: Code,
  inlineCode: props => <Code {...props} bg="lightgray" p={1} />
  // TODO add `a`
  // TODO add `img`
  // TODO add `blockquote`
  // TODO add `ul`
  // TODO add `li`
  // TODO add `table`
};
