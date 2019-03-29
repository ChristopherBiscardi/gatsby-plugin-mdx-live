const _ = require("lodash");
const babel = require("@babel/core");
const grayMatter = require("gray-matter");
const mdx = require("@mdx-js/mdx");
const objRestSpread = require("@babel/plugin-proposal-object-rest-spread");

const slash = require("slash");
const unified = require("unified");
const squeeze = require("remark-squeeze-paragraphs");
const toMDAST = require("remark-parse");
const {
  isImport,
  isExport,
  isExportDefault,
  BLOCKS_REGEX,
  EMPTY_NEWLINE
} = require("@mdx-js/mdx/util");

const debug = require("debug")("gatsby-mdx:gen-mdx");

const getSourcePluginsAsRemarkPlugins = require("./get-source-plugins-as-remark-plugins");
const htmlAttrToJSXAttr = require("./babel-plugin-html-attr-to-jsx-attr");
const BabelPluginPluckImports = require("./babel-plugin-pluck-imports");

const DEFAULT_OPTIONS = {
  footnotes: true,
  remarkPlugins: [],
  rehypePlugins: [],
  compilers: [],
  blocks: [BLOCKS_REGEX]
};

/**
 * TODO: Find a way to PR all of this code that was lifted
 * from @mdx-js/mdx back into mdx with the modifications. We
 * don't want to maintain subtly different parsing code if we
 * can avoid it.
 */
const hasDefaultExport = (str, options) => {
  let hasDefaultExportBool = false;

  function getDefaultExportBlock(subvalue) {
    const isDefault = isExportDefault(subvalue);
    hasDefaultExportBool = hasDefaultExportBool || isDefault;
    return isDefault;
  }
  const tokenizeEsSyntax = (eat, value) => {
    const index = value.indexOf(EMPTY_NEWLINE);
    const subvalue = value.slice(0, index);

    if (isExport(subvalue) || isImport(subvalue)) {
      return eat(subvalue)({
        type: isExport(subvalue) ? "export" : "import",
        default: getDefaultExportBlock(subvalue),
        value: subvalue
      });
    }
  };

  tokenizeEsSyntax.locator = value => {
    return isExport(value) || isImport(value) ? -1 : 1;
  };

  function esSyntax() {
    var Parser = this.Parser;
    var tokenizers = Parser.prototype.blockTokenizers;
    var methods = Parser.prototype.blockMethods;

    tokenizers.esSyntax = tokenizeEsSyntax;

    methods.splice(methods.indexOf("paragraph"), 0, "esSyntax");
  }

  const { content } = grayMatter(str);
  unified()
    .use(toMDAST, options)
    .use(esSyntax)
    .use(squeeze, options)
    .parse(content)
    .toString();

  return hasDefaultExportBool;
};

/*
 * function mutateNode({
 *   pluginOptions,
 *   mdxNode,
 *   getNode,
 *   files,
 *   reporter,
 *   cache
 * }) {
 *   return Promise.each(pluginOptions.gatsbyRemarkPlugins, plugin => {
 *     const requiredPlugin = require(plugin.resolve);
 *     if (_.isFunction(requiredPlugin.mutateSource)) {
 *       return requiredPlugin.mutateSource(
 *         {
 *           mdxNode,
 *           files: fileNodes,
 *           getNode,
 *           reporter,
 *           cache
 *         },
 *         plugin.pluginOptions
 *       );
 *     } else {
 *       return Promise.resolve();
 *     }
 *   });
 * }
 *  */

