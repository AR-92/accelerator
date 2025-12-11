import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: "google/gemma-3n-e2b-it:free",
  },
};

export default config;
