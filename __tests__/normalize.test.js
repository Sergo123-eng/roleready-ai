const { normalize } = require("../app.logic");

describe("normalize", () => {
  it("converts text to lowercase", () => {
    expect(normalize("Hello World")).toBe("hello world");
  });

  it("preserves numbers", () => {
    expect(normalize("Test123")).toBe("test123");
  });

  it("preserves plus sign", () => {
    expect(normalize("C++")).toBe("c++");
  });

  it("preserves hash sign", () => {
    expect(normalize("C#")).toBe("c#");
  });

  it("preserves dots", () => {
    expect(normalize("Node.js")).toBe("node.js");
  });

  it("preserves hyphens", () => {
    expect(normalize("a/b testing")).toBe("a b testing");
    expect(normalize("front-end")).toBe("front-end");
  });

  it("replaces special characters with spaces", () => {
    expect(normalize("Python, SQL & React")).toBe("python  sql   react");
  });

  it("handles empty string", () => {
    expect(normalize("")).toBe("");
  });

  it("handles string with only special characters", () => {
    expect(normalize("@!$%")).toBe("    ");
  });

  it("preserves whitespace", () => {
    expect(normalize("multiple   spaces")).toBe("multiple   spaces");
  });
});
