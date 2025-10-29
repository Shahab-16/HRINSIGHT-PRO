import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async (to, subject, text) => {
  try {
    const data = await resend.emails.send({
      from: "HRInsight Pro <onboarding@resend.dev>", // temporary sender; replace after domain verification
      to,
      subject,
      text,
    });

    console.log("✅ Email sent successfully:", data);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
