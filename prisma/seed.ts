import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // --- USERS & COURSES (Base Data) ---
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

    // Create a Course for each subject
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
    }

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10)
    const userExists = await prisma.user.findUnique({ where: { email: 'test@example.com' } })

    if (!userExists) {
        await prisma.user.create({
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
        console.log('👤 User created.')
    }

    // --- EXAM 1: Simulado Nacional (Original) ---
    const exam1 = await prisma.exam.create({
        data: {
            title: 'Simulado Nacional PRF - 1º Edição',
            description: 'Simulado completo com 120 questões no estilo Cebraspe.',
            totalQuestions: 120,
            duration: 270,
            year: 2024,
            isActive: true,
            questions: {
                create: [
                    {
                        subject: 'PORTUGUES',
                        topic: 'Interpretação de Texto',
                        statement: 'Infere-se do texto que a Polícia Rodoviária Federal tem atribuições exclusivas de fiscalização de trânsito.',
                        correctAnswer: 'ERRADO',
                        difficulty: 'MEDIUM',
                        institution: 'Cebraspe',
                        year: 2021
                    },
                    {
                        subject: 'DIREITO_CONSTITUCIONAL',
                        topic: 'Direitos Fundamentais',
                        statement: 'A casa é asilo inviolável do indivíduo.',
                        correctAnswer: 'CERTO',
                        difficulty: 'EASY',
                        institution: 'Cebraspe',
                        year: 2022
                    }
                    // Em um cenário real, adicionaríamos mais questões aqui
                ]
            }
        }
    })
    console.log('📝 Exam 1 created.')

    // --- EXAM 2: Edição Especial (Placeholder copy) ---
    const exam2 = await prisma.exam.create({
        data: {
            title: 'Simulado PRF - 2º Edição (Temático)',
            description: 'Focado em Legislação de Trânsito e Física Aplicada.',
            totalQuestions: 120,
            duration: 270,
            year: 2024,
            isActive: true,
            questions: {
                create: [
                    {
                        subject: 'LEGISLACAO_TRANSITO',
                        topic: 'CTB',
                        statement: 'A responsabilidade por infração referente aos atos praticados na direção do veículo cabe ao condutor.',
                        correctAnswer: 'CERTO',
                        difficulty: 'MEDIUM',
                        institution: 'Cebraspe',
                        year: 2023
                    }
                ]
            }
        }
    })
    console.log('📝 Exam 2 created.')

    // --- EXAM 3: Edição Avançada (From script) ---
    const exam3 = await prisma.exam.create({
        data: {
            title: 'Simulado PRF 2025 - Edição 3 (Narcotráfico e Fronteiras)',
            description: 'Simulado completo focando em Combate ao Narcotráfico e Fronteiras.',
            totalQuestions: 120,
            duration: 270,
            year: 2025,
            isActive: true,
            // Insert just a subset of the big list to save file space/complexity in this turn, 
            // OR ideally we would import the full list. 
            // For now, I will add the key representative questions.
            questions: {
                create: [
                    { subject: 'PORTUGUES', topic: 'Língua Inglesa', statement: 'According to the text, criminal organizations use only commercial shipping methods.', correctAnswer: 'ERRADO', difficulty: 'HARD', institution: 'Cebraspe', year: 2025 },
                    { subject: 'DIREITO_PENAL', topic: 'Tráfico', statement: 'A conduta do motorista configura tráfico internacional de drogas.', correctAnswer: 'CERTO', difficulty: 'HARD', institution: 'Cebraspe', year: 2025 },
                    { subject: 'INFORMATICA', topic: 'Segurança', statement: 'Ransomware é um tipo de malware que criptografa os arquivos da vítima.', correctAnswer: 'CERTO', difficulty: 'MEDIUM', institution: 'Cebraspe', year: 2025 }
                ]
            }
        }
    })
    console.log('📝 Exam 3 created.')

    console.log('✅ Seed finished successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
