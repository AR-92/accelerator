import { createClient } from "@supabase/supabase-js";
import config from "../config.js";

const supabase = createClient(config.supabase.url, config.supabase.key);

/**
 * Initialize user credits record if it doesn't exist
 * @param {string} userId - Supabase user ID
 */
export async function initializeUserCredits(userId) {
  try {
    // Check if user credits record exists
    const { data: existing, error: checkError } = await supabase
      .from("user_credits")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existing) {
      console.log("User credits already initialized");
      return { success: true, error: null };
    }

    // Create initial credits record
    const { data, error } = await supabase
      .from("user_credits")
      .insert({
        user_id: userId,
        balance: 1000, // Default starting credits
        total_earned: 1000,
        total_spent: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error initializing user credits:", error);
      return { success: false, error };
    }

    console.log("User credits initialized:", data);
    return { success: true, error: null };
  } catch (error) {
    console.error("Error in initializeUserCredits:", error);
    return { success: false, error };
  }
}
