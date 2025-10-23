import { prisma } from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// helper endpoint to seed one admin if none exists
export const seedOneAdminIfEmpty = async (req, res) => {
  try {
    const count = await prisma.admin.count();
    if (count > 0) return res.json({ message: "Admin already exists" });

    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!email || !password) {
      return res.status(400).json({ message: "Set SEED_ADMIN_EMAIL & SEED_ADMIN_PASSWORD in .env" });
    }
    const hash = await bcrypt.hash(password, 10);
    await prisma.admin.create({ data: { email, password: hash } });
    return res.json({ message: "Seed admin created", email });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
