import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  generateCandidateToken,
  verifyCandidateToken
} from "../controllers/token.controller.js";

const router = Router();

// admin generates tokenized test link for a candidate (role-based)
router.post("/generate", adminAuth, generateCandidateToken);

// public verify (used by frontend when user opens link)
router.get("/verify/:token", verifyCandidateToken);

export default router;
