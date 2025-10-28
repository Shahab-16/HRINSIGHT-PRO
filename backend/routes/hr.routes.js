import express from "express";
import { registerHR, verifyHR, loginHR,getAllQuestions } from "../controllers/hr.controller.js";


const router = express.Router();

router.post("/register", registerHR);  
router.post("/verify", verifyHR);       
router.post("/login", loginHR);        
router.get("/get-all-questions",getAllQuestions) 

export default router;
