import * as React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import Pre from "./pre";

/* eslint-disable react/jsx-key */
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

export default CodeBlock;
