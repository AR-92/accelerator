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
 * Generate description based on a question
 * @param {string} question - The question to answer
 * @returns {Promise<{success: boolean, generated_content: string, error: any}>}
 */
export async function generateDescription(question) {
  const systemPrompt = `Answer the following question with a detailed, professional response suitable for a business plan or project description. Provide comprehensive information that directly addresses the question. Keep the response focused and relevant.`;

  const result = await callOpenRouter(question, systemPrompt);

  return {
    success: result.success,
    generated_content: result.content,
    error: result.error,
  };
}

/**
 * Generate description for a specific model section
 * @param {string} model - The model name (e.g., "idea")
 * @param {string} section - The section name (e.g., "market-analysis")
 * @param {string} action - The action type (e.g., "generate")
 * @param {string} input - The input text (question or description)
 * @param {string} existingContent - Existing content for improve action
 * @param {string} userInputs - User inputs for generate action
 * @returns {Promise<{success: boolean, generated_content: string, error: any}>}
 */
export async function generateDescriptionForSection(
  model,
  section,
  action,
  input,
  existingContent = "",
  userInputs = "",
) {
  try {
    // Load prompt from .hbs file
    const fs = await import("fs");
    const path = await import("path");
    const Handlebars = await import("handlebars");

    const promptPath = path.join(
      process.cwd(),
      "prompts",
      "models",
      model,
      "sections",
      section,
      `${action}.hbs`,
    );

    if (!fs.existsSync(promptPath)) {
      // Fallback to generic
      return await generateDescription(input);
    }

    const templateSource = fs.readFileSync(promptPath, "utf8");

    // Register partials
    const partialsDir = path.join(process.cwd(), "prompts", "partials");
    if (fs.existsSync(partialsDir)) {
      const partialFiles = fs.readdirSync(partialsDir);
      for (const file of partialFiles) {
        if (file.endsWith(".hbs")) {
          const partialName = file.replace(".hbs", "");
          const partialPath = path.join(partialsDir, file);
          const partialContent = fs.readFileSync(partialPath, "utf8");
          Handlebars.registerPartial(partialName, partialContent);
        }
      }
    }

    const template = Handlebars.compile(templateSource);

    // Prepare data
    const data = {
      question: input,
      description: input,
      existingContent,
      userInputs,
      modelType: model,
    };

    const systemPrompt = template(data);

    // Default parameters based on action
    const maxTokens =
      action === "generate" ? 600 : action === "improve" ? 600 : 300;
    const temperature =
      action === "generate" ? 0.7 : action === "improve" ? 0.6 : 0.7;

    const result = await callOpenRouter(
      "", // No user prompt, system prompt contains everything
      systemPrompt,
      maxTokens,
      temperature,
    );

    return {
      success: result.success,
      generated_content: result.content,
      error: result.error,
    };
  } catch (error) {
    console.error("Error loading prompt file:", error);
    // Fallback to generic
    return await generateDescription(input);
  }
}

/**
 * Improve description for a specific model section
 * @param {string} model - The model name
 * @param {string} section - The section name
 * @param {string} action - The action type (e.g., "improve")
 * @param {string} description - The description to improve
 * @param {string} existingContent - Existing content for improve action
 * @param {string} userInputs - User inputs for improve action
 * @returns {Promise<{success: boolean, improved_description: string, error: any}>}
 */
