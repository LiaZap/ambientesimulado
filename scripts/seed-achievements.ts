
import { PrismaClient, Rarity } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding Achievements...')

    const achievements = [
        {
            id: 'ach-first-lesson',
            name: 'Primeiros Passos',
            description: 'Complete sua primeira aula.',
            icon: 'Medal',
            rarity: 'COMMON',
            xpReward: 100,
            criteria: { type: 'lesson_count', threshold: 1 }
        },
        {
            id: 'ach-dedicated',
            name: 'Estudante Dedicado',
            description: 'Complete 5 aulas.',
            icon: 'Star',
            rarity: 'RARE',
            xpReward: 300,
            criteria: { type: 'lesson_count', threshold: 5 }
        },
        {
            id: 'ach-exam-rookie',
            name: 'Recruta dos Simulados',
            description: 'Complete seu primeiro simulado.',
            icon: 'Target',
            rarity: 'COMMON',
            xpReward: 150,
            criteria: { type: 'exam_count', threshold: 1 }
        },
        {
            id: 'ach-exam-master',
            name: 'Mestre dos Simulados',
            description: 'Complete 3 simulados.',
            icon: 'Trophy',
            rarity: 'EPIC',
            xpReward: 500,
            criteria: { type: 'exam_count', threshold: 3 }
        },
        {
            id: 'ach-sniper',
            name: 'Sniper',
            description: 'Consiga 80% ou mais de acerto em um simulado.',
            icon: 'Crosshair',
            rarity: 'LEGENDARY',
            xpReward: 1000,
            criteria: { type: 'exam_score_percent', threshold: 80 }
        }
    ]

    for (const ach of achievements) {
        await prisma.achievement.upsert({
            where: { id: ach.id },
            update: {
                name: ach.name,
                description: ach.description,
                icon: ach.icon,
                rarity: ach.rarity as Rarity,
                xpReward: ach.xpReward,
                criteria: ach.criteria
            },
            create: {
                id: ach.id,
                name: ach.name,
                description: ach.description,
                icon: ach.icon,
                rarity: ach.rarity as Rarity,
                xpReward: ach.xpReward,
                criteria: ach.criteria
            }
        })
    }

    console.log('Achievements seeded successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
