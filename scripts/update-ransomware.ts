
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const questions = await prisma.question.findMany({
        where: {
            statement: {
                contains: 'Ransomware',
                mode: 'insensitive'
            }
        }
    })

    console.log(`Updating ${questions.length} questions...`)

    for (const q of questions) {
        await prisma.question.update({
            where: { id: q.id },
            data: {
                correctAnswer: 'CERTO', // Enforce clean string
                explanation: `Gabarito: Certo.
                
O Ransomware é, de fato, um código malicioso (malware) que age "sequestrando" os dados da vítima. Ele utiliza criptografia para tornar os arquivos inacessíveis e exige o pagamento de um resgate (normalmente em criptomoedas) para fornecer a chave que permite recuperar os arquivos.`
            }
        })
    }
    console.log('Update complete.')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
