const categories = [
  {
    id: "ai",
    label: "AI",
    color: "#0f766e",
    terms: ["ai", "artificial intelligence", "machine learning", "ml", "llm", "openai", "prompt", "prompt engineering", "model", "nlp", "classification", "recommendation", "computer vision"],
  },
  {
    id: "data",
    label: "Data",
    color: "#2563eb",
    terms: ["data", "sql", "python", "analytics", "dashboard", "metrics", "excel", "tableau", "experiment", "a/b", "statistics", "visualization", "analysis"],
  },
  {
    id: "frontend",
    label: "Frontend",
    color: "#7c3aed",
    terms: ["react", "javascript", "typescript", "html", "css", "frontend", "ui", "ux", "responsive", "accessibility", "prototype", "demo"],
  },
  {
    id: "backend",
    label: "Backend",
    color: "#c2410c",
    terms: ["api", "node", "express", "database", "postgres", "mongodb", "server", "cloud", "auth", "authentication", "deployment"],
  },
  {
    id: "product",
    label: "Product",
    color: "#b45309",
    terms: ["product", "research", "user", "roadmap", "figma", "requirements", "stakeholder", "design", "tradeoff", "feature", "customer"],
  },
  {
    id: "communication",
    label: "Comms",
    color: "#15803d",
    terms: ["presentation", "writing", "collaboration", "leadership", "documentation", "communicate", "training", "team", "nontechnical", "storytelling"],
  },
];

const sample = {
  role: "AI Product Intern",
  profile:
    "Computer science student with projects in Python, JavaScript, React, SQL, prompt testing, and dashboard design. Built a campus dining analytics prototype, explored LLM evaluation in a class notebook, led a student club website redesign, and presented research findings to nontechnical audiences.",
  job:
    "We are looking for an intern who can prototype AI features, analyze product usage data, collaborate with designers, build lightweight frontend demos, document tradeoffs, and communicate findings clearly. Experience with Python, SQL, prompt engineering, APIs, user research, and metrics is preferred.",
  time: "14 days",
  style: "Portfolio ready",
  stretch: true,
  entry: true,
};

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ");
}

