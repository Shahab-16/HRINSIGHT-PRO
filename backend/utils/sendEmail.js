import nodemailer from "nodemailer";

export const sendMail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"HRInsight Pro" <mdshahabuddin0516@gmail.com>`, // your verified sender
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to ${to}:`, info.response);
  } catch (error) {
    console.error(`❌ Email send error to ${to}:`, error.message);
    throw new Error("Email could not be sent. Check SMTP credentials or network.");
  }
};
