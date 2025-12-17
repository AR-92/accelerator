import express from "express";
import { requireAuth } from "../../session.js";
import { requirePackage } from "../../middleware/package.js";
import { getUserCredits, deductCredits } from "../../utils/credits.js";

const router = express.Router();

// Business Plan report
router.get(
  "/reports/business-plan",
  requireAuth,
  requirePackage(["student", "enterprise"]),
  async (req, res) => {
    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    if (req.session.supabaseAccessToken) {
      await supabase.auth.setSession({
        access_token: req.session.supabaseAccessToken,
        refresh_token: req.session.supabaseRefreshToken,
      });
    }

    // Get user's ideas that have validation threshold met
    const { data: userIdeas } = await supabase
      .from("ideas")
      .select("id, title, completion_percentage, validation_threshold_met")
      .eq("user_id", req.user.id)
      .eq("validation_threshold_met", true)
      .order("updated_at", { ascending: false });

    // Get user's credit balance
    const { data: profile } = await supabase
      .from("profiles")
      .select("credit_balance")
      .eq("user_id", req.user.id)
      .single();

    res.render("reports/business-plan", {
      title: "Business Plan Generator - Accelerator",
      bodyClass: "business-plan-report-page",
      layout: "main",
      user: req.user,
      flash: res.locals.flash,
      userIdeas: userIdeas || [],
      userCredits: profile?.credit_balance || 0,
    });
  },
);

// Pitch Deck report
router.get(
  "/reports/pitch-deck",
  requireAuth,
  requirePackage(["student", "enterprise"]),
  async (req, res) => {
    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    if (req.session.supabaseAccessToken) {
      await supabase.auth.setSession({
        access_token: req.session.supabaseAccessToken,
        refresh_token: req.session.supabaseRefreshToken,
      });
    }

    // Get user's ideas that have validation threshold met
    const { data: userIdeas } = await supabase
      .from("ideas")
      .select("id, title, completion_percentage, validation_threshold_met")
      .eq("user_id", req.user.id)
      .eq("validation_threshold_met", true)
      .order("updated_at", { ascending: false });

    // Get user's credit balance
    const { data: profile } = await supabase
      .from("profiles")
      .select("credit_balance")
      .eq("user_id", req.user.id)
      .single();

    res.render("reports/pitch-deck", {
      title: "Pitch Deck Generator - Accelerator",
      bodyClass: "pitch-deck-report-page",
      layout: "main",
      user: req.user,
      flash: res.locals.flash,
      userIdeas: userIdeas || [],
      userCredits: profile?.credit_balance || 0,
    });
  },
);

// Valuation report
router.get(
  "/reports/valuation",
  requireAuth,
  requirePackage(["student", "enterprise"]),
  async (req, res) => {
    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    if (req.session.supabaseAccessToken) {
      await supabase.auth.setSession({
        access_token: req.session.supabaseAccessToken,
        refresh_token: req.session.supabaseRefreshToken,
      });
    }

    // Get user's ideas that have validation threshold met
    const { data: userIdeas } = await supabase
      .from("ideas")
      .select("id, title, completion_percentage, validation_threshold_met")
      .eq("user_id", req.user.id)
      .eq("validation_threshold_met", true)
      .order("updated_at", { ascending: false });

    // Get user's credit balance
    const { data: profile } = await supabase
      .from("profiles")
      .select("credit_balance")
      .eq("user_id", req.user.id)
      .single();

    res.render("reports/valuation", {
      title: "Valuation Report Generator - Accelerator",
      bodyClass: "valuation-report-page",
      layout: "main",
      user: req.user,
      flash: res.locals.flash,
      userIdeas: userIdeas || [],
      userCredits: profile?.credit_balance || 0,
    });
  },
);

