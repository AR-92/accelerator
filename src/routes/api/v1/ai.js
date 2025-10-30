const express = require('express');
const router = express.Router();
const { AIAssistantAgent } = require('../../../ai/agent');

// Initialize the AI agent
const aiAgent = new AIAssistantAgent();

// Endpoint to interact with the AI agent
router.post('/chat', async (req, res) => {
  try {
    const { query, userId, conversationState } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Query is required' 
      });
    }

    // Run the AI agent with the provided query
    const result = await aiAgent.run(query, {
      userId: userId || null,
      ...conversationState
    });

    res.json({
      success: result.success,
      response: result.response,
      thoughts: result.thoughts,
      context: result.context,
      currentStep: result.currentStep
    });
  } catch (error) {
    console.error('AI Agent error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
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
      error: error.message 
    });
  }
});

// Endpoint to get conversation history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { supabaseAIService } = require('../ai/supabaseIntegration');
    
    const history = await supabaseAIService.getConversationHistory(userId);
    
    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;