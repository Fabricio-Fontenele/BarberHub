import { PrismaClient } from "@/generated/prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const prisma = new PrismaClient()

const handler = NextAuth({
  // @ts-expect-error - Known compatibility issue between Prisma v6 and NextAuth adapter
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
})

export { handler as GET, handler as POST }
