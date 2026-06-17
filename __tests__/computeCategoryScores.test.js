const { computeCategoryScores, categories } = require("../app.logic");

describe("computeCategoryScores", () => {
  it("returns scores for all 6 categories", () => {
    const scores = computeCategoryScores("Software Engineer", "I know Python", "Need Python experience");
    expect(scores).toHaveLength(6);
  });

  it("each category has required fields", () => {
    const scores = computeCategoryScores("Engineer", "Python", "Python needed");
    scores.forEach((cat) => {
      expect(cat).toHaveProperty("id");
      expect(cat).toHaveProperty("label");
      expect(cat).toHaveProperty("color");
      expect(cat).toHaveProperty("terms");
      expect(cat).toHaveProperty("required");
      expect(cat).toHaveProperty("present");
      expect(cat).toHaveProperty("overlap");
      expect(cat).toHaveProperty("missing");
      expect(cat).toHaveProperty("score");
    });
  });

  it("scores 100% when all required terms are present in profile", () => {
    const role = "Data Role";
    const profile = "I use python and sql for data analytics with metrics and dashboard tools";
    const job = "Need python, sql, data, analytics, metrics, dashboard experience";
    const scores = computeCategoryScores(role, profile, job);
    const dataCategory = scores.find((c) => c.id === "data");
    expect(dataCategory.score).toBe(100);
  });

  it("scores 0% when no required terms are present", () => {
    const role = "Data Role";
    const profile = "I build React frontends with JavaScript and HTML";
    const job = "Need experience with python, sql, analytics, dashboard, metrics";
    const scores = computeCategoryScores(role, profile, job);
    const dataCategory = scores.find((c) => c.id === "data");
    expect(dataCategory.score).toBe(0);
  });

  it("caps score at 100", () => {
    const scores = computeCategoryScores("AI ML Engineer", "I know ai, ml, llm, nlp, model, prompt, openai, classification, recommendation, machine learning, computer vision, prompt engineering, artificial intelligence", "ai");
    const aiCategory = scores.find((c) => c.id === "ai");
    expect(aiCategory.score).toBeLessThanOrEqual(100);
  });

  it("scores min 0", () => {
    const scores = computeCategoryScores("role", "", "api node express database");
    const backendCategory = scores.find((c) => c.id === "backend");
    expect(backendCategory.score).toBeGreaterThanOrEqual(0);
  });

  it("uses limited score when no terms required for a category", () => {
    const role = "Writer";
    const profile = "I know python, sql, data, analytics";
    const job = "Need writing skills and storytelling";
    const scores = computeCategoryScores(role, profile, job);
    const dataCategory = scores.find((c) => c.id === "data");
    // When no data terms are required in job, score is min(55, present.length * 18)
    expect(dataCategory.score).toBeLessThanOrEqual(55);
  });

  it("correctly identifies missing terms", () => {
    const role = "Backend Engineer";
    const profile = "I use node and express";
    const job = "Need api, node, express, database, postgres";
    const scores = computeCategoryScores(role, profile, job);
    const backendCategory = scores.find((c) => c.id === "backend");
    expect(backendCategory.missing).toContain("database");
    expect(backendCategory.missing).toContain("postgres");
    expect(backendCategory.missing).not.toContain("node");
    expect(backendCategory.missing).not.toContain("express");
  });

  it("correctly identifies overlap terms", () => {
    const role = "Frontend Dev";
    const profile = "I use react and javascript";
    const job = "Need react, javascript, typescript";
    const scores = computeCategoryScores(role, profile, job);
    const frontendCategory = scores.find((c) => c.id === "frontend");
    expect(frontendCategory.overlap).toContain("react");
    expect(frontendCategory.overlap).toContain("javascript");
    expect(frontendCategory.overlap).not.toContain("typescript");
  });

  it("includes role text in job matching", () => {
    const role = "AI Engineer";
    const profile = "I work with ai and machine learning";
    const job = "Need ML experience";
    const scores = computeCategoryScores(role, profile, job);
    const aiCategory = scores.find((c) => c.id === "ai");
    // "ai" should be in required because role contains "AI"
    expect(aiCategory.required).toContain("ai");
  });
});
