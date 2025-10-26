const express = require('express');
const router = express.Router();
const llmService = require('../src/services/llmService');

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }
    
    // Get response from LLM service (handles multiple providers)
    const response = await llmService.getResponse(message);
    
    res.json({ 
      success: true, 
      response: response 
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'An error occurred processing your request' 
    });
  }
});

module.exports = router;