import { prisma } from "../DB/db.config.js";

/**
 * Body:
 * {
 *   roleId: number,
 *   area: "Analytics" | "Sales & Marketing" | string,
 *   text: string,
 *   options: [
 *     { label: "A", text: "option text", maturity: 1 },
 *     ...
 *   ]
 * }
 */
export const addQuestionWithOptions = async (req, res) => {
  try {
    const { roleId, area, text, options } = req.body;

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "At least two options required" });
    }
    for (const op of options) {
      if (!op.label || !op.text || !op.maturity) {
        return res.status(400).json({ message: "Each option needs label, text, maturity(1-4)" });
      }
      if (op.maturity < 1 || op.maturity > 4) {
        return res.status(400).json({ message: "Maturity must be 1..4" });
      }
    }

    const q = await prisma.question.create({
      data: {
        roleId,
        area,
        text,
        options: {
          create: options.map(o => ({
            label: o.label,
            text: o.text,
            maturity: o.maturity
          }))
        }
      },
      include: { options: true }
    });

    return res.status(201).json(q);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const listQuestionsByRole = async (req, res) => {
  try {
    const roleId = Number(req.params.roleId);
    const items = await prisma.question.findMany({
      where: { roleId },
      include: { options: true },
      orderBy: { createdAt: "desc" }
    });
    return res.json(items);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
