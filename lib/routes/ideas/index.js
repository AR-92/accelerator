import express from "express";
import { requireAuth } from "../../session.js";

const router = express.Router();

// Idea Detail page
router.get("/idea/:id", requireAuth, (req, res) => {
  res.render("idea-detail", {
    title: "Idea Detail - Accelerator",
    bodyClass: "idea-detail-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
    ideaId: req.params.id,
  });
});

// New Idea page
router.get("/new-idea", requireAuth, (req, res) => {
  res.render("new-idea", {
    title: "New Idea - Accelerator",
    bodyClass: "new-idea-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
  });
});

// Portfolio page
router.get("/portfolio", requireAuth, (req, res) => {
  res.render("portfolio", {
    title: "Portfolio - Accelerator",
    bodyClass: "portfolio-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
  });
});

// Explore Ideas page
router.get("/explore-idea", requireAuth, (req, res) => {
  res.render("explore-idea", {
    title: "Explore Ideas - Accelerator",
    bodyClass: "explore-idea-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
  });
});

// Voting Reward page
router.get("/voting-reward", requireAuth, (req, res) => {
  res.render("voting-reward", {
    title: "Voting & Rewards - Accelerator",
    bodyClass: "voting-reward-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
  });
});

export default router;
