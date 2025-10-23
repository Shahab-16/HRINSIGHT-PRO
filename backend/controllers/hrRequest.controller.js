import { prisma } from "../DB/db.config.js";

export const createHRRegistrationRequest = async (req, res) => {
  try {
    const { orgName, contactName, email } = req.body;
    const r = await prisma.hRRegistrationRequest.create({
      data: { orgName, contactName, email }
    });
    return res.status(201).json(r);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const listHRRequests = async (req, res) => {
  try {
    const list = await prisma.hRRegistrationRequest.findMany({
      orderBy: { createdAt: "desc" }
    });
    return res.json(list);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const updateHRRequestStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body; // "APPROVED" | "REJECTED"
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await prisma.hRRegistrationRequest.update({
      where: { id },
      data: { status }
    });
    return res.json(updated);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
