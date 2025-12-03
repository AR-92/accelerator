import OpenAI from 'openai';
import { authenticateUser } from '../../middleware/auth/index.js';
import {
  csrfProtection,
  verifyCsrfToken,
} from '../../middleware/security/csrf.js';

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
      const prompt = `Based on this project description: "${description}"

Please generate a JSON object with exactly these fields:
- title: A catchy, concise title (maximum 50 characters)
- category: Choose one from: Technology, Healthcare, Education, Finance, Environment, Entertainment, Transportation, Food, Real Estate, Other
- description: An enhanced, more detailed version of the original description
- tags: An array of 3-5 relevant tags

Return ONLY the JSON object, no other text or explanation. Format: {"title": "...", "category": "...", "description": "...", "tags": ["tag1", "tag2", ...]}`;

      const aiResponse = await callAI(prompt, 500);
      // Gemini returns text, try to parse as JSON
      let result;
      try {
        // Clean the response by removing any markdown formatting or extra text
        const cleanedResponse = aiResponse
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .trim();
        result = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.warn('AI response not valid JSON:', aiResponse);
        // If not valid JSON, create a fallback result
        throw new Error('Invalid JSON response from AI');
      }

      res.json(result);
    } catch (error) {
      console.error('AI auto-fill error:', error);
      // Fallback to dummy data
      const title = `Enhanced: ${description.split('.')[0].substring(0, 50)}`;
      const category = 'Technology';
      const enhancedDescription = `${description} - This is an enhanced version with more details and structure.`;
      const tags = ['innovation', 'technology', 'startup'];
      res.json({ title, category, description: enhancedDescription, tags });
    }
  });

  // Improve with AI
  app.post('/api/ai/improve', authenticateUser, async (req, res) => {
    const { description } = req.body;
    try {
      const prompt = `Rewrite this as a problem statement in paragraph form. Focus only on the problem, not solutions.

Original: "${description}"

Keep it under 500 words. Return only the problem statement paragraph.`;

      const improved_description = await callAI(prompt, 300);

      res.json({ improved_description });
    } catch (error) {
      console.error('AI improve error:', error);
      const improved_description = `${description} - This version is more polished, professional, and engaging.`;
      res.json({ improved_description });
    }
  });

  // Add tags with AI
  app.post('/api/ai/add-tags', authenticateUser, async (req, res) => {
    try {
      const { description } = req.body;

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
      const tags = ['innovation', 'technology', 'startup', 'AI'];
      res.json({ tags });
    }
  });

  // Add category with AI
  app.post('/api/ai/add-category', authenticateUser, async (req, res) => {
    const { description } = req.body;
    try {
      const prompt = `Categorize this project based on its description: "${description}"

Choose one category from: Technology, Healthcare, Education, Finance, Environment, Entertainment, Transportation, Food, Real Estate, Other

Return ONLY the category name, no other text or explanation.`;

      const category = await callAI(prompt, 50);

      res.json({ category });
    } catch (error) {
      console.error('AI add category error:', error);
      const category = 'Technology';
      res.json({ category });
    }
  });

  // Suggest title with AI
  app.post('/api/ai/suggest-title', authenticateUser, async (req, res) => {
    const { description } = req.body;
    try {
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
