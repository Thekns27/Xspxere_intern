import { Router } from "express";
import { AnswerController } from "../controllers/answer.controller";
import { authenticate } from "../middleware/auth";

const AnswerRoute = Router();
const answerController = new AnswerController();

 //AnswerRoute.post("/create/:id",authenticate,answerController.createAnswer);
 AnswerRoute.post("/answer",authenticate,answerController.createAnswer);

 AnswerRoute.get("/:id", answerController.getMyAnswers);
 AnswerRoute.put("/update/:id", answerController.updateAnswer);
 AnswerRoute.delete("/delete/:id", answerController.deleteAnswer);


AnswerRoute.post("/answer", authenticate, answerController.createAnswerForQuizz);
AnswerRoute.get("/answers", answerController.getAllAnswers);
AnswerRoute.get("/answers-by-user/:id", answerController.getAllAnswersByUserId);
AnswerRoute.put("/answer/:id", authenticate, answerController.updateAnswer);


AnswerRoute.get("/totalscore-user/:id", answerController.totalScoreOfUser);




export default AnswerRoute;