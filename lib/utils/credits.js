import { createClient } from "@supabase/supabase-js";
import config from "../config.js";
import { initializeUserCredits } from "./credits-init.js";

const supabase = createClient(config.supabase.url, config.supabase.key);

/**
 * Get user credits balance
 * @param {string} userId - Supabase user ID
 * @returns {Promise<{balance: number, error: any}>}
 */
export async function getUserCredits(userId) {
  try {
    const { data, error } = await supabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", userId)
      .single();

    if (error) {
      // If user doesn't have credits record, initialize with default credits
      if (
        error.code === "PGRST116" ||
        error.message?.includes("No rows found")
      ) {
        console.log(`User ${userId} has no credits record, initializing...`);
        const initResult = await initializeUserCredits(userId);
        if (initResult.success) {
          return { balance: 1000, error: null }; // Default starting credits
        }
      }
      console.error("Error fetching user credits:", error);
      return { balance: 0, error };
    }

    return { balance: data?.balance || 0, error: null };
  } catch (error) {
    console.error("Error in getUserCredits:", error);
    return { balance: 0, error };
  }
}

/**
 * Check if user has enough credits
 * @param {string} userId - Supabase user ID
 * @param {number} amount - Required credits
 * @returns {Promise<{hasEnough: boolean, currentBalance: number, error: any}>}
 */
export async function hasEnoughCredits(userId, amount) {
  const { balance, error } = await getUserCredits(userId);
  return {
    hasEnough: balance >= amount,
    currentBalance: balance,
    error,
  };
}

/**
 * Deduct credits from user balance
 * @param {string} userId - Supabase user ID
 * @param {number} amount - Credits to deduct
 * @returns {Promise<{success: boolean, newBalance: number, error: any}>}
 */
export async function deductCredits(userId, amount) {
  try {
    // First get current balance
    const { balance: currentBalance, error: fetchError } =
      await getUserCredits(userId);
    if (fetchError) {
      return { success: false, newBalance: 0, error: fetchError };
    }

    if (currentBalance < amount) {
      return {
        success: false,
        newBalance: currentBalance,
        error: new Error("Insufficient credits"),
      };
    }

    const newBalance = currentBalance - amount;

    // Get current total_spent
    const { data: currentData, error: fetchSpentError } = await supabase
      .from("user_credits")
      .select("total_spent")
      .eq("user_id", userId)
      .single();

    if (fetchSpentError) {
      console.error("Error fetching current total_spent:", fetchSpentError);
      return {
        success: false,
        newBalance: currentBalance,
        error: fetchSpentError,
      };
    }

    const newTotalSpent = (currentData?.total_spent || 0) + amount;

    // Update balance and total_spent
    const { data, error } = await supabase
      .from("user_credits")
      .update({
        balance: newBalance,
        total_spent: newTotalSpent,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select("balance")
      .single();

    if (error) {
      console.error("Error deducting credits:", error);
      return { success: false, newBalance: currentBalance, error };
    }

    return {
      success: true,
      newBalance: data?.balance || newBalance,
      error: null,
    };
  } catch (error) {
    console.error("Error in deductCredits:", error);
    return { success: false, newBalance: 0, error };
  }
}
