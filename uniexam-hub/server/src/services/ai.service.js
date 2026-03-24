const { OpenAI } = require('openai');
const { env } = require('../config/env');

const openai = new OpenAI({
  apiKey: env.openaiApiKey,
});

exports.explainWrongAnswer = async (question, userAnswer, correctAnswer) => {
  if (!env.openaiApiKey) {
    return 'Default explanation: You chose the incorrect answer. Review your notes for this topic.';
  }

  try {
    const prompt = `
      Question: ${question}
      User's Answer: ${userAnswer}
      Correct Answer: ${correctAnswer}

      Provide a short (max 2 sentences), encouraging explanation on why the User's choice was incorrect 
      and how the Correct Answer is better conceptually. Use friendly, academic tone suitable for a student.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: 'You are an AI Education Tutor for UniExam Hub.' }, { role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ AI service error:', error.message);
    return `The correct answer is "${correctAnswer}". Conceptual review is recommended.`;
  }
};
