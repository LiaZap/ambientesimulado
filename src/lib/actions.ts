'use server'

import { signIn, auth, signOut } from "@/lib/auth"
import { AuthError } from "next-auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { checkAchievements } from "@/lib/gamification"

const RegisterSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

// ... existing code ...
export async function logout() {
    await signOut({ redirectTo: '/login' })
}

export async function authenticate(_prevState: string | undefined, formData: FormData) {
    // ... existing code ...
    try {
        const formDataObj = Object.fromEntries(formData)
        const email = formDataObj.email as string

        // Check user role for redirect
        const user = await prisma.user.findUnique({
            where: { email },
            select: { role: true }
        })

        const redirectTo = (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN')
            ? '/admin'
            : '/dashboard'

        await signIn('credentials', {
            ...formDataObj,
            redirectTo
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciais inválidas.'
                default:
                    return 'Algo deu errado.'
            }
        }
        throw error
    }
}

export async function register(_prevState: string | undefined, formData: FormData) {
    const data = Object.fromEntries(formData)
    const validation = RegisterSchema.safeParse(data)

    if (!validation.success) {
        const errorMessages = Object.values(validation.error.flatten().fieldErrors).flat().join(", ")
        return "Dados inválidos: " + errorMessages
    }

    const { name, email, password } = validation.data

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) return "Email já cadastrado."

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                profile: {
                    create: {}
                }
            }
        })

        // Auto-login after register? Or redirect to login?
        // Let's redirect to login for simplicity or try to simple login
        // return "success"
    } catch (error) {
        console.error(error)
        return "Erro ao criar conta."
    }
}

export async function updateProfile(_prevState: string | undefined, formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) return "Não autorizado"

    const name = formData.get("name") as string
    const avatarFile = formData.get("avatar") as File | null

    if (!name || name.length < 2) return "Nome inválido"

    let avatarUrl = undefined

    // Handle File Upload
    if (avatarFile && avatarFile.size > 0) {
        if (avatarFile.size > 2 * 1024 * 1024) { // 2MB Limit
            return "Imagem muito grande (Máx 2MB)."
        }

        if (!avatarFile.type.startsWith("image/")) {
            return "Arquivo deve ser uma imagem."
        }

        try {
            const buffer = await avatarFile.arrayBuffer()
            const base64 = Buffer.from(buffer).toString('base64')
            avatarUrl = `data:${avatarFile.type};base64,${base64}`
        } catch (_e) {
            return "Erro ao processar imagem."
        }
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name,
                ...(avatarUrl !== undefined && { avatar: avatarUrl })
            }
        })

        return "Perfil atualizado com sucesso!"
    } catch (_error) {
        return "Erro ao atualizar perfil."
    }
}

export async function toggleLessonProgress(lessonId: string, completed: boolean) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        await prisma.progress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.user.id,
                    lessonId
                }
            },
            update: {
                completed,
                completedAt: completed ? new Date() : null
            },
            create: {
                userId: session.user.id,
                lessonId,
                completed,
                completedAt: completed ? new Date() : null
            }
        })

        // Add XP reward logic
        if (completed) {
            await awardXP(session.user.id, 50) // 50 XP per lesson
            await checkAchievements(session.user.id)
        }

        return { success: true }
    } catch (_error) {
        return { error: "Erro ao salvar progresso" }
    }
}

// Internal helper for Gamification
async function awardXP(userId: string, amount: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
    })

    if (!user || !user.profile) return

    const newXp = user.profile.xp + amount
    const newLevel = Math.floor(newXp / 1000) + 1

    await prisma.profile.update({
        where: { userId },
        data: {
            xp: newXp,
            level: newLevel
        }
    })

    // In a real app, we would return levelUp status to trigger a UI animation
}


