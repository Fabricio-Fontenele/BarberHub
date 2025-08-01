import { PrismaClient } from "@/generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  cachedPrisma?: PrismaClient
}

const prisma = globalForPrisma.cachedPrisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.cachedPrisma = prisma
}

export const db = prisma
