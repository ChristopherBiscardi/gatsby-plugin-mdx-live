import React from "./node_modules/react";
import renderer from "./node_modules/react-test-renderer";

import C, { SluggerReseter } from ".";

describe("mdx-component-autolink-header", () => {
  it("renders with a slug", () => {
    Array(6)
      .fill(undefined)
      .map((_, index) => {
        const i = index + 1;
        const result = renderer.create(<C as={`h${i}`}>Test Header</C>);

        expect(result.toJSON()).toEqual({
          type: `h${i}`,
          props: { id: index ? `test-header-${index}` : "test-header" },
          children: ["Test Header"]
        });
      });
  });

  it("defaults to h2", () => {
    const result = renderer.create(<C>Test Header</C>);
    expect(result.toJSON()).toEqual({
      type: `h2`,
      props: { id: "test-header-6" },
      children: ["Test Header"]
    });
  });

  it("dont generate new ids when renders", () => {
    // reset slug before test
    let result = renderer.create(<SluggerReseter>RETURN</SluggerReseter>);
    expect(result.toJSON()).toEqual("RETURN");

    result = renderer.create(
      // reset slug after test
      <SluggerReseter>
        <C>Test Header</C>
        <C>Test Header</C>
        <C>Test Header</C>
      </SluggerReseter>
    );

    expect(result.toJSON()).toEqual([
      { type: "h2", props: { id: "test-header" }, children: ["Test Header"] },
      { type: "h2", props: { id: "test-header-1" }, children: ["Test Header"] },
      { type: "h2", props: { id: "test-header-2" }, children: ["Test Header"] }
    ]);
  });

  it("work fine with provided ids", () => {
    const result = renderer.create(
      <SluggerReseter>
        <C>Test Header</C>
        <C id="test-header">Test Header</C>
        <C id="custom-header">Test Header</C>
      </SluggerReseter>
    );

    expect(result.toJSON()).toEqual([
      { type: "h2", props: { id: "test-header" }, children: ["Test Header"] },
      { type: "h2", props: { id: "test-header-1" }, children: ["Test Header"] },
      { type: "h2", props: { id: "custom-header" }, children: ["Test Header"] }
    ]);
  });
});
