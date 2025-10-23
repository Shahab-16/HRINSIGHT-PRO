import { prisma } from "../DB/db.config.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * Admin creates candidate token to take test for a specific role.
 * Body: { email: string, roleId: number }
 * Returns: { token, link }
 */
export const generateCandidateToken = async (req, res) => {
  try {
    const { email, roleId } = req.body;
    // short opaque token to embed in URL (separate from JWT)
    const opaque = crypto.randomBytes(16).toString("hex");
    // also sign a JWT (extra verification/expiry)
    const signed = jwt.sign({ email, roleId, opaque }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    const saved = await prisma.candidateToken.create({
      data: { email, roleId, token: signed }
    });

    const link = `${process.env.FRONTEND_URL}/candidate/test/${signed}`;
    return res.status(201).json({ token: saved.token, link });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

/**
 * Public verification (front-end calls when user opens link)
 */
export const verifyCandidateToken = async (req, res) => {
  try {
    const { token } = req.params;
    const dbTok = await prisma.candidateToken.findUnique({ where: { token } });
    if (!dbTok || dbTok.used) {
      return res.status(403).json({ valid: false, reason: "invalid_or_used" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ valid: true, email: dbTok.email, roleId: dbTok.roleId, payload });
  } catch (e) {
    return res.status(401).json({ valid: false, reason: "expired_or_invalid" });
  }
};
