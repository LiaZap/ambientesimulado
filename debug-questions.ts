const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const questions = await prisma.question.findMany({
        where: {
            statement: {
                contains: "No Texto 2",
                mode: 'insensitive'
            }
        },
        take: 5
    })

    console.log(`Found ${questions.length} questions matching "No Texto 2"`)
    questions.forEach((q: any) => {
        console.log(`ID: ${q.id}`)
        console.log(`Statement: ${q.statement.substring(0, 50)}...`)
        console.log(`Correct Answer: ${q.correctAnswer}`)
        console.log(`Options:`, q.options) // This will be null/undefined for the bugged ones
        console.log(`CreatedAt: ${q.createdAt}`)
        console.log("---")
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
