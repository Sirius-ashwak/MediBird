/**
 * This module provides AI-powered health consultation services.
 * It integrates with OpenAI's GPT models for primary functionality,
 * with a fallback to Google's Gemini AI models.
 */

import { openAIService } from './openai';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Configure Gemini API
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-pro";
const FALLBACK_MODEL = "gemini-1.0-pro"; // Fallback to older model if needed

// Check if API key is available from environment
if (!GEMINI_API_KEY) {
  console.error('GOOGLE_GEMINI_API_KEY environment variable is not set. AI chat functionality will not work properly.');
}

// Initialize the Gemini API client with proper error handling
let genAI: GoogleGenerativeAI;
let model: any;

try {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API key");
  }
  
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  console.log(`Initializing Gemini AI with model: ${MODEL_NAME}`);
  model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
  // Test API key with a simple prompt
  console.log("Testing Gemini API connection...");
} catch (error) {
  console.error("Error initializing Gemini AI:", error);
  console.warn("AI chat functionality may not work correctly.");
  
  // Create a dummy model object that will throw appropriate errors when used
  genAI = new GoogleGenerativeAI("invalid-key");
  model = genAI.getGenerativeModel({ model: FALLBACK_MODEL });
}

// Configure safety settings for Gemini
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

class AIService {
  private userChats: Map<number, any[]>;
  
  constructor() {
    this.userChats = new Map();
  }

  /**
   * Processes a health-related query and returns an AI-generated response using Gemini
   */
  async getResponse(message: string, userId: number): Promise<string> {
    try {
      console.log(`Processing AI request for user ${userId} with message: "${message.substring(0, 30)}..."`);
      
      // Initialize chat history for this user if it doesn't exist
      if (!this.userChats.has(userId)) {
        console.log(`Initializing new chat history for user ${userId}`);
        this.userChats.set(userId, []);
      }
      
      // Get the chat history
      const chatHistory = this.userChats.get(userId);
      
      // Log API key status (without revealing the key)
      const apiKeyStatus = process.env.GOOGLE_GEMINI_API_KEY ? 
        "Using environment API key" : 
        "Using fallback API key";
      console.log(`Gemini API status: ${apiKeyStatus}`);
      
      console.log("Creating Gemini chat session...");
      // Create a chat session
      const chat = model.startChat({
        history: chatHistory,
        safetySettings,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
      
      // Send the message and get the response
      console.log("Sending message to Gemini API...");
      const result = await chat.sendMessage(message);
      const response = result.response.text();
      console.log(`Received response from Gemini (length: ${response.length} chars)`);
      
      // Update chat history
      this.updateChatHistory(userId, message, response);
      
      return response;
    } catch (error) {
      const err = error as Error;
      console.error("Error getting AI response:", err.message);
      console.error("Error stack:", err.stack);
      
      // Check for specific error types for better user feedback
      if (err.message.includes("API key")) {
        console.error("API key error detected. Please check your GOOGLE_GEMINI_API_KEY environment variable.");
        return "I'm unable to process your request due to an API authentication issue. Please contact support for assistance.";
      } else if (err.message.includes("network") || err.message.includes("connection")) {
        return "I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
      } else if (err.message.includes("quota") || err.message.includes("rate limit")) {
        return "We've reached our AI service quota limit. Please try again in a few minutes.";
      }
      
      // General fallback response
      return "I apologize, but I'm having trouble processing your request right now. Please try again later or contact technical support if the issue persists.";
    }
  }
  
  /**
   * Updates the chat history for a user
   */
  private updateChatHistory(userId: number, userMessage: string, aiResponse: string): void {
    const chatHistory = this.userChats.get(userId) || [];
    
    // Add the latest exchange to the chat history
    chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
    chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
    
    // Limit history to the last 10 exchanges (20 messages)
    if (chatHistory.length > 20) {
      chatHistory.splice(0, 2);
    }
    
    // Update the stored chat history
    this.userChats.set(userId, chatHistory);
  }
  
  /**
   * Clears chat history for a user
   */
  clearChatHistory(userId: number): void {
    this.userChats.delete(userId);
  }
}

export const aiService = new AIService();
