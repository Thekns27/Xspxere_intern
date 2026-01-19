import { AnswerPayload } from "../service/answer.service";
import { QuestionPayload } from "../service/question.service";

export interface CheckResult {
  isValid: boolean;
  message?: string;
}

export function validateAnswerPayload(payload: AnswerPayload): CheckResult {
  if (!payload) {
    return { isValid: false, message: "Invalid payload" };
  }

  switch (payload.answerType) {
    case "boolean":
      if (typeof payload.answer !== "boolean") {
        return { isValid: false, message: "Answer must be boolean" };
      }
      break;

    case "blank":
      if (typeof payload.answer !== "string") {
        return { isValid: false, message: "Answer must be string" };
      }
      break;

    case "choices":
      if (
        !Array.isArray(payload.answer) ||
        !payload.answer.every((a) => typeof a === "string")
      ) {
        return {
          isValid: false,
          message: "Answer must be an array of strings for CHOICES type",
        };
      }
      break;

    default:
      return { isValid: false, message: "Invalid answerType" };
  }

  return { isValid: true };
}

export function validateQuestionPayload(payload: QuestionPayload): CheckResult {
  if (!payload) {
    return { isValid: false, message: "Invalid payload" };
  }

  switch (payload.questionType) {
    case "boolean":
      if (typeof payload.correctAnswer !== "boolean") {
        return {
          isValid: false,
          message: "correctAnswer must be boolean for BOOLEAN question type",
        };
      }
      console.log("hello1");
      break;

    case "blank":
      if (typeof payload.correctAnswer !== "string") {
        return {
          isValid: false,
          message: "correctAnswer must be string for BLANK question type",
        };
      }
      console.log("hello2");

      break;

    case "choices":
      if (
        !Array.isArray(payload.correctAnswer) ||
        payload.correctAnswer.length === 0 ||
        !payload.correctAnswer.every((a) => typeof a === "string")
      ) {
        return {
          isValid: false,
          message:
            "correctAnswer must be a non-empty array of strings for CHOICES question type",
        };
      }
      console.log("hello3");
      break;

    default:
      return { isValid: false, message: "Invalid questionType" };
  }

  return { isValid: true };
}
