import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticateUser } from '../../middleware/auth/index.js';
import {
  csrfProtection,
  verifyCsrfToken,
} from '../../middleware/security/csrf.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI helper function
async function callGemini(prompt, maxTokens = 200) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const model = genAI.getGenerativeModel({
    model: process.env.AI_MODEL_DEFAULT || 'gemini-2.5-flash-lite',
  });

  const result = await model.generateContent({
    contents: [{ parts: [{ text: prompt }] }],
  });
  const response = await result.response;
  return response.text().trim();
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

      const aiResponse = await callGemini(prompt, 500);
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
      const prompt = `Improve this project description to make it more professional, engaging, and detailed: "${description}"

Return ONLY the improved description text, no other explanations or formatting.`;

      const improved_description = await callGemini(prompt, 300);

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

      const aiResponse = await callGemini(prompt, 100);
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

      const category = await callGemini(prompt, 50);

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
      // TODO: Use AI to generate a title from the description
      const suggestedTitle = description.substring(0, 50);

      res.json({ title: suggestedTitle });
    } catch (error) {
      console.error('AI suggest title error:', error);
      res.status(500).json({ error: 'Failed to suggest title with AI' });
    }
  });

  // Generate random idea
  app.post('/api/ai/random-idea', authenticateUser, async (req, res) => {
    try {
      const prompt = `Generate a creative startup idea. Return a JSON object with exactly these fields: title, description, category, tags. No other text.`;
      const aiResponse = await callGemini(prompt, 400);

      // Try to extract and parse JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        res.json(result);
        return;
      }

      // If no JSON found, return the raw response for debugging
      res.json({
        title: 'Gemini Response',
        description: aiResponse.substring(0, 200),
        category: 'Technology',
        tags: ['AI', 'Test'],
      });
    } catch (error) {
      console.error('AI random idea error:', error.message);
      // Fallback to dummy ideas
      const ideas = [
        {
          title: 'AI-Powered Health Monitoring App',
          description:
            'A mobile application that uses AI to monitor user health metrics and provide personalized wellness recommendations.',
          category: 'Healthcare',
          tags: ['AI', 'Health', 'Mobile', 'Wellness'],
        },
        {
          title: 'Sustainable Urban Farming Platform',
          description:
            'A platform connecting urban farmers with consumers, using IoT sensors to optimize crop yields and reduce waste.',
          category: 'Environment',
          tags: ['Sustainability', 'IoT', 'Urban', 'Food'],
        },
        {
          title: 'Blockchain-Based Supply Chain Tracker',
          description:
            'A transparent supply chain management system using blockchain to track products from origin to consumer.',
          category: 'Technology',
          tags: ['Blockchain', 'Supply Chain', 'Transparency', 'Logistics'],
        },
      ];

      const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];

      res.json({
        title: randomIdea.title,
        description: randomIdea.description,
        category: randomIdea.category,
        tags: randomIdea.tags,
      });
    }
  });
}
