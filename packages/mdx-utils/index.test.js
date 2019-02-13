import { preToCodeBlock } from ".";

const preProps = {
  children: {
    $$typeof: Symbol("react.element"),
    props: {
      name: "code",
      components: {},
      parentName: "pre",
      props: {
        className: "language-js"
      },
      children: "const some = {}\n"
    }
  }
};

const preProps2 = {
  children: {
    $$typeof: Symbol("react.element"),
    props: {
      name: "code",
      components: {},
      parentName: "pre",
      props: {
        className: "language-js",
        metastring: "react-live",
        "react-live": true
      },
      children: "<button onClick={alert('clicked')}>Click Me!</button>\n"
    }
  }
};

const preProps3 = {
  children: {
    $$typeof: Symbol("react.element"),
    props: {
      name: "code",
      components: {},
      parentName: "pre",
      props: {
        className: "language-java{3-6}",
      },
      children: "const some = {}\n"
    }
  }
};


describe("preToCodeBlock", () => {
  test("preToCodeBlock works", () => {
    expect(preToCodeBlock(preProps)).toEqual({
      codeString: "const some = {}",
      language: "js",
      highlight: null,
    });
  });

  test("preToCodeBlock passes metastring vars", () => {
    expect(preToCodeBlock(preProps2)).toEqual({
      codeString: "<button onClick={alert('clicked')}>Click Me!</button>",
      language: "js",
      highlight: null,
      metastring: "react-live",
      "react-live": true
    });
  });
  
  test("preToCodeBlock handles language and highlight string", () => {
    expect(preToCodeBlock(preProps2)).toEqual({
      codeString: "const some = {}",
      language: "java",
      highlight: "3-6",
    });
  });

  test("returns undefined if props dont match", () => {
    expect(preToCodeBlock({})).toBeUndefined();
  });
});
