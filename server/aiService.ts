/**
 * This module provides AI-powered health consultation services.
 * In a real application, this would integrate with Gemini AI models via API.
 */

class AIService {
  private readonly responses: Map<string, string[]>;
  
  constructor() {
    // Pre-define some responses for common health queries
    this.responses = new Map([
      ['headache', [
        "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or eye strain. Based on what you've shared, it sounds like your headaches might be related to dehydration and irregular sleep patterns. I recommend:\n\n1. Increasing your water intake throughout the day\n2. Establishing a more regular sleep schedule\n3. Taking short breaks from screen time\n4. Trying some gentle stretching for your neck and shoulders\n\nIf your headaches persist or worsen, please consult with a healthcare professional for a proper evaluation.",
        "I understand you're experiencing headaches. Let's look at some common causes and potential solutions:\n\n• Tension headaches: Often caused by stress and muscle tension\n• Dehydration headaches: Not drinking enough water\n• Eyestrain headaches: Too much screen time without breaks\n• Sinus headaches: Related to congestion and sinus pressure\n\nSome steps you might consider:\n1. Stay hydrated (aim for 8 glasses of water daily)\n2. Practice stress-reduction techniques like deep breathing\n3. Ensure you're getting adequate sleep (7-9 hours)\n4. Take regular breaks from screens using the 20-20-20 rule\n\nIf your headaches are severe, sudden, or accompanied by other symptoms like fever or stiff neck, please seek medical attention promptly."
      ]],
      ['sleep', [
        "Improving sleep quality is crucial for overall health. Based on your description of irregular sleep due to work, here are some evidence-based strategies:\n\n1. Consistent schedule: Try to go to bed and wake up at the same time daily, even on weekends\n2. Create a relaxing bedtime routine: Reading, gentle stretching, or meditation can signal to your body it's time for sleep\n3. Optimize your sleep environment: Keep your bedroom dark, quiet, and cool\n4. Limit screen time: Avoid phones, tablets, and computers 1-2 hours before bed\n5. Watch caffeine and alcohol consumption: Both can disrupt sleep quality\n6. Physical activity: Regular exercise promotes better sleep, but try to finish workouts at least 3 hours before bedtime\n\nIf your sleep problems persist despite these measures, consider discussing with a healthcare provider as it could be related to a sleep disorder or other health condition.",
        "Sleep is essential for cognitive function, emotional regulation, and physical health. To improve your sleep quality:\n\n• Create a consistent sleep schedule\n• Make your bedroom comfortable and conducive to sleep\n• Reduce exposure to blue light before bedtime\n• Avoid large meals, caffeine, and alcohol before sleeping\n• Try relaxation techniques like deep breathing or progressive muscle relaxation\n• Exercise regularly, but not too close to bedtime\n• Limit daytime naps to 20-30 minutes\n\nIf you're struggling with significant sleep issues like insomnia, sleep apnea, or excessive daytime sleepiness, please consult with a healthcare provider."
      ]],
      ['stress', [
        "Managing stress effectively is important for both mental and physical health. Here are some evidence-based stress management techniques:\n\n1. Mindfulness meditation: Even 5-10 minutes daily can help reduce stress hormones\n2. Physical activity: Regular exercise releases endorphins that improve mood\n3. Deep breathing exercises: Try the 4-7-8 technique (inhale for 4, hold for 7, exhale for 8)\n4. Progressive muscle relaxation: Tensing and releasing muscle groups\n5. Time management: Prioritize tasks and set realistic goals\n6. Social connections: Talking with trusted friends or family members\n7. Limiting stimulants: Reducing caffeine and alcohol can help stress levels\n8. Nature exposure: Spending time outdoors can reduce stress hormones\n\nIf stress is significantly impacting your daily life or causing physical symptoms, consider speaking with a mental health professional for additional support.",
        "Chronic stress can impact your physical health, emotional wellbeing, and cognitive function. Here are strategies for stress management:\n\n• Practice mindfulness and meditation\n• Engage in regular physical activity\n• Maintain social connections\n• Get adequate sleep\n• Use time management techniques\n• Consider journaling to process thoughts\n• Limit news and social media consumption\n• Try progressive muscle relaxation\n\nRemember that some stress is normal, but if you're experiencing persistent symptoms like trouble sleeping, irritability, difficulty concentrating, or physical symptoms, it may be beneficial to speak with a healthcare provider."
      ]],
      ['nutrition', [
        "Good nutrition is fundamental to overall health. Here are some evidence-based guidelines:\n\n1. Balanced diet: Include a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats\n2. Portion control: Be mindful of serving sizes\n3. Hydration: Aim for approximately 8 cups (64 oz) of water daily\n4. Limit processed foods: These often contain excess sodium, sugar, and unhealthy fats\n5. Mindful eating: Pay attention to hunger and fullness cues\n6. Meal planning: Prepare healthy meals in advance when possible\n7. Read nutrition labels: Understand what you're consuming\n\nSpecific nutritional needs can vary based on age, sex, activity level, and health conditions. If you have specific health concerns or dietary restrictions, considering consulting with a registered dietitian for personalized advice.",
        "Nutrition plays a crucial role in preventing disease and maintaining energy levels. Here are key nutrition principles:\n\n• Eat a rainbow of colorful fruits and vegetables daily\n• Choose whole grains over refined grains\n• Include quality protein sources (plant or animal-based)\n• Incorporate healthy fats like those from avocados, nuts, and olive oil\n• Limit added sugars and highly processed foods\n• Stay hydrated throughout the day\n• Practice mindful eating\n\nRemember that small, sustainable changes are more effective than drastic diets. If you have specific health concerns or conditions like diabetes, heart disease, or food allergies, please consult with a healthcare provider or registered dietitian."
      ]],
      ['default', [
        "Thank you for sharing your health concern. While I can provide general health information, I'm not able to diagnose specific conditions or replace professional medical advice.\n\nBased on what you've shared, I'd recommend monitoring your symptoms and considering the following general wellness practices:\n\n• Stay hydrated\n• Maintain regular sleep patterns\n• Engage in moderate physical activity\n• Practice stress management techniques\n• Eat a balanced diet\n\nIf your symptoms persist or worsen, please consult with a healthcare provider who can provide a proper evaluation and personalized treatment plan. Would you like more information about any specific aspect of your health concern?",
        "I appreciate you sharing your health concern. As an AI assistant, I can provide general health information, but cannot diagnose medical conditions or replace professional healthcare.\n\nSome general wellness recommendations include:\n\n1. Listen to your body and note any patterns in your symptoms\n2. Maintain healthy lifestyle habits including adequate sleep, nutrition, and exercise\n3. Consider stress management techniques if stress might be contributing to your symptoms\n4. Keep track of your symptoms to share with your healthcare provider\n\nFor specific medical advice, diagnosis, or treatment recommendations, please consult with a qualified healthcare professional who can evaluate your individual situation. Is there any particular aspect of your health that you'd like to learn more about?"
      ]]
    ]);
  }

