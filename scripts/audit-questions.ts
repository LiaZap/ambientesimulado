
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const questions = await prisma.question.findMany({
        where: {
            statement: {
                contains: 'último período',
                mode: 'insensitive'
            }
        }
    })

    console.log(`Found ${questions.length} questions matching "último período"`)

    questions.forEach(q => {
        if (q.statement.toLowerCase().includes('imperativos')) {
            console.log('MATCH FOUND!')
            console.log('ID:', q.id)
            console.log('Statement:', q.statement)
            console.log('Correct Answer:', `"${q.correctAnswer}"`)
            console.log('Explanation:', q.explanation)
            console.log('-------------------------------------------')
        }
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
