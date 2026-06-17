const { termHits } = require("../app.logic");

describe("termHits", () => {
  it("finds exact term matches in text", () => {
    const text = "I know Python and SQL";
    const terms = ["python", "sql", "java"];
    expect(termHits(text, terms)).toEqual(["python", "sql"]);
  });

  it("is case-insensitive", () => {
    const text = "Experience with REACT and JavaScript";
    const terms = ["react", "javascript"];
    expect(termHits(text, terms)).toEqual(["react", "javascript"]);
  });

  it("returns empty array when no matches", () => {
    const text = "I build websites";
    const terms = ["python", "sql", "java"];
    expect(termHits(text, terms)).toEqual([]);
  });

  it("handles empty text", () => {
    const terms = ["python", "sql"];
    expect(termHits("", terms)).toEqual([]);
  });

  it("handles empty terms array", () => {
    expect(termHits("some text", [])).toEqual([]);
  });

  it("matches terms at the beginning of text", () => {
    const text = "python is great";
    expect(termHits(text, ["python"])).toEqual(["python"]);
  });

  it("matches terms at the end of text", () => {
    const text = "I love python";
    expect(termHits(text, ["python"])).toEqual(["python"]);
  });

  it("does not match partial words by default", () => {
    const text = "I use pythonic patterns";
    expect(termHits(text, ["python"])).toEqual([]);
  });

  it("matches multi-word terms", () => {
    const text = "Experience with machine learning and prompt engineering";
    const terms = ["machine learning", "prompt engineering", "deep learning"];
    expect(termHits(text, terms)).toEqual(["machine learning", "prompt engineering"]);
  });

  it("handles special regex characters in terms", () => {
    // normalize replaces / with space, so "a/b" in text becomes "a b"
    // The term "a/b" won't match because the slash is removed during normalization
    const text = "Experience with a/b testing";
    const terms = ["a/b"];
    expect(termHits(text, terms)).toEqual([]);
  });

  it("matches terms requiring word boundaries", () => {
    // termHits uses word boundary matching, so "experiment" won't match "experiments"
    const text = "Ran an experiment and analyzed results";
    const terms = ["experiment"];
    expect(termHits(text, terms)).toEqual(["experiment"]);
  });

  it("matches terms with dots", () => {
    const text = "I use Node.js for backend";
    const terms = ["node"];
    expect(termHits(text, terms)).toEqual(["node"]);
  });

  it("matches ai as a standalone term", () => {
    const text = "Worked on AI projects";
    const terms = ["ai"];
    expect(termHits(text, terms)).toEqual(["ai"]);
  });

  it("handles text with many special characters", () => {
    const text = "Skills: Python, SQL, React (3+ years)";
    const terms = ["python", "sql", "react"];
    expect(termHits(text, terms)).toEqual(["python", "sql", "react"]);
  });
});
