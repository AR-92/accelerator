import express from "express";
import { requireAuth } from "../../session.js";

const router = express.Router();

// Business Model page
router.get("/models/business", requireAuth, (req, res) => {
  res.render("models/business", {
    title: "Business Model - Accelerator",
    bodyClass: "business-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "business",
    steps: [
      {
        number: 1,
        title: "Executive Summary",
        section: "executive-summary-section",
      },
      {
        number: 2,
        title: "Problem Analysis",
        section: "problem-analysis-section",
      },
      {
        number: 3,
        title: "Solution Overview",
        section: "solution-overview-section",
      },
      {
        number: 4,
        title: "Market Opportunity",
        section: "market-opportunity-section",
      },
      {
        number: 5,
        title: "Go-to-Market Strategy",
        section: "go-to-market-strategy-section",
      },
    ],
  });
});

// Financial Model page
router.get("/models/financial", requireAuth, (req, res) => {
  res.render("models/financial", {
    title: "Financial Model - Accelerator",
    bodyClass: "financial-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "financial",
    steps: [
      {
        title: "Financial Projections",
        section: "financial-projections-section",
      },
      {
        title: "Funding Requirements",
        section: "funding-requirements-section",
      },
      { title: "Cost Structure", section: "cost-structure-section" },
      {
        title: "Profitability Analysis",
        section: "profitability-analysis-section",
      },
      { title: "Financial Risks", section: "financial-risks-section" },
    ],
  });
});

// Idea Model page
router.get("/models/idea", requireAuth, (req, res) => {
  res.render("models/idea", {
    title: "Idea Model - Accelerator",
    bodyClass: "idea-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "idea",
    steps: [
      {
        number: 1,
        title: "Funding Strategy",
        section: "funding-strategy-section",
      },
      {
        number: 2,
        title: "Investment Plan",
        section: "investment-plan-section",
      },
      { number: 3, title: "Use of Funds", section: "use-of-funds-section" },
      { number: 4, title: "Exit Strategy", section: "exit-strategy-section" },
      {
        number: 5,
        title: "Funding Timeline",
        section: "funding-timeline-section",
      },
    ],
    sections: [
      {
        id: "problem-statement",
        question: "What problem are you solving?",
        answer:
          "Describe the core problem your idea addresses. Be specific about who experiences this problem and how it impacts them.",
        isGenerated: false,
      },
      {
        id: "target-audience",
        question: "Who is your target audience?",
        answer:
          "Define your ideal customer profile. Include demographics, psychographics, and behavioral characteristics.",
        isGenerated: false,
      },
      {
        id: "solution-overview",
        question: "What is your proposed solution?",
        answer:
          "Explain how your idea solves the problem. What makes your approach unique and effective?",
        isGenerated: false,
      },
      {
        id: "market-opportunity",
        question: "What is the market opportunity?",
        answer:
          "Describe the size of the market, growth potential, and your target market share.",
        isGenerated: false,
      },
      {
        id: "competitive-advantage",
        question: "What is your competitive advantage?",
        answer:
          "What makes your solution better than existing alternatives? Include unique features, cost advantages, or other differentiators.",
        isGenerated: false,
      },
      {
        id: "business-model",
        question: "How will you make money?",
        answer:
          "Describe your revenue streams, pricing strategy, and path to profitability.",
        isGenerated: false,
      },
    ],
    metadata: [
      { icon: "file-text", label: "Words", value: "1250" },
      { icon: "tag", label: "Tags", value: "innovation, startup, tech" },
      { icon: "check-circle", label: "Elements", value: "8" },
      { icon: "credit-card", label: "Credit", value: "50" },
      { icon: "calendar", label: "Updated", value: "Dec 13, 2025" },
      { icon: "clock", label: "Status", value: "In Progress" },
    ],
    subsections: [
      {
        title: "Concept Summary",
        content:
          "<p>Detailed breakdown of the core idea, including value proposition and unique selling points.</p>",
        hasSave: true,
        aiLabel: "Enhance Concept",
        aiIcon: "sparkles",
        aiAria: "Enhance the concept with AI suggestions",
      },
      {
        title: "Market Analysis",
        content:
          "<p>Target audience, market size, competitors, and growth potential.</p>",
        hasSave: true,
        aiLabel: "Analyze Market",
        aiIcon: "bar-chart",
        aiAria: "Run market analysis with AI",
      },
      {
        title: "Feasibility Study",
        content:
          "<p>Technical, financial, and operational feasibility assessment.</p>",
        hasSave: true,
        aiLabel: "Assess Feasibility",
        aiIcon: "check-circle",
        aiAria: "Evaluate feasibility using AI",
      },
      {
        title: "Risk Evaluation",
        content:
          "<p>Potential risks, mitigation strategies, and contingency plans.</p>",
        hasSave: true,
        aiLabel: "Identify Risks",
        aiIcon: "alert-triangle",
        aiAria: "Analyze risks with AI",
      },
    ],
    aiButtons: [
      {
        label: "Generate Ideas",
        icon: "brain",
        aria: "Generate new idea variations",
      },
      {
        label: "Predict Trends",
        icon: "trending-up",
        aria: "Forecast market trends",
      },
      {
        label: "Optimize Pitch",
        icon: "megaphone",
        aria: "Refine pitch deck content",
      },
      {
        label: "Financial Model",
        icon: "dollar-sign",
        aria: "Create financial projections",
      },
      { label: "Legal Review", icon: "scale", aria: "Check legal compliance" },
      {
        label: "Prototype Design",
        icon: "layout",
        aria: "Design initial prototype",
      },
    ],
  });
});

