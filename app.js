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

const state = {
  lastPlan: null,
};

const els = {
  role: document.getElementById("roleInput"),
  profile: document.getElementById("profileInput"),
  job: document.getElementById("jobInput"),
  time: document.getElementById("timeInput"),
  style: document.getElementById("styleInput"),
  stretch: document.getElementById("stretchToggle"),
  entry: document.getElementById("entryToggle"),
  score: document.getElementById("scoreText"),
  bestSignal: document.getElementById("bestSignal"),
  topGap: document.getElementById("topGap"),
  effort: document.getElementById("effortText"),
  brief: document.getElementById("projectBrief"),
  gaps: document.getElementById("skillGaps"),
  sprint: document.getElementById("sprintPlan"),
  resume: document.getElementById("resumeBullets"),
  pitch: document.getElementById("pitchText"),
  canvas: document.getElementById("skillCanvas"),
  saveStatus: document.getElementById("saveStatus"),
  toast: document.getElementById("toast"),
};

/* ── Shared DOM utilities ─────────────────────────────────────────────── */

function createEl(tag, className, html) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (html !== undefined) el.innerHTML = html;
  return el;
}

function renderList(container, items, tag) {
  container.innerHTML = "";
  items.forEach((text) => {
    const el = createEl(tag);
    el.textContent = text;
    container.appendChild(el);
  });
}

function renderTags(container, items, extraClass) {
  const row = createEl("div", "tag-row");
  items.forEach((text) => {
    const tag = createEl("span", extraClass ? `tag ${extraClass}` : "tag");
    tag.textContent = text;
    row.appendChild(tag);
  });
  container.appendChild(row);
}

/* ── Text utilities ───────────────────────────────────────────────────── */

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

function analyze() {
  const role = els.role.value.trim() || "Target Role";
  const profile = els.profile.value.trim();
  const job = els.job.value.trim();
  const joinedJob = `${role} ${job}`;
  const joinedProfile = profile;

  const categoryScores = categories.map((category) => {
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

  const allRequired = unique(categoryScores.flatMap((item) => item.required));
  const allOverlap = unique(categoryScores.flatMap((item) => item.overlap));
  const allMissing = unique(categoryScores.flatMap((item) => item.missing));
  const coverage = allRequired.length ? allOverlap.length / allRequired.length : 0.45;
  const signalCoverage = categoryScores.filter((item) => item.score >= 50).length / categoryScores.length;
  const score = Math.round(Math.min(96, Math.max(42, 38 + coverage * 43 + signalCoverage * 15)));
  const best = [...categoryScores].sort((a, b) => b.score - a.score)[0];
  const gap = [...categoryScores].sort((a, b) => a.score - b.score)[0];
  const topMissing = allMissing.slice(0, 8);

  const plan = buildPlan({
    role,
    profile,
    job,
    score,
    best,
    gap,
    categoryScores,
    missing: topMissing,
    timeframe: els.time.value,
    style: els.style.value,
    stretch: els.stretch.checked,
    entry: els.entry.checked,
  });

  state.lastPlan = plan;
  render(plan);
  persist();
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

function render(plan) {
  els.score.textContent = `${plan.score}%`;
  els.bestSignal.textContent = plan.bestSignal;
  els.topGap.textContent = plan.topGap;
  els.effort.textContent = plan.effort;

  els.brief.innerHTML = "";
  [
    ["Title", plan.brief.title],
    ["Problem", plan.brief.problem],
    ["Solution", plan.brief.solution],
    ["Metric", plan.brief.metric],
  ].forEach(([label, text]) => {
    els.brief.appendChild(createEl("div", "brief-block", `<span>${label}</span><p>${text}</p>`));
  });

  const featureBlock = createEl("div", "brief-block", "<span>Features</span>");
  renderTags(featureBlock, plan.brief.features);
  els.brief.appendChild(featureBlock);

  els.gaps.innerHTML = "";
  plan.categories.forEach((item) => {
    els.gaps.appendChild(
      createEl("div", "gap-row", `
        <strong>${item.label}</strong>
        <div class="bar" aria-label="${item.label} ${item.score}%">
          <span style="width:${item.score}%; background:${item.color}"></span>
        </div>
      `),
    );
  });

  const gapTagValues = plan.missing.length ? plan.missing : ["Add more role-specific evidence"];
  renderTags(els.gaps, gapTagValues, "gap");

  renderList(els.sprint, plan.sprint, "li");
  renderList(els.resume, plan.resumeBullets, "li");

  els.pitch.textContent = plan.pitch;
  drawSkillMap(plan.categories);
}

function drawSkillMap(items) {
  const canvas = els.canvas;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f9fbfc";
  ctx.fillRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2 + 8;
  const maxRadius = Math.min(width, height) * 0.34;
  const steps = [0.25, 0.5, 0.75, 1];

  ctx.strokeStyle = "#d8e0e7";
  ctx.lineWidth = 1;
  steps.forEach((step) => {
    ctx.beginPath();
    ctx.arc(cx, cy, maxRadius * step, 0, Math.PI * 2);
    ctx.stroke();
  });

  const points = items.map((item, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / items.length;
    const radius = maxRadius * (item.score / 100);
    const outerX = cx + Math.cos(angle) * (maxRadius + 38);
    const outerY = cy + Math.sin(angle) * (maxRadius + 38);
    return {
      item,
      angle,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      outerX,
      outerY,
    };
  });

  points.forEach((point) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(point.angle) * maxRadius, cy + Math.sin(point.angle) * maxRadius);
    ctx.strokeStyle = "#e1e8ee";
    ctx.stroke();
  });

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(15, 118, 110, 0.16)";
  ctx.strokeStyle = "#0f766e";
  ctx.lineWidth = 3;
  ctx.fill();
  ctx.stroke();

  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = point.item.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    ctx.fillStyle = "#1f2933";
    ctx.font = "700 15px Inter, system-ui, sans-serif";
    ctx.textAlign = point.outerX < cx - 20 ? "right" : point.outerX > cx + 20 ? "left" : "center";
    ctx.fillText(point.item.label, point.outerX, point.outerY);
    ctx.fillStyle = "#607080";
    ctx.font = "700 12px Inter, system-ui, sans-serif";
    ctx.fillText(`${point.item.score}%`, point.outerX, point.outerY + 17);
  });

  ctx.fillStyle = "#1f2933";
  ctx.font = "800 18px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Role evidence strength", cx, 34);
}