  /**
   * Processes a health-related query and returns an AI-generated response
   */
  async getResponse(message: string, userId: number): Promise<string> {
    // In a real application, this would call Gemini API with proper context
    
    // Simulate processing delay
    await this.simulateProcessingDelay();
    
    // Determine response based on keywords in the message
    let responseCategory = 'default';
    
    const messageLower = message.toLowerCase();
    if (messageLower.includes('headache') || messageLower.includes('pain') || messageLower.includes('migraine')) {
      responseCategory = 'headache';
    } else if (messageLower.includes('sleep') || messageLower.includes('insomnia') || messageLower.includes('tired')) {
      responseCategory = 'sleep';
    } else if (messageLower.includes('stress') || messageLower.includes('anxiety') || messageLower.includes('worry')) {
      responseCategory = 'stress';
    } else if (messageLower.includes('nutrition') || messageLower.includes('diet') || messageLower.includes('food') || messageLower.includes('eat')) {
      responseCategory = 'nutrition';
    }
    
    // Get responses for the category
    const responses = this.responses.get(responseCategory) || this.responses.get('default')!;
    
    // Return a random response from the category
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Simulates AI processing delay
   */
  private async simulateProcessingDelay(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, Math.random() * 1000 + 500); // 500-1500ms delay
    });
  }
}

export const aiService = new AIService();
