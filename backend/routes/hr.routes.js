import express from "express";
import { registerHR, verifyHR, loginHR } from "../controllers/hr.controller.js";

const router = express.Router();

router.post("/register", registerHR);   // sends OTP
router.post("/verify", verifyHR);       // verifies OTP
router.post("/login", loginHR);         // normal login

export default router;