function termHits(text, terms) {
  const normalized = normalize(text);
  return terms.filter((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|\\W)${escaped}(\\W|$)`, "i").test(normalized);
  });
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function computeCategoryScores(role, profile, job) {
  const joinedJob = `${role} ${job}`;
  const joinedProfile = profile;

  return categories.map((category) => {
    const required = termHits(joinedJob, category.terms);
    const present = termHits(joinedProfile, category.terms);
    const overlap = required.filter((term) => present.includes(term));
    const score = required.length === 0 ? Math.min(55, present.length * 18) : Math.round((overlap.length / required.length) * 100);
    return {
      ...category,
      required,
      present,
      overlap,
      missing: required.filter((term) => !present.includes(term)),
      score: Math.max(0, Math.min(100, score)),
    };
  });
}

function computeOverallScore(categoryScores) {
  const allRequired = unique(categoryScores.flatMap((item) => item.required));
  const allOverlap = unique(categoryScores.flatMap((item) => item.overlap));
  const coverage = allRequired.length ? allOverlap.length / allRequired.length : 0.45;
  const signalCoverage = categoryScores.filter((item) => item.score >= 50).length / categoryScores.length;
  return Math.round(Math.min(96, Math.max(42, 38 + coverage * 43 + signalCoverage * 15)));
}

function buildPlan(input) {
  const roleRoot = input.role.replace(/\s+/g, " ").trim();
  const missingText = input.missing.length ? input.missing.join(", ") : "role-specific proof";
  const bestSignal = input.best.label;
  const projectTitle = `${roleRoot} Signal Studio`;
  const audience = input.entry ? "early-career candidates" : "career switchers";
  const effort = input.timeframe === "7 days" ? "Focused MVP" : input.timeframe === "30 days" ? "Full case study" : "Demo plus case study";

  const features = [
    `Parse a job post and score skill evidence across ${bestSignal.toLowerCase()}, data, product, and communication signals.`,
    "Generate a project brief with scope, success metrics, risks, and a demo script.",
    "Turn student work into resume bullets and a concise Handshake profile pitch.",
  ];

  if (input.stretch) {
    features.push("Add a review mode where mentors can leave feedback on the generated project brief.");
  }

  const sprint = input.timeframe === "7 days"
    ? [
        "Day 1: Define the role rubric, sample profile, and scoring categories.",
        "Day 2: Build the input flow and keyword evidence matcher.",
        "Day 3: Create the signal map and skill gap view.",
        "Day 4: Generate the project brief, sprint plan, and pitch outputs.",
        "Day 5: Polish copy states, empty states, and mobile layout.",
        "Day 6: Test with two real job posts and tune the rubric.",
        "Day 7: Record a short demo and write the project story.",
      ]
    : input.timeframe === "30 days"
      ? [
          "Week 1: Interview students, collect role descriptions, and define scoring categories.",
          "Week 2: Build the local prototype, signal map, and generated plan outputs.",
          "Week 3: Test with real profiles, add export flows, and improve explainability.",
          "Week 4: Package the case study, metrics, demo video, and next-step roadmap.",
        ]
      : [
          "Days 1-2: Define the target user, role rubric, and sample prompts.",
          "Days 3-5: Build the analyzer, evidence matcher, and signal map.",
          "Days 6-8: Generate project briefs, skill gaps, resume bullets, and pitches.",
          "Days 9-11: Add export, copy states, saved inputs, and responsive polish.",
          "Days 12-14: Test with real job posts, write the case study, and record the demo.",
        ];

  const resumeBullets = [
    `Built ${projectTitle}, a browser-based career tool that converts job descriptions and student experience into a skill-gap map, portfolio project brief, and pitch.`,
    `Designed a transparent scoring rubric across ${input.categoryScores.map((item) => item.label).join(", ")} signals to explain why a candidate matches a target role.`,
    `Created an exportable ${input.style.toLowerCase()} workflow that helps ${audience} turn existing experience into recruiter-ready evidence.`,
  ];

  return {
    role: input.role,
    score: input.score,
    bestSignal,
    topGap: input.gap.label,
    effort,
    categories: input.categoryScores,
    brief: {
      title: projectTitle,
      problem: `${audience} often know what they have done, but not how to translate it into evidence for a specific ${roleRoot} posting.`,
      solution: `${projectTitle} reads the profile and job description, finds matching signals, surfaces gaps like ${missingText}, and creates a project plan that proves the missing skills.`,
      features,
      metric: "Success is measured by clearer role fit, fewer missing evidence gaps, and a finished demo or case study by the end of the chosen timeframe.",
    },
    missing: input.missing,
    sprint,
    resumeBullets,
    pitch: `I built ${projectTitle} to help students turn scattered experience into role-specific proof. The app compares a student profile with a ${roleRoot} job description, maps strengths and gaps, and generates a focused project plan plus resume bullets. It shows how I think about AI product design, explainability, user workflow, and practical career outcomes.`,
  };
}

function planText(plan, section) {
  if (!plan) return "";

  const sections = {
    signal: `Match score: ${plan.score}%\nBest signal: ${plan.bestSignal}\nGap to close: ${plan.topGap}\nProject effort: ${plan.effort}`,
    brief: `${plan.brief.title}\n\nProblem: ${plan.brief.problem}\n\nSolution: ${plan.brief.solution}\n\nMetric: ${plan.brief.metric}\n\nFeatures:\n- ${plan.brief.features.join("\n- ")}`,
    gaps: plan.categories.map((item) => `${item.label}: ${item.score}%`).join("\n") + `\n\nMissing: ${(plan.missing.length ? plan.missing : ["role-specific evidence"]).join(", ")}`,
    sprint: plan.sprint.map((item, index) => `${index + 1}. ${item}`).join("\n"),
    resume: plan.resumeBullets.map((item) => `- ${item}`).join("\n"),
    pitch: plan.pitch,
  };

  return sections[section] || JSON.stringify(plan, null, 2);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    categories,
    sample,
    normalize,
    termHits,
    unique,
    computeCategoryScores,
    computeOverallScore,
    buildPlan,
    planText,
  };
}
