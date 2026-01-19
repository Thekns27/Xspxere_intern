import { Router } from "express";
import { QuestionController } from "../controllers/question.controller";

const QuestionRoute = Router();
const questionController = new QuestionController();

QuestionRoute.post("/create", questionController.createQuestion);
QuestionRoute.get("/", questionController.getAllQuestion);
QuestionRoute.get("/:id", questionController.getQuestionById);
QuestionRoute.put("/update/:id", questionController.updateQuestion);
QuestionRoute.delete("/delete/:id", questionController.deleteQuestion);

export default QuestionRoute;