export async function improveDescriptionForSection(
  model,
  section,
  action,
  description,
  existingContent = "",
  userInputs = "",
) {
  try {
    // Load prompt from .hbs file
    const fs = await import("fs");
    const path = await import("path");
    const Handlebars = await import("handlebars");

    const promptPath = path.join(
      process.cwd(),
      "prompts",
      "models",
      model,
      "sections",
      section,
      `${action}.hbs`,
    );

    if (!fs.existsSync(promptPath)) {
      // Fallback to generic
      return await improveDescription(description);
    }

    const templateSource = fs.readFileSync(promptPath, "utf8");

    // Register partials
    const partialsDir = path.join(process.cwd(), "prompts", "partials");
    if (fs.existsSync(partialsDir)) {
      const partialFiles = fs.readdirSync(partialsDir);
      for (const file of partialFiles) {
        if (file.endsWith(".hbs")) {
          const partialName = file.replace(".hbs", "");
          const partialPath = path.join(partialsDir, file);
          const partialContent = fs.readFileSync(partialPath, "utf8");
          Handlebars.registerPartial(partialName, partialContent);
        }
      }
    }

    const template = Handlebars.compile(templateSource);

    // Prepare data
    const data = {
      question: description,
      description,
      existingContent,
      userInputs,
      modelType: model,
    };

    const systemPrompt = template(data);

    // Default parameters
    const maxTokens = 600;
    const temperature = 0.6;

    const result = await callOpenRouter(
      "", // System prompt contains everything
      systemPrompt,
      maxTokens,
      temperature,
    );

    return {
      success: result.success,
      improved_description: result.content,
      error: result.error,
    };
  } catch (error) {
    console.error("Error loading prompt file:", error);
    // Fallback to generic
    return await improveDescription(description);
  }
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

/**
 * Explain the executive summary section
 * @param {string} title - The idea title
 * @param {string} category - The idea category
 * @param {string} description - The idea description
 * @returns {Promise<{success: boolean, explanation: string, error: any}>}
 */
export async function explainExecutiveSummary(title, category, description) {
  const systemPrompt = `You are an expert business analyst. Given an idea's title, category, and description, provide a clear, concise explanation of what this executive summary means and why it matters. Focus on:
1. What the idea is about
2. The problem it solves
3. The target market
4. The unique value proposition
5. Why this could be successful

Keep the explanation to 200-400 words, professional but accessible. Return only the explanation text, nothing else.`;

  const prompt = `Title: ${title}\nCategory: ${category}\nDescription: ${description}`;

  const result = await callOpenRouter(prompt, systemPrompt);

  return {
    success: result.success,
    explanation: result.content,
    error: result.error,
  };
}

/**
 * Chat about project requirements
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} context - Current project context (title, category, description)
 * @returns {Promise<{success: boolean, response: string, error: any}>}
 */
export async function chatAboutRequirements(messages, context = "") {
  const systemPrompt = `You are an AI assistant helping users refine and discuss their startup project requirements. You can help with:
- Clarifying requirements
- Suggesting improvements
- Answering questions about the project
- Providing business advice
- Technical guidance

Be helpful, professional, and concise. Focus on the user's project requirements and context provided. If no specific context is given, ask for clarification about their project.

Current project context: ${context || "No specific context provided yet"}`;

  // Convert messages to OpenRouter format
  const openRouterMessages = messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "assistant",
    content: msg.content,
  }));

  // Handle system prompt based on model support
  if (config.openrouter.model !== "google/gemma-3n-e2b-it:free") {
    // Use system message for models that support it
    openRouterMessages.unshift({ role: "system", content: systemPrompt });
  } else {
    // Combine system prompt with first user message for models that don't support system messages
    const firstUserMessageIndex = openRouterMessages.findIndex(
      (msg) => msg.role === "user",
    );
    if (firstUserMessageIndex !== -1) {
      openRouterMessages[firstUserMessageIndex].content =
        `${systemPrompt}\n\n${openRouterMessages[firstUserMessageIndex].content}`;
    } else {
      // If no user message, add as first message
      openRouterMessages.unshift({ role: "user", content: systemPrompt });
    }
  }

  try {
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
          messages: openRouterMessages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", response.status, errorData);
      return {
        success: false,
        response: "",
        error: new Error(`OpenRouter API error: ${response.status}`),
      };
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid OpenRouter response:", data);
      return {
        success: false,
        response: "",
        error: new Error("Invalid response from OpenRouter"),
      };
    }

    return {
      success: true,
      response: data.choices[0].message.content.trim(),
      error: null,
    };
  } catch (error) {
    console.error("Error calling OpenRouter for chat:", error);
    return {
      success: false,
      response: "",
      error,
    };
  }
}
