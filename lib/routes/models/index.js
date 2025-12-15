import express from "express";
import { requireAuth } from "../../session.js";

const router = express.Router();

// Business Model page
router.get("/models/business", requireAuth, async (req, res) => {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  if (req.session.supabaseAccessToken) {
    await supabase.auth.setSession({
      access_token: req.session.supabaseAccessToken,
      refresh_token: req.session.supabaseRefreshToken,
    });
  }

  let populateIdeaJson = null;
  if (req.query.ideaId) {
    const { data: idea, error } = await supabase
      .from("ideas")
      .select("id, title, description, tags, category")
      .eq("id", req.query.ideaId)
      .eq("user_id", req.user.id)
      .single();

    if (idea && !error) {
      // Clean control characters from strings
      let cleanIdea = { ...idea };
      if (cleanIdea.title)
        cleanIdea.title = cleanIdea.title
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.description)
        cleanIdea.description = cleanIdea.description
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.category)
        cleanIdea.category = cleanIdea.category
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.tags && Array.isArray(cleanIdea.tags)) {
        cleanIdea.tags = cleanIdea.tags.map((tag) =>
          tag
            .replace(/[\x00-\x1F\x7F]/g, "")
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"'),
        );
      }

      // Create executive summary from idea data
      let executiveSummary = "";
      if (cleanIdea.title) executiveSummary += `Title: ${cleanIdea.title}\n\n`;
      if (cleanIdea.category)
        executiveSummary += `Category: ${cleanIdea.category}\n\n`;
      if (cleanIdea.description)
        executiveSummary += `Description: ${cleanIdea.description}\n\n`;
      if (cleanIdea.tags && cleanIdea.tags.length > 0) {
        executiveSummary += `Tags: ${cleanIdea.tags.join(", ")}\n\n`;
      }

      // Set the description to the executive summary
      cleanIdea.description = executiveSummary.trim();

      // Escape for HTML and JS
      populateIdeaJson = JSON.stringify(cleanIdea)
        .replace(/'/g, "\\'")
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e");
    }
  }

  // Extract title, category, and tags for the heading
  let ideaTitle = null;
  let ideaCategory = null;
  let ideaTags = null;
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      ideaTitle = ideaData.title;
      ideaCategory = ideaData.category;
      ideaTags =
        ideaData.tags && Array.isArray(ideaData.tags) ? ideaData.tags : null;
    } catch (e) {
      console.error("Error parsing idea data for heading:", e);
    }
  }

  // Create executive summary text for the question block (only description)
  let executiveSummaryText = "";
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      if (ideaData.description) {
        // Extract only the description part (between "Description: " and "Tags: ")
        const descMatch = ideaData.description.match(
          /Description:\s*(.*?)(?:\n\nTags:|$)/s,
        );
        if (descMatch && descMatch[1]) {
          executiveSummaryText = descMatch[1].trim();
        } else {
          // Fallback: if no match, use the whole description
          executiveSummaryText = ideaData.description;
        }
      }
    } catch (e) {
      console.error("Error creating executive summary text:", e);
    }
  }

  // Create dynamic page title with primary color for idea title
  let pageTitle = "Business Model";
  if (ideaTitle) {
    pageTitle = `Business Model of <span class="text-primary">${ideaTitle}</span>`;
  }

  res.render("models/business", {
    title: "Business Model - Accelerator",
    bodyClass: "business-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "business",
    ideaId: req.query.ideaId,
    populateIdeaJson: populateIdeaJson,
    ideaTitle: ideaTitle,
    ideaCategory: ideaCategory,
    ideaTags: ideaTags,
    executiveSummaryText: executiveSummaryText,
    pageTitle: pageTitle,
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
router.get("/models/financial", requireAuth, async (req, res) => {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  if (req.session.supabaseAccessToken) {
    await supabase.auth.setSession({
      access_token: req.session.supabaseAccessToken,
      refresh_token: req.session.supabaseRefreshToken,
    });
  }

  let populateIdeaJson = null;
  if (req.query.ideaId) {
    const { data: idea, error } = await supabase
      .from("ideas")
      .select("id, title, description, tags, category")
      .eq("id", req.query.ideaId)
      .eq("user_id", req.user.id)
      .single();

    if (idea && !error) {
      // Clean control characters from strings
      let cleanIdea = { ...idea };
      if (cleanIdea.title)
        cleanIdea.title = cleanIdea.title
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.description)
        cleanIdea.description = cleanIdea.description
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.category)
        cleanIdea.category = cleanIdea.category
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.tags && Array.isArray(cleanIdea.tags)) {
        cleanIdea.tags = cleanIdea.tags.map((tag) =>
          tag
            .replace(/[\x00-\x1F\x7F]/g, "")
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"'),
        );
      }

      // Create executive summary from idea data
      let executiveSummary = "";
      if (cleanIdea.title) executiveSummary += `Title: ${cleanIdea.title}\n\n`;
      if (cleanIdea.category)
        executiveSummary += `Category: ${cleanIdea.category}\n\n`;
      if (cleanIdea.description)
        executiveSummary += `Description: ${cleanIdea.description}\n\n`;
      if (cleanIdea.tags && cleanIdea.tags.length > 0) {
        executiveSummary += `Tags: ${cleanIdea.tags.join(", ")}\n\n`;
      }

      // Set the description to the executive summary
      cleanIdea.description = executiveSummary.trim();

      // Escape for HTML and JS
      populateIdeaJson = JSON.stringify(cleanIdea)
        .replace(/'/g, "\\'")
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e");
    }
  }

  // Extract title, category, and tags for the heading
  let ideaTitle = null;
  let ideaCategory = null;
  let ideaTags = null;
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      ideaTitle = ideaData.title;
      ideaCategory = ideaData.category;
      ideaTags =
        ideaData.tags && Array.isArray(ideaData.tags) ? ideaData.tags : null;
    } catch (e) {
      console.error("Error parsing idea data for heading:", e);
    }
  }

  // Create executive summary text for the question block (only description)
  let executiveSummaryText = "";
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      if (ideaData.description) {
        // Extract only the description part (between "Description: " and "Tags: ")
        const descMatch = ideaData.description.match(
          /Description:\s*(.*?)(?:\n\nTags:|$)/s,
        );
        if (descMatch && descMatch[1]) {
          executiveSummaryText = descMatch[1].trim();
        } else {
          // Fallback: if no match, use the whole description
          executiveSummaryText = ideaData.description;
        }
      }
    } catch (e) {
      console.error("Error creating executive summary text:", e);
    }
  }

  // Create dynamic page title with primary color for idea title
  let pageTitle = "Financial Model";
  if (ideaTitle) {
    pageTitle = `Financial Model of <span class="text-primary">${ideaTitle}</span>`;
  }

  res.render("models/financial", {
    title: "Financial Model - Accelerator",
    bodyClass: "financial-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "financial",
    ideaId: req.query.ideaId,
    populateIdeaJson: populateIdeaJson,
    ideaTitle: ideaTitle,
    ideaCategory: ideaCategory,
    ideaTags: ideaTags,
    executiveSummaryText: executiveSummaryText,
    pageTitle: pageTitle,
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

// Legal Model page
router.get("/models/legal", requireAuth, async (req, res) => {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  if (req.session.supabaseAccessToken) {
    await supabase.auth.setSession({
      access_token: req.session.supabaseAccessToken,
      refresh_token: req.session.supabaseRefreshToken,
    });
  }

  let populateIdeaJson = null;
  if (req.query.ideaId) {
    const { data: idea, error } = await supabase
      .from("ideas")
      .select("id, title, description, tags, category")
      .eq("id", req.query.ideaId)
      .eq("user_id", req.user.id)
      .single();

    if (idea && !error) {
      // Clean control characters from strings
      let cleanIdea = { ...idea };
      if (cleanIdea.title)
        cleanIdea.title = cleanIdea.title
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.description)
        cleanIdea.description = cleanIdea.description
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.category)
        cleanIdea.category = cleanIdea.category
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.tags && Array.isArray(cleanIdea.tags)) {
        cleanIdea.tags = cleanIdea.tags.map((tag) =>
          tag
            .replace(/[\x00-\x1F\x7F]/g, "")
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"'),
        );
      }

      // Create executive summary from idea data
      let executiveSummary = "";
      if (cleanIdea.title) executiveSummary += `Title: ${cleanIdea.title}\n\n`;
      if (cleanIdea.category)
        executiveSummary += `Category: ${cleanIdea.category}\n\n`;
      if (cleanIdea.description)
        executiveSummary += `Description: ${cleanIdea.description}\n\n`;
      if (cleanIdea.tags && cleanIdea.tags.length > 0) {
        executiveSummary += `Tags: ${cleanIdea.tags.join(", ")}\n\n`;
      }

      // Set the description to the executive summary
      cleanIdea.description = executiveSummary.trim();

      // Escape for HTML and JS
      populateIdeaJson = JSON.stringify(cleanIdea)
        .replace(/'/g, "\\'")
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e");
    }
  }

  // Extract title, category, and tags for the heading
  let ideaTitle = null;
  let ideaCategory = null;
  let ideaTags = null;
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      ideaTitle = ideaData.title;
      ideaCategory = ideaData.category;
      ideaTags =
        ideaData.tags && Array.isArray(ideaData.tags) ? ideaData.tags : null;
    } catch (e) {
      console.error("Error parsing idea data for heading:", e);
    }
  }

  // Create executive summary text for the question block (only description)
  let executiveSummaryText = "";
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      if (ideaData.description) {
        // Extract only the description part (between "Description: " and "Tags: ")
        const descMatch = ideaData.description.match(
          /Description:\s*(.*?)(?:\n\nTags:|$)/s,
        );
        if (descMatch && descMatch[1]) {
          executiveSummaryText = descMatch[1].trim();
        } else {
          // Fallback: if no match, use the whole description
          executiveSummaryText = ideaData.description;
        }
      }
    } catch (e) {
      console.error("Error creating executive summary text:", e);
    }
  }

  // Create dynamic page title with primary color for idea title
  let pageTitle = "Legal Model";
  if (ideaTitle) {
    pageTitle = `Legal Model of <span class="text-primary">${ideaTitle}</span>`;
  }

  res.render("models/legal", {
    title: "Legal Model - Accelerator",
    bodyClass: "legal-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "legal",
    ideaId: req.query.ideaId,
    populateIdeaJson: populateIdeaJson,
    ideaTitle: ideaTitle,
    ideaCategory: ideaCategory,
    ideaTags: ideaTags,
    executiveSummaryText: executiveSummaryText,
    pageTitle: pageTitle,
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
router.get("/models/marketing", requireAuth, async (req, res) => {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  if (req.session.supabaseAccessToken) {
    await supabase.auth.setSession({
      access_token: req.session.supabaseAccessToken,
      refresh_token: req.session.supabaseRefreshToken,
    });
  }

  let populateIdeaJson = null;
  if (req.query.ideaId) {
    const { data: idea, error } = await supabase
      .from("ideas")
      .select("id, title, description, tags, category")
      .eq("id", req.query.ideaId)
      .eq("user_id", req.user.id)
      .single();

    if (idea && !error) {
      // Clean control characters from strings
      let cleanIdea = { ...idea };
      if (cleanIdea.title)
        cleanIdea.title = cleanIdea.title
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.description)
        cleanIdea.description = cleanIdea.description
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.category)
        cleanIdea.category = cleanIdea.category
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.tags && Array.isArray(cleanIdea.tags)) {
        cleanIdea.tags = cleanIdea.tags.map((tag) =>
          tag
            .replace(/[\x00-\x1F\x7F]/g, "")
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"'),
        );
      }

      // Create executive summary from idea data
      let executiveSummary = "";
      if (cleanIdea.title) executiveSummary += `Title: ${cleanIdea.title}\n\n`;
      if (cleanIdea.category)
        executiveSummary += `Category: ${cleanIdea.category}\n\n`;
      if (cleanIdea.description)
        executiveSummary += `Description: ${cleanIdea.description}\n\n`;
      if (cleanIdea.tags && cleanIdea.tags.length > 0) {
        executiveSummary += `Tags: ${cleanIdea.tags.join(", ")}\n\n`;
      }

      // Set the description to the executive summary
      cleanIdea.description = executiveSummary.trim();

      // Escape for HTML and JS
      populateIdeaJson = JSON.stringify(cleanIdea)
        .replace(/'/g, "\\'")
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e");
    }
  }

  // Extract title, category, and tags for the heading
  let ideaTitle = null;
  let ideaCategory = null;
  let ideaTags = null;
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      ideaTitle = ideaData.title;
      ideaCategory = ideaData.category;
      ideaTags =
        ideaData.tags && Array.isArray(ideaData.tags) ? ideaData.tags : null;
    } catch (e) {
      console.error("Error parsing idea data for heading:", e);
    }
  }

  // Create executive summary text for the question block (only description)
  let executiveSummaryText = "";
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      if (ideaData.description) {
        // Extract only the description part (between "Description: " and "Tags: ")
        const descMatch = ideaData.description.match(
          /Description:\s*(.*?)(?:\n\nTags:|$)/s,
        );
        if (descMatch && descMatch[1]) {
          executiveSummaryText = descMatch[1].trim();
        } else {
          // Fallback: if no match, use the whole description
          executiveSummaryText = ideaData.description;
        }
      }
    } catch (e) {
      console.error("Error creating executive summary text:", e);
    }
  }

  // Create dynamic page title with primary color for idea title
  let pageTitle = "Marketing Model";
  if (ideaTitle) {
    pageTitle = `Marketing Model of <span class="text-primary">${ideaTitle}</span>`;
  }

  res.render("models/marketing", {
    title: "Marketing Model - Accelerator",
    bodyClass: "marketing-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "marketing",
    ideaId: req.query.ideaId,
    populateIdeaJson: populateIdeaJson,
    ideaTitle: ideaTitle,
    ideaCategory: ideaCategory,
    ideaTags: ideaTags,
    executiveSummaryText: executiveSummaryText,
    pageTitle: pageTitle,
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
router.get("/models/team", requireAuth, async (req, res) => {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  if (req.session.supabaseAccessToken) {
    await supabase.auth.setSession({
      access_token: req.session.supabaseAccessToken,
      refresh_token: req.session.supabaseRefreshToken,
    });
  }

  let populateIdeaJson = null;
  if (req.query.ideaId) {
    const { data: idea, error } = await supabase
      .from("ideas")
      .select("id, title, description, tags, category")
      .eq("id", req.query.ideaId)
      .eq("user_id", req.user.id)
      .single();

    if (idea && !error) {
      // Clean control characters from strings
      let cleanIdea = { ...idea };
      if (cleanIdea.title)
        cleanIdea.title = cleanIdea.title
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.description)
        cleanIdea.description = cleanIdea.description
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.category)
        cleanIdea.category = cleanIdea.category
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.tags && Array.isArray(cleanIdea.tags)) {
        cleanIdea.tags = cleanIdea.tags.map((tag) =>
          tag
            .replace(/[\x00-\x1F\x7F]/g, "")
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"'),
        );
      }

      // Create executive summary from idea data
      let executiveSummary = "";
      if (cleanIdea.title) executiveSummary += `Title: ${cleanIdea.title}\n\n`;
      if (cleanIdea.category)
        executiveSummary += `Category: ${cleanIdea.category}\n\n`;
      if (cleanIdea.description)
        executiveSummary += `Description: ${cleanIdea.description}\n\n`;
      if (cleanIdea.tags && cleanIdea.tags.length > 0) {
        executiveSummary += `Tags: ${cleanIdea.tags.join(", ")}\n\n`;
      }

      // Set the description to the executive summary
      cleanIdea.description = executiveSummary.trim();

      // Escape for HTML and JS
      populateIdeaJson = JSON.stringify(cleanIdea)
        .replace(/'/g, "\\'")
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e");
    }
  }

  // Extract title, category, and tags for the heading
  let ideaTitle = null;
  let ideaCategory = null;
  let ideaTags = null;
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      ideaTitle = ideaData.title;
      ideaCategory = ideaData.category;
      ideaTags =
        ideaData.tags && Array.isArray(ideaData.tags) ? ideaData.tags : null;
    } catch (e) {
      console.error("Error parsing idea data for heading:", e);
    }
  }

  // Create executive summary text for the question block (only description)
  let executiveSummaryText = "";
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      if (ideaData.description) {
        // Extract only the description part (between "Description: " and "Tags: ")
        const descMatch = ideaData.description.match(
          /Description:\s*(.*?)(?:\n\nTags:|$)/s,
        );
        if (descMatch && descMatch[1]) {
          executiveSummaryText = descMatch[1].trim();
        } else {
          // Fallback: if no match, use the whole description
          executiveSummaryText = ideaData.description;
        }
      }
    } catch (e) {
      console.error("Error creating executive summary text:", e);
    }
  }

  // Create dynamic page title with primary color for idea title
  let pageTitle = "Team Model";
  if (ideaTitle) {
    pageTitle = `Team Model of <span class="text-primary">${ideaTitle}</span>`;
  }

  res.render("models/team", {
    title: "Team Model - Accelerator",
    bodyClass: "team-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "team",
    ideaId: req.query.ideaId,
    populateIdeaJson: populateIdeaJson,
    ideaTitle: ideaTitle,
    ideaCategory: ideaCategory,
    ideaTags: ideaTags,
    executiveSummaryText: executiveSummaryText,
    pageTitle: pageTitle,
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
router.get("/models/funding", requireAuth, async (req, res) => {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  if (req.session.supabaseAccessToken) {
    await supabase.auth.setSession({
      access_token: req.session.supabaseAccessToken,
      refresh_token: req.session.supabaseRefreshToken,
    });
  }

  let populateIdeaJson = null;
  if (req.query.ideaId) {
    const { data: idea, error } = await supabase
      .from("ideas")
      .select("id, title, description, tags, category")
      .eq("id", req.query.ideaId)
      .eq("user_id", req.user.id)
      .single();

    if (idea && !error) {
      // Clean control characters from strings
      let cleanIdea = { ...idea };
      if (cleanIdea.title)
        cleanIdea.title = cleanIdea.title
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.description)
        cleanIdea.description = cleanIdea.description
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.category)
        cleanIdea.category = cleanIdea.category
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.tags && Array.isArray(cleanIdea.tags)) {
        cleanIdea.tags = cleanIdea.tags.map((tag) =>
          tag
            .replace(/[\x00-\x1F\x7F]/g, "")
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"'),
        );
      }

      // Create executive summary from idea data
      let executiveSummary = "";
      if (cleanIdea.title) executiveSummary += `Title: ${cleanIdea.title}\n\n`;
      if (cleanIdea.category)
        executiveSummary += `Category: ${cleanIdea.category}\n\n`;
      if (cleanIdea.description)
        executiveSummary += `Description: ${cleanIdea.description}\n\n`;
      if (cleanIdea.tags && cleanIdea.tags.length > 0) {
        executiveSummary += `Tags: ${cleanIdea.tags.join(", ")}\n\n`;
      }

      // Set the description to the executive summary
      cleanIdea.description = executiveSummary.trim();

      // Escape for HTML and JS
      populateIdeaJson = JSON.stringify(cleanIdea)
        .replace(/'/g, "\\'")
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e");
    }
  }

  // Extract title, category, and tags for the heading
  let ideaTitle = null;
  let ideaCategory = null;
  let ideaTags = null;
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      ideaTitle = ideaData.title;
      ideaCategory = ideaData.category;
      ideaTags =
        ideaData.tags && Array.isArray(ideaData.tags) ? ideaData.tags : null;
    } catch (e) {
      console.error("Error parsing idea data for heading:", e);
    }
  }

  // Create executive summary text for the question block (only description)
  let executiveSummaryText = "";
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      if (ideaData.description) {
        // Extract only the description part (between "Description: " and "Tags: ")
        const descMatch = ideaData.description.match(
          /Description:\s*(.*?)(?:\n\nTags:|$)/s,
        );
        if (descMatch && descMatch[1]) {
          executiveSummaryText = descMatch[1].trim();
        } else {
          // Fallback: if no match, use the whole description
          executiveSummaryText = ideaData.description;
        }
      }
    } catch (e) {
      console.error("Error creating executive summary text:", e);
    }
  }

  // Create dynamic page title with primary color for idea title
  let pageTitle = "Funding Model";
  if (ideaTitle) {
    pageTitle = `Funding Model of <span class="text-primary">${ideaTitle}</span>`;
  }

  res.render("models/funding", {
    title: "Funding Model - Accelerator",
    bodyClass: "funding-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "funding",
    ideaId: req.query.ideaId,
    populateIdeaJson: populateIdeaJson,
    ideaTitle: ideaTitle,
    ideaCategory: ideaCategory,
    ideaTags: ideaTags,
    executiveSummaryText: executiveSummaryText,
    pageTitle: pageTitle,
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

// Idea Model page
router.get("/models/idea", requireAuth, async (req, res) => {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  if (req.session.supabaseAccessToken) {
    await supabase.auth.setSession({
      access_token: req.session.supabaseAccessToken,
      refresh_token: req.session.supabaseRefreshToken,
    });
  }

  let populateIdeaJson = null;
  if (req.query.ideaId) {
    const { data: idea, error } = await supabase
      .from("ideas")
      .select("id, title, description, tags, category")
      .eq("id", req.query.ideaId)
      .eq("user_id", req.user.id)
      .single();

    if (idea && !error) {
      // Clean control characters from strings
      let cleanIdea = { ...idea };
      if (cleanIdea.title)
        cleanIdea.title = cleanIdea.title
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.description)
        cleanIdea.description = cleanIdea.description
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.category)
        cleanIdea.category = cleanIdea.category
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');
      if (cleanIdea.tags && Array.isArray(cleanIdea.tags)) {
        cleanIdea.tags = cleanIdea.tags.map((tag) =>
          tag
            .replace(/[\x00-\x1F\x7F]/g, "")
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"'),
        );
      }

      // Create executive summary from idea data
      let executiveSummary = "";
      if (cleanIdea.title) executiveSummary += `Title: ${cleanIdea.title}\n\n`;
      if (cleanIdea.category)
        executiveSummary += `Category: ${cleanIdea.category}\n\n`;
      if (cleanIdea.description)
        executiveSummary += `Description: ${cleanIdea.description}\n\n`;
      if (cleanIdea.tags && cleanIdea.tags.length > 0) {
        executiveSummary += `Tags: ${cleanIdea.tags.join(", ")}\n\n`;
      }

      // Set the description to the executive summary
      cleanIdea.description = executiveSummary.trim();

      // Escape for HTML and JS
      populateIdeaJson = JSON.stringify(cleanIdea)
        .replace(/'/g, "\\'")
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e");
    }
  }

  // Extract title, category, and tags for the heading
  let ideaTitle = null;
  let ideaCategory = null;
  let ideaTags = null;
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      ideaTitle = ideaData.title;
      ideaCategory = ideaData.category;
      ideaTags =
        ideaData.tags && Array.isArray(ideaData.tags) ? ideaData.tags : null;
    } catch (e) {
      console.error("Error parsing idea data for heading:", e);
    }
  }

  // Create executive summary text for display
  let executiveSummaryText = "";
  if (req.query.ideaId && populateIdeaJson !== null) {
    try {
      const ideaData = JSON.parse(
        populateIdeaJson
          .replace(/\\'/g, "'")
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      );
      if (ideaData.description) {
        executiveSummaryText = ideaData.description;
      }
    } catch (e) {
      console.error("Error creating executive summary text:", e);
    }
  }

  // Create dynamic page title with primary color for idea title
  let pageTitle = "Idea Model";
  if (ideaTitle) {
    pageTitle = `Idea Model of <span class="text-primary">${ideaTitle}</span>`;
  }

  const steps = [
    {
      number: 0,
      title: "Executive Summary",
      section: "executive-summary",
    },
    {
      number: 1,
      title: "Problem Validation",
      section: "problem-validation",
    },
    {
      number: 2,
      title: "Solution Development",
      section: "solution-development",
    },
    {
      number: 3,
      title: "Customer Model",
      section: "customer-model",
    },
    {
      number: 4,
      title: "Branding",
      section: "branding",
    },
    {
      number: 5,
      title: "IP Protection",
      section: "ip-protection",
    },
  ];

  res.render("models/idea", {
    title: "Idea Model - Accelerator",
    bodyClass: "idea-model-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeStep: "idea",
    ideaId: req.query.ideaId,
    populateIdeaJson: populateIdeaJson,
    ideaTitle: ideaTitle,
    ideaCategory: ideaCategory,
    ideaTags: ideaTags,
    executiveSummaryText: executiveSummaryText,
    pageTitle: pageTitle,
    steps: steps,
    sections: steps.map((s) => s.section),
    labels: steps.map((s) => `${s.number}. ${s.title}`),
    shortLabels: steps.map((s) => `${s.number}.`),
    positions: steps.map((_, i) => (i / (steps.length - 1)) * 100),
    activeSection: 0,
  });
});

export default router;
