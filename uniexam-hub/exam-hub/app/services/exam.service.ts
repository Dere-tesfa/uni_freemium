// This is a server-side service. 
// In a real full-stack app, this would use Prisma, Drizzle, or raw SQL.

export class ExamService {
  static async getAllExams() {
    // In production: return await prisma.exam.findMany();
    return [
      { id: "1", title: "CS-101 Final Exam", dept: "Computer Science", price: 15, rating: 4.8, purchases: "1.2k" },
      { id: "2", title: "Bio-202 Midterm", dept: "Biology", price: 20, rating: 4.9, purchases: "800" },
      { id: "3", title: "Eng-305 Analysis", dept: "Engineering", price: 25, rating: 4.7, purchases: "2.1k" },
      { id: "4", title: "Med-101 Anatomy", dept: "Medicine", price: 30, rating: 5.0, purchases: "3.5k" },
      { id: "5", title: "Math-201 Calculus", dept: "Mathematics", price: 18, rating: 4.6, purchases: "4.2k" },
      { id: "6", title: "Arch-404 Design", dept: "Architecture", price: 40, rating: 4.9, purchases: "600" },
    ];
  }

  static async getExamById(id: string) {
    const exams = await this.getAllExams();
    return exams.find(e => e.id === id);
  }

  static async submitExam(examId: string, answers: any) {
    // Logic for AI explanation here
    // 1. Compare answers
    // 2. Call OpenAI for wrong answers
    // 3. Save result to DB
    return {
      score: 85,
      explanations: [
        { qId: "q1", explanation: "AI: The correct answer is B because..." }
      ]
    };
  }
}
