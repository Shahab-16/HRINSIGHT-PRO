import { prisma } from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { sendMail } from "../utils/sendEmail.js"; // ✅ Nodemailer utility

//
// 1️⃣ Register - sends OTP using Gmail (Nodemailer)
//
export const registerHR = async (req, res) => {
  try {
    const { email, password, name, organization } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const existing = await prisma.hRUser.findUnique({ where: { email } });
    if (existing && existing.verified)
      return res.status(400).json({ message: "User already registered" });

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
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

    // ✉️ Styled OTP Email (HTML only)
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f8fafc; padding:30px; border-radius:12px; max-width:600px; margin:auto; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
        <div style="text-align:center;">
          <h2 style="color:#1d4ed8; margin-bottom:5px;">HRInsight Pro</h2>
          <p style="color:#475569; font-size:15px;">Email Verification</p>
        </div>

        <div style="margin-top:25px; background:#ffffff; border-radius:10px; padding:25px; border:1px solid #e2e8f0;">
          <p style="font-size:16px; color:#334155;">Hello ${name || "there"} 👋,</p>
          <p style="font-size:15px; color:#334155;">Please verify your email to continue using <strong>HRInsight Pro</strong>.</p>
          
          <div style="text-align:center; margin:25px 0;">
            <div style="display:inline-block; background-color:#2563eb; color:#fff; padding:15px 35px; border-radius:8px; font-size:28px; font-weight:600; letter-spacing:4px;">
              ${otp}
            </div>
          </div>

          <p style="font-size:14px; color:#475569; text-align:center;">This OTP will expire in <strong>5 minutes</strong>.</p>
        </div>

        <div style="text-align:center; margin-top:25px;">
          <p style="font-size:13px; color:#94a3b8;">If you didn’t request this, you can safely ignore this email.</p>
          <hr style="border:none; border-top:1px solid #e2e8f0; margin:20px 0;" />
          <p style="font-size:12px; color:#94a3b8;">© ${new Date().getFullYear()} <strong>HRInsight Pro</strong> | Perennial Systems</p>
        </div>
      </div>
    `;

    await sendMail(email, "HRInsight Pro – Verify Your Email", html);
    console.log(`✅ OTP email sent to ${email}`);

    res.json({ message: "OTP sent to email for verification" });
  } catch (err) {
    console.error("❌ Registration error:", err);
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
    if (user.otpExpiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

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
