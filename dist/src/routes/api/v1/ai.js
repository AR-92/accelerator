const express = require('express');
const router = express.Router();
const { logger } = require('../../../config/logger');

// Simplified AI endpoint - AI agent removed for simplicity
router.post('/collaborate', async (req, res) => {
  try {
    const { query, userId } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'Query is required',
      });
    }

    // Simple mock response
    const response = `This is a simplified response to your query: "${query}". AI agent functionality has been removed to streamline the application.`;

    res.json({
      success: true,
      response: response,
      thoughts: [
        'Query received',
        'Processing simplified',
        'Response generated',
      ],
      context: {
        query,
        timestamp: new Date().toISOString(),
        userId: userId || null,
      },
      currentStep: 'complete',
    });
  } catch (error) {
    logger.error('AI endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// Health check endpoint - simplified
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    name: 'Simplified AI Service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    note: 'AI agent functionality removed for simplicity',
  });
});

// Conversation history endpoint removed - Supabase dependency

module.exports = router;
