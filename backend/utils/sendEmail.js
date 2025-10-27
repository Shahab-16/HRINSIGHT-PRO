import nodemailer from "nodemailer";

export const sendMail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"HRInsight Pro" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};
