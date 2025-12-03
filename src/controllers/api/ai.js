import OpenAI from 'openai';
import { authenticateUser } from '../../middleware/auth/index.js';
import {
  csrfProtection,
  verifyCsrfToken,
} from '../../middleware/security/csrf.js';
import CreditManager from '../../utils/creditManager.js';

// AI credit cost per request
const AI_CREDIT_COST = 10;

// Initialize OpenAI client configured for OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

// AI helper function
async function callAI(prompt, maxTokens = 200) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const completion = await openai.chat.completions.create({
    model: process.env.AI_MODEL_DEFAULT || 'google/gemma-3n-e2b-it:free',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: maxTokens,
  });

  return completion.choices[0]?.message?.content?.trim() || '';
}

// AI API routes
export default function aiRoutes(app) {
  // Auto fill with AI
  app.post('/api/ai/auto-fill', authenticateUser, async (req, res) => {
    const { description } = req.body;
    try {
      // Check if user has enough credits
      const userId = req.user.id;
      const hasCredits = await CreditManager.hasCredits(userId, AI_CREDIT_COST);
      if (!hasCredits) {
        return res.status(402).json({
          error: 'Insufficient credits',
          required: AI_CREDIT_COST,
          balance: await CreditManager.getBalance(userId),
        });
      }

      // Consume credits
      await CreditManager.consumeCredits(
        userId,
        AI_CREDIT_COST,
        'AI auto-fill generation',
        'ai_auto_fill'
      );
      const prompt = `Based on this project description: "${description}"

Generate the following information:

Title: A catchy, concise title (maximum 50 characters) that captures the essence of this project
Category: Choose the most appropriate category from: Technology, Healthcare, Education, Finance, Environment, Entertainment, Transportation, Food, Real Estate, Other
Description: Rewrite and enhance the description to be more detailed, professional, and engaging, while staying true to the original idea
Tags: 3-5 highly relevant tags that best describe this project, separated by commas

Format your response exactly like this:
Title: [title here]
Category: [category here]
Description: [description here]
Tags: [tag1, tag2, tag3]`;

      const aiResponse = await callAI(prompt, 500);
      // Parse the text response
      let result;
      try {
        const lines = aiResponse
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line);
        let title = '',
          category = '',
          description = '',
          tags = [];

        for (const line of lines) {
          if (line.startsWith('Title:')) {
            title = line.replace('Title:', '').trim();
          } else if (line.startsWith('Category:')) {
            category = line.replace('Category:', '').trim();
          } else if (line.startsWith('Description:')) {
            description = line.replace('Description:', '').trim();
          } else if (line.startsWith('Tags:')) {
            const tagsStr = line.replace('Tags:', '').trim();
            tags = tagsStr
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag);
          }
        }

        // Validate that we have all fields
        if (!title || !category || !description || tags.length === 0) {
          throw new Error('Incomplete response from AI');
        }

        result = { title, category, description, tags };
      } catch (parseError) {
        console.warn('AI response parsing failed:', aiResponse);
        // Use fallback
        throw new Error('Failed to parse AI response');
      }

      res.json(result);
    } catch (error) {
      console.error('AI auto-fill error:', error);
      res.status(500).json({ error: 'AI generation failed' });
    }
  });

  // Improve with AI
  app.post('/api/ai/improve', authenticateUser, async (req, res) => {
    const { description } = req.body;
    try {
      // Check if user has enough credits
      const userId = req.user.id;
      const hasCredits = await CreditManager.hasCredits(userId, AI_CREDIT_COST);
      if (!hasCredits) {
        return res.status(402).json({
          error: 'Insufficient credits',
          required: AI_CREDIT_COST,
          balance: await CreditManager.getBalance(userId),
        });
      }

      // Consume credits
      await CreditManager.consumeCredits(
        userId,
        AI_CREDIT_COST,
        'AI description improvement',
        'ai_improve'
      );
      const prompt = `Rewrite this as a problem statement in paragraph form. Focus only on the problem, not solutions.

Original: "${description}"

Keep it under 500 words. Return only the problem statement paragraph.`;

      const improved_description = await callAI(prompt, 300);

      res.json({ improved_description });
    } catch (error) {
      console.error('AI improve error:', error);
      res.status(500).json({ error: 'AI improvement failed' });
    }
  });

  // Add tags with AI
  app.post('/api/ai/add-tags', authenticateUser, async (req, res) => {
    try {
      const { description } = req.body;

      // Check if user has enough credits
      const userId = req.user.id;
      const hasCredits = await CreditManager.hasCredits(userId, AI_CREDIT_COST);
      if (!hasCredits) {
        return res.status(402).json({
          error: 'Insufficient credits',
          required: AI_CREDIT_COST,
          balance: await CreditManager.getBalance(userId),
        });
      }

      // Consume credits
      await CreditManager.consumeCredits(
        userId,
        AI_CREDIT_COST,
        'AI tag generation',
        'ai_add_tags'
      );

      const prompt = `Analyze this project description and suggest 3-5 relevant tags: "${description}"

Return ONLY a JSON array of strings, like: ["tag1", "tag2", "tag3"]

No other text or explanation.`;

      const aiResponse = await callAI(prompt, 100);
      // Gemini returns text, try to parse as JSON array
      let tags;
      try {
        // Clean the response
        const cleanedResponse = aiResponse
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .trim();
        tags = JSON.parse(cleanedResponse);
        // Ensure it's an array
        if (!Array.isArray(tags)) {
          throw new Error('Response is not an array');
        }
      } catch (parseError) {
        console.warn('AI response not valid JSON for tags:', aiResponse);
        // If not valid JSON, create fallback tags
        throw new Error('Invalid JSON response from AI');
      }

      res.json({ tags });
    } catch (error) {
      console.error('AI add tags error:', error);
      res.status(500).json({ error: 'AI tag generation failed' });
    }
  });

  // Add category with AI
  app.post('/api/ai/add-category', authenticateUser, async (req, res) => {
    const { description } = req.body;
    try {
      // Check if user has enough credits
      const userId = req.user.id;
      const hasCredits = await CreditManager.hasCredits(userId, AI_CREDIT_COST);
      if (!hasCredits) {
        return res.status(402).json({
          error: 'Insufficient credits',
          required: AI_CREDIT_COST,
          balance: await CreditManager.getBalance(userId),
        });
      }

      // Consume credits
      await CreditManager.consumeCredits(
        userId,
        AI_CREDIT_COST,
        'AI category suggestion',
        'ai_add_category'
      );
      const prompt = `Categorize this project based on its description: "${description}"

Choose one category from: Technology, Healthcare, Education, Finance, Environment, Entertainment, Transportation, Food, Real Estate, Other

Return ONLY the category name, no other text or explanation.`;

      const category = await callAI(prompt, 50);

      res.json({ category });
    } catch (error) {
      console.error('AI add category error:', error);
      res.status(500).json({ error: 'AI category selection failed' });
    }
  });

  // Suggest title with AI
  app.post('/api/ai/suggest-title', authenticateUser, async (req, res) => {
    const { description } = req.body;
    try {
      // Check if user has enough credits
      const userId = req.user.id;
      const hasCredits = await CreditManager.hasCredits(userId, AI_CREDIT_COST);
      if (!hasCredits) {
        return res.status(402).json({
          error: 'Insufficient credits',
          required: AI_CREDIT_COST,
          balance: await CreditManager.getBalance(userId),
        });
      }

      // Consume credits
      await CreditManager.consumeCredits(
        userId,
        AI_CREDIT_COST,
        'AI title suggestion',
        'ai_suggest_title'
      );
      const prompt = `Based on this project description: "${description}"

Generate a catchy, concise title (maximum 50 characters) that captures the essence of this project.

Return ONLY the title text, no quotes or explanation.`;

      const suggestedTitle = await callAI(prompt, 100);

      res.json({ title: suggestedTitle.trim() });
    } catch (error) {
      console.error('AI suggest title error:', error);
      res.status(500).json({ error: 'Failed to suggest title with AI' });
    }
  });

  // Generate random idea
  app.post('/api/ai/random-idea', authenticateUser, async (req, res) => {
    try {
      // Check if user has enough credits
      const userId = req.user.id;
      const hasCredits = await CreditManager.hasCredits(userId, AI_CREDIT_COST);
      if (!hasCredits) {
        return res.status(402).json({
          error: 'Insufficient credits',
          required: AI_CREDIT_COST,
          balance: await CreditManager.getBalance(userId),
        });
      }

      // Consume credits
      await CreditManager.consumeCredits(
        userId,
        AI_CREDIT_COST,
        'AI random idea generation',
        'ai_random_idea'
      );
      const prompt = `Generate a creative startup idea. Return a JSON object with exactly these fields: title, description, category, tags. No other text.`;
      const aiResponse = await callAI(prompt, 400);

      // Try to extract and parse JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        res.json(result);
        return;
      }

      // If no JSON found, return an error
      throw new Error('Invalid JSON response from AI');
    } catch (error) {
      console.error('AI random idea error:', error.message);
      res.status(500).json({ error: 'Failed to generate random idea with AI' });
    }
  });
}
