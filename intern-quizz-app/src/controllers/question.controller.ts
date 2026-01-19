import { Request, Response, NextFunction } from "express";
import { QuestionService } from "../service/question.service";
import { Question } from "../model/question";
import { ApiResponse } from "../types/auth.type";
import { questionRepository } from "../repositories/question.repository";
import { validateQuestionPayload } from "../utils/check.q&a.utils";
import { QuestionPayload } from "../service/question.service";

export interface IQuestionController {
  createQuestion: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<ApiResponse<{ message: string; data: Question }>>>;

  getAllQuestion: (
    req: Request,
    res: Response
  ) => Promise<Response<ApiResponse<Question[]>>>;

  getQuestionById: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<ApiResponse<Question | null>>>;

  updateQuestion: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<ApiResponse<Question | null>>>;

  deleteQuestion: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<ApiResponse<Question | null>>>;
}

export class QuestionController implements IQuestionController {
  createQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: QuestionPayload = req.body;

      if (!payload) {
        return res.status(400).json({
          success: false,
          message: "Invalid payload",
          data: null,
        });
      }

      const validation = validateQuestionPayload(payload);
      console.log("hello");

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
          data: null,
        });
      }

      const questionService = new QuestionService(questionRepository);
      const createdQuestion = await questionService.create(payload);

      return res.status(201).json({
        success: true,
        message: "Question created successfully",
        data: createdQuestion,
      });
    } catch (e) {
      console.error("Error in createQuestion:", e);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
      });
    }
  };

  getAllQuestion = async (req: Request, res: Response) => {
    try {
      const questionService = new QuestionService(questionRepository);
      const questions = await questionService.getAll();

      return res.status(200).json({
        success: true,
        message: "Questions fetched successfully",
        data: questions,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
      });
    }
  };

  getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const questionService = new QuestionService(questionRepository);
      const question = await questionService.getQuestionById(Number(id));

      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "get question successfully with id",
        data: question,
      });
    } catch (e) {
      next(e);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
      });
    }
  };

  updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const questionService = new QuestionService(questionRepository);

      const existing = await questionService.getQuestionById(Number(id));
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
          data: null,
        });
      }
      const updated = await questionService.update(Number(id), updateData);

      return res.status(200).json({
        success: true,
        message: "Question updated successfully",
        data: updated,
      });
    } catch (e) {
      next(e);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
      });
    }
  };

  deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const questionService = new QuestionService(questionRepository);

      const question = await questionService.getQuestionById(Number(id));

      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
          data: null,
        });
      }

      await questionService.delete(Number(id));
      return res.status(200).json({
        success: true,
        message: "Question deleted successfully",
        data: question,
      });
    } catch (e) {
      next(e);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
      });
    }
  };
}
