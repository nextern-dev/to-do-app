import NextAuth from "next-auth"
import { prisma } from "./prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Authorize called with credentials:', credentials);
        if (!credentials?.email || !credentials?.password) {
          console.log('Email or password missing');
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        console.log('Email and password:', email, password);

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email }
          })

          console.log('User found:', user);

          if (!user || !user.password) {
            console.log('User not found or password missing');
            return null
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.password)

          console.log('isValidPassword:', isValidPassword);

          if (!isValidPassword) {
            console.log('Invalid password');
            return null
          }

          console.log('User authorized:', user);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        return {
        ...token,
          id: user.id,
          name: user.name,
        }
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
      }
      return session
    }
  }
}

export const { handlers, auth } = NextAuth(authOptions)
