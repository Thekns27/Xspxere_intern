import { AnswerRepository } from "./../repositories/answer.repository";
import {
  AnswerPayload,
  AnswerService,
  IAnswerService,
} from "./../service/answer.service";
import { Answer } from "./../model/answer";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/auth.type";
import { AppError } from "../error-codes/app.error";
import { questionRepository } from "../repositories/question.repository";
import { Question } from "../model/question";
import { Repository } from "typeorm";
import { userRepository } from "../repositories/user.repository";
import { validateAnswerPayload } from "../utils/check.q&a.utils";

export interface IAnswerController {
  createAnswer: (
    req: Request,
    res: Response
  ) => Promise<Response<ApiResponse<Answer | null>>>;

  createAnswerForQuizz: (
    req: Request,
    res: Response
  ) => Promise<Response<ApiResponse<Answer>>>;
  getQuizzForAnswer: (
    req: Request,
    res: Response
  ) => Promise<Response<ApiResponse<Question>>>;
  getAllAnswers: (
    req: Request,
    res: Response
  ) => Promise<Response<ApiResponse<Answer[]>>>;

  getAllAnswersByUserId: (
    req: Request,
    res: Response
  ) => Promise<Response<ApiResponse<Answer[] | null>>>;

  getMyAnswers: (
    req: Request,
    res: Response
  ) => Promise<Response<ApiResponse<Answer[]>>>;

  updateAnswer: (
    req: Request,
    res: Response
  ) => Promise<Response<ApiResponse<Answer | null>>>;

  deleteAnswer: (
    req: Request,
    res: Response
  ) => Promise<Response<ApiResponse<Answer | null>>>;
}

export class AnswerController implements IAnswerController {
  private answerService: AnswerService;

  constructor() {
    this.answerService = new AnswerService(
      questionRepository,
      AnswerRepository
    );
  }

  createAnswerForQuizz = async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const payload: AnswerPayload = req.body;
    const answer = await this.answerService.createAnswerForQuizz(
      userId,
      payload
    );
    console.log(answer);
    return res.status(200).json({
      message: `Create answer for question no.${answer.question.rank} !`,
      data: answer,
    });
  };

  getQuizzForAnswer = async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const showQuestion = await this.answerService.getQuizzForAnswer(userId);
    return res.status(200).json({
      message: "Next question....",
      data: showQuestion,
    });
  };

  getAllAnswers = async (req: Request, res: Response) => {
    const answers = await this.answerService.getAllAnswers();
    return res.status(200).json({
      message: "All answers!",
      data: answers,
    });
  };

  getAllAnswersByUserId = async (req: Request, res: Response) => {
    const userId = +req.params.id;
    console.log("userId: ", userId);
    const answers = await this.answerService.getAllAnswersByUserId(userId);
    console.log(answers?.length);
    if (answers?.length === 0) {
      return res.status(200).json({
        message: `No answer from user id: ${userId}!`,
        data: answers,
      });
    }
    return res.status(200).json({
      message: `All answers from user id: ${userId}!`,
      data: answers,
    });
  };

  // createAnswer = async (
  //   req: Request,
  //   res: Response<ApiResponse<Answer | null>>
  // ): Promise<Response<ApiResponse<Answer | null>>> => {
  //   const userId = Number(req.params.id);
  //   const payload: AnswerPayload = req.body;

  //   if (!userId) {
  //     throw new AppError("userId not found", "INVALID_USER", 400);
  //   }

  //   if (!payload) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Invalid payload",
  //       data: null,
  //     });
  //   }

  //   const check = await AnswerRepository.findOne({
  //     where: {
  //       user: { id: userId },
  //       question: { id: payload.questionId },
  //     },
  //   });

  //   if (check) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Answer already created",
  //       data: null,
  //     });
  //   }

  //   const validation = validateAnswerPayload(payload);

  //   if (!validation.isValid) {
  //     return res.status(400).json({
  //       success: false,
  //       message: validation.message!,
  //       data: null,
  //     });
  //   }

  //   const answerUser = await this.answerService.createAnswer(userId, payload);

  //   return res.status(201).json({
  //     success: true,
  //     message: "Answer created successfully",
  //     data: answerUser,
  //   });
  // };

   createAnswer = async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const payload: AnswerPayload = req.body;

    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload",
        data: null,
      });
    }

    // const check = await AnswerRepository.findOne({
    //   where: {
    //     user: { id: userId },
    //     question: { id: payload.questionId },
    //   },
    // });

    // if (check) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Answer already created",
    //     data: null,
    //   });
    // }

    const validation = validateAnswerPayload(payload);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message!,
        data: null,
      });
    }

    const answer = await this.answerService.createAnswer(userId, payload);
    console.log(answer);
    return res.status(200).json({
      message: `Create answer for question no.${answer.question.rank} !`,
      data: answer,
    });
  };

  getMyAnswers = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const answers = await this.answerService.getMyAnswers(userId);
    return res.status(200).json({
      success: true,
      message: "Answers fetched successfully",
      data: answers,
    });
  };

  updateAnswer = async (req: Request, res: Response) => {
    try {
      const answerId = +req.params.id;

      if (!answerId) {
        return res.status(400).json({
          success: false,
          message: "Invalid answerId",
          data: null,
        });
      }

      const payload: AnswerPayload = req.body;

      if (!payload) {
        return res.status(400).json({
          success: false,
          message: "Invalid payload",
          data: null,
        });
      }

      const answer = await this.answerService.updateAnswer(answerId, payload);

      return res.status(200).json({
        success: true,
        message: "Answer updated successfully",
        data: answer,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  };

  deleteAnswer = async (req: Request, res: Response) => {
    const answerId = Number(req.params.id);
    await this.answerService.deleteAnswer(answerId);
    return res.status(200).json({
      success: true,
      message: "Answer deleted successfully",
      data: this.deleteAnswer,
    });
  };

  totalScoreOfUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const totalScore = await this.answerService.getAllAnswersByUserId(
        Number(id)
      );
      const useranswerData = totalScore.map((item) => item.score);
      const totalScoreOfUser = useranswerData.reduce((a, b) => a + b, 0);
      const rank = await this.answerService.getCurrentRank(Number(id));
      const question = await this.answerService.getSingleAnswerByRank(
        Number(rank)
      );
      const nextRank = await this.answerService.getSingleAnswerByRank(
        Number(rank) + 1
      );

      //const answeredRank = await this.answerService.getSingleAnswerByRank(Number(rank));

      if (rank === 0) {
        throw new AppError(
          "User has not answered any question",
          "ERROR_ONE",
          400
        );
      }
      if (question === null) {
        throw new AppError(
          "Great job finishing all questions!",
          "ERROR_ONE",
          400
        );
      }
      if (totalScoreOfUser === 0) {
        return res.status(200).json({
          success: true,
          message: "Total score of user fetched successfully",
          data: {},
        });
      }

      if (!totalScore) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Total score of user fetched successfully",
        data: { totalScoreOfUser, rank, nextRank },
      });
    } catch (e) {
      next(e);
    }
  };
}
