import { Repository } from "typeorm";
import { Question, QuestionType, correctAnswer } from "../model/question";
import { AppError } from "../error-codes/app.error";
import { ErrorCodes } from "../error-codes/auth.error";

export interface QuestionPayload {
  title: string;
  questionType: QuestionType;
  correctAnswer: correctAnswer;
  score?: number;
}
export interface IQuestionService {
  create(payload: QuestionPayload): Promise<Question>;
  getAll(): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question>;
  getSingleAnswerByRank(rank: number): Promise<Question | null>;
  update(id: number, payload: QuestionPayload): Promise<Question>;
  delete(id: number): Promise<{ message: string }>;
}

export class QuestionService implements IQuestionService {
  constructor(private readonly questionRepository: Repository<Question>) {}

  async create(payload: QuestionPayload): Promise<Question> {
    const { title, questionType, correctAnswer, score } = payload;

    if (!title?.trim() || correctAnswer === undefined) {
      throw new AppError(
        "Missing required fields",
        ErrorCodes.QUESTION_MISSING_FIELDS,
        400
      );
    }

    if (!Object.values(QuestionType).includes(questionType)) {
      throw new AppError("Invalid question type", "QUESTION_TYPE_INVALID", 400);
    }

    const existing = await this.questionRepository.findOne({
      where: { title },
    });

    if (existing) {
      throw new AppError(
        "Question already exists",
        ErrorCodes.QUESTION_ALREADY_EXISTS,
        409
      );
    }

    const question = this.questionRepository.create({
      title: title.trim(),
      questionType,
      correctAnswer,
      score: score ?? 0,
    });

    return this.questionRepository.save(question);
  }

  async getAll(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async getQuestionById(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
    });

    if (!question) {
      throw new AppError(
        "Question not found",
        ErrorCodes.QUESTION_NOT_FOUND,
        404
      );
    }

    return question;
  }

  async getSingleAnswerByRank(rank: number): Promise<Question | null> {
    return this.questionRepository.findOne({ where: { rank } });
  }

  async update(id: number, payload: QuestionPayload): Promise<Question> {
    const question = await this.getQuestionById(id);

    question.title = payload.title?.trim() ?? question.title;
    question.questionType = payload.questionType ?? question.questionType;
    question.correctAnswer = payload.correctAnswer ?? question.correctAnswer;
    question.score = payload.score ?? question.score;

    return this.questionRepository.save(question);
  }

  async delete(id: number): Promise<{ message: string }> {
    const question = await this.getQuestionById(id);
    await this.questionRepository.remove(question);

    return { message: "Question deleted successfully" };
  }
}
