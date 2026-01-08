
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const questions = await prisma.question.findMany({
        where: {
            statement: {
                contains: 'pisca-alerta',
                mode: 'insensitive'
            }
        }
    })

    console.log(`Found ${questions.length} questions.`)

    questions.forEach(q => {
        console.log(`ID: ${q.id}`)
        console.log(`Statement: ${q.statement}`)
        console.log(`Correct Answer: "${q.correctAnswer}" (Length: ${q.correctAnswer.length})`)
        console.log(`Explanation: ${q.explanation}`)
        console.log('-------------------------------------------')
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
