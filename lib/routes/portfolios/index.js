import express from "express";
import { requireAuth } from "../../session.js";

const router = express.Router();

// Portfolio detail view
router.get("/:portfolioId", requireAuth, async (req, res) => {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  if (req.session.supabaseAccessToken) {
    await supabase.auth.setSession({
      access_token: req.session.supabaseAccessToken,
      refresh_token: req.session.supabaseRefreshToken,
    });
  }

  const { portfolioId } = req.params;
  const userId = req.user.id;

  // Check if user has enterprise package
  const { data: profile } = await supabase
    .from("profiles")
    .select("package_type")
    .eq("user_id", userId)
    .single();

  if (profile?.package_type !== "enterprise") {
    req.session.flash.error.push(
      "Portfolio management requires Enterprise package",
    );
    return res.redirect("/dashboard");
  }

  // Get portfolio details
  const { data: portfolio, error: portfolioError } = await supabase
    .from("portfolios")
    .select(`
      *,
      portfolio_ideas (
        idea_id,
        ideas (
          id,
          title,
          description,
          category,
          completion_percentage,
          overall_status,
          rating,
          created_at,
          updated_at
        )
      ),
      portfolio_members (
        user_id,
        role,
        profiles:user_id (
          name,
          avatar_url
        )
      )
    `)
    .eq("id", portfolioId)
    .single();

  if (portfolioError || !portfolio) {
    req.session.flash.error.push("Portfolio not found");
    return res.redirect("/portfolios");
  }

  // Check if user owns this portfolio or is a member
  const isOwner = portfolio.user_id === userId;
  const isMember = portfolio.portfolio_members?.some(member => member.user_id === userId);

  if (!isOwner && !isMember) {
    req.session.flash.error.push("Access denied to this portfolio");
    return res.redirect("/portfolios");
  }

  // Format portfolio data
  const ideas = portfolio.portfolio_ideas?.map(pi => pi.ideas).filter(Boolean) || [];
  const members = portfolio.portfolio_members || [];

  const stats = {
    totalIdeas: ideas.length,
    completedIdeas: ideas.filter(idea => idea.overall_status === "completed").length,
    averageRating: ideas.length > 0
      ? ideas.reduce((sum, idea) => sum + (idea.rating || 0), 0) / ideas.length
      : 0,
    averageCompletion: ideas.length > 0
      ? ideas.reduce((sum, idea) => sum + (idea.completion_percentage || 0), 0) / ideas.length
      : 0,
    totalMembers: members.length,
  };

  res.render("portfolios/detail", {
    title: `${portfolio.name} - Portfolios`,
    bodyClass: "portfolio-detail-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    portfolio: {
      ...portfolio,
      ideas,
      members: members.map(member => ({
        ...member,
        name: member.profiles?.name || "Unknown",
        avatar: member.profiles?.avatar_url,
      })),
      stats,
      isOwner,
      canEdit: isOwner || members.find(m => m.user_id === userId)?.role === "editor",
    },
  });
});

// Add idea to portfolio page
router.get("/:portfolioId/ideas", requireAuth, async (req, res) => {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  if (req.session.supabaseAccessToken) {
    await supabase.auth.setSession({
      access_token: req.session.supabaseAccessToken,
      refresh_token: req.session.supabaseRefreshToken,
    });
  }

  const { portfolioId } = req.params;
  const userId = req.user.id;

  // Check if user has enterprise package
  const { data: profile } = await supabase
    .from("profiles")
    .select("package_type")
    .eq("user_id", userId)
    .single();

  if (profile?.package_type !== "enterprise") {
    req.session.flash.error.push(
      "Portfolio management requires Enterprise package",
    );
    return res.redirect("/dashboard");
  }

  // Get portfolio details
  const { data: portfolio, error: portfolioError } = await supabase
    .from("portfolios")
    .select("*")
    .eq("id", portfolioId)
    .eq("user_id", userId)
    .single();

  if (portfolioError || !portfolio) {
    req.session.flash.error.push("Portfolio not found");
    return res.redirect("/portfolios");
  }

  // Get user's ideas that are not already in this portfolio
  const { data: portfolioIdeas } = await supabase
    .from("portfolio_ideas")
    .select("idea_id")
    .eq("portfolio_id", portfolioId);

  const portfolioIdeaIds = portfolioIdeas?.map(pi => pi.idea_id) || [];

  const { data: availableIdeas } = await supabase
    .from("ideas")
    .select("id, title, category, completion_percentage, overall_status, rating, created_at")
    .eq("user_id", userId)
    .not("id", "in", `(${portfolioIdeaIds.join(",") || "null"})`)
    .order("updated_at", { ascending: false });

  res.render("portfolios/add-ideas", {
    title: `Add Ideas to ${portfolio.name}`,
    bodyClass: "add-ideas-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    portfolio,
    availableIdeas: availableIdeas || [],
  });
});

export default router;
