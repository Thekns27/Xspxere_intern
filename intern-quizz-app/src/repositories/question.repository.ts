
import { AppDataSource } from "../config/database";
import {Question} from "../model/question"


export const questionRepository = AppDataSource.getRepository(Question);