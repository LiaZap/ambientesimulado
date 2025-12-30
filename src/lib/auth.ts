import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { authConfig } from "@/auth.config"

// Helper schema for login
const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
})

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const parsed = LoginSchema.safeParse(credentials)

                if (parsed.success) {
                    const { email, password } = parsed.data
                    const user = await prisma.user.findUnique({ where: { email } })
                    if (!user || !user.password) return null

                    const passwordsMatch = await bcrypt.compare(password, user.password)

                    if (passwordsMatch) return user
                }

                return null
            }
        })
    ],
    callbacks: {
        ...authConfig.callbacks, // Merge callbacks
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role as string // Pass role to session
            }
            return session
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = user.role // Initial login
            }

            // Optional: Force a refresh if needed, but for now let's trust the re-login. 
            // Better: If we are in the session (standard JWT flow), we might want to refetch.
            // But let's verify if `user` is passed on login. Yes it is.

            // To ensure role updates persist even if token exists:
            if (!user && token.sub) {
                const existingUser = await prisma.user.findUnique({
                    where: { id: token.sub },
                    select: { role: true }
                })
                if (existingUser) {
                    token.role = existingUser.role
                }
            }

            return token
        }
    }
})
