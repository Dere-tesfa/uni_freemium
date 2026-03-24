const { pool } = require('../config/db');
const aiService = require('../services/ai.service');

// @desc    Get all exams
exports.getAllExams = async (req, res) => {
  const result = await pool.query('SELECT exams.id, exams.title, exams.duration, departments.name AS department FROM exams JOIN departments ON exams.department_id = departments.id');
  res.json({ success: true, data: result.rows });
};

// @desc    Get single exam with questions
exports.getExamById = async (req, res) => {
  const { id } = req.params;
  const examResult = await pool.query('SELECT * FROM exams WHERE id = $1', [id]);
  const exam = examResult.rows[0];

  if (!exam) {
    return res.status(404).json({ success: false, message: 'Exam not found' });
  }

  // Fetch questions (scramble if needed)
  const questionResult = await pool.query(
    'SELECT id, text, options FROM questions WHERE exam_id = $1 ORDER BY RANDOM()', 
    [id]
  );

  res.json({
    success: true,
    data: {
      ...exam,
      questions: questionResult.rows
    }
  });
};

// @desc    Submit exam for scoring and AI explanation
exports.submitExam = async (req, res) => {
  const { id } = req.params; // examId
  const { answers, timeTaken } = req.body; // answers is an object: { questionId: answerIndex }
  const userId = req.user.id;

  // 1. Fetch correct answers and questions for context
  const questionsResult = await pool.query(
    'SELECT id, text, correct_index, options FROM questions WHERE exam_id = $1',
    [id]
  );
  
  const correctQuestions = questionsResult.rows;
  let score = 0;
  const reports = [];

  // 2. Score the exam and identify wrong answers for AI
  for (const q of correctQuestions) {
    const userAnswerIndex = answers[q.id];
    const isCorrect = (userAnswerIndex !== undefined) && (userAnswerIndex === q.correct_index);

    if (isCorrect) {
      score++;
    }

    reports.push({
      questionId: q.id,
      text: q.text,
      userAnswer: q.options[userAnswerIndex] || 'No answer',
      correctAnswer: q.options[q.correct_index],
      isCorrect,
      explanation: null, // to be filled if incorrect
    });
  }

  // 3. Generate AI explanations for wrong answers concurrently
  const aiTasks = reports
    .filter((r) => !r.isCorrect)
    .map(async (r) => {
      r.explanation = await aiService.explainWrongAnswer(r.text, r.userAnswer, r.correctAnswer);
    });
  
  await Promise.all(aiTasks);

  // 4. Save result to database
  const finalResult = await pool.query(
    'INSERT INTO results (user_id, exam_id, score, total_questions, time_spent, detail_json) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [userId, id, score, correctQuestions.length, timeTaken, JSON.stringify(reports)]
  );

  res.status(201).json({
    success: true,
    data: {
      score,
      total: correctQuestions.length,
      percentage: ((score / correctQuestions.length) * 100).toFixed(2),
      reports,
      resultId: finalResult.rows[0].id,
    }
  });
};

// @desc    Get past exam result
exports.getExamResult = async (req, res) => {
  const { id } = req.params; // resultId or examId
  const result = await pool.query('SELECT * FROM results WHERE id = $1', [id]);
  res.json({ success: true, data: result.rows[0] });
};

// @desc    Admin: Create exam
exports.createExam = async (req, res) => {
  const { title, description, duration, price, department_id } = req.body;
  const result = await pool.query(
    'INSERT INTO exams (title, description, duration, price, department_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, description, duration, price, department_id]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
};
