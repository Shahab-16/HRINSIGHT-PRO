import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./DB/db.config.js";

import adminRoutes from "./routes/admin.routes.js";
import hrReqRoutes from "./routes/hrRequest.routes.js";
import roleRoutes from "./routes/role.routes.js";
import questionRoutes from "./routes/question.routes.js";
import tokenRoutes from "./routes/token.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Hello World 🌍");
});

app.use("/api/admin", adminRoutes);
app.use("/api/hr-requests", hrReqRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/tokens", tokenRoutes);

const PORT = process.env.PORT || 5000;

// Wrap DB connection and server start in async function
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error.message);
    process.exit(1);
  }
};

startServer();
