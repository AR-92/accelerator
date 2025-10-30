const { 
  StateGraph, 
  MessageGraph, 
  Annotation 
} = require("@langchain/langgraph");
const { 
  BaseMessage, 
  HumanMessage, 
  AIMessage 
} = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { supabaseAIService } = require('./supabaseIntegration');
const { aiConfig } = require('./config');

// Define the state structure for our AI agent
const AgentState = Annotation.Root({
  // Messages in the conversation
  messages: Annotation({ 
    reducer: (x, y) => x.concat(y), 
    default: () => [] 
  }),
  // Current user query
  query: Annotation({ 
    reducer: (x, y) => y,
    default: () => ""
  }),
  // Agent response
  response: Annotation({ 
    reducer: (x, y) => y,
    default: () => ""
  }),
  // Context from database or other sources
  context: Annotation({ 
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => {}
  }),
  // Current step in the agent workflow
  currentStep: Annotation({ 
    reducer: (x, y) => y,
    default: () => "start"
  }),
  // Any errors that occur
  error: Annotation({ 
    reducer: (x, y) => y,
    default: () => null
  }),
  // Agent's internal thoughts
  thoughts: Annotation({ 
    reducer: (x, y) => x.concat(y),
    default: () => []
  }),
  // User ID (for conversation history and personalization)
  userId: Annotation({ 
    reducer: (x, y) => y,
    default: () => null
  })
});

// Node functions for the agent workflow

// 1. Router node - determines the next step based on the query
const routerNode = async (state) => {
  const lastMessage = state.messages[state.messages.length - 1];
  const query = lastMessage?.content?.toLowerCase() || state.query.toLowerCase();
  
  let nextStep = "process";
  
  // Determine the appropriate path based on query content
  if (query.includes("user") || query.includes("customer") || query.includes("account")) {
    nextStep = "fetch_user_data";
  } else if (query.includes("product") || query.includes("item") || query.includes("inventory")) {
    nextStep = "fetch_product_data";
  } else if (query.includes("help") || query.includes("assist")) {
    nextStep = "provide_assistance";
  } else {
    nextStep = "process";
  }
  
  return {
    ...state,
    currentStep: nextStep,
    thoughts: [...state.thoughts, `Determined next step: ${nextStep}`]
  };
};

// 2. Data fetching node for user information
const fetchUserDataNode = async (state) => {
  try {
    // Fetch real user data from Supabase
    const userData = await supabaseAIService.fetchUserData(state.query);
    
    return {
      ...state,
      context: { ...state.context, ...userData },
      currentStep: "process",
      thoughts: [...state.thoughts, "Fetched user data from Supabase"]
    };
  } catch (error) {
    console.error('Error in fetchUserDataNode:', error);
    return {
      ...state,
      error: error.message,
      currentStep: "error",
      thoughts: [...state.thoughts, `Error fetching user data: ${error.message}`]
    };
  }
};

// 3. Data fetching node for product information
const fetchProductDataNode = async (state) => {
  try {
    // Fetch real product data from Supabase
    const productData = await supabaseAIService.fetchProductData(state.query);
    
    return {
      ...state,
      context: { ...state.context, ...productData },
      currentStep: "process",
      thoughts: [...state.thoughts, "Fetched product data from Supabase"]
    };
  } catch (error) {
    console.error('Error in fetchProductDataNode:', error);
    return {
      ...state,
      error: error.message,
      currentStep: "error",
      thoughts: [...state.thoughts, `Error fetching product data: ${error.message}`]
    };
  }
};

