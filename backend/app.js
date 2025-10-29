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

// If you set cookies, this helps behind proxies like Vercel
app.set("trust proxy", 1);

const allowedOrigins = new Set([
  // PRODUCTION
  "https://hrinsight-pro.vercel.app",
  "http://localhost:5173",
]);

const corsOptions = {
  origin(origin, callback) {
    // Allow same-origin/non-browser tools (no Origin header) and explicit allowed origins
    if (!origin) return callback(null, true);

    // Allow your main prod domain
    if (allowedOrigins.has(origin)) return callback(null, true);

    // Optionally allow Vercel preview URLs for *this* project
    const previewRegex = /^https:\/\/hrinsight-pro-.*\.vercel\.app$/i;
    if (previewRegex.test(origin)) return callback(null, true);

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// Ensure preflight responses are sent with the same headers
app.options("*", cors(corsOptions));

app.use(express.json());
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
