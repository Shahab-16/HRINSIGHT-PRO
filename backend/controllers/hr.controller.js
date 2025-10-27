import { prisma } from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { sendMail } from "../utils/sendEmail.js";

//
// 1️⃣ Register - sends OTP
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
        data: { name, organization, otp, otpExpiresAt: expiry, password: hashed, verified: false },
      });
    } else {
      await prisma.hRUser.create({
        data: { name, organization, email, password: hashed, otp, otpExpiresAt: expiry },
      });
    }

    await sendMail(email, "HRInsight Pro – Verify Your Email", `Your OTP is ${otp}. It expires in 5 minutes.`);

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
// 3️⃣ Login
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

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};