module.exports = async function genMDX({
  isLoader,
  node,
  options,
  getNode,
  getNodes,
  reporter,
  cache,
  pathPrefix
}) {
  const pathPrefixCacheStr = pathPrefix || ``;
  const payloadCacheKey = node =>
    `gatsby-mdx-entire-payload-${
      node.internal.contentDigest
    }-${pathPrefixCacheStr}`;

  const cachedPayload = await cache.get(payloadCacheKey(node));
  if (cachedPayload) {
    return cachedPayload;
  }

  let results = {
    mdast: undefined,
    hast: undefined,
    html: undefined,
    scopeImports: [],
    scopeIdentifiers: [],
    body: undefined
  };

  // TODO: a remark and a hast plugin that pull out the ast and store it in results
  /* const cacheMdast = () => ast => {
   *   results.mdast = ast;
   *   return ast;
   * };

   * const cacheHast = () => ast => {
   *   results.hast = ast;
   *   return ast;
   * }; */

  // pull classic style frontmatter off the raw MDX body
  debug("processing classic frontmatter");
  const { data, content: frontMatterCodeResult } = grayMatter(node.rawBody);
  const content = `${frontMatterCodeResult}

export const _frontmatter = ${JSON.stringify(data)}`;

  // get mdast by itself
  // in the future it'd be nice to not do this twice
  debug("generating AST");
  const compiler = mdx.createMdxAstCompiler(options);
  results.mdast = compiler.parse(content);

  /* await mutateNode({
   *   pluginOptions,
   *   mdxNode,
   *   files: getNodes().filter(n => n.internal.type === `File`),
   *   getNode,
   *   reporter,
   *   cache
   * }); */

  const gatsbyRemarkPluginsAsremarkPlugins = await getSourcePluginsAsRemarkPlugins(
    {
      gatsbyRemarkPlugins: options.gatsbyRemarkPlugins,
      mdxNode: node,
      //          files,
      getNode,
      getNodes,
      reporter,
      cache,
      pathPrefix
    }
  );

  const parent = node.parent && getNode(node.parent);
  const source =
    parent && parent.internal.type === `File` && parent.sourceInstanceName;

  // get the default layout for the file source group, or if it doesn't
  // exist, the overall default layout
  const defaultLayout = _.get(
    options.defaultLayouts,
    source,
    _.get(options.defaultLayouts, "default")
  );

  let code = content;
  // after running mdx, the code *always* has a default export, so this
  // check needs to happen first.
  if (!hasDefaultExport(content, DEFAULT_OPTIONS) && !!defaultLayout) {
    debug("inserting default layout", defaultLayout);
    const { content: contentWithoutFrontmatter, matter } = grayMatter(content);

    code = `${matter ? matter : ""}

import DefaultLayout from "${slash(defaultLayout)}"

export default DefaultLayout

${contentWithoutFrontmatter}`;
  }

  debug("running mdx");
  code = await mdx(code, {
    ...options,
    remarkPlugins: options.remarkPlugins.concat(
      gatsbyRemarkPluginsAsremarkPlugins
    )
  });

  results.rawMDXOutput = `/* @jsx mdx */
import mdx from '@mdx-js/react/create-element';
${code}`;

  if (!isLoader) {
    debug("compiling scope");
    const instance = new BabelPluginPluckImports();
    const result = babel.transform(code, {
      configFile: false,
      plugins: [instance.plugin, objRestSpread, htmlAttrToJSXAttr],
      presets: [
        require("@babel/preset-react"),
        [
          require("@babel/preset-env"),
          {
            useBuiltIns: "entry",
            modules: "false"
          }
        ]
      ]
    });

    const identifiers = Array.from(instance.state.identifiers);
    const imports = Array.from(instance.state.imports);
    if (!identifiers.includes("React")) {
      identifiers.push("React");
      imports.push("import React from 'react'");
    }

    results.scopeImports = imports;
    results.scopeIdentifiers = identifiers;
    // TODO: be more sophisticated about these replacements
    results.body = result.code
      .replace(
        /export\s*default\s*function\s*MDXContent\s*/,
        "return function MDXContent"
      )
      .replace(
        /export\s*{\s*MDXContent\s+as\s+default\s*};?/,
        "return MDXContent;"
      )
      .replace(/\nexport /g, "\n");
  }
  /* results.html = renderToStaticMarkup(
   *   React.createElement(MDXRenderer, null, results.body)
   * ); */
  cache.set(payloadCacheKey(node), results);
  return results;
};
