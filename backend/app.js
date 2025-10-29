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
  "https://hrinsight-pro.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (/^https:\/\/hrinsight-pro-.*\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`❌ CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// ✅ Connect DB only once per Vercel instance
await connectDB();

// ✅ Health route
app.get("/", (req, res) => {
  res.status(200).send("✅ HRInsight Pro Backend is live!");
});

// ✅ All routes
app.use("/api/admin", adminRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/tokens", tokenRoutes);

export default app;
