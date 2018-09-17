const defaultOptions = require("../utils/default-options");
const createMDXNode = require("../utils/create-mdx-node");

module.exports = async (
  { node, loadNodeContent, actions, createNodeId },
  pluginOptions
) => {
  const { createNode, createParentChildLink } = actions;
  const options = defaultOptions(pluginOptions);

  const isMarkdownMediaType =
    node.internal.mediaType === `text/markdown` ||
    node.internal.mediaType === `text/x-markdown`;

  if (
    !options.extensions.includes(node.ext) &&
    !(options.handleMarkdown && isMarkdownMediaType)
  ) {
    return;
  }

  const content = await loadNodeContent(node);

  const mdxNode = await createMDXNode({
    id: createNodeId(`${node.id} >>> Mdx`),
    node,
    content
  });

  createNode(mdxNode);
  createParentChildLink({ parent: node, child: mdxNode });
};