export async function finishExamAttempt(examId: string, answers: Record<string, string>, timeSpent: number) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        const exam = await prisma.exam.findUnique({
            where: { id: examId },
            include: { questions: true }
        })

        if (!exam) return { error: "Simulado não encontrado" }

        let correct = 0
        let wrong = 0

        const _answerData = exam.questions.map(q => {
            const userAnswer = answers[q.id]
            const isAnswered = userAnswer !== undefined && userAnswer !== ""

            // Normalize comparison (A vs a)
            const isCorrect = isAnswered
                ? userAnswer.toUpperCase() === q.correctAnswer.toUpperCase()
                : false

            if (isAnswered) {
                if (isCorrect) correct++
                else wrong++
            }

            return {
                questionId: q.id,
                userAnswer: userAnswer || "",
                isCorrect: isCorrect,
                timeSpent: 0
            }
        })

        const score = correct - wrong
        let xpEarned = (correct * 10) - (wrong * 5) + 20
        if (xpEarned < 0) xpEarned = 10

        // Save Attempt
        await prisma.examAttempt.create({
            data: {
                userId: session.user.id,
                examId,
                status: 'COMPLETED',
                score: score,
                correctAnswers: correct,
                wrongAnswers: wrong,
                timeSpent,
            }
        })

        await awardXP(session.user.id, xpEarned)
        await checkAchievements(session.user.id)

        return {
            success: true,
            xpEarned,
            score,
            correct,
            wrong
        }

    } catch (error) {
        console.error(error)
        return { error: "Erro ao salvar resultado" }
    }
}

// ... existing code ...

export async function createQuestion(_prevState: string | undefined, formData: FormData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
        return "Não autorizado"
    }

    const statement = formData.get("statement") as string
    const subject = formData.get("subject") as string
    const topic = formData.get("topic") as string
    const difficulty = formData.get("difficulty") as string
    const correctAnswer = formData.get("correctAnswer") as string
    const explanation = formData.get("explanation") as string

    // Parse Options A-E
    const optionA = formData.get("optionA") as string
    const optionB = formData.get("optionB") as string
    const optionC = formData.get("optionC") as string
    const optionD = formData.get("optionD") as string
    const optionE = formData.get("optionE") as string

    // Check type: True/False vs Multiple Choice
    // We assume if optionA/B are present, it is multiple choice.
    const isMultipleChoice = !!optionA && !!optionB

    const options = isMultipleChoice ? {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD,
        E: optionE
    } : null

    if (!statement || !subject || !topic || !correctAnswer) return "Campos obrigatórios faltando."

    try {
        await prisma.question.create({
            data: {
                statement,
                subject: subject as any,
                topic,
                difficulty: difficulty as any,
                correctAnswer,
                explanation,
                options: options || undefined,
                institution: "Cebraspe",
                year: new Date().getFullYear(),
            }
        })
        return "Questão criada com sucesso!"
    } catch (error) {
        console.error(error)
        return "Erro ao criar questão."
    }
}

export async function createCourse(_prevState: string | undefined, formData: FormData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
        return "Não autorizado"
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const subject = formData.get("subject") as string

    if (!title || !subject) return "Título e Disciplina são obrigatórios."

    try {
        await prisma.course.create({
            data: {
                id: `course-${Date.now()}`,
                title,
                description,
                subject: subject as any,
                order: 99,
                isActive: true
            }
        })
        return "Curso criado com sucesso!"
    } catch (error) {
        console.error(error)
        return "Erro ao criar curso."
    }
}

export async function createModule(_prevState: string | undefined, formData: FormData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
        return "Não autorizado"
    }

    const courseId = formData.get("courseId") as string
    const title = formData.get("title") as string

    if (!courseId || !title) return "Dados inválidos."

    try {
        await prisma.module.create({
            data: {
                courseId,
                title,
                order: 99 // Put at end
            }
        })
        return "Módulo criado com sucesso!"
    } catch (error) {
        console.error(error)
        return "Erro ao criar módulo."
    }
}

export async function createLesson(_prevState: string | undefined, formData: FormData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
        return "Não autorizado"
    }

    const moduleId = formData.get("moduleId") as string
    const title = formData.get("title") as string
    const videoUrl = formData.get("videoUrl") as string
    const duration = Number(formData.get("duration") || 0)

    if (!moduleId || !title || !videoUrl) return "Dados obrigatórios faltando."

    try {
        await prisma.lesson.create({
            data: {
                moduleId,
                title,
                videoUrl,
                videoDuration: duration,
                order: 99
            }
        })
        return "Aula criada com sucesso!"
    } catch (error) {
        console.error(error)
        return "Erro ao criar aula."
    }
}


