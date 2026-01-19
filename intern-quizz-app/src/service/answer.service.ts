import { Question } from "../model/question";
import { correctAnswer } from "./../model/question";
import { Repository } from "typeorm";
import { Answer, answerType } from "../model/answer";
import { QuestionService } from "./question.service";
import { AppError } from "../error-codes/app.error";

export interface AnswerPayload {
  answerType: answerType;
  answer: correctAnswer;
  questionId: number;
}

export interface IAnswerService {
  createAnswer: (userId: number, payload: AnswerPayload) => Promise<Answer>;

  getMyAnswers: (userId: number) => Promise<Answer[]>;

  deleteAnswer: (id: number) => Promise<void>;

  updateAnswer: (id: number, payload: AnswerPayload) => Promise<Answer>;

  createAnswerForQuizz: (
    userId: number,
    payload: AnswerPayload
  ) => Promise<Answer>;

  getQuizzForAnswer: (userId: number) => Promise<Question | null>;

  getAllAnswers: () => Promise<Answer[]>;

  getAllAnswersByUserId: (userId: number) => Promise<Answer[] | null>;
}

export class AnswerService extends QuestionService implements IAnswerService {
  constructor(
    questionRepository: Repository<Question>,
    private answerRepository: Repository<Answer>
  ) {
    super(questionRepository);
  }

  // async createAnswerF(userId: number, payload: AnswerPayload) {
  //   const findQuestion = await this.getQuestionById(payload.questionId);
  //   let score = 0;
  //   let isCorrect = false;

  //   if (payload.answer !== findQuestion.correctAnswer) {
  //     score = 0;
  //     isCorrect = false;
  //   }

  //   if (payload.answer === findQuestion.correctAnswer) {
  //     score = 100;
  //     isCorrect = true;
  //   }

  //   const answer = this.answerRepository.create({
  //     question: {
  //       id: payload.questionId,
  //     },
  //     user: {
  //       id: userId,
  //     },
  //     answer: payload.answer,
  //     answerType: payload.answerType,
  //     isCorrect: isCorrect,
  //     score: score,
  //   });

  //   await this.answerRepository.save(answer);
  //   console.log(answer);
  //   return answer;
  // }
  async createAnswer(userId: number, payload: AnswerPayload) {
    const findAnswered = await this.getAllAnswersByUserId(userId);
    const findQID = findAnswered.map((item) => item.question.id);
    const isDuplicate = findQID.includes(payload.questionId);
    if (isDuplicate) {
      throw new AppError(
        "This question is already answered!",
        "DUPLICATE",
        400
      );
    }
    const findQuestion = await this.getQuestionById(payload.questionId);

        if (!findQuestion) {
          throw new AppError("Question not found!", "ERROR_ONE", 404);
        }
        if (!findQuestion.questionType.includes(payload.answerType)) {
          throw new AppError(
            "Answer type does not match with question type",
            "UNMATCH_WITH_QUESTIONTYPE",
            404
          );
        }

    let score = 0;
    let isCorrect = false;

    if (payload.answer !== findQuestion.correctAnswer) {
      score = 0;
      isCorrect = false;
    }

    if (payload.answer ===  findQuestion.correctAnswer) {
      score = 100;
      isCorrect = true;
    }
    console.log("payload.answer", payload.answer)


    const answer = this.answerRepository.create({
      question: {
        id: payload.questionId,
      },
      user: {
        id: userId,
      },
      answer: payload.answer,
      answerType: payload.answerType,
      isCorrect: isCorrect,
      score: score,
    });

    console.log(answer);
    return await this.answerRepository.save(answer);
  }

  async getMyAnswers(userId: number): Promise<Answer[]> {
    return this.answerRepository.find({
      where: { user: { id: userId } },
      relations: ["question"],
    });
  }

  async updateAnswer(id: number, payload: AnswerPayload) {
    const answer = await this.answerRepository.findOne({
      where: { id },
      relations: ["question"],
    });

    if (!answer) {
      throw new AppError("Answer not found", "ANSWER_NOT_FOUND", 404);
    }
    if (answer.question.id !== payload.questionId) {
      throw new AppError(
        "Question ID does not match",
        "INVALID_QUESTION_ID",
        400
      );
    }

    let score = 0;
    let isCorrect = false;

    if (payload.answer !== answer.question.correctAnswer) {
      score = 0;
      isCorrect = false;
    }

    if (payload.answer === answer.question.correctAnswer) {
      score = 100;
      isCorrect = true;
    }

    answer.answerType = payload.answerType;
    answer.answer = payload.answer;
    answer.isCorrect = isCorrect;
    answer.score = score;

    return this.answerRepository.save(answer);
  }

