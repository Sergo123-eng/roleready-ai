const { planText } = require("../app.logic");

function makePlan() {
  return {
    role: "AI Product Intern",
    score: 78,
    bestSignal: "AI",
    topGap: "Backend",
    effort: "Demo plus case study",
    categories: [
      { label: "AI", score: 90 },
      { label: "Data", score: 70 },
      { label: "Frontend", score: 60 },
      { label: "Backend", score: 20 },
      { label: "Product", score: 50 },
      { label: "Comms", score: 40 },
    ],
    brief: {
      title: "AI Product Intern Signal Studio",
      problem: "early-career candidates often know what they have done...",
      solution: "Signal Studio reads the profile and job description...",
      metric: "Success is measured by clearer role fit...",
      features: ["Feature 1", "Feature 2", "Feature 3"],
    },
    missing: ["api", "database", "deployment"],
    sprint: [
      "Days 1-2: Define the target user.",
      "Days 3-5: Build the analyzer.",
      "Days 6-8: Generate project briefs.",
      "Days 9-11: Add export.",
      "Days 12-14: Test with real job posts.",
    ],
    resumeBullets: [
      "Built Signal Studio, a browser-based career tool.",
      "Designed a transparent scoring rubric.",
      "Created an exportable portfolio workflow.",
    ],
    pitch: "I built Signal Studio to help students turn scattered experience into role-specific proof.",
  };
}

describe("planText", () => {
  it("returns empty string when plan is null", () => {
    expect(planText(null, "signal")).toBe("");
  });

  it("returns empty string when plan is undefined", () => {
    expect(planText(undefined, "brief")).toBe("");
  });

  describe("signal section", () => {
    it("includes match score", () => {
      const text = planText(makePlan(), "signal");
      expect(text).toContain("Match score: 78%");
    });

    it("includes best signal", () => {
      const text = planText(makePlan(), "signal");
      expect(text).toContain("Best signal: AI");
    });

    it("includes gap to close", () => {
      const text = planText(makePlan(), "signal");
      expect(text).toContain("Gap to close: Backend");
    });

    it("includes project effort", () => {
      const text = planText(makePlan(), "signal");
      expect(text).toContain("Project effort: Demo plus case study");
    });
  });

  describe("brief section", () => {
    it("includes the title", () => {
      const text = planText(makePlan(), "brief");
      expect(text).toContain("AI Product Intern Signal Studio");
    });

    it("includes the problem statement", () => {
      const text = planText(makePlan(), "brief");
      expect(text).toContain("Problem:");
    });

    it("includes features", () => {
      const text = planText(makePlan(), "brief");
      expect(text).toContain("Features:");
      expect(text).toContain("- Feature 1");
      expect(text).toContain("- Feature 2");
    });
  });

  describe("gaps section", () => {
    it("includes category scores", () => {
      const text = planText(makePlan(), "gaps");
      expect(text).toContain("AI: 90%");
      expect(text).toContain("Backend: 20%");
    });

    it("includes missing skills", () => {
      const text = planText(makePlan(), "gaps");
      expect(text).toContain("Missing: api, database, deployment");
    });

    it("uses fallback when missing is empty", () => {
      const plan = makePlan();
      plan.missing = [];
      const text = planText(plan, "gaps");
      expect(text).toContain("Missing: role-specific evidence");
    });
  });

  describe("sprint section", () => {
    it("numbers each sprint item", () => {
      const text = planText(makePlan(), "sprint");
      expect(text).toContain("1. Days 1-2:");
      expect(text).toContain("2. Days 3-5:");
    });
  });

  describe("resume section", () => {
    it("formats as bullet list", () => {
      const text = planText(makePlan(), "resume");
      expect(text).toContain("- Built Signal Studio");
      expect(text).toContain("- Designed a transparent");
    });
  });

  describe("pitch section", () => {
    it("returns the pitch text directly", () => {
      const text = planText(makePlan(), "pitch");
      expect(text).toContain("I built Signal Studio");
    });
  });

  describe("unknown section", () => {
    it("returns JSON representation for unknown section", () => {
      const text = planText(makePlan(), "unknown");
      const parsed = JSON.parse(text);
      expect(parsed.role).toBe("AI Product Intern");
    });
  });
});
