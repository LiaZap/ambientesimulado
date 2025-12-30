import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET() {
    try {
        const hashedPassword = await bcrypt.hash("123456", 10)

        // Force update Admin
        await prisma.user.update({
            where: { email: "contatopaulonvr@gmail.com" },
            data: {
                password: hashedPassword,
                role: "SUPER_ADMIN"
            }
        })

        return NextResponse.json({
            success: true,
            message: "SENHA RESETADA COM SUCESSO! Tente logar com: 123456"
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 })
    }
}
