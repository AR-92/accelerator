import express from "express";
import { requireAuth, optionalAuth } from "../../session.js";

const router = express.Router();

// Buy Credits page
router.get("/buy-credits", requireAuth, (req, res) => {
  res.render("payments/buy-credits", {
    title: "Buy Credits - Accelerator",
    bodyClass: "buy-credits-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
  });
});

// Billing page
router.get("/billing", optionalAuth, (req, res) => {
  res.render("payments/billing", {
    title: "Billing - Accelerator",
    bodyClass: "billing-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
  });
});

// Add Payment Method page
router.get("/add-payment-method", requireAuth, (req, res) => {
  res.render("payments/add-payment-method", {
    title: "Add Payment Method - Accelerator",
    bodyClass: "add-payment-method-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
  });
});

// Upgrade Package page
router.get("/upgrade-package", requireAuth, (req, res) => {
  res.render("payments/upgrade-package", {
    title: "Upgrade Package - Accelerator",
    bodyClass: "upgrade-package-page",
    layout: "main",
    user: req.user,
    flash: res.locals.flash,
  });
});

export default router;
