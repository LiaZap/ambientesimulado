
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Fetch ALL questions and filter in JS to avoid DB collation issues
    const allQuestions = await prisma.question.findMany()

    const matches = allQuestions.filter(q =>
        q.statement.toLowerCase().includes('imperativos') ||
        q.statement.toLowerCase().includes('term') // Broad match
    ).filter(q => q.statement.toLowerCase().includes('obrigat'))

    console.log(`Deep Scan found ${matches.length} questions.`)

    matches.forEach(q => {
        console.log(`ID: ${q.id}`)
        console.log(`Statement: ${q.statement.substring(0, 50)}...`)
        console.log(`Correct Answer: "${q.correctAnswer}" (Length: ${q.correctAnswer.length})`)
        console.log(`Explanation: ${q.explanation ? "PRESENT" : "NULL"}`)
        console.log('---')
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