export async function deleteCourse(courseId: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") return { error: "Não autorizado" }

    try {
        await prisma.course.delete({ where: { id: courseId } })
        revalidatePath("/admin/cursos")
        return { success: true }
    } catch (_error) {
        return { error: "Erro ao excluir curso" }
    }
}

export async function deleteModule(moduleId: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") return { error: "Não autorizado" }

    try {
        await prisma.module.delete({ where: { id: moduleId } })
        revalidatePath("/admin/cursos") // Revalidate parent? 
        return { success: true }
    } catch (_error) {
        return { error: "Erro ao excluir módulo" }
    }
}

export async function deleteLesson(lessonId: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") return { error: "Não autorizado" }

    try {
        await prisma.lesson.delete({ where: { id: lessonId } })
        revalidatePath("/admin/cursos") // Weak revalidation, better to revalidate specific path
        return { success: true }
    } catch (_error) {
        return { error: "Erro ao excluir aula" }
    }
}

export async function deleteQuestion(questionId: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") return { error: "Não autorizado" }

    try {
        await prisma.question.delete({ where: { id: questionId } })
        revalidatePath("/admin/questoes")
        return { success: true }
    } catch (_error) {
        return { error: "Erro ao excluir questão" }
    }
}

// Exam Management Actions

export async function createExam(_prevState: string | undefined, formData: FormData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") return "Não autorizado"

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const duration = Number(formData.get("duration") || 240) // Default 4 hours
    const totalQuestions = Number(formData.get("totalQuestions") || 0)

    if (!title) return "Título é obrigatório."

    try {
        await prisma.exam.create({
            data: {
                title,
                description,
                duration,
                totalQuestions,
                isActive: true
            }
        })
        revalidatePath("/admin/simulados")
        return "Simulado criado com sucesso!"
    } catch (error) {
        console.error(error)
        return "Erro ao criar simulado."
    }
}

export async function deleteExam(examId: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") return { error: "Não autorizado" }

    try {
        await prisma.exam.delete({ where: { id: examId } })
        revalidatePath("/admin/simulados")
        return { success: true }
    } catch (_error) {
        return { error: "Erro ao excluir simulado" }
    }
}

export async function addQuestionToExam(examId: string, questionId: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") return { error: "Unauthorized" }

    try {
        await prisma.exam.update({
            where: { id: examId },
            data: {
                questions: {
                    connect: { id: questionId }
                }
            }
        })
        revalidatePath(`/admin/simulados/${examId}`)
        return { success: true }
    } catch (_error) {
        return { error: "Failed to add question" }
    }
}

export async function removeQuestionFromExam(examId: string, questionId: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") return { error: "Unauthorized" }

    try {
        await prisma.exam.update({
            where: { id: examId },
            data: {
                questions: {
                    disconnect: { id: questionId }
                }
            }
        })
        revalidatePath(`/admin/simulados/${examId}`)
        return { success: true }
    } catch (_error) {
        return { error: "Failed to remove question" }
    }
}

export async function createQuestionsBulk(jsonContent: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") return { error: "Não autorizado" }

    try {
        const questions = JSON.parse(jsonContent)

        if (!Array.isArray(questions)) return { error: "Formato inválido: deve ser um array de questões." }

        let count = 0
        for (const q of questions) {
            // Basic validation
            if (!q.statement || !q.subject || !q.topic) continue

            await prisma.question.create({
                data: {
                    statement: q.statement,
                    subject: q.subject,
                    topic: q.topic,
                    difficulty: q.difficulty || "MEDIUM",
                    correctAnswer: String(q.correctAnswer), // Ensure String
                    explanation: q.explanation,
                    options: q.options || undefined, // Save options
                    institution: q.institution || "Cebraspe",
                    year: q.year || new Date().getFullYear()
                }
            })
            count++
        }
        revalidatePath("/admin/questoes")
        return { success: true, count }
    } catch (error) {
        console.error(error)
        return { error: "Erro ao processar arquivo." }
    }
}

