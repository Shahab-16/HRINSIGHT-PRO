import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  // Create new client per invocation on Vercel
  prisma = new PrismaClient();
} else {
  // Reuse in dev to avoid multiple connections
  if (!global.prisma) global.prisma = new PrismaClient();
  prisma = global.prisma;
}

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL Connected");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
};

// 🔥 critical: close Prisma after each invocation in serverless
export const disconnectDB = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      await prisma.$disconnect();
      console.log("🔌 Prisma Disconnected (Vercel)");
    }
  } catch (err) {
    console.error("⚠️ Failed to disconnect Prisma:", err.message);
  }
};

export { prisma };
