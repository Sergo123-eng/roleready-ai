const { unique } = require("../app.logic");

describe("unique", () => {
  it("removes duplicate values", () => {
    expect(unique(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
  });

  it("filters out falsy values", () => {
    expect(unique(["a", null, "b", undefined, "", "c"])).toEqual(["a", "b", "c"]);
  });

  it("handles empty array", () => {
    expect(unique([])).toEqual([]);
  });

  it("handles array with all duplicates", () => {
    expect(unique(["x", "x", "x"])).toEqual(["x"]);
  });

  it("preserves order of first occurrence", () => {
    expect(unique(["c", "b", "a", "b", "c"])).toEqual(["c", "b", "a"]);
  });

  it("handles array with only falsy values", () => {
    expect(unique([null, undefined, "", 0, false])).toEqual([]);
  });

  it("keeps numeric zero filtered out (falsy)", () => {
    expect(unique([0, 1, 2, 1])).toEqual([1, 2]);
  });

  it("handles single element array", () => {
    expect(unique(["only"])).toEqual(["only"]);
  });
});