import { revalidatePath } from "next/cache"

export async function getSystemConfig() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
        return null
    }

    const config = await prisma.systemConfig.findFirst()
    return config
}

export async function updateSystemConfig(data: { n8nWebhookUrl?: string, siteName?: string, maintenanceMode?: boolean, xpPerLesson?: number, xpBaseExam?: number }) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" }
    }

    const config = await prisma.systemConfig.findFirst()

    if (config) {
        await prisma.systemConfig.update({
            where: { id: config.id },
            data,
        })
    } else {
        await prisma.systemConfig.create({
            data,
        })
    }

    revalidatePath("/admin/config")
    return { success: true }
}

export async function searchQuestions(query: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") return []

    try {
        const questions = await prisma.question.findMany({
            where: {
                OR: [
                    { statement: { contains: query, mode: 'insensitive' } },
                    { topic: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 20,
            select: {
                id: true,
                statement: true,
                subject: true,
                difficulty: true
            }
        })
        return questions
    } catch (error) {
        return []
    }
}

export async function submitEssay(_prevState: string | undefined, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return "Não autorizado"

    const theme = formData.get("theme") as string
    const content = formData.get("content") as string
    const file = formData.get("file") as File | null

    if (!theme) return "Tema é obrigatório."
    if (!content && (!file || file.size === 0)) return "É necessário enviar o texto ou um arquivo."

    let imageUrl = undefined

    // Handle File Upload (Basic Base64 for MVP, ideally should verify size/upload to S3/Cloudinary)
    if (file && file.size > 0) {
        if (file.size > 4 * 1024 * 1024) { // 4MB Limit
            return "Arquivo muito grande (Máx 4MB)."
        }
        if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
            return "Formato inválido (Imagem ou PDF)."
        }

        // For MVP, if it's an image, convert to Base64 to store in DB 
        // (Not recommended for prod scale but solves the build error and works for small demos)
        // If PDF, we might need other handling, but let's try assuming image for now or just text.
        // Given constraints, I will try to save base64 if it's an image.
        try {
            const buffer = await file.arrayBuffer()
            const base64 = Buffer.from(buffer).toString('base64')
            imageUrl = `data:${file.type};base64,${base64}`
        } catch (_e) {
            return "Erro ao processar arquivo."
        }
    }

    try {
        // 1. Create Essay as PENDING
        const essay = await prisma.essay.create({
            data: {
                userId: session.user.id,
                theme,
                content: content || " [Arquivo Enviado] ",
                imageUrl: imageUrl,
                status: "PENDING"
            }
        })

        // 2. Trigger AI Correction (Fire and Forget or Await? Await for MVP UX)
        const config = await prisma.systemConfig.findFirst()

        if (config?.n8nWebhookUrl) {
            try {
                const response = await fetch(config.n8nWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: essay.id,
                        theme: essay.theme,
                        content: essay.content,
                        imageUrl: essay.imageUrl, // Base64 might be large, be careful
                        userId: session.user.id
                    })
                })

                if (response.ok) {
                    const result = await response.json()

                    // Expecting { score: number, feedback: string, suggestions: string, criteria: object }
                    // Check if result has valid data before updating
                    if (result && typeof result.score === 'number') {
                        await prisma.essay.update({
                            where: { id: essay.id },
                            data: {
                                status: 'CORRECTED',
                                score: result.score,
                                feedback: result.feedback || "Sem feedback detalhado.",
                                suggestions: result.suggestions || "Sem sugestões.",
                                criteria: result.criteria || {},
                                correctedAt: new Date()
                            }
                        })
                        revalidatePath("/redacao")
                        return "Redação enviada e corrigida pela IA com sucesso!"
                    }
                }
            } catch (webhookError) {
                console.error("Erro no Webhook n8n:", webhookError)
                // Do nothing, leave as PENDING
            }
        }

        revalidatePath("/redacao")
        return "Redação enviada com sucesso! Aguarde a correção."
    } catch (error) {
        console.error(error)
        return "Erro ao enviar redação."
    }
}

