import express from "express";
import { requireAuth } from "../../session.js";

const router = express.Router();

// Dashboard (protected)
router.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard - Accelerator",
    bodyClass: "dashboard-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
  });
});

export default router;
