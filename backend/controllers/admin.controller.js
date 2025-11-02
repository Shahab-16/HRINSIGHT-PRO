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
    const emailList = Array.isArray(emails) ? emails.map(e => (e || "").trim()).filter(Boolean) : [];
    const phoneList = Array.isArray(phones) ? phones.map(p => (p || "").trim()).filter(Boolean) : [];

    if (emailList.length === 0 && phoneList.length === 0) {
      return res.status(400).json({ message: "Please provide at least one email or WhatsApp number." });
    }

    const results = { emailsSent: 0, emailsFailed: 0, phonesSent: 0, phonesFailed: 0, savedInvites: 0 };
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // --- Send Email Invites ---
    for (const email of emailList) {
      try {
        const token = `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`;
        const inviteLink = `${process.env.FRONTEND_URL || "https://hrinsightpro.vercel.app"}/register?token=${token}`;
        const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(inviteLink)}&size=200x200`;

        const html = `
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8;padding:30px 0;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background:#ffffff;border-radius:12px;padding:30px;font-family:'Segoe UI',Arial,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                  <tr>
                    <td align="center" style="padding-bottom:15px;">
                      <h1 style="color:#2563eb;margin:0;font-size:26px;">HRInsight Pro</h1>
                      <p style="color:#64748b;font-size:14px;margin:5px 0;">Personalized Diagnostic Test Invitation</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="color:#334155;font-size:15px;line-height:1.6;padding-top:15px;">
                      <p>Hi there 👋,</p>
                      <p>You’ve been invited to take a <strong>Diagnostic Test</strong> on <strong>HRInsight Pro</strong>.</p>
                      <p>Click the button below or scan the QR code to begin:</p>

                      <div style="text-align:center;margin:25px 0;">
                        <a href="${inviteLink}" 
                          style="display:inline-block;background-color:#2563eb;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:500;font-size:15px;">
                          🚀 Start Diagnostic Test
                        </a>
                      </div>

                      <div style="text-align:center;margin-top:20px;">
                        <img src="${qrCodeURL}" alt="QR Code" width="180" height="180" style="border:1px solid #e2e8f0;border-radius:8px;padding:5px;" />
                        <p style="font-size:13px;color:#64748b;margin-top:6px;">(Scan this QR to open the test on your phone)</p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding-top:25px;color:#94a3b8;font-size:12px;">
                      <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
                      <p>This link is unique to you. Please don’t share it.</p>
                      <p>© ${new Date().getFullYear()} <strong>HRInsight Pro</strong> | Perennial Systems</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `;

        await sendMail(email, "📩 HRInsight Pro Diagnostic Test Invitation", html);

        await prisma.candidateInvite.create({ data: { email, token } });
        results.emailsSent++;
        results.savedInvites++;
        await delay(800);
      } catch (err) {
        console.error(`Error sending email to ${email}:`, err?.message || err);
        results.emailsFailed++;
        await delay(800);
      }
    }

    // --- WhatsApp invites ---
    if (phoneList.length > 0) {
      for (const phone of phoneList) {
        try {
          const token = `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`;
          const inviteLink = `${process.env.FRONTEND_URL || "https://hrinsightpro.vercel.app"}/register?token=${token}`;
          await prisma.candidateInvite.create({ data: { phone, token } });
          results.savedInvites++;

          if (typeof client !== "undefined") {
            const toNumber = phone.startsWith("whatsapp:") ? phone : `whatsapp:+${phone.replace(/\D/g, "")}`;
            await client.messages.create({
              from: process.env.TWILIO_WHATSAPP_FROM,
              to: toNumber,
              body: `You’re invited to take an HRInsight Pro diagnostic test. Open: ${inviteLink}`
            });
            results.phonesSent++;
          } else {
            console.log(`Twilio client not configured – saved phone invite for ${phone}`);
            results.phonesFailed++;
          }
          await delay(600);
        } catch (err) {
          console.error(`Error sending WhatsApp to ${phone}:`, err?.message || err);
          results.phonesFailed++;
          await delay(600);
        }
      }
    }

    return res.status(200).json({ message: "Invites processed", details: results });
  } catch (error) {
    console.error("❌ sendInvites error:", error);
    return res.status(500).json({ message: "Failed to send invitations", error: error.message || error });
  }
};


