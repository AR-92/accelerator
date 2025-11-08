const express = require('express');
const router = express.Router();
const { AIAssistantAgent } = require('../../../ai/agent');
const { logger } = require('../../../../config/logger');

// Initialize the AI agent
const aiAgent = new AIAssistantAgent();

// Endpoint to interact with the AI agent
router.post('/collaborate', async (req, res) => {
  try {
    const { query, userId, conversationState } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'Query is required',
      });
    }

    // Run the AI agent with the provided query
    const result = await aiAgent.run(query, {
      userId: userId || null,
      ...conversationState,
    });

    res.json({
      success: result.success,
      response: result.response,
      thoughts: result.thoughts,
      context: result.context,
      currentStep: result.currentStep,
    });
  } catch (error) {
    logger.error('AI Agent error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// Health check endpoint for the AI agent
router.get('/health', (req, res) => {
  try {
    const health = aiAgent.healthCheck();
    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

// Conversation history endpoint removed - Supabase dependency

module.exports = router;
