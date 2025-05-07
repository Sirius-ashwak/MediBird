/**
 * This module provides OpenAI integration for AI-powered health consultations
 * using the latest GPT models.
 */

import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources";

// Check if OpenAI API key is available
if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY environment variable is not set. OpenAI features will not work properly.');
}

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

/**
 * Service to handle OpenAI API interactions for health consultations
 */
class OpenAIService {
  private userChats: Map<number, Array<{ role: "system" | "user" | "assistant"; content: string }>>;

  constructor() {
    this.userChats = new Map();
  }

  /**
   * Gets a response from OpenAI for a health-related query
   */
  async getResponse(message: string, userId: number): Promise<string> {
    try {
      // Initialize chat history for this user if it doesn't exist
      if (!this.userChats.has(userId)) {
        this.userChats.set(userId, [
          { role: "system", content: systemPrompt }
        ]);
      }

      // Get the chat history
      const chatHistory = this.userChats.get(userId) || [];
      
      // Add the user's message to the chat history
      chatHistory.push({ role: "user", content: message });

      // Create a chat completion
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: chatHistory as any,
        temperature: 0.7,
        max_tokens: 1024,
      });

      // Extract the assistant's response
      const aiResponse = response.choices[0].message.content || 
        "I apologize, but I couldn't generate a response. Please try again.";

      // Update chat history with the AI's response
      this.updateChatHistory(userId, message, aiResponse);

      return aiResponse;
    } catch (error) {
      console.error("Error getting OpenAI response:", error);
      
      // Return a fallback response if there's an error
      return "I apologize, but I'm having trouble processing your request right now. Please try again later or contact technical support if the issue persists.";
    }
  }

  /**
   * Updates the chat history for a user
   */
  private updateChatHistory(userId: number, userMessage: string, aiResponse: string): void {
    const chatHistory = this.userChats.get(userId) || [
      { role: "system", content: systemPrompt }
    ];
    
    // Ensure user message is already in history
    if (chatHistory[chatHistory.length - 1].role !== "user" || 
        chatHistory[chatHistory.length - 1].content !== userMessage) {
      chatHistory.push({ role: "user", content: userMessage });
    }
    
    // Add the AI's response to the chat history
    chatHistory.push({ role: "assistant", content: aiResponse });
    
    // Limit history to maintain context but prevent token limit issues
    // Keep system prompt and last 10 exchanges (20 messages)
    if (chatHistory.length > 21) { // 1 system + 20 messages
      chatHistory.splice(1, 2); // Remove oldest exchange after system prompt
    }
    
    // Update the stored chat history
    this.userChats.set(userId, chatHistory);
  }
  
  /**
   * Clears chat history for a user
   */
  clearChatHistory(userId: number): void {
    // Reset to just the system prompt
    this.userChats.set(userId, [
      { role: "system", content: systemPrompt }
    ]);
  }
}

export const openAIService = new OpenAIService();