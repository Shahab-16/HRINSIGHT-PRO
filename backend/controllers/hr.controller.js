import { prisma } from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { sendMail } from "../utils/sendEmail.js";

/**
 * Register HR User – Generates OTP & sends via email
 */
export const registerHR = async (req, res) => {
  try {
    const { email, password, name, organization } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const existing = await prisma.hRUser.findUnique({ where: { email } });
    if (existing && existing.verified)
      return res.status(400).json({ message: "User already registered" });

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    const expiry = new Date(Date.now() + 5 * 60 * 1000);
    const hashed = await bcrypt.hash(password, 10);

    if (existing) {
      await prisma.hRUser.update({
        where: { email },
        data: { name, organization, otp, otpExpiresAt: expiry, password: hashed, verified: false },
      });
    } else {
      await prisma.hRUser.create({
        data: { name, organization, email, password: hashed, otp, otpExpiresAt: expiry },
      });
    }

    const html = `
      <div style="font-family:'Segoe UI',sans-serif;background:#f9fafb;padding:30px;border-radius:12px;max-width:600px;margin:auto;">
        <h2 style="color:#2563eb;text-align:center;">HRInsight Pro Verification</h2>
        <p style="text-align:center;color:#334155;">Hello ${name || "there"} 👋</p>
        <p style="text-align:center;">Your OTP is:</p>
        <div style="text-align:center;margin:20px 0;">
          <span style="background:#2563eb;color:#fff;padding:15px 30px;border-radius:8px;font-size:28px;letter-spacing:4px;">${otp}</span>
        </div>
        <p style="text-align:center;color:#64748b;">Expires in 5 minutes.</p>
      </div>
    `;

    await sendMail(email, "Verify your HRInsight Pro account", html);
    console.log(`✅ OTP email sent to ${email}`);
    res.json({ message: "OTP sent to email for verification" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/** Verify OTP */
export const verifyHR = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await prisma.hRUser.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

    await prisma.hRUser.update({
      where: { email },
      data: { verified: true, otp: null, otpExpiresAt: null },
    });

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/** Login HR */
export const loginHR = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.hRUser.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.verified) return res.status(401).json({ message: "Email not verified" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

//
// 4️⃣ Get All Questions
//
export const getAllQuestions = async (req, res) => {
  try {
    const rows = await prisma.question.findMany({
      orderBy: { id: "asc" },
      include: {
        options: {
          select: { id: true, text: true },
          orderBy: { id: "asc" },
        },
      },
    });

    const questions = rows.map((q) => ({
      id: q.id,
      area: q.area,
      text: q.text,
      options: (q.options || []).map((o) => o.text),
    }));

    return res.json({ questions });
  } catch (err) {
    console.error("getAllQuestions error:", err);
    return res.status(500).json({ message: "Failed to fetch questions" });
  }
};
