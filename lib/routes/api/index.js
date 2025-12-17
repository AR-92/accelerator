import express from "express";
import { requireAuth } from "../../session.js";
import { requirePackage } from "../../middleware/package.js";
import * as credits from "../../utils/credits.js";
import * as ai from "../../services/ai.js";

const router = express.Router();

// Function to distribute voting rewards
async function distributeVotingRewards(ideaId, ideaTitle) {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(
    config.supabase.url,
    config.supabase.serviceKey || config.supabase.key,
  );

  try {
    // Get all voters for this idea
    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select("user_id")
      .eq("idea_id", ideaId);

    if (votesError || !votes || votes.length === 0) {
      console.error(
        "Error fetching votes for reward distribution:",
        votesError,
      );
      return;
    }

    // Check if rewards have already been distributed
    const { data: existingRewards } = await supabase
      .from("voting_rewards")
      .select("id")
      .eq("idea_id", ideaId)
      .limit(1);

    if (existingRewards && existingRewards.length > 0) {
      console.log("Rewards already distributed for idea:", ideaId);
      return;
    }

    // Calculate reward per voter (5 credits total, distributed evenly)
    const totalReward = 5;
    const rewardPerVoter = Math.max(1, Math.floor(totalReward / votes.length)); // Minimum 1 credit per voter
    const distributedAt = new Date().toISOString();

    // Distribute rewards and create notifications
    for (const vote of votes) {
      // Add credits to voter
      const { data: voterProfile } = await supabase
        .from("profiles")
        .select("credit_balance, total_earned")
        .eq("user_id", vote.user_id)
        .single();

      if (voterProfile) {
        await supabase
          .from("profiles")
          .update({
            credit_balance: voterProfile.credit_balance + rewardPerVoter,
            total_earned: voterProfile.total_earned + rewardPerVoter,
            last_credit_update: distributedAt,
          })
          .eq("user_id", vote.user_id);
      }

      // Record the reward
      await supabase.from("voting_rewards").insert({
        idea_id: ideaId,
        voter_id: vote.user_id,
        reward_amount: rewardPerVoter,
        distributed_at: distributedAt,
      });

      // Record transaction
      await supabase.from("credit_transactions").insert({
        user_id: vote.user_id,
        transaction_type: "reward_earned",
        amount: rewardPerVoter,
        metadata: {
          idea_id: ideaId,
          idea_title: ideaTitle,
          type: "voting_reward",
        },
      });

      // Create notification for voter
      await supabase.from("notifications").insert({
        user_id: vote.user_id,
        type: "reward_earned",
        message: `🎁 Congratulations! You earned ${rewardPerVoter} credits for voting on the idea "${ideaTitle}" which reached validation threshold.`,
      });

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: vote.user_id,
        action_type: "reward_earned",
        entity_type: "voting_reward",
        entity_id: `${ideaId}_${vote.user_id}`,
        details: { idea_id: ideaId, reward_amount: rewardPerVoter },
      });
    }

    console.log(
      `Distributed ${rewardPerVoter} credits each to ${votes.length} voters for idea ${ideaId}`,
    );
  } catch (error) {
    console.error("Error distributing voting rewards:", error);
  }
}

// Function to unlock next model in sequence
async function unlockNextModel(ideaId, completedModelType) {
  const modelSequence = [
    "idea",
    "business",
    "financial",
    "funding",
    "marketing",
    "team",
    "legal",
  ];
  const currentIndex = modelSequence.indexOf(completedModelType);

  if (currentIndex === -1 || currentIndex === modelSequence.length - 1) {
    // Model not in sequence or it's the last one
    return;
  }

  const nextModel = modelSequence[currentIndex + 1];

  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  try {
    // Get current unlocked models for the idea
    const { data: idea, error: ideaError } = await supabase
      .from("ideas")
      .select("unlocked_models")
      .eq("id", ideaId)
      .single();

    if (ideaError || !idea) {
      console.error("Error fetching idea for model unlocking:", ideaError);
      return;
    }

    // Add next model to unlocked models if not already there
    const currentUnlocked = idea.unlocked_models || [];
    if (!currentUnlocked.includes(nextModel)) {
      const updatedUnlocked = [...currentUnlocked, nextModel];

      await supabase
        .from("ideas")
        .update({ unlocked_models: updatedUnlocked })
        .eq("id", ideaId);

      console.log(`Unlocked ${nextModel} model for idea ${ideaId}`);
    }
  } catch (error) {
    console.error("Error unlocking next model:", error);
  }
}

