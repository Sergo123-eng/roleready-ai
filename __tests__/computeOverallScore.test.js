const { computeOverallScore } = require("../app.logic");

function makeCategoryScores(overrides = []) {
  const defaults = [
    { id: "ai", required: ["ai", "ml"], overlap: ["ai", "ml"], score: 100 },
    { id: "data", required: ["python", "sql"], overlap: ["python"], score: 50 },
    { id: "frontend", required: ["react"], overlap: ["react"], score: 100 },
    { id: "backend", required: ["api", "node"], overlap: [], score: 0 },
    { id: "product", required: ["product", "user"], overlap: ["user"], score: 50 },
    { id: "communication", required: ["writing"], overlap: [], score: 0 },
  ];
  return defaults.map((d, i) => ({ ...d, ...(overrides[i] || {}) }));
}

describe("computeOverallScore", () => {
  it("returns a number between 42 and 96", () => {
    const score = computeOverallScore(makeCategoryScores());
    expect(score).toBeGreaterThanOrEqual(42);
    expect(score).toBeLessThanOrEqual(96);
  });

  it("returns higher score when more terms overlap", () => {
    const lowOverlap = makeCategoryScores([
      { required: ["ai", "ml", "nlp"], overlap: ["ai"], score: 33 },
      { required: ["python", "sql", "data"], overlap: [], score: 0 },
      { required: ["react", "javascript"], overlap: [], score: 0 },
      { required: ["api", "node"], overlap: [], score: 0 },
      { required: ["product", "user"], overlap: [], score: 0 },
      { required: ["writing"], overlap: [], score: 0 },
    ]);
    const highOverlap = makeCategoryScores([
      { required: ["ai", "ml", "nlp"], overlap: ["ai", "ml", "nlp"], score: 100 },
      { required: ["python", "sql", "data"], overlap: ["python", "sql", "data"], score: 100 },
      { required: ["react", "javascript"], overlap: ["react", "javascript"], score: 100 },
      { required: ["api", "node"], overlap: ["api", "node"], score: 100 },
      { required: ["product", "user"], overlap: ["product", "user"], score: 100 },
      { required: ["writing"], overlap: ["writing"], score: 100 },
    ]);
    const low = computeOverallScore(lowOverlap);
    const high = computeOverallScore(highOverlap);
    expect(high).toBeGreaterThan(low);
  });

  it("returns minimum 42 even with zero coverage", () => {
    const zeroCoverage = makeCategoryScores([
      { required: ["ai"], overlap: [], score: 0 },
      { required: ["python"], overlap: [], score: 0 },
      { required: ["react"], overlap: [], score: 0 },
      { required: ["api"], overlap: [], score: 0 },
      { required: ["product"], overlap: [], score: 0 },
      { required: ["writing"], overlap: [], score: 0 },
    ]);
    expect(computeOverallScore(zeroCoverage)).toBeGreaterThanOrEqual(42);
  });

  it("returns maximum 96 even with full coverage", () => {
    const fullCoverage = makeCategoryScores([
      { required: ["ai"], overlap: ["ai"], score: 100 },
      { required: ["python"], overlap: ["python"], score: 100 },
      { required: ["react"], overlap: ["react"], score: 100 },
      { required: ["api"], overlap: ["api"], score: 100 },
      { required: ["product"], overlap: ["product"], score: 100 },
      { required: ["writing"], overlap: ["writing"], score: 100 },
    ]);
    expect(computeOverallScore(fullCoverage)).toBeLessThanOrEqual(96);
  });

  it("uses 0.45 as default coverage when no required terms", () => {
    const noRequired = [
      { required: [], overlap: [], score: 0 },
      { required: [], overlap: [], score: 0 },
      { required: [], overlap: [], score: 0 },
      { required: [], overlap: [], score: 0 },
      { required: [], overlap: [], score: 0 },
      { required: [], overlap: [], score: 0 },
    ];
    const score = computeOverallScore(noRequired);
    // With coverage=0.45, signalCoverage=0: round(min(96, max(42, 38 + 0.45*43 + 0*15))) = round(57.35) = 57
    expect(score).toBe(57);
  });

  it("accounts for signal coverage (categories scoring >= 50)", () => {
    const halfAbove50 = makeCategoryScores([
      { required: ["ai"], overlap: ["ai"], score: 100 },
      { required: ["python"], overlap: ["python"], score: 100 },
      { required: ["react"], overlap: ["react"], score: 100 },
      { required: ["api"], overlap: [], score: 0 },
      { required: ["product"], overlap: [], score: 0 },
      { required: ["writing"], overlap: [], score: 0 },
    ]);
    const allAbove50 = makeCategoryScores([
      { required: ["ai"], overlap: ["ai"], score: 100 },
      { required: ["python"], overlap: ["python"], score: 100 },
      { required: ["react"], overlap: ["react"], score: 100 },
      { required: ["api"], overlap: ["api"], score: 100 },
      { required: ["product"], overlap: ["product"], score: 100 },
      { required: ["writing"], overlap: ["writing"], score: 100 },
    ]);
    const scoreHalf = computeOverallScore(halfAbove50);
    const scoreAll = computeOverallScore(allAbove50);
    expect(scoreAll).toBeGreaterThan(scoreHalf);
  });

  it("returns an integer", () => {
    const score = computeOverallScore(makeCategoryScores());
    expect(Number.isInteger(score)).toBe(true);
  });
});
