import serverless from "serverless-http";
import app from "../app.js";
import { disconnectDB } from "../DB/db.config.js";

const handler = async (req, res) => {
  const wrapped = serverless(app);
  const response = await wrapped(req, res);
  await disconnectDB(); // 🧩 close connection after every request
  return response;
};

export default handler;
