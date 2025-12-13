import express from "express";
import { requireAuth } from "../../session.js";

const router = express.Router();

// Business Plan report
router.get("/reports/business-plan", requireAuth, (req, res) => {
  res.render("reports/business-plan", {
    title: "Business Plan Report - Accelerator",
    bodyClass: "business-plan-report-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeReport: "business-plan",
  });
});

// Pitch Deck report
router.get("/reports/pitch-deck", requireAuth, (req, res) => {
  res.render("reports/pitch-deck", {
    title: "Pitch Deck Report - Accelerator",
    bodyClass: "pitch-deck-report-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeReport: "pitch-deck",
  });
});

// Valuation report
router.get("/reports/valuation", requireAuth, (req, res) => {
  res.render("reports/valuation", {
    title: "Valuation Report - Accelerator",
    bodyClass: "valuation-report-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    activeReport: "valuation",
  });
});

export default router;
