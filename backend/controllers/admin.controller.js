import { prisma } from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import qrcode from "qrcode";
import crypto from "crypto";
import axios from "axios";
import twilio from "twilio";
// helper endpoint to seed one admin if none exists
export const seedOneAdminIfEmpty = async (req, res) => {
  try {
    const count = await prisma.admin.count();
    if (count > 0) return res.json({ message: "Admin already exists" });

    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!email || !password) {
      return res
        .status(400)
        .json({
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

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    {
      /*const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });*/
    }

    console.log("Admin Login", email, password ,"and the env", process.env.SEED_ADMIN_EMAIL, process.env.SEED_ADMIN_PASSWORD);

    if (
      email !== process.env.SEED_ADMIN_EMAIL &&
      password !== process.env.SEED_ADMIN_PASSWORD
    )
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Login Successful");
    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const uploadQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: "No questions provided" });
    }

    const role = await prisma.role.findFirst({ where: { name: "General" } });
    const roleId = role ? role.id : (await prisma.role.create({ data: { name: "General" } })).id;

    const createdQuestions = [];

    for (const q of questions) {
      const question = await prisma.question.create({
        data: {
          area: q.area || "General",
          text: q.question,
          roleId,
          options: {
            create: q.options.map((opt, i) => ({
              label: String.fromCharCode(65 + i), // A, B, C, D
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
    return res.status(500).json({ message: "Failed to upload questions", error: error.message });
  }
};

// Get all questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      include: { options: true },
      orderBy: { id: "asc" },
    });

    return res.json({ questions });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return res.status(500).json({ message: "Failed to fetch questions", error: error.message });
  }
};

// Delete question by ID
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.option.deleteMany({ where: { questionId: Number(id) } });
    await prisma.question.delete({ where: { id: Number(id) } });

    return res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    return res.status(500).json({ message: "Failed to delete question", error: error.message });
  }
};


const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendInvites = async (req, res) => {
  try {
    const { emails = [], phones = [] } = req.body;
    console.log("inside send invites", emails, phones);

    if (!emails.length && !phones.length) {
      return res.status(400).json({ message: "No recipients provided." });
    }

    const sentInvites = [];

    for (const email of emails) {
      // Generate unique token
      const token = Math.random().toString(36).substring(2, 15);

      // Save invite to DB
      const invite = await prisma.candidateInvite.create({
        data: { email, token },
      });

      const testLink = `${process.env.FRONTEND_URL}/register?token=${invite.token}`;
      const qrImage = await qrcode.toDataURL(testLink);

      // Send Email with QR code
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"HRInsight Pro" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Your Diagnostic Test Invitation",
        html: `
          <div style="font-family: Arial; color: #333;">
            <h2>📊 HRInsight Pro Test Invitation</h2>
            <p>You’ve been invited to take a diagnostic test. Please click the link or scan the QR code below to start:</p>
            <p><a href="${testLink}" style="color: #2563eb;">Start Test</a></p>
            <br/>
            <img src="${qrImage}" alt="QR Code" style="width:180px; height:180px;"/>
            <p style="font-size: 12px; color: #888;">This link is unique to you. Do not share it.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      sentInvites.push({ email, token, testLink });
    }

    // ✅ WhatsApp Invites
    for (const phone of phones) {
      const token = Math.random().toString(36).substring(2, 15);

      const invite = await prisma.candidateInvite.create({
        data: { phone, token },
      });

      const testLink = `${process.env.FRONTEND_URL}/register?token=${invite.token}`;

      try {
        await client.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM, // e.g. "whatsapp:+14155238886"
          to: `whatsapp:+91${phone}`, // adjust country code
          body: `Hi! You’re invited to take your HRInsight Pro diagnostic test.\n\nClick here: ${testLink}\n\nor scan the QR in your email.`,
        });
      } catch (err) {
        console.error(`WhatsApp failed for ${phone}:`, err.message);
      }

      sentInvites.push({ phone, token, testLink });
    }

    res.status(200).json({
      message: "Invites sent successfully.",
      sentInvites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending invites", error });
  }
};