function planText(section) {
  const plan = state.lastPlan;
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

async function copySection(section) {
  const text = planText(section);
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    toast("Copied");
  } catch {
    toast("Copy blocked by browser");
  }
}

function exportPlan() {
  if (!state.lastPlan) analyze();
  const data = {
    generatedAt: new Date().toISOString(),
    inputs: readInputs(),
    plan: state.lastPlan,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "roleready-plan.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast("Exported");
}

function readInputs() {
  return {
    role: els.role.value,
    profile: els.profile.value,
    job: els.job.value,
    time: els.time.value,
    style: els.style.value,
    stretch: els.stretch.checked,
    entry: els.entry.checked,
  };
}

function writeInputs(data) {
  els.role.value = data.role || sample.role;
  els.profile.value = data.profile || sample.profile;
  els.job.value = data.job || sample.job;
  els.time.value = data.time || sample.time;
  els.style.value = data.style || sample.style;
  els.stretch.checked = data.stretch ?? sample.stretch;
  els.entry.checked = data.entry ?? sample.entry;
}

function persist() {
  localStorage.setItem("roleready-ai", JSON.stringify(readInputs()));
  els.saveStatus.textContent = "Saved locally";
}

function restore() {
  const raw = localStorage.getItem("roleready-ai");
  if (!raw) return false;
  try {
    writeInputs(JSON.parse(raw));
    return true;
  } catch {
    return false;
  }
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => els.toast.classList.remove("show"), 1800);
}

document.getElementById("generatePlan").addEventListener("click", analyze);
document.getElementById("loadSample").addEventListener("click", () => {
  writeInputs(sample);
  analyze();
  toast("Sample loaded");
});
document.getElementById("exportPlan").addEventListener("click", exportPlan);
document.getElementById("resetApp").addEventListener("click", () => {
  localStorage.removeItem("roleready-ai");
  writeInputs(sample);
  analyze();
  toast("Reset");
});

document.querySelectorAll(".small-copy").forEach((button) => {
  button.addEventListener("click", () => copySection(button.dataset.copy));
});

[els.role, els.profile, els.job, els.time, els.style, els.stretch, els.entry].forEach((input) => {
  input.addEventListener("input", () => {
    els.saveStatus.textContent = "Unsaved changes";
  });
});

if (!restore()) {
  writeInputs(sample);
}
analyze();
