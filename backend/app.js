// backend/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./DB/db.config.js";

// Routes
import adminRoutes from "./routes/admin.routes.js";
import hrRoutes from "./routes/hr.routes.js";
import tokenRoutes from "./routes/token.routes.js";

dotenv.config();

const app = express();

// Allow local + your Vercel frontend
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://<your-frontend>.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// Connect DB once per cold start
await connectDB();

// Health
app.get("/", (req, res) => {
  res.send("HRInsight Pro API is up ✅");
});

// Mount APIs
app.use("/api/admin", adminRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/tokens", tokenRoutes);

export default app;
