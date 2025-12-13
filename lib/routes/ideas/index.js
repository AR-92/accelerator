import express from "express";
import { requireAuth } from "../../session.js";

const router = express.Router();

// Idea Detail page
router.get("/idea-detail", requireAuth, (req, res) => {
  res.render("models/idea", {
    title: "Idea Model - Accelerator",
    bodyClass: "models-idea-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    ideaId: req.query.ideaId,
  });
});

// New Idea page
router.get("/new-idea", requireAuth, async (req, res) => {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  if (req.session.supabaseAccessToken) {
    await supabase.auth.setSession({
      access_token: req.session.supabaseAccessToken,
      refresh_token: req.session.supabaseRefreshToken,
    });
  }

  const { data: projects, error } = await supabase
    .from("ideas")
    .select("id, title")
    .eq("user_id", req.user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects for sidebar:", error);
  }

  let populateIdeaJson = "null";
  if (req.query.populate) {
    const { data: idea, error: populateError } = await supabase
      .from("ideas")
      .select("id, title, description, tags, category")
      .eq("id", req.query.populate)
      .eq("status", "active")
      .single();

    if (populateError) {
      console.error("Error fetching idea for population:", populateError);
    } else {
      let populateIdea = idea;
      // Clean control characters from strings
      if (populateIdea.title)
        populateIdea.title = populateIdea.title.replace(/[\x00-\x1F\x7F]/g, "");
      if (populateIdea.description)
        populateIdea.description = populateIdea.description.replace(
          /[\x00-\x1F\x7F]/g,
          "",
        );
      if (populateIdea.category)
        populateIdea.category = populateIdea.category.replace(
          /[\x00-\x1F\x7F]/g,
          "",
        );
      if (populateIdea.tags && Array.isArray(populateIdea.tags)) {
        populateIdea.tags = populateIdea.tags.map((tag) =>
          tag.replace(/[\x00-\x1F\x7F]/g, ""),
        );
      }
      // Escape for HTML and JS
      populateIdeaJson = JSON.stringify(populateIdea)
        .replace(/'/g, "\\'")
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e");
    }
  }

  const { data: ideas, error: ideasError } = await supabase
    .from("ideas")
    .select(
      "id, title, description, tags, category, rating, is_favorite, status, created_at",
    )
    .eq("user_id", req.user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (ideasError) {
    console.error("Error fetching ideas for new-idea:", ideasError);
  }

  res.render("ideas/new-idea", {
    title: "New Idea - Accelerator",
    bodyClass: "new-idea-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    projects: projects || [],
    populateIdeaJson: populateIdeaJson,
    ideas: ideas || [],
  });
});

// Portfolio page
router.get("/portfolio", requireAuth, async (req, res) => {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  if (req.session.supabaseAccessToken) {
    await supabase.auth.setSession({
      access_token: req.session.supabaseAccessToken,
      refresh_token: req.session.supabaseRefreshToken,
    });
  }

  const { data: ideas, error } = await supabase
    .from("ideas")
    .select(
      "id, title, description, tags, category, rating, is_favorite, status, created_at",
    )
    .eq("user_id", req.user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ideas for portfolio:", error);
  }

  res.render("dashboard/portfolio", {
    title: "Portfolio - Accelerator",
    bodyClass: "portfolio-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    ideas: ideas || [],
  });
});

// Explore Ideas page
router.get("/explore-idea", requireAuth, async (req, res) => {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  if (req.session.supabaseAccessToken) {
    await supabase.auth.setSession({
      access_token: req.session.supabaseAccessToken,
      refresh_token: req.session.supabaseRefreshToken,
    });
  }

  const { data: ideas, error } = await supabase
    .from("ideas")
    .select(
      "id, title, description, tags, category, rating, is_favorite, status, created_at",
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ideas for explore:", error);
  }

  res.render("ideas/explore-idea", {
    title: "Explore Ideas - Accelerator",
    bodyClass: "explore-idea-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    ideas: ideas || [],
  });
});

// Voting Reward page
router.get("/voting-reward", requireAuth, (req, res) => {
  res.render("notifications/voting-reward", {
    title: "Voting & Rewards - Accelerator",
    bodyClass: "voting-reward-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
  });
});

export default router;
