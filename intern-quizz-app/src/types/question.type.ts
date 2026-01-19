
import {QuestionType,correctAnswer} from "../model/question"

export interface Question {
  id: number;
  title: string;
  questionType: QuestionType;
  correctAnswer: correctAnswer;
  createdAt: Date;
  updatedAt: Date;
}