import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Create initial subjects
    const subjects = [
        'PORTUGUES',
        'DIREITO_CONSTITUCIONAL',
        'DIREITO_ADMINISTRATIVO',
        'DIREITO_PENAL',
        'LEGISLACAO_TRANSITO',
        'FISICA',
        'RACIOCINIO_LOGICO',
        'INFORMATICA',
        'ETICA',
        'NOCOES_CIDADANIA',
    ]

    // Clean existing data if needed (optional)
    // await prisma.course.deleteMany()

    // Create a Course for each subject as a placeholder
    for (const subject of subjects) {
        const course = await prisma.course.upsert({
            where: { id: `course-${subject.toLowerCase()}` },
            update: {},
            create: {
                id: `course-${subject.toLowerCase()}`,
                title: `Curso Completo de ${subject.replace('_', ' ')}`,
                description: `Módulos abrangentes para dominar ${subject.replace('_', ' ')} na PRF.`,
                subject: subject as any,
                order: subjects.indexOf(subject) + 1,
                isActive: true,
            }
        })

        // Add 2 Modules for each Course
        for (let i = 1; i <= 2; i++) {
            const module = await prisma.module.create({
                data: {
                    courseId: course.id,
                    title: `Módulo ${i}: Fundamentos de ${subject.replace('_', ' ')}`,
                    order: i,
                    lessons: {
                        create: [
                            {
                                title: `Aula 1: Introdução ao Módulo ${i}`,
                                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Rick Roll Placeholder
                                videoDuration: 600,
                                order: 1,
                            },
                            {
                                title: `Aula 2: Aprofundamento Prático`,
                                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                                videoDuration: 1200,
                                order: 2,
                            }
                        ]
                    }
                }
            })
        }
    }



    // Create a Simulado
    const exam = await prisma.exam.create({
        data: {
            title: 'Simulado Nacional PRF - 1º Edição',
            description: 'Simulado completo com 120 questões no estilo Cebraspe (Certo/Errado). Teste seus conhecimentos.',
            totalQuestions: 120,
            duration: 270, // 4h30
            year: 2024,
            isActive: true,
            questions: {
                create: [
                    {
                        subject: 'PORTUGUES',
                        topic: 'Interpretação de Texto',
                        statement: 'Infere-se do texto que a Polícia Rodoviária Federal tem atribuições exclusivas de fiscalização de trânsito, não atuando no combate ao crime.',
                        correctAnswer: 'ERRADO', // Errado
                        explanation: 'A PRF atua tanto na fiscalização de trânsito quanto no combate à criminalidade nas rodovias federais.',
                        difficulty: 'MEDIUM',
                        institution: 'Cebraspe',
                        year: 2021
                    },
                    {
                        subject: 'DIREITO_CONSTITUCIONAL',
                        topic: 'Direitos Fundamentais',
                        statement: 'A casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador, salvo em caso de flagrante delito ou desastre, ou para prestar socorro, ou, durante o dia, por determinação judicial.',
                        correctAnswer: 'CERTO', // Certo
                        explanation: 'Texto literal do Art. 5º, XI, da CF/88.',
                        difficulty: 'EASY',
                        institution: 'Cebraspe',
                        year: 2022
                    },
                    {
                        subject: 'DIREITO_ADMINISTRATIVO',
                        topic: 'Atos Administrativos',
                        statement: 'A presunção de legitimidade dos atos administrativos é absoluta, não admitindo prova em contrário.',
                        correctAnswer: 'ERRADO', // Errado
                        explanation: 'A presunção é relativa (juris tantum).',
                        difficulty: 'MEDIUM',
                        institution: 'Cebraspe',
                        year: 2023
                    },
                    {
                        subject: 'LEGISLACAO_TRANSITO',
                        topic: 'Código de Trânsito Brasileiro',
                        statement: 'Compete à PRF realizar o patrulhamento ostensivo das rodovias federais.',
                        correctAnswer: 'CERTO', // Certo
                        explanation: 'Competência prevista no CTB e na CF.',
                        difficulty: 'EASY',
                        institution: 'Cebraspe',
                        year: 2021
                    }
                    // Adicionar mais questões conforme necessário no futuro
                ]
            }
        }
    })

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Check if user exists first to avoid unique constraint error on re-seed of user
    const userExists = await prisma.user.findUnique({ where: { email: 'test@example.com' } })
    let user;

    if (!userExists) {
        user = await prisma.user.create({
            data: {
                email: 'test@example.com',
                name: 'Test Student',
                password: hashedPassword,
                role: 'PREMIUM',
                profile: {
                    create: {
                        level: 5,
                        xp: 1250,
                        rank: 'Aspirante',
                        streak: 3
                    }
                }
            }
        })
    } else {
        user = userExists
    }

    console.log({ user })
    console.log('✅ Seed finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
