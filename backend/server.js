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

await connectDB(); 

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api/admin", adminRoutes);
app.use("/api/hr-requests", hrReqRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/tokens", tokenRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT}`)
  );
});

