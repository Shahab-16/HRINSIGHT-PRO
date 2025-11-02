import nodemailer from "nodemailer";

export const sendMail = async (to, subject, html) => {
  try {
    // Use Gmail service for simplicity and Render compatibility
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER, // Your Gmail address
        pass: process.env.MAIL_PASS, // App password from Google
      },
    });

    await transporter.sendMail({
      from: `"HRInsight Pro" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to: ${to}`);
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    throw new Error("Email could not be sent. Check your credentials or app password.");
  }
};
