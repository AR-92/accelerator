import express from "express";
import { createClient } from "@supabase/supabase-js";
import config from "../config.js";
import { optionalAuth, requireAuth, guestOnly } from "../session.js";

const supabase = createClient(config.supabase.url, config.supabase.key);
const router = express.Router();

// Home page
router.get("/", optionalAuth, (req, res) => {
  res.render("home", {
    title: "Accelerator - Build Your Startup",
    bodyClass: "home-page",
    layout: "langingpage",
    user: req.user,
    flash: res.locals.flash,
  });
});

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

// Login page
router.get("/auth/login", guestOnly, (req, res) => {
  res.render("login", {
    title: "Login - Accelerator",
    bodyClass: "auth-page",
    layout: "auth",
    flash: res.locals.flash,
  });
});

// Login action
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const errorMsg = `Login failed: ${error.message}`.replace(
        /[\x00-\x1F\x7F]/g,
        "",
      );
      req.session.flash.error.push(errorMsg);
      if (req.isHtmx) {
        return res.send(
          `<script>showToast('${errorMsg.replace(/'/g, "\\'")}', 'error');</script>`,
        );
      }
      return res.render("login", {
        title: "Login - Accelerator",
        flash: res.locals.flash,
      });
    }

    // Set session
    req.session.userId = data.user.id;
    req.session.supabaseAccessToken = data.session.access_token;
    req.session.supabaseRefreshToken = data.session.refresh_token;

    req.session.flash.success.push(
      "Login successful! Welcome back to your dashboard.".replace(
        /[\x00-\x1F\x7F]/g,
        "",
      ),
    );

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).send("Session error");
      }
      if (req.isHtmx) {
        return res.send(
          `<script>window.location.href = '/dashboard';</script>`,
        );
      }
      res.redirect("/dashboard");
    });
  } catch (error) {
    const errorMsg = "Login failed. Please try again.".replace(
      /[\x00-\x1F\x7F]/g,
      "",
    );

    req.session.flash.error.push(errorMsg);
    if (req.isHtmx) {
      return res.send(
        `<script>showToast('${errorMsg.replace(/'/g, "\\'")}', 'error');</script>`,
      );
    }
    return res.render("login", {
      title: "Login - Accelerator",
      flash: res.locals.flash,
    });
  }
});

// Signup page
router.get("/auth/signup", guestOnly, (req, res) => {
  res.render("signup", {
    title: "Sign Up - Accelerator",
    bodyClass: "auth-page",
    layout: "auth",
    flash: res.locals.flash,
  });
});

// Signup action
router.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { firstName, lastName } },
    });

    if (error) {
      req.session.flash.error.push(`Signup failed: ${error.message}`);
      if (req.isHtmx) {
        return res.send(
          `<script>showToast('${`Signup failed: ${error.message}`.replace(/[\x00-\x1F\x7F]/g, "").replace(/'/g, "\\'")}', 'error');</script>`,
        );
      }
      return res.render("signup", {
        title: "Sign Up - Accelerator",
        flash: res.locals.flash,
      });
    }

    // Set session
    req.session.userId = data.user.id;
    req.session.supabaseAccessToken = data.session.access_token;
    req.session.supabaseRefreshToken = data.session.refresh_token;

    req.session.flash.success.push(
      "Account created successfully! Welcome to your dashboard.".replace(
        /[\x00-\x1F\x7F]/g,
        "",
      ),
    );

    if (req.isHtmx) {
      return res.send(`<script>window.location.href = '/dashboard';</script>`);
    }

    res.redirect("/dashboard");
  } catch (error) {
    const errorMsg = "Signup failed. Please try again.";
    req.session.flash.error.push(errorMsg);

    if (req.isHtmx) {
      return res.send(`<div class="error">${errorMsg}</div>`);
    }

    res.render("signup", {
      title: "Sign Up - Accelerator",
      flash: res.locals.flash,
    });
  }
});

// Logout
router.post("/auth/logout", async (req, res) => {
  try {
    await supabase.auth.signOut();

    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (req.isHtmx) {
      return res.send(
        `<script>showToast('Logged out successfully', 'success'); setTimeout(() => window.location.href = '/', 1000);</script>`,
      );
    }

    res.redirect("/");
  } catch (error) {
    console.error("Logout error:", error);
    if (req.isHtmx) {
      return res.send(
        `<script>showToast('Logout failed. Please try again.'.replace(/[\x00-\x1F\x7F]/g, ''), 'error');</script>`,
      );
    }
    res.redirect("/");
  }
});

export default router;