// Function to update idea completion percentage and status
async function updateIdeaCompletion(ideaId) {
  const { createClient } = await import("@supabase/supabase-js");
  const config = (await import("../../config.js")).default;
  const supabase = createClient(config.supabase.url, config.supabase.key);

  try {
    // Get all completed model instances for this idea
    const { data: completedModels, error: modelsError } = await supabase
      .from("model_instances")
      .select("id")
      .eq("idea_id", ideaId)
      .eq("status", "completed");

    if (modelsError) {
      console.error("Error fetching completed models:", modelsError);
      return;
    }

    let totalSections = 0;
    let completedSections = 0;

    // For each completed model, count sections
    for (const model of completedModels || []) {
      const { data: sections, error: sectionsError } = await supabase
        .from("model_sections")
        .select("is_completed")
        .eq("model_instance_id", model.id);

      if (!sectionsError && sections) {
        totalSections += sections.length;
        completedSections += sections.filter((s) => s.is_completed).length;
      }
    }

    // Calculate completion percentage
    const completionPercentage =
      totalSections > 0
        ? Math.round((completedSections / totalSections) * 100)
        : 0;

    // Determine overall status
    let overallStatus = "draft";
    if (completionPercentage > 0 && completionPercentage < 100) {
      overallStatus = "in_progress";
    } else if (completionPercentage === 100) {
      overallStatus = "completed";
    }

    // Update idea
    await supabase
      .from("ideas")
      .update({
        completion_percentage: completionPercentage,
        overall_status: overallStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", ideaId);
  } catch (error) {
    console.error("Error updating idea completion:", error);
  }
}

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
      package_type: req.user.profile?.package_type,
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

// Generate description with AI (generic)
router.post(
  "/ai/generate",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { question } = req.body;

      if (!question || question.trim().length < 5) {
        return res.status(400).json({
          error: "Question is required and must be at least 5 characters",
        });
      }

      const result = await ai.generateDescription(question);

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to generate description",
        });
      }

      res.json({
        generated_content: result.generated_content,
      });
    } catch (error) {
      console.error("generate error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Generate description with AI (idea model sections)
router.post(
  "/ai/generate/idea/:section",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { section } = req.params;
      const { question } = req.body;

      if (!question || question.trim().length < 5) {
        return res.status(400).json({
          error: "Question is required and must be at least 5 characters",
        });
      }

      const result = await ai.generateDescriptionForSection(
        "idea",
        section,
        "generate",
        question,
      );

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to generate description",
        });
      }

      res.json({
        generated_content: result.generated_content,
      });
    } catch (error) {
      console.error("generate idea section error:", error);
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

// Improve description with AI (idea model sections)
router.post(
  "/ai/improve/idea/:section",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { section } = req.params;
      const { description } = req.body;

      if (!description || description.trim().length < 10) {
        return res.status(400).json({
          error: "Description is required and must be at least 10 characters",
        });
      }

      const result = await ai.improveDescriptionForSection(
        "idea",
        section,
        "improve",
        description,
      );

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to improve description",
        });
      }

      res.json({
        improved_description: result.improved_description,
      });
    } catch (error) {
      console.error("improve idea section error:", error);
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

// Generate description with AI (generic model sections)
router.post(
  "/ai/generate/:model/:section",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { model, section } = req.params;
      const { question } = req.body;

      if (!question || question.trim().length < 5) {
        return res.status(400).json({
          error: "Question is required and must be at least 5 characters",
        });
      }

      const result = await ai.generateDescriptionForSection(
        model,
        section,
        "generate",
        question,
      );

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to generate description",
        });
      }

      res.json({
        generated_content: result.generated_content,
      });
    } catch (error) {
      console.error("generate model section error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Improve description with AI (generic model sections)
router.post(
  "/ai/improve/:model/:section",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { model, section } = req.params;
      const { description } = req.body;

      if (!description || description.trim().length < 10) {
        return res.status(400).json({
          error: "Description is required and must be at least 10 characters",
        });
      }

      const result = await ai.improveDescriptionForSection(
        model,
        section,
        "improve",
        description,
      );

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to improve description",
        });
      }

      res.json({
        improved_description: result.improved_description,
      });
    } catch (error) {
      console.error("improve model section error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Chat about requirements (generic model sections)
router.post(
  "/ai/chat/:model/:section",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { model, section } = req.params;
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
      console.error("chat model section error:", error);
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

// Get user profile
router.get("/profile", requireApiAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Update user profile
router.put("/profile", requireApiAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar_url, role, preferences } = req.body;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (role !== undefined) updateData.role = role;
    if (preferences !== undefined) updateData.preferences = preferences;

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({
        error: "Failed to update profile",
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Vote on an idea
router.post("/votes", requireApiAuth, async (req, res) => {
  try {
    const { idea_id, rating } = req.body;
    const userId = req.user.id;

    if (!idea_id || rating === undefined) {
      return res.status(400).json({
        error: "idea_id and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 1 and 5",
      });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    // Check if idea exists and is public
    const { data: idea, error: ideaError } = await supabase
      .from("ideas")
      .select("id, privacy, user_id")
      .eq("id", idea_id)
      .single();

    if (ideaError || !idea) {
      return res.status(404).json({
        error: "Idea not found",
      });
    }

    if (idea.privacy !== "public") {
      return res.status(403).json({
        error: "Cannot vote on private ideas",
      });
    }

    // Check if user already voted on this idea
    const { data: existingVote, error: voteCheckError } = await supabase
      .from("votes")
      .select("id")
      .eq("idea_id", idea_id)
      .eq("user_id", userId)
      .single();

    if (existingVote) {
      return res.status(409).json({
        error: "You have already voted on this idea",
      });
    }

    // Create the vote
    const { data: vote, error: voteError } = await supabase
      .from("votes")
      .insert({
        idea_id,
        user_id: userId,
        rating,
      })
      .select()
      .single();

    if (voteError) {
      console.error("Error creating vote:", voteError);
      return res.status(500).json({
        error: "Failed to create vote",
      });
    }

    // Update idea rating (calculate average)
    const { data: allVotes, error: votesError } = await supabase
      .from("votes")
      .select("rating")
      .eq("idea_id", idea_id);

    if (votesError) {
      console.error("Error fetching votes for rating calculation:", votesError);
    } else {
      const totalRating = allVotes.reduce((sum, vote) => sum + vote.rating, 0);
      const averageRating =
        allVotes.length > 0 ? totalRating / allVotes.length : 0;

      await supabase
        .from("ideas")
        .update({ rating: averageRating })
        .eq("id", idea_id);
    }

    // Check if idea should be unlocked (rating > 3)
    const wasThresholdMet = idea.validation_threshold_met;
    if (averageRating > 3 && !wasThresholdMet) {
      await supabase
        .from("ideas")
        .update({
          validation_threshold_met: true,
          unlocked_models: ["idea", "business"],
        })
        .eq("id", idea_id);

      // Distribute voting rewards (5 credits total among voters)
      await distributeVotingRewards(idea_id, idea.title);

      // Create notification for idea creator
      if (idea.user_id !== userId) {
        // Don't notify if user voted on their own idea
        await supabase.from("notifications").insert({
          user_id: idea.user_id,
          type: "validation_threshold_reached",
          message: `🎉 Congratulations! Your idea "${idea.title}" has reached the validation threshold with ${averageRating.toFixed(1)} stars. You can now access Business Model features.`,
        });
      }
    }

    // Log activity
    await supabase.from("activity_log").insert({
      user_id: userId,
      action_type: "vote_cast",
      entity_type: "vote",
      entity_id: vote.id,
      details: { idea_id, rating },
    });

    res.json({
      success: true,
      vote: vote,
      message: "Vote submitted successfully",
    });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Get votes for an idea
router.get("/ideas/:ideaId/votes", requireApiAuth, async (req, res) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    // Check if user owns the idea or if it's public
    const { data: idea, error: ideaError } = await supabase
      .from("ideas")
      .select("privacy, user_id")
      .eq("id", ideaId)
      .single();

    if (ideaError || !idea) {
      return res.status(404).json({
        error: "Idea not found",
      });
    }

    if (idea.privacy !== "public" && idea.user_id !== userId) {
      return res.status(403).json({
        error: "Cannot view votes for private ideas",
      });
    }

    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select(
        `
        id,
        rating,
        created_at,
        profiles:user_id (name, avatar_url)
      `,
      )
      .eq("idea_id", ideaId)
      .order("created_at", { ascending: false });

    if (votesError) {
      console.error("Error fetching votes:", votesError);
      return res.status(500).json({
        error: "Failed to fetch votes",
      });
    }

    res.json(votes || []);
  } catch (error) {
    console.error("Get votes error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Create or get model instance
router.post("/models/:modelType", requireApiAuth, async (req, res) => {
  try {
    const { modelType } = req.params;
    const { idea_id } = req.body;
    const userId = req.user.id;

    const validModels = [
      "idea",
      "business",
      "financial",
      "funding",
      "legal",
      "marketing",
      "team",
    ];
    if (!validModels.includes(modelType)) {
      return res.status(400).json({
        error: "Invalid model type",
      });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    // Check if idea exists and user has access
    if (idea_id) {
      const { data: idea, error: ideaError } = await supabase
        .from("ideas")
        .select("id, user_id")
        .eq("id", idea_id)
        .eq("user_id", userId)
        .single();

      if (ideaError || !idea) {
        return res.status(404).json({
          error: "Idea not found or access denied",
        });
      }
    }

    // Check if model instance already exists
    let { data: existingInstance, error: instanceCheckError } = await supabase
      .from("model_instances")
      .select("*")
      .eq("idea_id", idea_id || null)
      .eq("user_id", userId)
      .eq("model_type", modelType)
      .single();

    if (existingInstance) {
      return res.json(existingInstance);
    }

    // Create new model instance
    const { data: newInstance, error: createError } = await supabase
      .from("model_instances")
      .insert({
        idea_id: idea_id || null,
        user_id: userId,
        model_type: modelType,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating model instance:", createError);
      return res.status(500).json({
        error: "Failed to create model instance",
      });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      user_id: userId,
      action_type: "model_created",
      entity_type: "model",
      entity_id: newInstance.id,
      details: { model_type: modelType, idea_id },
    });

    res.json(newInstance);
  } catch (error) {
    console.error("Create model instance error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Save model section data
router.put(
  "/models/:modelId/sections/:sectionName",
  requireApiAuth,
  async (req, res) => {
    try {
      const { modelId, sectionName } = req.params;
      const { section_data, is_completed } = req.body;
      const userId = req.user.id;

      const { createClient } = await import("@supabase/supabase-js");
      const config = (await import("../../config.js")).default;
      const supabase = createClient(config.supabase.url, config.supabase.key);

      // Verify model instance ownership
      const { data: modelInstance, error: modelError } = await supabase
        .from("model_instances")
        .select("*")
        .eq("id", modelId)
        .eq("user_id", userId)
        .single();

      if (modelError || !modelInstance) {
        return res.status(404).json({
          error: "Model instance not found or access denied",
        });
      }

      // Check if section already exists
      let { data: existingSection, error: sectionCheckError } = await supabase
        .from("model_sections")
        .select("*")
        .eq("model_instance_id", modelId)
        .eq("section_name", sectionName)
        .single();

      let sectionResult;
      if (existingSection) {
        // Update existing section
        const { data, error } = await supabase
          .from("model_sections")
          .update({
            section_data: section_data || {},
            is_completed:
              is_completed !== undefined
                ? is_completed
                : existingSection.is_completed,
          })
          .eq("id", existingSection.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating model section:", error);
          return res.status(500).json({
            error: "Failed to update model section",
          });
        }
        sectionResult = data;
      } else {
        // Create new section
        const { data, error } = await supabase
          .from("model_sections")
          .insert({
            model_instance_id: modelId,
            section_name: sectionName,
            section_data: section_data || {},
            is_completed: is_completed || false,
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating model section:", error);
          return res.status(500).json({
            error: "Failed to create model section",
          });
        }
        sectionResult = data;
      }

      // Check if all sections are completed to update model instance status
      const { data: allSections, error: sectionsError } = await supabase
        .from("model_sections")
        .select("is_completed")
        .eq("model_instance_id", modelId);

      if (!sectionsError && allSections) {
        const allCompleted = allSections.every(
          (section) => section.is_completed,
        );
        if (allCompleted && modelInstance.status !== "completed") {
          await supabase
            .from("model_instances")
            .update({ status: "completed" })
            .eq("id", modelId);

          // Unlock next model in sequence
          await unlockNextModel(
            modelInstance.idea_id,
            modelInstance.model_type,
          );

          // Log activity
          await supabase.from("activity_log").insert({
            user_id: userId,
            action_type: "model_completed",
            entity_type: "model",
            entity_id: modelId,
            details: {
              model_type: modelInstance.model_type,
              idea_id: modelInstance.idea_id,
            },
          });
        }
      }

      // Update idea completion percentage and status
      await updateIdeaCompletion(modelInstance.idea_id);

      res.json(sectionResult);
    } catch (error) {
      console.error("Save model section error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Get model section data
router.get(
  "/models/:modelId/sections/:sectionName",
  requireApiAuth,
  async (req, res) => {
    try {
      const { modelId, sectionName } = req.params;
      const userId = req.user.id;

      const { createClient } = await import("@supabase/supabase-js");
      const config = (await import("../../config.js")).default;
      const supabase = createClient(config.supabase.url, config.supabase.key);

      // Verify model instance ownership
      const { data: modelInstance, error: modelError } = await supabase
        .from("model_instances")
        .select("*")
        .eq("id", modelId)
        .eq("user_id", userId)
        .single();

      if (modelError || !modelInstance) {
        return res.status(404).json({
          error: "Model instance not found or access denied",
        });
      }

      // Get section data
      const { data: section, error: sectionError } = await supabase
        .from("model_sections")
        .select("*")
        .eq("model_instance_id", modelId)
        .eq("section_name", sectionName)
        .single();

      if (sectionError && sectionError.code !== "PGRST116") {
        console.error("Error fetching model section:", sectionError);
        return res.status(500).json({
          error: "Failed to fetch model section",
        });
      }

      res.json(
        section || {
          section_data: {},
          is_completed: false,
        },
      );
    } catch (error) {
      console.error("Get model section error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Get all sections for a model instance
router.get("/models/:modelId/sections", requireApiAuth, async (req, res) => {
  try {
    const { modelId } = req.params;
    const userId = req.user.id;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    // Verify model instance ownership
    const { data: modelInstance, error: modelError } = await supabase
      .from("model_instances")
      .select("*")
      .eq("id", modelId)
      .eq("user_id", userId)
      .single();

    if (modelError || !modelInstance) {
      return res.status(404).json({
        error: "Model instance not found or access denied",
      });
    }

    // Get all sections
    const { data: sections, error: sectionsError } = await supabase
      .from("model_sections")
      .select("*")
      .eq("model_instance_id", modelId)
      .order("created_at");

    if (sectionsError) {
      console.error("Error fetching model sections:", sectionsError);
      return res.status(500).json({
        error: "Failed to fetch model sections",
      });
    }

    res.json(sections || []);
  } catch (error) {
    console.error("Get model sections error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Get user settings
router.get("/settings", requireApiAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    const { data: settings, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching settings:", error);
      return res.status(500).json({
        error: "Failed to fetch settings",
      });
    }

    // Convert to object
    const settingsObj = {};
    if (settings) {
      settings.forEach((setting) => {
        settingsObj[setting.key] = setting.value;
      });
    }

    res.json(settingsObj);
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Update user setting
router.put("/settings/:key", requireApiAuth, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const userId = req.user.id;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    const { error } = await supabase.from("user_settings").upsert(
      {
        user_id: userId,
        key,
        value,
      },
      {
        onConflict: "user_id,key",
      },
    );

    if (error) {
      console.error("Error updating setting:", error);
      return res.status(500).json({
        error: "Failed to update setting",
      });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      user_id: userId,
      action_type: "setting_updated",
      entity_type: "setting",
      entity_id: `${userId}_${key}`,
      details: { key },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Update setting error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Upload avatar
router.post("/upload/avatar", requireApiAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if file was uploaded
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({
        error: "No avatar file uploaded",
      });
    }

    const avatarFile = req.files.avatar;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Validate file type
    if (!allowedTypes.includes(avatarFile.mimetype)) {
      return res.status(400).json({
        error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
      });
    }

    // Validate file size
    if (avatarFile.size > maxSize) {
      return res.status(400).json({
        error: "File too large. Maximum size is 5MB.",
      });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(
      config.supabase.url,
      config.supabase.serviceKey || config.supabase.key,
    );

    // Generate unique filename
    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `avatar_${userId}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("user-uploads")
      .upload(filePath, avatarFile.data, {
        contentType: avatarFile.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error("Avatar upload error:", uploadError);
      return res.status(500).json({
        error: "Failed to upload avatar",
      });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("user-uploads")
      .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    // Update user profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Profile update error:", updateError);
      // Try to clean up uploaded file
      await supabase.storage.from("user-uploads").remove([filePath]);
      return res.status(500).json({
        error: "Failed to update profile",
      });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      user_id: userId,
      action_type: "avatar_uploaded",
      entity_type: "profile",
      entity_id: userId,
      details: { avatar_url: avatarUrl },
    });

    res.json({
      success: true,
      avatar_url: avatarUrl,
      message: "Avatar uploaded successfully",
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Get user notifications
router.get("/notifications", requireApiAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0, type } = req.query;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    // Set auth session for RLS
    if (req.session.supabaseAccessToken) {
      await supabase.auth.setSession({
        access_token: req.session.supabaseAccessToken,
        refresh_token: req.session.supabaseRefreshToken,
      });
    }

    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId);

    if (type) {
      query = query.eq("type", type);
    }

    const { data: notifications, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({
        error: "Failed to fetch notifications",
      });
    }

    // Check if HTMX request (return HTML)
    if (req.headers["hx-request"]) {
      let html = "";
      if (!notifications || notifications.length === 0) {
        html = `
          <div class="text-center py-8">
            <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="lucide lucide-bell text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-muted-foreground mb-2">No Notifications Yet</h3>
            <p class="text-sm text-muted-foreground">You'll receive notifications when you earn rewards or when ideas you voted on succeed!</p>
          </div>
        `;
      } else {
        notifications.forEach((notification) => {
          const isRead = notification.is_read;
          html += `
            <div class="flex items-start gap-3 p-3 rounded-lg ${!isRead ? "bg-primary/5 border border-primary/20" : "bg-muted/30"}">
              <div class="p-1.5 ${!isRead ? "bg-primary/10" : "bg-warning/10"} rounded-lg mt-0.5">
                <svg class="lucide lucide-bell ${!isRead ? "text-primary" : "text-warning"}" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm text-foreground">${notification.message}</p>
                <p class="text-xs text-muted-foreground mt-1">${getTimeAgo(notification.created_at)}</p>
              </div>
              ${!isRead ? '<div class="w-2 h-2 bg-primary rounded-full mt-2"></div>' : ""}
            </div>
          `;
        });
      }

      res.send(html);
    } else {
      res.json(notifications || []);
    }
  } catch (error) {
    console.error("Get notifications error:", error);
    if (req.headers["hx-request"]) {
      res
        .status(500)
        .send(
          '<div class="text-center py-4 text-red-600">Failed to load notifications</div>',
        );
    } else {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
});

// Helper function for time ago
function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

// Mark notification as read
router.put(
  "/notifications/:notificationId/read",
  requireApiAuth,
  async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      const { createClient } = await import("@supabase/supabase-js");
      const config = (await import("../../config.js")).default;
      const supabase = createClient(
        config.supabase.url,
        config.supabase.serviceKey || config.supabase.key,
      );

      // Set auth session for RLS
      if (req.session.supabaseAccessToken) {
        await supabase.auth.setSession({
          access_token: req.session.supabaseAccessToken,
          refresh_token: req.session.supabaseRefreshToken,
        });
      }

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating notification:", error);
        return res.status(500).json({
          error: "Failed to update notification",
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Mark notification read error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Mark all notifications as read
router.put("/notifications/read-all", requireApiAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(
      config.supabase.url,
      config.supabase.serviceKey || config.supabase.key,
    );

    // Set auth session for RLS
    if (req.session.supabaseAccessToken) {
      await supabase.auth.setSession({
        access_token: req.session.supabaseAccessToken,
        refresh_token: req.session.supabaseRefreshToken,
      });
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      console.error("Error updating notifications:", error);
      return res.status(500).json({
        error: "Failed to update notifications",
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Get unread notification count
router.get("/notifications/unread-count", requireApiAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    // Set auth session for RLS
    if (req.session.supabaseAccessToken) {
      await supabase.auth.setSession({
        access_token: req.session.supabaseAccessToken,
        refresh_token: req.session.supabaseRefreshToken,
      });
    }

    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      console.error("Error counting notifications:", error);
      return res.status(500).json({
        error: "Failed to count notifications",
      });
    }

    res.json({ unreadCount: count || 0 });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// AI Chat for model sections
router.post(
  "/ai/chat",
  requireApiAuth,
  checkAndDeductCredits,
  async (req, res) => {
    try {
      const { message, context, conversation } = req.body;

      if (!message || !context) {
        return res.status(400).json({
          error: "Message and context are required",
        });
      }

      // Build conversation context
      const messages = [
        {
          role: "system",
          content: `You are an expert business consultant helping with "${context.question}" in the "${context.section}" section.

You are having a temporary, single-question conversation about this specific section. Keep your response focused, helpful, and professional. Do not reference persistent chat history or previous conversations.

Guidelines:
- Provide specific, actionable advice
- Use business terminology appropriately
- Keep responses concise but comprehensive
- Focus on the user's question about this section
- Offer examples when helpful`,
        },
      ];

      // Add conversation history if provided
      if (conversation && Array.isArray(conversation)) {
        messages.push(...conversation.slice(-4)); // Keep last 4 messages for context
      }

      // Add current user message
      messages.push({
        role: "user",
        content: message,
      });

      const result = await callOpenRouter(
        messages[messages.length - 1].content,
        messages[0].content,
        1000, // Shorter responses for chat
        0.7,
      );

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to get AI response",
        });
      }

      res.json({
        response: result.content,
        credits_deducted: 10,
      });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Get team members for an idea
router.get("/ideas/:ideaId/team", requireApiAuth, async (req, res) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    // Check if user has access to the idea
    const { data: idea, error: ideaError } = await supabase
      .from("ideas")
      .select("id, user_id")
      .eq("id", ideaId)
      .single();

    if (ideaError || !idea) {
      return res.status(404).json({
        error: "Idea not found",
      });
    }

    // Only idea owner or team members can view team
    const { data: teamMembers, error: teamError } = await supabase
      .from("team_members")
      .select("*")
      .eq("idea_id", ideaId);

    if (teamError) {
      console.error("Error fetching team members:", teamError);
      return res.status(500).json({
        error: "Failed to fetch team members",
      });
    }

    // Check if current user is owner or team member
    const isOwner = idea.user_id === userId;
    const isTeamMember =
      teamMembers?.some((member) => member.user_id === userId) || false;

    if (!isOwner && !isTeamMember) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    res.json(teamMembers || []);
  } catch (error) {
    console.error("Get team members error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Add team member to an idea (Enterprise only)
router.post(
  "/ideas/:ideaId/team",
  requireApiAuth,
  requirePackage(["enterprise"]),
  async (req, res) => {
    try {
      const { ideaId } = req.params;
      const { name, email, role } = req.body;
      const userId = req.user.id;

      if (!name || !email || !role) {
        return res.status(400).json({
          error: "Name, email, and role are required",
        });
      }

      const { createClient } = await import("@supabase/supabase-js");
      const config = (await import("../../config.js")).default;
      const supabase = createClient(
        config.supabase.url,
        config.supabase.serviceKey || config.supabase.key,
      );

      // Check if user owns the idea
      const { data: idea, error: ideaError } = await supabase
        .from("ideas")
        .select("id, user_id")
        .eq("id", ideaId)
        .eq("user_id", userId)
        .single();

      if (ideaError || !idea) {
        return res.status(404).json({
          error: "Idea not found or access denied",
        });
      }

      // Add team member
      const { data: teamMember, error: teamError } = await supabase
        .from("team_members")
        .insert({
          user_id: userId, // The idea owner
          idea_id: ideaId,
          name,
          email,
          role,
        })
        .select()
        .single();

      if (teamError) {
        console.error("Error adding team member:", teamError);
        return res.status(500).json({
          error: "Failed to add team member",
        });
      }

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: userId,
        action_type: "team_member_added",
        entity_type: "team_member",
        entity_id: teamMember.id,
        details: { idea_id: ideaId, team_member_name: name, role },
      });

      res.json(teamMember);
    } catch (error) {
      console.error("Add team member error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Remove team member from an idea
router.delete(
  "/ideas/:ideaId/team/:memberId",
  requireApiAuth,
  requirePackage(["enterprise"]),
  async (req, res) => {
    try {
      const { ideaId, memberId } = req.params;
      const userId = req.user.id;

      const { createClient } = await import("@supabase/supabase-js");
      const config = (await import("../../config.js")).default;
      const supabase = createClient(
        config.supabase.url,
        config.supabase.serviceKey || config.supabase.key,
      );

      // Check if user owns the idea
      const { data: idea, error: ideaError } = await supabase
        .from("ideas")
        .select("id, user_id")
        .eq("id", ideaId)
        .eq("user_id", userId)
        .single();

      if (ideaError || !idea) {
        return res.status(403).json({
          error: "Access denied",
        });
      }

      // Remove team member
      const { error: deleteError } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId)
        .eq("idea_id", ideaId)
        .eq("user_id", userId);

      if (deleteError) {
        console.error("Error removing team member:", deleteError);
        return res.status(500).json({
          error: "Failed to remove team member",
        });
      }

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: userId,
        action_type: "team_member_removed",
        entity_type: "team_member",
        entity_id: memberId,
        details: { idea_id: ideaId },
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Remove team member error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Portfolio management for Enterprise users
router.get(
  "/portfolios",
  requireApiAuth,
  requirePackage(["enterprise"]),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const { createClient } = await import("@supabase/supabase-js");
      const config = (await import("../../config.js")).default;
      const supabase = createClient(config.supabase.url, config.supabase.key);

      // Get user's profile with portfolio data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("user_id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return res.status(500).json({
          error: "Failed to fetch portfolios",
        });
      }

      const portfolios = profile?.preferences?.portfolios || [];

      // Get ideas for each portfolio
      const portfoliosWithIdeas = await Promise.all(
        portfolios.map(async (portfolio) => {
          const { data: ideas, error: ideasError } = await supabase
            .from("ideas")
            .select("id, title, completion_percentage, overall_status, rating")
            .eq("user_id", userId)
            .in("id", portfolio.idea_ids || []);

          if (ideasError) {
            console.error("Error fetching portfolio ideas:", ideasError);
            return { ...portfolio, ideas: [] };
          }

          // Calculate portfolio stats
          const stats = {
            totalIdeas: ideas?.length || 0,
            completedIdeas:
              ideas?.filter((i) => i.overall_status === "completed").length ||
              0,
            averageRating:
              ideas?.length > 0
                ? ideas.reduce((sum, i) => sum + (i.rating || 0), 0) /
                  ideas.length
                : 0,
            totalCompletion:
              ideas?.length > 0
                ? ideas.reduce(
                    (sum, i) => sum + (i.completion_percentage || 0),
                    0,
                  ) / ideas.length
                : 0,
          };

          return {
            ...portfolio,
            ideas: ideas || [],
            stats,
          };
        }),
      );

      res.json(portfoliosWithIdeas);
    } catch (error) {
      console.error("Get portfolios error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Create new portfolio
router.post(
  "/portfolios",
  requireApiAuth,
  requirePackage(["enterprise"]),
  async (req, res) => {
    try {
      const { name, description, idea_ids } = req.body;
      const userId = req.user.id;

      if (!name) {
        return res.status(400).json({
          error: "Portfolio name is required",
        });
      }

      const { createClient } = await import("@supabase/supabase-js");
      const config = (await import("../../config.js")).default;
      const supabase = createClient(
        config.supabase.url,
        config.supabase.serviceKey || config.supabase.key,
      );

      // Get current profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("user_id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return res.status(500).json({
          error: "Failed to create portfolio",
        });
      }

      const portfolios = profile?.preferences?.portfolios || [];
      const newPortfolio = {
        id: `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        description: description || "",
        idea_ids: idea_ids || [],
        created_at: new Date().toISOString(),
      };

      portfolios.push(newPortfolio);

      // Update profile with new portfolios
      await supabase
        .from("profiles")
        .update({
          preferences: {
            ...profile.preferences,
            portfolios,
          },
        })
        .eq("user_id", userId);

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: userId,
        action_type: "portfolio_created",
        entity_type: "portfolio",
        entity_id: newPortfolio.id,
        details: { portfolio_name: name },
      });

      res.json(newPortfolio);
    } catch (error) {
      console.error("Create portfolio error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Update portfolio
router.put(
  "/portfolios/:portfolioId",
  requireApiAuth,
  requirePackage(["enterprise"]),
  async (req, res) => {
    try {
      const { portfolioId } = req.params;
      const { name, description, idea_ids } = req.body;
      const userId = req.user.id;

      const { createClient } = await import("@supabase/supabase-js");
      const config = (await import("../../config.js")).default;
      const supabase = createClient(
        config.supabase.url,
        config.supabase.serviceKey || config.supabase.key,
      );

      // Get current profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("user_id", userId)
        .single();

      if (profileError) {
        return res.status(500).json({
          error: "Failed to update portfolio",
        });
      }

      const portfolios = profile?.preferences?.portfolios || [];
      const portfolioIndex = portfolios.findIndex((p) => p.id === portfolioId);

      if (portfolioIndex === -1) {
        return res.status(404).json({
          error: "Portfolio not found",
        });
      }

      // Update portfolio
      portfolios[portfolioIndex] = {
        ...portfolios[portfolioIndex],
        name: name || portfolios[portfolioIndex].name,
        description:
          description !== undefined
            ? description
            : portfolios[portfolioIndex].description,
        idea_ids: idea_ids || portfolios[portfolioIndex].idea_ids,
      };

      // Update profile
      await supabase
        .from("profiles")
        .update({
          preferences: {
            ...profile.preferences,
            portfolios,
          },
        })
        .eq("user_id", userId);

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: userId,
        action_type: "portfolio_updated",
        entity_type: "portfolio",
        entity_id: portfolioId,
        details: { portfolio_name: name },
      });

      res.json(portfolios[portfolioIndex]);
    } catch (error) {
      console.error("Update portfolio error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Delete portfolio
router.delete(
  "/portfolios/:portfolioId",
  requireApiAuth,
  requirePackage(["enterprise"]),
  async (req, res) => {
    try {
      const { portfolioId } = req.params;
      const userId = req.user.id;

      const { createClient } = await import("@supabase/supabase-js");
      const config = (await import("../../config.js")).default;
      const supabase = createClient(
        config.supabase.url,
        config.supabase.serviceKey || config.supabase.key,
      );

      // Get current profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("user_id", userId)
        .single();

      if (profileError) {
        return res.status(500).json({
          error: "Failed to delete portfolio",
        });
      }

      const portfolios = profile?.preferences?.portfolios || [];
      const filteredPortfolios = portfolios.filter((p) => p.id !== portfolioId);

      // Update profile
      await supabase
        .from("profiles")
        .update({
          preferences: {
            ...profile.preferences,
            portfolios: filteredPortfolios,
          },
        })
        .eq("user_id", userId);

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: userId,
        action_type: "portfolio_deleted",
        entity_type: "portfolio",
        entity_id: portfolioId,
        details: {},
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Delete portfolio error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Generate private share link for idea
router.post("/ideas/:ideaId/share", requireApiAuth, async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { expires_in_days } = req.body; // Optional expiration
    const userId = req.user.id;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    // Check if user owns the idea
    const { data: idea, error: ideaError } = await supabase
      .from("ideas")
      .select("id, title, privacy")
      .eq("id", ideaId)
      .eq("user_id", userId)
      .single();

    if (ideaError || !idea) {
      return res.status(404).json({
        error: "Idea not found",
      });
    }

    // Generate unique share token
    const shareToken = `share_${ideaId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = expires_in_days
      ? new Date(
          Date.now() + expires_in_days * 24 * 60 * 60 * 1000,
        ).toISOString()
      : null;

    // Store share token in idea's metadata (using JSONB field)
    const { data: currentIdea } = await supabase
      .from("ideas")
      .select("tags")
      .eq("id", ideaId)
      .single();

    const shareData = {
      token: shareToken,
      created_by: userId,
      created_at: new Date().toISOString(),
      expires_at: expiresAt,
      is_active: true,
    };

    // Store share data in tags JSONB field (we'll use a special tag)
    const updatedTags = [
      ...(currentIdea?.tags || []),
      `share:${JSON.stringify(shareData)}`,
    ];

    await supabase.from("ideas").update({ tags: updatedTags }).eq("id", ideaId);

    // Generate shareable URL
    const shareUrl = `${config.baseUrl || "http://localhost:4000"}/shared-idea/${shareToken}`;

    // Log activity
    await supabase.from("activity_log").insert({
      user_id: userId,
      action_type: "idea_shared",
      entity_type: "idea",
      entity_id: ideaId,
      details: { share_token: shareToken, expires_at: expiresAt },
    });

    res.json({
      share_url: shareUrl,
      share_token: shareToken,
      expires_at: expiresAt,
    });
  } catch (error) {
    console.error("Generate share link error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Access shared idea (public endpoint)
router.get("/shared-idea/:shareToken", async (req, res) => {
  try {
    const { shareToken } = req.params;

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    // Find idea with this share token
    const { data: ideas, error: ideasError } = await supabase
      .from("ideas")
      .select("*");

    if (ideasError) {
      return res.status(500).json({
        error: "Failed to find shared idea",
      });
    }

    let sharedIdea = null;
    for (const idea of ideas || []) {
      const shareTags =
        idea.tags?.filter((tag) => tag.startsWith("share:")) || [];
      for (const shareTag of shareTags) {
        try {
          const shareData = JSON.parse(shareTag.substring(6)); // Remove 'share:' prefix
          if (shareData.token === shareToken && shareData.is_active) {
            // Check if expired
            if (
              shareData.expires_at &&
              new Date() > new Date(shareData.expires_at)
            ) {
              shareData.is_active = false;
              // Update the share data to mark as inactive
              continue;
            }
            sharedIdea = { ...idea, shareData };
            break;
          }
        } catch (e) {
          // Invalid share data, skip
          continue;
        }
      }
      if (sharedIdea) break;
    }

    if (!sharedIdea) {
      return res.status(404).json({
        error: "Invalid or expired share link",
      });
    }

    // Get existing votes for this shared idea
    const { data: votes } = await supabase
      .from("votes")
      .select("rating")
      .eq("idea_id", sharedIdea.id);

    // Calculate current rating
    let currentRating = 0;
    if (votes && votes.length > 0) {
      currentRating =
        votes.reduce((sum, vote) => sum + vote.rating, 0) / votes.length;
    }

    res.render("ideas/shared-idea", {
      title: `Vote on: ${sharedIdea.title}`,
      bodyClass: "shared-idea-page",
      layout: "main",
      idea: {
        ...sharedIdea,
        rating: currentRating,
        voteCount: votes?.length || 0,
      },
      shareToken: shareToken,
    });
  } catch (error) {
    console.error("Access shared idea error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Vote on shared idea
router.post("/shared-idea/:shareToken/vote", async (req, res) => {
  try {
    const { shareToken } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 1 and 5",
      });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const config = (await import("../../config.js")).default;
    const supabase = createClient(config.supabase.url, config.supabase.key);

    // Find the shared idea
    const { data: ideas, error: ideasError } = await supabase
      .from("ideas")
      .select("*");

    if (ideasError) {
      return res.status(500).json({
        error: "Failed to find shared idea",
      });
    }

    let sharedIdea = null;
    let shareData = null;
    for (const idea of ideas || []) {
      const shareTags =
        idea.tags?.filter((tag) => tag.startsWith("share:")) || [];
      for (const shareTag of shareTags) {
        try {
          const parsedShareData = JSON.parse(shareTag.substring(6));
          if (
            parsedShareData.token === shareToken &&
            parsedShareData.is_active
          ) {
            if (
              parsedShareData.expires_at &&
              new Date() > new Date(parsedShareData.expires_at)
            ) {
              parsedShareData.is_active = false;
              continue;
            }
            sharedIdea = idea;
            shareData = parsedShareData;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      if (sharedIdea) break;
    }

    if (!sharedIdea) {
      return res.status(404).json({
        error: "Invalid or expired share link",
      });
    }

    // Check if user has already voted (we'll use IP/session based limiting for anonymous votes)
    // For now, allow multiple votes since it's shared

    // Create the vote
    const { data: vote, error: voteError } = await supabase
      .from("votes")
      .insert({
        idea_id: sharedIdea.id,
        user_id: null, // Anonymous vote for shared ideas
        rating: rating,
      })
      .select()
      .single();

    if (voteError) {
      console.error("Error creating vote on shared idea:", voteError);
      return res.status(500).json({
        error: "Failed to submit vote",
      });
    }

    // Update idea rating
    const { data: allVotes } = await supabase
      .from("votes")
      .select("rating")
      .eq("idea_id", sharedIdea.id);

    const totalRating =
      allVotes?.reduce((sum, vote) => sum + vote.rating, 0) || 0;
    const averageRating =
      allVotes?.length > 0 ? totalRating / allVotes.length : 0;

    await supabase
      .from("ideas")
      .update({ rating: averageRating })
      .eq("id", sharedIdea.id);

    // Log activity
    await supabase.from("activity_log").insert({
      user_id: shareData.created_by, // Log under the idea owner's account
      action_type: "shared_idea_voted",
      entity_type: "vote",
      entity_id: vote.id,
      details: { share_token: shareToken, rating, idea_id: sharedIdea.id },
    });

    res.json({
      success: true,
      message: "Vote submitted successfully!",
      newRating: averageRating.toFixed(1),
      voteCount: allVotes?.length || 0,
    });
  } catch (error) {
    console.error("Vote on shared idea error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Portfolio management endpoints (Enterprise only)

// Get user's portfolios
router.get("/portfolios", requireApiAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user has enterprise package
    const { data: profile } = await supabase
      .from("profiles")
      .select("package_type")
      .eq("user_id", userId)
      .single();

    if (profile?.package_type !== "enterprise") {
      return res.status(403).json({
        error: "Portfolio management requires Enterprise package",
      });
    }

    const { data: portfolios, error } = await supabase
      .from("portfolios")
      .select(
        `
        *,
        portfolio_ideas (
          idea_id,
          ideas (
            id,
            title,
            completion_percentage,
            overall_status,
            rating,
            category,
            created_at
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
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching portfolios:", error);
      return res.status(500).json({
        error: "Failed to fetch portfolios",
      });
    }

    // Calculate aggregated stats for each portfolio
    const portfoliosWithStats = portfolios?.map((portfolio) => {
      const ideas =
        portfolio.portfolio_ideas?.map((pi) => pi.ideas).filter(Boolean) || [];
      const members = portfolio.portfolio_members || [];

      const stats = {
        totalIdeas: ideas.length,
        completedIdeas: ideas.filter(
          (idea) => idea.overall_status === "completed",
        ).length,
        averageRating:
          ideas.length > 0
            ? ideas.reduce((sum, idea) => sum + (idea.rating || 0), 0) /
              ideas.length
            : 0,
        averageCompletion:
          ideas.length > 0
            ? ideas.reduce(
                (sum, idea) => sum + (idea.completion_percentage || 0),
                0,
              ) / ideas.length
            : 0,
        totalMembers: members.length,
      };

      return {
        ...portfolio,
        stats,
        ideas,
        members,
        portfolio_ideas: undefined, // Remove nested data
        portfolio_members: undefined,
      };
    });

    res.json(portfoliosWithStats || []);
  } catch (error) {
    console.error("Get portfolios error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Create new portfolio
router.post("/portfolios", requireApiAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, color, is_default } = req.body;

    // Check if user has enterprise package
    const { data: profile } = await supabase
      .from("profiles")
      .select("package_type")
      .eq("user_id", userId)
      .single();

    if (profile?.package_type !== "enterprise") {
      return res.status(403).json({
        error: "Portfolio management requires Enterprise package",
      });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: "Portfolio name is required",
      });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await supabase
        .from("portfolios")
        .update({ is_default: false })
        .eq("user_id", userId);
    }

    const { data: portfolio, error } = await supabase
      .from("portfolios")
      .insert({
        user_id: userId,
        name: name.trim(),
        description: description?.trim(),
        color: color || "#3B82F6",
        is_default: is_default || false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating portfolio:", error);
      return res.status(500).json({
        error: "Failed to create portfolio",
      });
    }

    // Add creator as owner
    await supabase.from("portfolio_members").insert({
      portfolio_id: portfolio.id,
      user_id: userId,
      role: "owner",
      invited_by: userId,
    });

    // Log activity
    await supabase.from("activity_log").insert({
      user_id: userId,
      action_type: "portfolio_created",
      entity_type: "portfolio",
      entity_id: portfolio.id,
      details: { name: portfolio.name },
    });

    res.json({
      success: true,
      portfolio: {
        ...portfolio,
        stats: {
          totalIdeas: 0,
          completedIdeas: 0,
          averageRating: 0,
          averageCompletion: 0,
          totalMembers: 1,
        },
      },
    });
  } catch (error) {
    console.error("Create portfolio error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Update portfolio
router.put("/portfolios/:portfolioId", requireApiAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { portfolioId } = req.params;
    const { name, description, color, is_default } = req.body;

    // Verify ownership
    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .select("*")
      .eq("id", portfolioId)
      .eq("user_id", userId)
      .single();

    if (portfolioError || !portfolio) {
      return res.status(404).json({
        error: "Portfolio not found or access denied",
      });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await supabase
        .from("portfolios")
        .update({ is_default: false })
        .eq("user_id", userId);
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (color !== undefined) updateData.color = color;
    if (is_default !== undefined) updateData.is_default = is_default;
    updateData.updated_at = new Date().toISOString();

    const { data: updatedPortfolio, error } = await supabase
      .from("portfolios")
      .update(updateData)
      .eq("id", portfolioId)
      .select()
      .single();

    if (error) {
      console.error("Error updating portfolio:", error);
      return res.status(500).json({
        error: "Failed to update portfolio",
      });
    }

    res.json({
      success: true,
      portfolio: updatedPortfolio,
    });
  } catch (error) {
    console.error("Update portfolio error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Delete portfolio
router.delete("/portfolios/:portfolioId", requireApiAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { portfolioId } = req.params;

    // Verify ownership
    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .select("*")
      .eq("id", portfolioId)
      .eq("user_id", userId)
      .single();

    if (portfolioError || !portfolio) {
      return res.status(404).json({
        error: "Portfolio not found or access denied",
      });
    }

    // Delete portfolio (cascade will handle related records)
    const { error } = await supabase
      .from("portfolios")
      .delete()
      .eq("id", portfolioId);

    if (error) {
      console.error("Error deleting portfolio:", error);
      return res.status(500).json({
        error: "Failed to delete portfolio",
      });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      user_id: userId,
      action_type: "portfolio_deleted",
      entity_type: "portfolio",
      entity_id: portfolioId,
      details: { name: portfolio.name },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Delete portfolio error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Add idea to portfolio
router.post(
  "/portfolios/:portfolioId/ideas/:ideaId",
  requireApiAuth,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { portfolioId, ideaId } = req.params;

      // Verify portfolio ownership
      const { data: portfolio, error: portfolioError } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", portfolioId)
        .eq("user_id", userId)
        .single();

      if (portfolioError || !portfolio) {
        return res.status(404).json({
          error: "Portfolio not found or access denied",
        });
      }

      // Verify idea ownership
      const { data: idea, error: ideaError } = await supabase
        .from("ideas")
        .select("title")
        .eq("id", ideaId)
        .eq("user_id", userId)
        .single();

      if (ideaError || !idea) {
        return res.status(404).json({
          error: "Idea not found or access denied",
        });
      }

      // Check if already in portfolio
      const { data: existing } = await supabase
        .from("portfolio_ideas")
        .select("id")
        .eq("portfolio_id", portfolioId)
        .eq("idea_id", ideaId)
        .single();

      if (existing) {
        return res.status(409).json({
          error: "Idea is already in this portfolio",
        });
      }

      // Add idea to portfolio
      const { data: portfolioIdea, error } = await supabase
        .from("portfolio_ideas")
        .insert({
          portfolio_id: portfolioId,
          idea_id: ideaId,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding idea to portfolio:", error);
        return res.status(500).json({
          error: "Failed to add idea to portfolio",
        });
      }

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: userId,
        action_type: "idea_added_to_portfolio",
        entity_type: "portfolio_idea",
        entity_id: portfolioIdea.id,
        details: {
          portfolio_id: portfolioId,
          portfolio_name: portfolio.name,
          idea_id: ideaId,
          idea_title: idea.title,
        },
      });

      res.json({
        success: true,
        message: "Idea added to portfolio successfully",
      });
    } catch (error) {
      console.error("Add idea to portfolio error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Remove idea from portfolio
router.delete(
  "/portfolios/:portfolioId/ideas/:ideaId",
  requireApiAuth,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { portfolioId, ideaId } = req.params;

      // Verify portfolio ownership
      const { data: portfolio, error: portfolioError } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", portfolioId)
        .eq("user_id", userId)
        .single();

      if (portfolioError || !portfolio) {
        return res.status(404).json({
          error: "Portfolio not found or access denied",
        });
      }

      // Remove idea from portfolio
      const { error } = await supabase
        .from("portfolio_ideas")
        .delete()
        .eq("portfolio_id", portfolioId)
        .eq("idea_id", ideaId);

      if (error) {
        console.error("Error removing idea from portfolio:", error);
        return res.status(500).json({
          error: "Failed to remove idea from portfolio",
        });
      }

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: userId,
        action_type: "idea_removed_from_portfolio",
        entity_type: "portfolio",
        entity_id: portfolioId,
        details: {
          portfolio_id: portfolioId,
          portfolio_name: portfolio.name,
          idea_id: ideaId,
        },
      });

      res.json({
        success: true,
        message: "Idea removed from portfolio successfully",
      });
    } catch (error) {
      console.error("Remove idea from portfolio error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Invite team member to portfolio
router.post(
  "/portfolios/:portfolioId/invite",
  requireApiAuth,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { portfolioId } = req.params;
      const { email, role } = req.body;

      if (!email || !role) {
        return res.status(400).json({
          error: "Email and role are required",
        });
      }

      if (!["viewer", "editor"].includes(role)) {
        return res.status(400).json({
          error: "Role must be 'viewer' or 'editor'",
        });
      }

      // Verify portfolio ownership
      const { data: portfolio, error: portfolioError } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", portfolioId)
        .eq("user_id", userId)
        .single();

      if (portfolioError || !portfolio) {
        return res.status(404).json({
          error: "Portfolio not found or access denied",
        });
      }

      // Find user by email
      const { data: users, error: userError } =
        await supabase.auth.admin.listUsers();

      if (userError) {
        console.error("Error listing users:", userError);
        return res.status(500).json({
          error: "Failed to find user",
        });
      }

      const invitedUser = users.users.find((u) => u.email === email);
      if (!invitedUser) {
        return res.status(404).json({
          error: "User with this email not found",
        });
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from("portfolio_members")
        .select("id")
        .eq("portfolio_id", portfolioId)
        .eq("user_id", invitedUser.id)
        .single();

      if (existingMember) {
        return res.status(409).json({
          error: "User is already a member of this portfolio",
        });
      }

      // Add member
      const { data: member, error } = await supabase
        .from("portfolio_members")
        .insert({
          portfolio_id: portfolioId,
          user_id: invitedUser.id,
          role,
          invited_by: userId,
        })
        .select()
        .single();

      if (error) {
        console.error("Error inviting team member:", error);
        return res.status(500).json({
          error: "Failed to invite team member",
        });
      }

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: userId,
        action_type: "team_member_invited",
        entity_type: "portfolio_member",
        entity_id: member.id,
        details: {
          portfolio_id: portfolioId,
          portfolio_name: portfolio.name,
          invited_email: email,
          role,
        },
      });

      res.json({
        success: true,
        message: "Team member invited successfully",
        member,
      });
    } catch (error) {
      console.error("Invite team member error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

// Remove team member from portfolio
router.delete(
  "/portfolios/:portfolioId/members/:memberId",
  requireApiAuth,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { portfolioId, memberId } = req.params;

      // Verify portfolio ownership
      const { data: portfolio, error: portfolioError } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", portfolioId)
        .eq("user_id", userId)
        .single();

      if (portfolioError || !portfolio) {
        return res.status(404).json({
          error: "Portfolio not found or access denied",
        });
      }

      // Remove member
      const { error } = await supabase
        .from("portfolio_members")
        .delete()
        .eq("portfolio_id", portfolioId)
        .eq("user_id", memberId);

      if (error) {
        console.error("Error removing team member:", error);
        return res.status(500).json({
          error: "Failed to remove team member",
        });
      }

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: userId,
        action_type: "team_member_removed",
        entity_type: "portfolio",
        entity_id: portfolioId,
        details: {
          portfolio_id: portfolioId,
          portfolio_name: portfolio.name,
          removed_user_id: memberId,
        },
      });

      res.json({
        success: true,
        message: "Team member removed successfully",
      });
    } catch (error) {
      console.error("Remove team member error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

export default router;
