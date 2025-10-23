import { Router } from "express";
import { adminLogin, seedOneAdminIfEmpty } from "../controllers/admin.controller.js";

const router = Router();

// one-time helper to seed a default admin if none exists
router.post("/seed-admin", seedOneAdminIfEmpty);

// admin login
router.post("/login", adminLogin);

export default router;
