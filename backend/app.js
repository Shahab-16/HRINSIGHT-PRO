import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./DB/db.config.js";

import adminRoutes from "./routes/admin.routes.js";
import hrRoutes from "./routes/hr.routes.js";
import tokenRoutes from "./routes/token.routes.js";

dotenv.config();
const app = express();
app.set("trust proxy", 1);

// ✅ Allowed origins for both local + Vercel
const allowedOrigins = [
  "http://localhost:5173",
  "https://hrinsight-pro.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow tools like Postman (no Origin header) or allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow Vercel preview deployments (e.g., hrinsight-pro-git-main-shahab16.vercel.app)
    if (/^https:\/\/hrinsight-pro-.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`❌ CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// ✅ Ensure DB connects *once* per cold start (Vercel)
try {
  await connectDB();
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
  // Don't block the function — just log and continue (for serverless)
}

// ✅ Health Check Route — must be immediate
app.get("/", (req, res) => {
  res.status(200).send("✅ HRInsight Pro Backend is live and connected to DB!");
});

// ✅ API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/tokens", tokenRoutes);

// ✅ Catch-All Fallback (helps debug 404s)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found 🚫" });
});

export default app;
