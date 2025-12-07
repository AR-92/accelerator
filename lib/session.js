import session from "express-session";
import { createClient } from "@supabase/supabase-js";
import config from "./config.js";
import MemoryStore from "memorystore";

const supabase = createClient(config.supabase.url, config.supabase.key);

const MemoryStoreSession = MemoryStore(session);

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  store: new MemoryStoreSession({
    checkPeriod: 86400000, // prune expired entries every 24h
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
});

export const requireAuth = async (req, res, next) => {
  if (!req.session.userId) {
    if (req.isHtmx) {
      return res.redirect("/auth/login");
    }
    return res.redirect("/auth/login");
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    req.session.destroy();
    if (req.isHtmx) {
      return res.redirect("/auth/login");
    }
    res.redirect("/auth/login");
  }

  req.user = data.user;
  res.locals.user = req.user;
  next();
};

export const guestOnly = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect("/dashboard");
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  if (req.session.userId) {
    try {
      if (req.session.supabaseAccessToken) {
        await supabase.auth.setSession({
          access_token: req.session.supabaseAccessToken,
          refresh_token: req.session.supabaseRefreshToken,
        });
      }
      const { data } = await supabase.auth.getUser();
      req.user = data.user || null;
    } catch (error) {
      req.user = null;
    }
  }
  res.locals.user = req.user;
  next();
};