// Generate Business Plan
router.post(
  "/reports/business-plan",
  requireAuth,
  requirePackage(["student", "enterprise"]),
  async (req, res) => {
    try {
      const { ideaId } = req.body;
      const userId = req.user.id;

      // Check credit balance
      const { balance } = await getUserCredits(userId);
      if (balance < 50) {
        req.session.flash.error.push(
          "Insufficient credits. Report generation costs 50 credits.",
        );
        return res.redirect("/reports/business-plan");
      }

      // Get idea data
      const { createClient } = await import("@supabase/supabase-js");
      const config = (await import("../../config.js")).default;
      const supabase = createClient(config.supabase.url, config.supabase.key);

      const { data: idea, error: ideaError } = await supabase
        .from("ideas")
        .select("*")
        .eq("id", ideaId)
        .eq("user_id", userId)
        .single();

      if (ideaError || !idea) {
        req.session.flash.error.push("Idea not found");
        return res.redirect("/reports/business-plan");
      }

      // Get completed model data
      const { data: modelData } = await supabase
        .from("model_instances")
        .select(
          `
        model_type,
        model_sections (
          section_name,
          section_data
        )
      `,
        )
        .eq("idea_id", ideaId)
        .eq("user_id", userId)
        .eq("status", "completed");

      // Generate report using AI
      const { generateBusinessPlan } = await import(
        "../../services/report-generator.js"
      );
      const reportContent = await generateBusinessPlan(idea, modelData);

      // Deduct credits
      await deductCredits(userId, 50, "report_generation", {
        idea_id: ideaId,
        report_type: "business-plan",
      });

      // Save report
      const { data: report, error: reportError } = await supabase
        .from("reports")
        .insert({
          idea_id: ideaId,
          user_id: userId,
          report_type: "business-plan",
          report_data: { content: reportContent },
        })
        .select()
        .single();

      if (reportError) {
        console.error("Error saving report:", reportError);
        req.session.flash.error.push("Report generated but failed to save");
        return res.redirect("/reports/business-plan");
      }

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: userId,
        action_type: "report_generated",
        entity_type: "report",
        entity_id: report.id,
        details: { report_type: "business-plan", idea_id: ideaId },
      });

      req.session.flash.success.push("Business plan generated successfully!");
      res.redirect(`/reports/view/${report.id}`);
    } catch (error) {
      console.error("Business plan generation error:", error);
      req.session.flash.error.push("Failed to generate business plan");
      res.redirect("/reports/business-plan");
    }
  },
);

// Generate Pitch Deck
router.post(
  "/reports/pitch-deck",
  requireAuth,
  requirePackage(["student", "enterprise"]),
  async (req, res) => {
    try {
      const { ideaId } = req.body;
      const userId = req.user.id;

      // Check credit balance
      const { balance } = await getUserCredits(userId);
      if (balance < 50) {
        req.session.flash.error.push(
          "Insufficient credits. Report generation costs 50 credits.",
        );
        return res.redirect("/reports/pitch-deck");
      }

      // Get idea and model data (similar to business plan)
      const { createClient } = await import("@supabase/supabase-js");
      const config = (await import("../../config.js")).default;
      const supabase = createClient(config.supabase.url, config.supabase.key);

      const { data: idea, error: ideaError } = await supabase
        .from("ideas")
        .select("*")
        .eq("id", ideaId)
        .eq("user_id", userId)
        .single();

      if (ideaError || !idea) {
        req.session.flash.error.push("Idea not found");
        return res.redirect("/reports/pitch-deck");
      }

      const { data: modelData } = await supabase
        .from("model_instances")
        .select(
          `
        model_type,
        model_sections (
          section_name,
          section_data
        )
      `,
        )
        .eq("idea_id", ideaId)
        .eq("user_id", userId)
        .eq("status", "completed");

      // Generate pitch deck
      const { generatePitchDeck } = await import(
        "../../services/report-generator.js"
      );
      const reportContent = await generatePitchDeck(idea, modelData);

      // Deduct credits and save report
      await deductCredits(userId, 50, "report_generation", {
        idea_id: ideaId,
        report_type: "pitch-deck",
      });

      const { data: report } = await supabase
        .from("reports")
        .insert({
          idea_id: ideaId,
          user_id: userId,
          report_type: "pitch-deck",
          report_data: { content: reportContent },
        })
        .select()
        .single();

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: userId,
        action_type: "report_generated",
        entity_type: "report",
        entity_id: report.id,
        details: { report_type: "pitch-deck", idea_id: ideaId },
      });

      req.session.flash.success.push("Pitch deck generated successfully!");
      res.redirect(`/reports/view/${report.id}`);
    } catch (error) {
      console.error("Pitch deck generation error:", error);
      req.session.flash.error.push("Failed to generate pitch deck");
      res.redirect("/reports/pitch-deck");
    }
  },
);

