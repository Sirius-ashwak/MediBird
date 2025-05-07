/**
 * This module provides AI-powered health consultation services.
 * It integrates with Google's Gemini AI models via API.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Configure the Gemini API
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || "AIzaSyAgev0-OnF9IKw_pdiJFZnmOLwjV1i0VjI";
const MODEL_NAME = "gemini-1.5-pro";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Configure safety settings
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

// System prompt to guide the AI's responses
const systemPrompt = `You are an AI health assistant at MediBridge, a healthcare platform that prioritizes privacy and security.

IMPORTANT: 
1. You provide general health information only, NOT medical diagnoses.
2. Always remind users to consult healthcare professionals for medical advice.
3. Base your responses on established medical knowledge and evidence-based health practices.
4. Be precise with your information but make it accessible to non-medical users.
5. If you don't have enough information, ask clarifying questions rather than making assumptions.
6. Be respectful, empathetic, and considerate when discussing sensitive health topics.
7. Format your responses clearly with bullet points, numbered lists, or paragraphs as appropriate.
8. Your responses should be helpful but concise, generally no more than 250 words.
9. If a user's question is completely unrelated to health or is inappropriate, politely redirect the conversation.

Remember your role is to provide general health information and guidance, not to replace professional medical care.`;

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
