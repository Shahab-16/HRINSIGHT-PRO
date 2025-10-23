import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  createHRRegistrationRequest,
  listHRRequests,
  updateHRRequestStatus
} from "../controllers/hrRequest.controller.js";

const router = Router();

// public endpoint for HRs to request registration
router.post("/", createHRRegistrationRequest);

// admin-only list + approve/reject
router.get("/", adminAuth, listHRRequests);
router.patch("/:id/status", adminAuth, updateHRRequestStatus);

export default router;
