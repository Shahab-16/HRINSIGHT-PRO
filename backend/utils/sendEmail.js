import nodemailer from "nodemailer";

export const sendMail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,              // TLS port
      secure: false,          // must be false for 587
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER, // your Gmail
        pass: process.env.MAIL_PASS, // your 16-digit app password
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000, // 10s timeout to avoid hanging
    });

    const mailOptions = {
      from: `"HRInsight Pro" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    throw new Error("Email could not be sent. Check credentials or network.");
  }
};
