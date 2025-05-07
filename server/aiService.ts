/**
 * This module provides AI-powered health consultation services.
 * It integrates with OpenAI's GPT models for primary functionality,
 * with a fallback to Google's Gemini AI models.
 */

import { openAIService } from './openai';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Configure fallback Gemini API
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || 'AIzaSyAgev0-OnF9IKw_pdiJFZnmOLwjV1i0VjI';
const MODEL_NAME = "gemini-1.5-pro";

// Check if API key is available from environment
if (!process.env.GOOGLE_GEMINI_API_KEY) {
  console.warn('GOOGLE_GEMINI_API_KEY environment variable is not set. Using fallback key.');
}

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

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
      // Initialize chat history for this user if it doesn't exist
      if (!this.userChats.has(userId)) {
        this.userChats.set(userId, []);
      }
      
      // Get the chat history
      const chatHistory = this.userChats.get(userId);
      
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
      const result = await chat.sendMessage(message);
      const response = result.response.text();
      
      // Update chat history
      this.updateChatHistory(userId, message, response);
      
      return response;
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Return a fallback response if there's an error
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
