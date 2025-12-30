import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { z } from "zod"
import crypto from "crypto"
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

                    if (passwordsMatch) {
                        // Single Session Enforcement: Generate new Session ID
                        const newSessionId = crypto.randomUUID()

                        await prisma.user.update({
                            where: { id: user.id },
                            data: { currentSessionId: newSessionId }
                        })

                        return { ...user, currentSessionId: newSessionId }
                    }
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
            // Initial Login
            if (user) {
                token.role = user.role
                token.sid = (user as any).currentSessionId // Store session ID
            }

            // Session Enforcement Check
            if (token.sub) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.sub },
                    select: { role: true, currentSessionId: true }
                })

                // If user deleted or session changed (logged in elsewhere)
                if (!dbUser) return null

                // DEBUG: Commenting out strict session check to isolate issue
                // if (dbUser.currentSessionId && dbUser.currentSessionId !== token.sid) {
                //    return null
                // }

                // Update role if changed
                if (dbUser) {
                    token.role = dbUser.role
                }
            }

            return token
        }
    }
})