// Generate Valuation Report
router.post(
  "/reports/valuation",
  requireAuth,
  requirePackage(["student", "enterprise"]),
  async (req, res) => {
    try {
      const { ideaId } = req.body;
      const userId = req.user.id;

      // Check credit balance
      const { balance } = await getUserCredits(userId);
      if (balance < 50) {
        req.session.flash.error.push(
          "Insufficient credits. Report generation costs 50 credits.",
        );
        return res.redirect("/reports/valuation");
      }

      // Get idea and model data
      const { createClient } = await import("@supabase/supabase-js");
      const config = (await import("../../config.js")).default;
      const supabase = createClient(config.supabase.url, config.supabase.key);

      const { data: idea, error: ideaError } = await supabase
        .from("ideas")
        .select("*")
        .eq("id", ideaId)
        .eq("user_id", userId)
        .single();

      if (ideaError || !idea) {
        req.session.flash.error.push("Idea not found");
        return res.redirect("/reports/valuation");
      }

      const { data: modelData } = await supabase
        .from("model_instances")
        .select(
          `
        model_type,
        model_sections (
          section_name,
          section_data
        )
      `,
        )
        .eq("idea_id", ideaId)
        .eq("user_id", userId)
        .eq("status", "completed");

      // Generate valuation
      const { generateValuation } = await import(
        "../../services/report-generator.js"
      );
      const reportContent = await generateValuation(idea, modelData);

      // Deduct credits and save report
      await deductCredits(userId, 50, "report_generation", {
        idea_id: ideaId,
        report_type: "valuation",
      });

      const { data: report } = await supabase
        .from("reports")
        .insert({
          idea_id: ideaId,
          user_id: userId,
          report_type: "valuation",
          report_data: { content: reportContent },
        })
        .select()
        .single();

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: userId,
        action_type: "report_generated",
        entity_type: "report",
        entity_id: report.id,
        details: { report_type: "valuation", idea_id: ideaId },
      });

      req.session.flash.success.push(
        "Valuation report generated successfully!",
      );
      res.redirect(`/reports/view/${report.id}`);
    } catch (error) {
      console.error("Valuation generation error:", error);
      req.session.flash.error.push("Failed to generate valuation report");
      res.redirect("/reports/valuation");
    }
  },
);

// View generated report
router.get("/reports/view/:reportId", requireAuth, async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user.id;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    const { data: report, error } = await supabase
      .from("reports")
      .select(
        `
        *,
        ideas (
          title,
          description
        )
      `,
      )
      .eq("id", reportId)
      .eq("user_id", userId)
      .single();

    if (error || !report) {
      req.session.flash.error.push("Report not found");
      return res.redirect("/dashboard");
    }

    res.render("reports/view", {
      title: `${report.report_type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Report - Accelerator`,
      bodyClass: "report-view-page",
      layout: "main",
      user: req.user,
      flash: res.locals.flash,
      report: report,
    });
  } catch (error) {
    console.error("View report error:", error);
    req.session.flash.error.push("Failed to load report");
    res.redirect("/dashboard");
  }
});

export default router;
