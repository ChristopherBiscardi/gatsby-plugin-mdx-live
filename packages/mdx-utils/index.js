const extract = /language-(?<language>[a-zA-Z-]*)[{]?(?<highlight>[0-9-]*)?[}]?/;

exports.preToCodeBlock = preProps => {
  if (
    // children is MDXTag
    preProps.children &&
    // MDXTag props
    preProps.children.props &&
    // if MDXTag is going to render a <code>
    preProps.children.props.name === "code"
  ) {
    // we have a <pre><code> situation
    const {
      children,
      props: { className, ...props }
    } = preProps.children.props;
    
    const output = {
      codeString: children.trim(),
      language: null,
      highlight: null,
      ...props,
    };

    // matches "language-java" & "language-java{3-4}"
    const match = extract.exec(className);
    
    if (!match) {
      return output; 
    }
    
    const { language, highlight } = match.groups;
    
    output.language = language;
    output.highlight = highlight || null;
    
    return output;
  }
  
  return undefined;
};
