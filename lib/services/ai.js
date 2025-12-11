import config from "../config.js";

/**
 * Call OpenRouter API for chat completions
 * @param {string} prompt - The user prompt
 * @param {string} systemPrompt - The system prompt
 * @returns {Promise<{success: boolean, content: string, error: any}>}
 */
async function callOpenRouter(prompt, systemPrompt) {
  try {
    // For models that don't support system prompts, combine system prompt with user prompt
    const combinedPrompt = systemPrompt
      ? `${systemPrompt}\n\n${prompt}`
      : prompt;

    const messages = [];
    if (
      systemPrompt &&
      config.openrouter.model !== "google/gemma-3n-e2b-it:free"
    ) {
      // Use system message for models that support it
      messages.push({ role: "system", content: systemPrompt });
      messages.push({ role: "user", content: prompt });
    } else {
      // Combine system prompt with user prompt for models that don't support system messages
      messages.push({ role: "user", content: combinedPrompt });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.openrouter.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:4000",
          "X-Title": "Accelerator AI",
        },
        body: JSON.stringify({
          model: config.openrouter.model,
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", response.status, errorData);
      return {
        success: false,
        content: "",
        error: new Error(`OpenRouter API error: ${response.status}`),
      };
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid OpenRouter response:", data);
      return {
        success: false,
        content: "",
        error: new Error("Invalid response from OpenRouter"),
      };
    }

    return {
      success: true,
      content: data.choices[0].message.content.trim(),
      error: null,
    };
  } catch (error) {
    console.error("Error calling OpenRouter:", error);
    return {
      success: false,
      content: "",
      error,
    };
  }
}

/**
 * Generate a title for the project
 * @param {string} description - Project description
 * @returns {Promise<{success: boolean, title: string, error: any}>}
 */
export async function generateTitle(description) {
  const systemPrompt = `You are a startup naming expert. Given a project description, create a compelling, memorable title that is 3-8 words long. Return only the title, nothing else.`;

  const result = await callOpenRouter(description, systemPrompt);

  return {
    success: result.success,
    title: result.content,
    error: result.error,
  };
}

/**
 * Generate a category for the project
 * @param {string} description - Project description
 * @returns {Promise<{success: boolean, category: string, error: any}>}
 */
export async function generateCategory(description) {
  const systemPrompt = `Categorize this startup idea into exactly one of these categories: Technology, Healthcare, Finance, Education, E-commerce, Entertainment, Social, Environment, or Other. Return only the category name, nothing else.`;

  const result = await callOpenRouter(description, systemPrompt);

  return {
    success: result.success,
    category: result.content,
    error: result.error,
  };
}

/**
 * Generate tags for the project
 * @param {string} description - Project description
 * @returns {Promise<{success: boolean, tags: string[], error: any}>}
 */
export async function generateTags(description) {
  const systemPrompt = `Generate 3-5 relevant tags for this project, separated by commas. Tags should be lowercase, use hyphens instead of spaces, and be highly relevant. Return only the comma-separated tags, nothing else.`;

  const result = await callOpenRouter(description, systemPrompt);

  if (!result.success) {
    return result;
  }

  // Parse comma-separated tags
  const tags = result.content
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  return {
    success: true,
    tags,
    error: null,
  };
}

/**
 * Improve the project description
 * @param {string} description - Original description
 * @returns {Promise<{success: boolean, improved_description: string, error: any}>}
 */
export async function improveDescription(description) {
  const systemPrompt = `Improve this project description to be more compelling, clear, and professional while maintaining the original meaning. Keep it concise but detailed. Return only the improved description, nothing else.`;

  const result = await callOpenRouter(description, systemPrompt);

  return {
    success: result.success,
    improved_description: result.content,
    error: result.error,
  };
}

/**
 * Auto-fill all project fields
 * @param {string} description - Partial description
 * @returns {Promise<{success: boolean, title: string, category: string, description: string, tags: string[], error: any}>}
 */
export async function autoFill(description) {
  const systemPrompt = `Generate a complete startup idea based on the provided description. Return a JSON object with exactly these fields:
- title: A compelling 3-8 word title
- category: One category from: Technology, Healthcare, Finance, Education, E-commerce, Entertainment, Social, Environment, or Other
- description: An improved, detailed description (100-2000 characters)
- tags: Array of 3-5 relevant tags (lowercase, hyphen-separated)

Return only valid JSON, no other text.`;

  const result = await callOpenRouter(description, systemPrompt);

  if (!result.success) {
    return result;
  }

  try {
    // Strip markdown code blocks if present
    let jsonContent = result.content.trim();
    if (jsonContent.startsWith("```json")) {
      jsonContent = jsonContent
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const data = JSON.parse(jsonContent);
    return {
      success: true,
      title: data.title || "",
      category: data.category || "",
      description: data.description || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      error: null,
    };
  } catch (error) {
    console.error("Error parsing auto-fill JSON:", error, result.content);
    return {
      success: false,
      title: "",
      category: "",
      description: "",
      tags: [],
      error: new Error("Failed to parse AI response"),
    };
  }
}

/**
 * Generate a random startup idea
 * @returns {Promise<{success: boolean, title: string, category: string, description: string, tags: string[], error: any}>}
 */
export async function generateRandomIdea() {
  const systemPrompt = `Generate a completely random, creative startup idea. Return a JSON object with exactly these fields:
- title: A compelling 3-8 word title
- category: One category from: Technology, Healthcare, Finance, Education, E-commerce, Entertainment, Social, Environment, or Other
- description: A detailed description (100-2000 characters)
- tags: Array of 3-5 relevant tags (lowercase, hyphen-separated)

Be innovative and unexpected. Return only valid JSON, no other text.`;

  const result = await callOpenRouter(
    "Generate a random startup idea",
    systemPrompt,
  );

  if (!result.success) {
    return result;
  }

  try {
    // Strip markdown code blocks if present
    let jsonContent = result.content.trim();
    if (jsonContent.startsWith("```json")) {
      jsonContent = jsonContent
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const data = JSON.parse(jsonContent);
    return {
      success: true,
      title: data.title || "",
      category: data.category || "",
      description: data.description || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      error: null,
    };
  } catch (error) {
    console.error("Error parsing random idea JSON:", error, result.content);
    return {
      success: false,
      title: "",
      category: "",
      description: "",
      tags: [],
      error: new Error("Failed to parse AI response"),
    };
  }
}