  async deleteAnswer(id: number): Promise<void> {
    const answer = await this.answerRepository.findOne({ where: { id } });

    if (!answer) {
      throw new AppError("Answer Id not found", "ANSWER_ID_NOT_FOUND", 404);
    }

    await this.answerRepository.remove(answer);
  }

  async createAnswerForQuizz(userId: number, payload: AnswerPayload) {
    const findAnswered = await this.getAllAnswersByUserId(userId);
    const findQID = findAnswered.map((item) => item.question.id);
    const isDuplicate = findQID.includes(payload.questionId);
    if (isDuplicate) {
      throw new AppError(
        "This question is already answered!",
        "DUPLICATE",
        400
      );
    }
    const findQuestion = await this.getQuestionById(payload.questionId);

    if (!findQuestion) {
      throw new AppError("Question not found!", "ERROR_ONE", 404);
    }
    if (!findQuestion.questionType.includes(payload.answerType)) {
      throw new AppError(
        "Answer type does not match with question type",
        "UNMATCH_WITH_QUESTIONTYPE",
        404
      );
    }
    // switch (payload.answerType) {
    //   case "boolean":
    //     if (typeof payload.answer !== typeof true) {
    //       throw new AppError(
    //         "Answer must be a boolean for BOOLEAN type",
    //         "UNMATCH_WITH_QUESTIONTYPE",
    //         400
    //       );
    //     }
    //     break;
    //   case "choices":
    //     if (
    //       !Array.isArray(payload.answer) ||
    //       !payload.answer.every(
    //         (ans) => typeof ans === "string" || typeof ans === "number"
    //       )
    //     ) {
    //       throw new AppError(
    //         "Answer must be an array for CHOICES type",
    //         "UNMATCH_WITH_QUESTIONTYPE",
    //         400
    //       );
    //     }
    //     break;
    //   case "blank":
    //     if (typeof payload.answer !== "string") {
    //       throw new AppError(
    //         "Answer must be a string for BLANK type",
    //         "UNMATCH_WITH_QUESTIONTYPE",
    //         400
    //       );
    //     }
    //     break;
    //   default:
    //     throw new AppError("Invalid answer type", "ERROR_ONE", 400);
    // }
  
    let score = 0;
    let isCorrect = false;

    if (
      payload.answerType === "choices" &&
      Array.isArray(payload.answer) &&
      Array.isArray(findQuestion.correctAnswer)
    ) {
      isCorrect =
        payload.answer.length === findQuestion.correctAnswer.length &&
        payload.answer.every(
          (ans) => typeof ans !== "string" || typeof ans !== "number"
        );
      if (isCorrect === true) {
        score = findQuestion.score;
      } else {
        score = 0;
      }
    }

    if (findQuestion.correctAnswer === payload.answer) {
      score = findQuestion.score;
      isCorrect = true;
    }
    const answer = this.answerRepository.create({
      question: {
        id: payload.questionId,
      },
      user: {
        id: userId,
      },
      answer: payload.answer,
      answerType: payload.answerType,
      isCorrect: isCorrect,
      score: score,
    });
    console.log(answer);
    return await this.answerRepository.save(answer);
  }

  async getQuizzForAnswer(userId: number) {
    const rank = await this.getCurrentRank(userId);

    const question = await this.getSingleAnswerByRank(Number(rank) + 1);
    if (question === null) {
      throw new AppError(
        "Great job finishing all questions!",
        "ERROR_ONE",
        400
      );
    }
    return question;
  }

  async getAllAnswers() {
    return this.answerRepository.find();
  }

  async getAllAnswersByUserId(userId: number) {
    console.log("id : ", userId);
    return await this.answerRepository.find({
      where: {
        user: { id: userId },
      },
      order: {
        question: {
          rank: "asc",
        },
      },
      relations: {
        question: true,
      },
    });
  }

  async getCurrentRank(userId: number) {
    return await this.answerRepository
      .findOne({
        where: {
          user: { id: userId },
        },
        order: {
          question: {
            rank: "desc",
          },
        },
        relations: {
          question: true,
        },
      })
      .then((data) => data?.question.rank || 0);
  }

  async totalScoreOfUser(userId: number) {
    const totalScore = await this.answerRepository
      .findOne({
        where: {
          user: { id: userId },
        },
        order: {
          question: {
            rank: "asc",
          },
        },
        relations: {
          question: true,
        },
      })
      .then((data) => data?.score || 0);
    const rank = await this.getCurrentRank(userId);

    if (rank === 0) {
      throw new AppError(
        "User has not answered any question",
        "ERROR_ONE",
        400
      );
    }
    return totalScore;
  }
}
