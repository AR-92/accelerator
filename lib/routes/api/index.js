import express from "express";
import { requireAuth } from "../../session.js";
import * as credits from "../../utils/credits.js";
import * as ai from "../../services/ai.js";

const router = express.Router();

// API-specific auth middleware that returns JSON instead of redirects
const requireApiAuth = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  try {
    // Reuse the logic from requireAuth but return JSON on error
    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    if (req.session.supabaseAccessToken) {
      await supabase.auth.setSession({
        access_token: req.session.supabaseAccessToken,
        refresh_token: req.session.supabaseRefreshToken,
      });
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return res.status(401).json({
        error: "Invalid authentication",
      });
    }

    req.user = data.user;
    res.locals.user = req.user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Authentication failed",
    });
  }
};

// Middleware to check credits and deduct
async function checkAndDeductCredits(req, res, next) {
  try {
    const userId = req.user.id;
    const { hasEnough, currentBalance, error } = await credits.hasEnoughCredits(
      userId,
      10,
    );

    if (error) {
      console.error("Credit check error:", error);
      return res.status(500).json({
        error: "Failed to check credits",
      });
    }

    if (!hasEnough) {
      return res.status(402).json({
        error: "Insufficient credits",
        current_balance: currentBalance,
        required: 10,
      });
    }

    // Deduct credits
    const {
      success: deductSuccess,
      newBalance,
      error: deductError,
    } = await credits.deductCredits(userId, 10);

    if (!deductSuccess) {
      console.error("Credit deduction failed:", deductError);
      return res.status(500).json({
        error: "Failed to deduct credits",
      });
    }

    req.creditsDeducted = true;
    req.newBalance = newBalance;
    console.log(
      `Credits successfully deducted for user. New balance: ${newBalance}`,
    );
    next();
  } catch (error) {
    console.error("Credit middleware error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}

// Get user credit balance
router.get("/credits", requireApiAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { balance, error } = await credits.getUserCredits(userId);

    if (error) {
      console.error("Error fetching credits for navbar:", error);
      return res.status(500).json({
        error: "Failed to fetch credits",
      });
    }

    res.json({
      balance: balance,
    });
  } catch (error) {
    console.error("Credits API error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Generate title with AI
router.post(
  "/ai/suggest-title",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { description } = req.body;

      if (!description || description.trim().length < 10) {
        return res.status(400).json({
          error: "Description is required and must be at least 10 characters",
        });
      }

      const result = await ai.generateTitle(description);

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to generate title",
        });
      }

      res.json({
        title: result.title,
      });
    } catch (error) {
      console.error("suggest-title error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Add category with AI
router.post(
  "/ai/add-category",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { description } = req.body;

      if (!description || description.trim().length < 10) {
        return res.status(400).json({
          error: "Description is required and must be at least 10 characters",
        });
      }

      const result = await ai.generateCategory(description);

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to generate category",
        });
      }

      res.json({
        category: result.category,
      });
    } catch (error) {
      console.error("add-category error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Add tags with AI
router.post(
  "/ai/add-tags",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { description } = req.body;

      if (!description || description.trim().length < 10) {
        return res.status(400).json({
          error: "Description is required and must be at least 10 characters",
        });
      }

      const result = await ai.generateTags(description);

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to generate tags",
        });
      }

      res.json({
        tags: result.tags,
      });
    } catch (error) {
      console.error("add-tags error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Improve description with AI
router.post(
  "/ai/improve",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { description } = req.body;

      if (!description || description.trim().length < 10) {
        return res.status(400).json({
          error: "Description is required and must be at least 10 characters",
        });
      }

      const result = await ai.improveDescription(description);

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to improve description",
        });
      }

      res.json({
        improved_description: result.improved_description,
      });
    } catch (error) {
      console.error("improve error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Auto fill with AI
router.post(
  "/ai/auto-fill",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { description } = req.body;

      if (!description || description.trim().length < 10) {
        return res.status(400).json({
          error: "Description is required and must be at least 10 characters",
        });
      }

      const result = await ai.autoFill(description);

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to auto-fill form",
        });
      }

      res.json({
        title: result.title,
        category: result.category,
        description: result.description,
        tags: result.tags,
      });
    } catch (error) {
      console.error("auto-fill error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Generate random idea
router.post(
  "/ai/random-idea",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const result = await ai.generateRandomIdea();

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to generate random idea",
        });
      }

      res.json({
        title: result.title,
        category: result.category,
        description: result.description,
        tags: result.tags,
      });
    } catch (error) {
      console.error("random-idea error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Explain executive summary
router.post(
  "/ai/explain-executive-summary",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { title, category, description } = req.body;

      if (!title || !category || !description) {
        return res.status(400).json({
          error: "Title, category, and description are required",
        });
      }

      const result = await ai.explainExecutiveSummary(
        title,
        category,
        description,
      );

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to explain executive summary",
        });
      }

      res.json({
        explanation: result.explanation,
      });
    } catch (error) {
      console.error("explain-executive-summary error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Chat about requirements
router.post(
  "/ai/chat",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { messages, context } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
          error: "Messages array is required and must not be empty",
        });
      }

      // Validate message format
      for (const msg of messages) {
        if (
          !msg.role ||
          !msg.content ||
          !["user", "assistant"].includes(msg.role)
        ) {
          return res.status(400).json({
            error:
              "Each message must have role ('user' or 'assistant') and content",
          });
        }
      }

      const result = await ai.chatAboutRequirements(messages, context || "");

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to process chat message",
        });
      }

      res.json({
        response: result.response,
      });
    } catch (error) {
      console.error("chat error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Get user credit balance
router.get("/credits", requireApiAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { balance, error } = await credits.getUserCredits(userId);

    if (error) {
      console.error("Error fetching credits for navbar:", error);
      return res.status(500).json({
        error: "Failed to fetch credits",
      });
    }

    res.json({
      balance: balance,
    });
  } catch (error) {
    console.error("Credits API error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Get idea details
router.get("/ideas/:id", requireApiAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Idea not found",
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Get idea error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;