// 4. Processing node - performs the main AI logic
const processNode = async (state) => {
  try {
    // Import the LLM based on configuration
    let model;
    
    if (aiConfig.llmProvider === 'openai') {
      const { ChatOpenAI } = require("@langchain/openai");
      model = new ChatOpenAI({
        apiKey: aiConfig.openai.apiKey,
        modelName: aiConfig.openai.model,
        temperature: aiConfig.openai.temperature,
        maxTokens: aiConfig.openai.maxTokens,
      });
    } else if (aiConfig.llmProvider === 'anthropic') {
      const { ChatAnthropic } = require("@langchain/anthropic");
      model = new ChatAnthropic({
        apiKey: aiConfig.anthropic.apiKey,
        modelName: aiConfig.anthropic.model,
        temperature: aiConfig.anthropic.temperature,
        maxTokens: aiConfig.anthropic.maxTokens,
      });
    } else if (aiConfig.llmProvider === 'groq') {
      const { ChatGroq } = require("@langchain/groq");
      model = new ChatGroq({
        apiKey: aiConfig.groq.apiKey,
        modelName: aiConfig.groq.model,
        temperature: aiConfig.groq.temperature,
        maxTokens: aiConfig.groq.maxTokens,
      });
    } else {
      // Default to OpenAI if no provider specified
      const { ChatOpenAI } = require("@langchain/openai");
      model = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        modelName: aiConfig.openai.model || 'gpt-4o',
        temperature: aiConfig.openai.temperature || 0.7,
        maxTokens: aiConfig.openai.maxTokens || 1000,
      });
    }
    
    // Create a prompt based on the state
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are an AI assistant. Use the context provided to answer questions accurately. 
       Context: ${JSON.stringify(state.context, null, 2)}
       If no specific user or product context is available, provide general assistance.`],
      ["human", "{query}"]
    ]);
    
    // Format the prompt with state data
    const formattedPrompt = await prompt.format({
      query: state.query
    });
    
    // Call the model
    const response = await model.invoke([new HumanMessage(formattedPrompt)]);
    
    // Save the conversation to Supabase if userId is available
    if (state.userId) {
      try {
        await supabaseAIService.saveConversation(
          state.userId, 
          state.query, 
          response.content, 
          state.context
        );
      } catch (saveError) {
        console.error('Error saving conversation:', saveError);
        // Don't fail the whole process if saving fails
      }
    }
    
    return {
      ...state,
      response: response.content,
      currentStep: "complete",
      thoughts: [...state.thoughts, "Processed query with LLM and saved conversation"]
    };
  } catch (error) {
    console.error('Error in processNode:', error);
    return {
      ...state,
      error: error.message,
      currentStep: "error",
      thoughts: [...state.thoughts, `Error in processing: ${error.message}`]
    };
  }
};

// 5. Error handling node
const errorNode = async (state) => {
  return {
    ...state,
    response: "I encountered an error processing your request. Please try again.",
    currentStep: "error_handled"
  };
};

// 6. Assistance providing node
const provideAssistanceNode = async (state) => {
  return {
    ...state,
    response: "I'm here to help! Could you please be more specific about what you need assistance with?",
    currentStep: "complete"
  };
};

// Create the agent graph
const createAgentGraph = () => {
  const workflow = new StateGraph(AgentState)
    .addNode("router", routerNode)
    .addNode("fetch_user_data", fetchUserDataNode)
    .addNode("fetch_product_data", fetchProductDataNode)
    .addNode("process", processNode)
    .addNode("provide_assistance", provideAssistanceNode)
    .addNode("error", errorNode)
    // Define the graph flow
    .addEdge("__start__", "router")
    .addConditionalEdges(
      "router",
      (state) => state.currentStep,
      {
        fetch_user_data: "fetch_user_data",
        fetch_product_data: "fetch_product_data",
        provide_assistance: "provide_assistance",
        process: "process",
        error: "error"
      }
    )
    .addEdge("fetch_user_data", "process")
    .addEdge("fetch_product_data", "process")
    .addEdge("provide_assistance", "process")
    .addConditionalEdges(
      "process",
      (state) => state.error ? "error" : "complete",
      {
        error: "error",
        complete: "__end__"
      }
    )
    .addEdge("error", "__end__");

  return workflow.compile();
};

module.exports = {
  AgentState,
  createAgentGraph,
  routerNode,
  fetchUserDataNode,
  fetchProductDataNode,
  processNode,
  provideAssistanceNode,
  errorNode
};