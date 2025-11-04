require('dotenv').config();

// AI Configuration
const aiConfig = {
  // LLM Provider Configuration
  llmProvider: process.env.LLM_PROVIDER || 'openai', // openai, anthropic, groq, etc.
  
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
  },
  
  // Anthropic Configuration
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
    temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE) || 0.7,
    maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS) || 1000,
  },
  
  // Groq Configuration
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'llama3-70b-8192',
    temperature: parseFloat(process.env.GROQ_TEMPERATURE) || 0.7,
    maxTokens: parseInt(process.env.GROQ_MAX_TOKENS) || 1000,
  },
  
  // Embedding Configuration
  embeddings: {
    provider: process.env.EMBEDDING_PROVIDER || 'openai',
    model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
  },
  
  // Vector Store Configuration (for future use with Supabase)
  vectorStore: {
    enabled: process.env.VECTOR_STORE_ENABLED === 'true',
    similarityThreshold: parseFloat(process.env.VECTOR_SIMILARITY_THRESHOLD) || 0.7,
  },
  
  // Agent Configuration
  agent: {
    maxIterations: parseInt(process.env.AGENT_MAX_ITERATIONS) || 10,
    timeout: parseInt(process.env.AGENT_TIMEOUT) || 30000, // in milliseconds
    verbose: process.env.AGENT_VERBOSE === 'true' || false,
  }
};

module.exports = aiConfig;