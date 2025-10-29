import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./DB/db.config.js";
import adminRoutes from "./routes/admin.routes.js";
import hrRoutes from "./routes/hr.routes.js";
import tokenRoutes from "./routes/token.routes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://hrinsight-pro.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

// Connect once per cold start
await connectDB();

// ✅ Return a response immediately
app.get("/", (req, res) => {
  res.status(200).json({
    message: "✅ HRInsight Pro Backend Live!",
    db: "Connected",
  });
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/tokens", tokenRoutes);

export default app;
