import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function getUserProfile() {
    const session = await auth()

    if (!session?.user?.email) return null

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            profile: true,
            subscription: true,
            achievements: {
                include: {
                    achievement: true
                }
            }
        }
    })

    return user
}

export async function getCourses() {
    const courses = await prisma.course.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
            _count: {
                select: { modules: true }
            }
        }
    })
    return courses
}

export async function getAllCourses() {
    const courses = await prisma.course.findMany({
        orderBy: { order: 'asc' },
        include: {
            _count: {
                select: { modules: true }
            }
        }
    })
    return courses
}

export async function getDashboardStats() {
    const user = await getUserProfile()
    if (!user) return null

    // 1. Completed Lessons
    const completedLessons = await prisma.progress.count({
        where: {
            userId: user.id,
            completed: true
        }
    })

    // 2. Exam Stats (Simulados)
    const examStats = await prisma.examAttempt.aggregate({
        where: { userId: user.id, status: 'COMPLETED' },
        _sum: {
            correctAnswers: true,
            wrongAnswers: true,
            score: true,
            timeSpent: true
        },
        _count: {
            id: true // total attempts
        }
    })

    const totalQuestionsAnswered = (examStats._sum.correctAnswers || 0) + (examStats._sum.wrongAnswers || 0)
    const accuracy = totalQuestionsAnswered > 0
        ? Math.round(((examStats._sum.correctAnswers || 0) / totalQuestionsAnswered) * 100)
        : 0

    // 3. Essay Stats
    // const essaysSubmitted = await prisma.essay.count({ where: { userId: user.id } })

    return {
        user,
        completedLessons,
        examStats: {
            attempts: examStats._count.id,
            correct: examStats._sum.correctAnswers || 0,
            wrong: examStats._sum.wrongAnswers || 0,
            score: examStats._sum.score || 0,
            timeSpent: Math.floor((examStats._sum.timeSpent || 0) / 3600), // hours
            accuracy
        },
        courses: await getCourses()
    }
}

export async function getCourse(courseId: string) {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: {
                orderBy: { order: 'asc' },
                include: {
                    lessons: {
                        orderBy: { order: 'asc' },
                        include: {
                            progress: {
                                where: { userId: (await auth())?.user?.id }
                            }
                        }
                    }
                }
            }
        }
    })
    return course
}

export async function getLesson(lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
            module: {
                include: {
                    course: true
                }
            },
            progress: {
                where: { userId: (await auth())?.user?.id }
            }
        }
    })
    return lesson
}

export async function getEssays() {
    const session = await auth()
    if (!session?.user?.id) return []

    const essays = await prisma.essay.findMany({
        where: { userId: session.user.id },
        orderBy: { submittedAt: 'desc' }
    })
    return essays
}

export async function getExams() {
    const exams = await prisma.exam.findMany({
        where: { isActive: true },
        include: {
            _count: {
                select: { questions: true }
            }
        }
    })
    return exams
}

export async function getExam(examId: string) {
    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: {
            questions: {
                orderBy: { createdAt: 'asc' } // Or by specific order field
            }
        }
    })
    return exam
}

export async function getQuestions() {
    const questions = await prisma.question.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50 // Limit for now
    })
    return questions
}

export async function getRanking() {
    const ranking = await prisma.user.findMany({
        where: { profile: { isNot: null } },
        select: {
            id: true,
            name: true,
            avatar: true,
            profile: {
                select: {
                    xp: true,
                    level: true
                }
            }
        },
        orderBy: {
            profile: {
                xp: 'desc'
            }
        },
        take: 50
    })
    return ranking
}

export async function getAllUsers() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            profile: true,
            subscription: true,
            _count: {
                select: { progress: true }
            }
        }
    })
    return users
}

export async function getEditalData() {
    const session = await auth()
    const userId = session?.user?.id

    const topics = await prisma.editalTopic.findMany({
        orderBy: { order: 'asc' },
        include: {
            progress: {
                where: { userId: userId || 'no-user' }
            }
        }
    })
    return topics
}
