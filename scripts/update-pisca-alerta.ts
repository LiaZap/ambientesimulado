
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

    console.log(`Found ${questions.length} questions to update.`)

    for (const q of questions) {
        await prisma.question.update({
            where: { id: q.id },
            data: {
                correctAnswer: 'CERTO',
                explanation: `Gabarito: Certo.

De acordo com o CTB:
Art. 40. O uso de luzes em veículo obedecerá às seguintes determinações:
(...)
V - O condutor utilizará o pisca-alerta nas seguintes situações:
a) em imobilizações ou situações de emergência;
b) quando a regulamentação da via assim o determinar.

Portanto, o uso do pisca-alerta como advertência em caso de imobilização do veículo é permitido e correto.`
            }
        })
        console.log(`Updated question ${q.id}`)
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