// Legal Model page
router.get("/models/legal", requireAuth, (req, res) => {
  res.render("models/leagal", {
    title: "Legal Model - Accelerator",
    bodyClass: "legal-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "legal",
    steps: [
      { title: "Legal Compliance", section: "legal-compliance-section" },
      {
        title: "Intellectual Property",
        section: "intellectual-property-section",
      },
      {
        title: "Regulatory Framework",
        section: "regulatory-framework-section",
      },
      {
        title: "Contracts and Agreements",
        section: "contracts-agreements-section",
      },
      { title: "Legal Risks", section: "legal-risks-section" },
    ],
  });
});

// Marketing Model page
router.get("/models/marketing", requireAuth, (req, res) => {
  res.render("models/marketing", {
    title: "Marketing Model - Accelerator",
    bodyClass: "marketing-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "marketing",
    steps: [
      {
        number: 1,
        title: "Team Structure",
        section: "team-structure-section",
      },
      {
        number: 2,
        title: "Key Roles",
        section: "key-roles-section",
      },
      {
        number: 3,
        title: "Recruitment Plan",
        section: "recruitment-plan-section",
      },
      {
        number: 4,
        title: "Team Development",
        section: "team-development-section",
      },
      {
        number: 5,
        title: "Organizational Culture",
        section: "organizational-culture-section",
      },
    ],
  });
});

// Team Model page
router.get("/models/team", requireAuth, (req, res) => {
  res.render("models/team", {
    title: "Team Model - Accelerator",
    bodyClass: "team-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "team",
    steps: [
      {
        number: 1,
        title: "Financial Projections",
        section: "financial-projections-section",
      },
      {
        number: 2,
        title: "Funding Requirements",
        section: "funding-requirements-section",
      },
      { number: 3, title: "Cost Structure", section: "cost-structure-section" },
      {
        number: 4,
        title: "Profitability Analysis",
        section: "profitability-analysis-section",
      },
      {
        number: 5,
        title: "Financial Risks",
        section: "financial-risks-section",
      },
    ],
  });
});

// Funding Model page
router.get("/models/funding", requireAuth, (req, res) => {
  res.render("models/funding", {
    title: "Funding Model - Accelerator",
    bodyClass: "funding-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "funding",
    steps: [
      {
        number: 1,
        title: "Business Strategy",
        section: "business-strategy-section",
      },
      {
        number: 2,
        title: "Market Analysis",
        section: "market-analysis-section",
      },
      {
        number: 3,
        title: "Competitive Landscape",
        section: "competitive-landscape-section",
      },
      { number: 4, title: "Revenue Model", section: "revenue-model-section" },
      { number: 5, title: "Growth Plan", section: "growth-plan-section" },
    ],
  });
});

export default router;
