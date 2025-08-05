import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { type DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Estendendo o tipo de sessão para incluir o ID do usuário
declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

// Criando uma instância dedicada para o NextAuth
const prisma = new PrismaClient()

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})

export { handler as GET, handler as POST }
