import serverless from "serverless-http";
import app from "../app.js";
import { disconnectDB } from "../DB/db.config.js";

const handler = async (req, res) => {
  try {
    const wrapped = serverless(app);
    const response = await wrapped(req, res);
    await disconnectDB(); // close prisma after every invocation
    return response;
  } catch (err) {
    console.error("❌ Serverless error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
