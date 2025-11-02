import fetch from "node-fetch";

export const sendMail = async (to, subject, html) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "HRInsight Pro", email: "mdshahabuddin0516@gmail.com" },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brevo API error: ${errorText}`);
    }

    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Email send error to ${to}:`, error.message);
  }
};
