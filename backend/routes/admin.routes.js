import { Router } from "express";
import { adminLogin, seedOneAdminIfEmpty,uploadQuestions, getAllQuestions, deleteQuestion,sendInvites} from "../controllers/admin.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

// one-time helper to seed a default admin if none exists
router.post("/seed-admin", seedOneAdminIfEmpty);

// admin login
router.post("/login", adminLogin);

router.post("/questions/upload", uploadQuestions);
router.get("/questions", getAllQuestions);
router.delete("/questions/:id", deleteQuestion);

router.post("/send-invites", sendInvites);


export default router;
