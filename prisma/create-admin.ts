import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Creating Admin User...')

    const hashedPassword = await bcrypt.hash('admin123', 10)

    const adminEmail = 'admin@example.com'

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } })

    if (existingUser) {
        console.log('⚠️ Admin user already exists. Updating role and password...')
        await prisma.user.update({
            where: { email: adminEmail },
            data: {
                password: hashedPassword,
                role: 'ADMIN',
                name: 'System Admin'
            }
        })
    } else {
        await prisma.user.create({
            data: {
                email: adminEmail,
                name: 'System Admin',
                password: hashedPassword,
                role: 'ADMIN',
                profile: {
                    create: {
                        level: 99,
                        xp: 999999,
                        rank: 'General',
                        streak: 999
                    }
                }
            }
        })
        console.log('✅ Admin user created!')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
