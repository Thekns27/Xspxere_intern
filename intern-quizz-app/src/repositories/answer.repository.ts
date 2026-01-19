import { Answer } from "../model/answer";
import { AppDataSource } from "../config/database";

export const AnswerRepository = AppDataSource.getRepository(Answer);