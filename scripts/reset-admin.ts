
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    const email = 'contatopaulonvr@gmail.com'
    const passwordHash = await bcrypt.hash('123456', 10)

    await prisma.user.update({
        where: { email },
        data: { password: passwordHash }
    })

    console.log(`Password for ${email} reset to 123456`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
