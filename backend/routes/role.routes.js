import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { addRole, listRoles } from "../controllers/role.controller.js";

const router = Router();

router.post("/", adminAuth, addRole);
router.get("/", adminAuth, listRoles);

export default router;
