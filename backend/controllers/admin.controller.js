import { prisma } from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import qrcode from "qrcode";
import twilio from "twilio";
import { sendMail } from "../utils/sendEmail.js"; // ✅ Nodemailer utility

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/* ===========================================================
   SEED ADMIN (optional)
=========================================================== */
export const seedOneAdminIfEmpty = async (req, res) => {
  try {
    const count = await prisma.admin.count();
    if (count > 0) return res.json({ message: "Admin already exists" });

    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!email || !password) {
      return res.status(400).json({
        message: "Set SEED_ADMIN_EMAIL & SEED_ADMIN_PASSWORD in .env",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await prisma.admin.create({ data: { email, password: hash } });
    return res.json({ message: "Seed admin created", email });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

/* ===========================================================
   ADMIN LOGIN
=========================================================== */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Admin Login", email);
    if (
      email !== process.env.SEED_ADMIN_EMAIL ||
      password !== process.env.SEED_ADMIN_PASSWORD
    ) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("✅ Admin Login Successful");
    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

/* ===========================================================
   UPLOAD QUESTIONS
=========================================================== */
export const uploadQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: "No questions provided" });
    }

    const role =
      (await prisma.role.findFirst({ where: { name: "General" } })) ||
      (await prisma.role.create({ data: { name: "General" } }));

    const createdQuestions = [];

    for (const q of questions) {
      const question = await prisma.question.create({
        data: {
          area: q.area || "General",
          text: q.question,
          roleId: role.id,
          options: {
            create: q.options.map((opt, i) => ({
              label: String.fromCharCode(65 + i),
              text: opt,
              maturity: 0,
            })),
          },
        },
        include: { options: true },
      });

      createdQuestions.push(question);
    }

    return res.status(201).json({
      message: "Questions uploaded successfully",
      count: createdQuestions.length,
      data: createdQuestions,
    });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    return res.status(500).json({
      message: "Failed to upload questions",
      error: error.message,
    });
  }
};

/* ===========================================================
   FETCH ALL QUESTIONS
=========================================================== */
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      include: { options: true },
      orderBy: { id: "asc" },
    });
    return res.json({ questions });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return res.status(500).json({
      message: "Failed to fetch questions",
      error: error.message,
    });
  }
};

/* ===========================================================
   DELETE QUESTION
=========================================================== */
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.option.deleteMany({ where: { questionId: Number(id) } });
    await prisma.question.delete({ where: { id: Number(id) } });
    return res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    return res.status(500).json({
      message: "Failed to delete question",
      error: error.message,
    });
  }
};

/* ===========================================================
   SEND INVITES (LOCAL + DEPLOYED)
=========================================================== */

export const sendInvites = async (req, res) => {
  try {
    const { emails = [], phones = [] } = req.body;
    const emailList = emails.filter(Boolean);
    const phoneList = phones.filter(Boolean);
    const results = { emailsSent: 0, emailsFailed: 0, phonesSent: 0, phonesFailed: 0, savedInvites: 0 };
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    for (const email of emailList) {
      try {
        const token = `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`;
        const inviteLink = `${process.env.FRONTEND_URL}/register?token=${token}`;
        const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(inviteLink)}&size=200x200`;

        const html = `
          <div style="font-family:'Segoe UI',sans-serif;background:#f9fafb;padding:30px;border-radius:12px;max-width:600px;margin:auto;">
            <h2 style="color:#2563eb;text-align:center;">HRInsight Pro Test Invitation</h2>
            <p style="text-align:center;color:#334155;">You’ve been invited to take a diagnostic test.</p>
            <div style="text-align:center;margin:20px 0;">
              <a href="${inviteLink}" style="background:#2563eb;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;">🚀 Start Test</a>
            </div>
            <div style="text-align:center;margin-top:15px;">
              <img src="${qrCodeURL}" width="150" style="border:1px solid #ddd;border-radius:8px;" />
              <p style="font-size:13px;color:#64748b;">Scan to open on your phone</p>
            </div>
          </div>
        `;

        await sendMail(email, "📩 HRInsight Pro Diagnostic Test Invitation", html);
        await prisma.candidateInvite.create({ data: { email, token } });
        results.emailsSent++;
        results.savedInvites++;
        await delay(800);
      } catch (err) {
        console.error(`❌ Email failed to ${email}:`, err.message);
        results.emailsFailed++;
        await delay(800);
      }
    }

    for (const phone of phoneList) {
      try {
        const token = `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`;
        const inviteLink = `${process.env.FRONTEND_URL}/register?token=${token}`;
        const toNumber = phone.startsWith("whatsapp:") ? phone : `whatsapp:+${phone.replace(/\D/g, "")}`;
        await prisma.candidateInvite.create({ data: { phone, token } });
        await client.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM,
          to: toNumber,
          body: `You're invited to take the HRInsight Pro diagnostic test. Open: ${inviteLink}`,
        });
        results.phonesSent++;
        await delay(600);
      } catch (err) {
        console.error(`❌ WhatsApp failed to ${phone}:`, err.message);
        results.phonesFailed++;
        await delay(600);
      }
    }

    res.status(200).json({ message: "Invites processed", details: results });
  } catch (error) {
    res.status(500).json({ message: "Failed to send invitations", error: error.message });
  }
};



