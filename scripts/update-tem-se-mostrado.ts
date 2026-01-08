
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const questions = await prisma.question.findMany({
        where: {
            statement: {
                contains: 'tem se mostrado',
                mode: 'insensitive'
            }
        }
    })

    console.log(`Found ${questions.length} questions to update.`)

    for (const q of questions) {
        await prisma.question.update({
            where: { id: q.id },
            data: {
                correctAnswer: 'CERTO', // Enforce clean answer
                explanation: `Gabarito: Certo.

A questão trata da colocação pronominal em locuções verbais.
Na locução "tem se mostrado" (verbo ter + particípio), o pronome átono pode ficar solto entre o auxiliar e o principal (sem hífen) ou enclítico ao auxiliar com hífen ("tem-se mostrado"), desde que não haja fator de atração.
Como não há particípio enclítico (ênclise em particípio é proibida, mas aqui a ênclise seria no auxiliar "tem"), a forma "tem-se mostrado" é gramaticalmente correta e equivalente.

Nota: O CESPE/Cebraspe costuma aceitar ambas as formas em locuções com particípio, desde que o pronome não venha *após* o particípio.`
            }
        })
        console.log(`Updated question ${q.id}`)
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
