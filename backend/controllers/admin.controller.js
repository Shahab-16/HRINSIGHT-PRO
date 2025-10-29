import { prisma } from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import qrcode from "qrcode";
import twilio from "twilio";
import { Resend } from "resend";

// Initialize clients
const resend = new Resend(process.env.RESEND_API_KEY);
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
      return res
        .status(400)
        .json({ message: "Set SEED_ADMIN_EMAIL & SEED_ADMIN_PASSWORD in .env" });
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

    console.log("Admin Login", email, password);
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
    return res
      .status(500)
      .json({ message: "Failed to upload questions", error: error.message });
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
    return res
      .status(500)
      .json({ message: "Failed to fetch questions", error: error.message });
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
    return res
      .status(500)
      .json({ message: "Failed to delete question", error: error.message });
  }
};

/* ===========================================================
   SEND INVITES (WORKS LOCALLY + ON RENDER)
=========================================================== */
export const sendInvites = async (req, res) => {
  try {
    const { emails = [], phones = [] } = req.body;
    console.log("inside send invites", emails, phones);

    if (!emails.length && !phones.length) {
      return res.status(400).json({ message: "No recipients provided." });
    }

    const sentInvites = [];

    // ===== EMAIL INVITES (RESEND) =====
    for (const email of emails) {
      const token = Math.random().toString(36).substring(2, 15);

      const invite = await prisma.candidateInvite.create({
        data: { email, token },
      });

      const testLink = `${process.env.FRONTEND_URL}/register?token=${invite.token}`;
      const qrImage = await qrcode.toDataURL(testLink);

      console.log("📧 Sending via Resend API:", email);
      const response = await resend.emails.send({
        from: "HRInsight Pro <onboarding@resend.dev>",
        to: email,
        subject: "📊 Your HRInsight Pro Diagnostic Test Invitation",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; background: #f9fafb; padding: 20px; border-radius: 10px;">
            <h2 style="color: #2563eb;">HRInsight Pro Test Invitation</h2>
            <p>Hi there 👋,</p>
            <p>You’ve been invited to take a <strong>diagnostic test</strong> on HRInsight Pro.</p>
            <p>Click the button below or scan the QR code to begin:</p>
            <a href="${testLink}" 
               style="display:inline-block; margin-top:10px; background:#2563eb; color:#fff; text-decoration:none; padding:10px 20px; border-radius:6px;">
               Start Test
            </a>
            <br/><br/>
            <img src="${qrImage}" alt="QR Code" style="width:180px; height:180px; border:1px solid #ddd; padding:5px; border-radius:8px;"/>
            <p style="font-size: 12px; color: #666; margin-top:15px;">This link is unique to you. Do not share it with anyone.</p>
            <hr style="margin-top:20px;"/>
            <p style="font-size: 13px; color: #888;">© ${new Date().getFullYear()} HRInsight Pro | Perennial Systems</p>
          </div>
        `,
      });

      console.log("✅ Resend response:", response);
      sentInvites.push({ email, token, testLink });
    }

    // ===== WHATSAPP INVITES (TWILIO) =====
    for (const phone of phones) {
      const token = Math.random().toString(36).substring(2, 15);
      const invite = await prisma.candidateInvite.create({
        data: { phone, token },
      });

      const testLink = `${process.env.FRONTEND_URL}/register?token=${invite.token}`;

      try {
        await client.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM,
          to: `whatsapp:+91${phone}`,
          body: `Hi! You’re invited to take your HRInsight Pro diagnostic test.\n\nClick here: ${testLink}\n\nor check your email for the QR code.`,
        });
        console.log(`✅ WhatsApp sent to ${phone}`);
      } catch (err) {
        console.error(`❌ WhatsApp failed for ${phone}:`, err.message);
      }

      sentInvites.push({ phone, token, testLink });
    }

    return res.status(200).json({
      message: "Invites sent successfully.",
      sentInvites,
    });
  } catch (error) {
    console.error("❌ Error in sendInvites:", error);
    return res
      .status(500)
      .json({ message: "Error sending invites", error: error.message });
  }
};
