import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [], // Providers added in auth.ts
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') ||
                nextUrl.pathname.startsWith('/simulados') ||
                nextUrl.pathname.startsWith('/aulas') ||
                nextUrl.pathname.startsWith('/perfil') ||
                nextUrl.pathname.startsWith('/ranking') ||
                nextUrl.pathname.startsWith('/meu-edital')

            const isOnAdmin = nextUrl.pathname.startsWith('/admin')

            if (isOnDashboard || isOnAdmin) {
                if (isLoggedIn) {
                    // DEBUG: Temporarily allowing all logged users to access /admin to debug role issue
                    // if (isOnAdmin && auth.user.role !== "ADMIN" && auth.user.role !== "SUPER_ADMIN") {
                    //    return Response.redirect(new URL('/dashboard', nextUrl))
                    // }
                    return true
                }
                return false // Redirect to login
            }

            // Allow access to home, login, register, etc.
            return true
        },
    },
} satisfies NextAuthConfig
