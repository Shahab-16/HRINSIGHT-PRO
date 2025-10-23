import { prisma } from "../DB/db.config.js";

export const addRole = async (req, res) => {
  try {
    const { name } = req.body;
    const r = await prisma.role.create({ data: { name } });
    return res.status(201).json(r);
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({ message: "Role already exists" });
    }
    return res.status(500).json({ error: e.message });
  }
};

export const listRoles = async (_req, res) => {
  try {
    const roles = await prisma.role.findMany({ orderBy: { createdAt: "desc" } });
    return res.json(roles);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
