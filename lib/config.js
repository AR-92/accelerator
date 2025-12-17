import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_PUBLIC_KEY || process.env.SUPABASE_KEY, // Use anon key for client auth
    serviceKey: process.env.SUPABASE_KEY, // Service role key for admin operations
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: "google/gemma-3n-e2b-it:free",
  },
};

export default config;
