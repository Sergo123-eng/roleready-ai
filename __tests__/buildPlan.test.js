const { buildPlan } = require("../app.logic");

function makeInput(overrides = {}) {
  return {
    role: "AI Product Intern",
    profile: "CS student with Python and React",
    job: "Looking for an intern with AI experience",
    score: 78,
    best: { id: "ai", label: "AI", color: "#0f766e", score: 90 },
    gap: { id: "backend", label: "Backend", color: "#c2410c", score: 20 },
    categoryScores: [
      { id: "ai", label: "AI", score: 90 },
      { id: "data", label: "Data", score: 70 },
      { id: "frontend", label: "Frontend", score: 60 },
      { id: "backend", label: "Backend", score: 20 },
      { id: "product", label: "Product", score: 50 },
      { id: "communication", label: "Comms", score: 40 },
    ],
    missing: ["api", "database", "deployment"],
    timeframe: "14 days",
    style: "Portfolio ready",
    stretch: true,
    entry: true,
    ...overrides,
  };
}

describe("buildPlan", () => {
  describe("basic output structure", () => {
    it("returns an object with all required fields", () => {
      const plan = buildPlan(makeInput());
      expect(plan).toHaveProperty("role");
      expect(plan).toHaveProperty("score");
      expect(plan).toHaveProperty("bestSignal");
      expect(plan).toHaveProperty("topGap");
      expect(plan).toHaveProperty("effort");
      expect(plan).toHaveProperty("categories");
      expect(plan).toHaveProperty("brief");
      expect(plan).toHaveProperty("missing");
      expect(plan).toHaveProperty("sprint");
      expect(plan).toHaveProperty("resumeBullets");
      expect(plan).toHaveProperty("pitch");
    });

    it("preserves the input role", () => {
      const plan = buildPlan(makeInput({ role: "Data Analyst" }));
      expect(plan.role).toBe("Data Analyst");
    });

    it("preserves the input score", () => {
      const plan = buildPlan(makeInput({ score: 85 }));
      expect(plan.score).toBe(85);
    });
  });

  describe("bestSignal and topGap", () => {
    it("uses the best category label as bestSignal", () => {
      const plan = buildPlan(makeInput({ best: { label: "Frontend" } }));
      expect(plan.bestSignal).toBe("Frontend");
    });

    it("uses the gap category label as topGap", () => {
      const plan = buildPlan(makeInput({ gap: { label: "Comms" } }));
      expect(plan.topGap).toBe("Comms");
    });
  });

  describe("effort calculation", () => {
    it("returns 'Focused MVP' for 7 days", () => {
      const plan = buildPlan(makeInput({ timeframe: "7 days" }));
      expect(plan.effort).toBe("Focused MVP");
    });

    it("returns 'Full case study' for 30 days", () => {
      const plan = buildPlan(makeInput({ timeframe: "30 days" }));
      expect(plan.effort).toBe("Full case study");
    });

    it("returns 'Demo plus case study' for 14 days", () => {
      const plan = buildPlan(makeInput({ timeframe: "14 days" }));
      expect(plan.effort).toBe("Demo plus case study");
    });

    it("returns 'Demo plus case study' for unknown timeframe", () => {
      const plan = buildPlan(makeInput({ timeframe: "21 days" }));
      expect(plan.effort).toBe("Demo plus case study");
    });
  });

  describe("sprint plan", () => {
    it("generates 7 items for 7-day sprint", () => {
      const plan = buildPlan(makeInput({ timeframe: "7 days" }));
      expect(plan.sprint).toHaveLength(7);
      expect(plan.sprint[0]).toContain("Day 1");
    });

    it("generates 4 items for 30-day sprint", () => {
      const plan = buildPlan(makeInput({ timeframe: "30 days" }));
      expect(plan.sprint).toHaveLength(4);
      expect(plan.sprint[0]).toContain("Week 1");
    });

    it("generates 5 items for 14-day sprint", () => {
      const plan = buildPlan(makeInput({ timeframe: "14 days" }));
      expect(plan.sprint).toHaveLength(5);
      expect(plan.sprint[0]).toContain("Days 1-2");
    });
  });

  describe("features and stretch goal", () => {
    it("includes 4 features when stretch is true", () => {
      const plan = buildPlan(makeInput({ stretch: true }));
      expect(plan.brief.features).toHaveLength(4);
      expect(plan.brief.features[3]).toContain("review mode");
    });

    it("includes 3 features when stretch is false", () => {
      const plan = buildPlan(makeInput({ stretch: false }));
      expect(plan.brief.features).toHaveLength(3);
    });
  });

  describe("audience selection", () => {
    it("targets early-career candidates when entry is true", () => {
      const plan = buildPlan(makeInput({ entry: true }));
      expect(plan.brief.problem).toContain("early-career candidates");
    });

    it("targets career switchers when entry is false", () => {
      const plan = buildPlan(makeInput({ entry: false }));
      expect(plan.brief.problem).toContain("career switchers");
    });
  });

  describe("brief content", () => {
    it("includes the project title in the brief", () => {
      const plan = buildPlan(makeInput({ role: "AI Product Intern" }));
      expect(plan.brief.title).toBe("AI Product Intern Signal Studio");
    });

    it("includes missing skills in the solution", () => {
      const plan = buildPlan(makeInput({ missing: ["api", "database"] }));
      expect(plan.brief.solution).toContain("api, database");
    });

    it("uses fallback text when no missing skills", () => {
      const plan = buildPlan(makeInput({ missing: [] }));
      expect(plan.brief.solution).toContain("role-specific proof");
    });
  });

  describe("resume bullets", () => {
    it("generates exactly 3 resume bullets", () => {
      const plan = buildPlan(makeInput());
      expect(plan.resumeBullets).toHaveLength(3);
    });

    it("includes the project title in the first bullet", () => {
      const plan = buildPlan(makeInput({ role: "AI Product Intern" }));
      expect(plan.resumeBullets[0]).toContain("AI Product Intern Signal Studio");
    });

    it("includes all category labels in the second bullet", () => {
      const plan = buildPlan(makeInput());
      expect(plan.resumeBullets[1]).toContain("AI, Data, Frontend, Backend, Product, Comms");
    });

    it("includes the style in the third bullet", () => {
      const plan = buildPlan(makeInput({ style: "Portfolio ready" }));
      expect(plan.resumeBullets[2]).toContain("portfolio ready");
    });
  });

  describe("pitch", () => {
    it("includes the project title", () => {
      const plan = buildPlan(makeInput({ role: "Data Analyst" }));
      expect(plan.pitch).toContain("Data Analyst Signal Studio");
    });

    it("includes the role in the pitch", () => {
      const plan = buildPlan(makeInput({ role: "ML Engineer" }));
      expect(plan.pitch).toContain("ML Engineer");
    });
  });

  describe("role normalization", () => {
    it("trims extra whitespace in role", () => {
      const plan = buildPlan(makeInput({ role: "  AI  Product  Intern  " }));
      expect(plan.brief.title).toBe("AI Product Intern Signal Studio");
    });
  });
});
