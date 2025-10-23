import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  addQuestionWithOptions,
  listQuestionsByRole
} from "../controllers/question.controller.js";

const router = Router();

router.post("/", adminAuth, addQuestionWithOptions);
router.get("/role/:roleId", adminAuth, listQuestionsByRole);

export default router;