export async function toggleEditalProgress(topicId: string, field: 'hasStudiedTheory' | 'hasStudiedPDF' | 'hasReviewed', value: boolean) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        await prisma.userEditalProgress.upsert({
            where: {
                userId_topicId: {
                    userId: session.user.id,
                    topicId
                }
            },
            create: {
                userId: session.user.id,
                topicId,
                [field]: value
            },
            update: {
                [field]: value
            }
        })
        revalidatePath("/meu-edital")
        return { success: true }
    } catch (_error) {
        return { error: "Erro ao salvar progresso" }
    }
}

export async function seedEditalTopics() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") return { error: "Não autorizado" }

    const topics = [
        { subject: "PORTUGUES", title: "Compreensão e interpretação de textos", order: 1 },
        { subject: "PORTUGUES", title: "Tipologia textual", order: 2 },
        { subject: "PORTUGUES", title: "Ortografia oficial", order: 3 },
        { subject: "PORTUGUES", title: "Acentuação gráfica", order: 4 },
        { subject: "PORTUGUES", title: "Emprego das classes de palavras", order: 5 },
        { subject: "PORTUGUES", title: "Sintaxe da oração e do período", order: 6 },
        { subject: "PORTUGUES", title: "Pontuação", order: 7 },
        { subject: "PORTUGUES", title: "Concordância nominal e verbal", order: 8 },
        { subject: "PORTUGUES", title: "Regência nominal e verbal", order: 9 },
        { subject: "PORTUGUES", title: "Significação das palavras", order: 10 },

        { subject: "RACIOCINIO_LOGICO", title: "Estruturas lógicas", order: 1 },
        { subject: "RACIOCINIO_LOGICO", title: "Lógica de argumentação", order: 2 },
        { subject: "RACIOCINIO_LOGICO", title: "Diagramas lógicos", order: 3 },

        { subject: "INFORMATICA", title: "Conceitos de Internet e Intranet", order: 1 },
        { subject: "INFORMATICA", title: "Segurança da informação", order: 2 },
        { subject: "INFORMATICA", title: "Sistemas operacionais (Windows/Linux)", order: 3 },

        { subject: "DIREITO_CONSTITUCIONAL", title: "Direitos e garantias fundamentais", order: 1 },
        { subject: "DIREITO_CONSTITUCIONAL", title: "Defesa do Estado e das Instituições", order: 2 },

        { subject: "DIREITO_ADMINISTRATIVO", title: "Princípios básicos", order: 1 },
        { subject: "DIREITO_ADMINISTRATIVO", title: "Poderes administrativos", order: 2 },
        { subject: "DIREITO_ADMINISTRATIVO", title: "Atos administrativos", order: 3 },

        { subject: "DIREITO_PENAL", title: "Aplicação da lei penal", order: 1 },
        { subject: "DIREITO_PENAL", title: "Fato típico e ilicitude", order: 2 },
        { subject: "DIREITO_PENAL", title: "Crimes contra a pessoa", order: 3 },

        { subject: "LEGISLACAO_TRANSITO", title: "Código de Trânsito Brasileiro", order: 1 },
        { subject: "LEGISLACAO_TRANSITO", title: "Resoluções do CONTRAN", order: 2 },

        // Requisitos Básicos
        { subject: "REQUISITOS", title: "Ser brasileiro ou português equiparado", order: 1 },
        { subject: "REQUISITOS", title: "Ter idade mínima de 18 anos", order: 2 },
        { subject: "REQUISITOS", title: "Estar quite com as obrigações eleitorais e militares", order: 3 },
        { subject: "REQUISITOS", title: "Ter nível superior em qualquer área de formação", order: 4 },
        { subject: "REQUISITOS", title: "Possuir CNH categoria B ou superior", order: 5 },
        { subject: "REQUISITOS", title: "Ter aptidão física e mental", order: 6 },
    ]

    try {
        for (const t of topics) {
            await prisma.editalTopic.create({
                data: {
                    subject: t.subject as any,
                    title: t.title,
                    order: t.order,
                    priority: "MEDIUM"
                }
            })
        }
        revalidatePath("/meu-edital")
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: "Erro ao criar tópicos" }
    }
}
