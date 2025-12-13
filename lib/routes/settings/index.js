import express from "express";
import { requireAuth, optionalAuth } from "../../session.js";

const router = express.Router();

// Settings page
router.get("/settings", requireAuth, (req, res) => {
  res.render("dashboard/settings", {
    title: "Settings - Accelerator",
    bodyClass: "settings-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
  });
});

// Notification page
router.get("/notification", optionalAuth, (req, res) => {
  res.render("notifications/notification", {
    title: "Notifications - Accelerator",
    bodyClass: "notification-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
  });
});

// User Activity page
router.get("/user-activity", requireAuth, (req, res) => {
  res.render("dashboard/user-activity", {
    title: "User Activity - Accelerator",
    bodyClass: "user-activity-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
  });
});

export default router;
