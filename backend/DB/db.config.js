import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL Database Connected Successfully");
  } catch (error) {
    console.error("❌ Failed to connect to PostgreSQL Database:", error.message);
    process.exit(1); 
  }
};
