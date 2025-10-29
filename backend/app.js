import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./DB/db.config.js";
import adminRoutes from "./routes/admin.routes.js";
import hrRoutes from "./routes/hr.routes.js";
import tokenRoutes from "./routes/token.routes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

await connectDB();

app.get("/", (_, res) => res.send("✅ HRInsight Pro Backend Live!"));
app.use("/api/admin", adminRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/tokens", tokenRoutes);

export default app;
