import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

let prisma;

// ✅ Proper global client reuse for local dev (hot reload safe)
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// ✅ Reliable connection with retry + logging
export const connectDB = async () => {
  try {
    // Ensure DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      console.error("❌ Missing DATABASE_URL in environment variables!");
      return;
    }

    // Try to connect (retries 3 times if failed)
    let retries = 3;
    while (retries) {
      try {
        await prisma.$connect();
        console.log("✅ PostgreSQL Database Connected Successfully");
        break;
      } catch (err) {
        retries -= 1;
        console.error("⚠️ Database connection failed. Retrying...", err.message);
        await new Promise((res) => setTimeout(res, 2000));
      }
    }
  } catch (error) {
    console.error("❌ Unhandled DB connection error:", error);
  }
};

export { prisma };
