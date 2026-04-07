import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../lib/logger.server';

class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private modelName = 'gemini-1.5-pro';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      logger.warn('GEMINI_API_KEY is not set. AI explanations will be disabled.');
    }
  }

  /**
   * Generate an explanation for a question's answer
   */
  async generateExplanation(questionText: string, correctAnswer: string, options: Array<{label: string, text: string}>): Promise<string> {
    if (!this.genAI) {
      return "AI explanations are currently unavailable. Please contact support.";
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      
      const prompt = `
        You are an expert tutor requested to explain a question.
        Question: "${questionText}"
        Options:
        ${options.map(o => `${o.label}: ${o.text}`).join('\n')}
        
        The correct answer is ${correctAnswer}.
        
        Please provide a concise but thorough explanation of why ${correctAnswer} is correct and why the other options are incorrect.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text() || "Could not generate an explanation.";
    } catch (error) {
      logger.error({ err: error }, 'Error generating AI explanation:');
      return "Failed to generate explanation due to an error.";
    }
  }
}

export const aiService = new AIService();
