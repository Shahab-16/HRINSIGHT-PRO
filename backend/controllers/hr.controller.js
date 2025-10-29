import { prisma } from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

//
// 1️⃣ Register - sends OTP using Resend
//
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
        data: {
          name,
          organization,
          otp,
          otpExpiresAt: expiry,
          password: hashed,
          verified: false,
        },
      });
    } else {
      await prisma.hRUser.create({
        data: { name, organization, email, password: hashed, otp, otpExpiresAt: expiry },
      });
    }

    // ✉️ Send OTP Email using Resend
    try {
      await resend.emails.send({
        from: "HRInsight Pro <onboarding@resend.dev>", // replace after verifying your domain
        to: email,
        subject: "HRInsight Pro – Verify Your Email",
        html: `
          <div style="font-family: Arial, sans-serif; color:#333; background:#f9fafb; padding:20px; border-radius:8px;">
            <h2 style="color:#2563eb;">Verify Your Email</h2>
            <p>Dear ${name || "User"},</p>
            <p>Your OTP for HRInsight Pro is:</p>
            <div style="font-size:28px; font-weight:bold; color:#2563eb; letter-spacing:3px; margin:10px 0;">${otp}</div>
            <p>This OTP will expire in <strong>5 minutes</strong>.</p>
            <p>If you didn’t request this, please ignore this message.</p>
            <br/>
            <p style="font-size:12px; color:#888;">© ${new Date().getFullYear()} HRInsight Pro | Perennial Systems</p>
          </div>
        `,
      });
      console.log(`✅ OTP email sent to ${email}`);
    } catch (err) {
      console.error("❌ Failed to send OTP email:", err.message);
    }

    res.json({ message: "OTP sent to email for verification" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

//
// 2️⃣ Verify OTP
//
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
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

//
// 3️⃣ Login HR
//
export const loginHR = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await prisma.hRUser.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.verified) return res.status(401).json({ message: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error(err);
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
