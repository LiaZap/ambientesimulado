
import { prisma } from "@/lib/db"

export async function checkAchievements(userId: string) {
    // 1. Fetch User Stats & Unlocked Achievements
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: true,
            achievements: true,
        }
    })

    if (!user || !user.profile) return

    // 2. Fetch All Available Achievements
    const allAchievements = await prisma.achievement.findMany()

    // 3. Logic Check (Mock Logic matching Seed Criteria)
    const unlockedIds = user.achievements.map(ua => ua.achievementId)

    // Calculate Stats
    // Ideally we would run count queries, but for MVP we might rely on Profile stats if accurate, 
    // or run aggregate queries here. Let's run aggregate for correctness.

    const lessonCount = await prisma.progress.count({
        where: { userId, completed: true }
    })

    const examAttemptCount = await prisma.examAttempt.count({
        where: { userId, status: 'COMPLETED' }
    })

    // Find best exam score
    const bestExam = await prisma.examAttempt.findFirst({
        where: { userId, status: 'COMPLETED' },
        orderBy: { score: 'desc' }
    })

    // Assuming score is raw number, logic needs calculation.
    // "Sniper" says 80% accuracy.
    // We need to check correct / total.
    // Let's assume we can query ExamAttempt to see percentage if we had it.
    // We have correctAnswers and wrongAnswers. 
    // total = correct + wrong (approx).

    const achievementsToUnlock: string[] = []

    interface AchievementCriteria {
        type: 'lesson_count' | 'exam_count' | 'exam_score_percent';
        threshold: number;
    }

    for (const ach of allAchievements) {
        if (unlockedIds.includes(ach.id)) continue

        const criteria = ach.criteria as unknown as AchievementCriteria

        if (criteria.type === 'lesson_count') {
            if (lessonCount >= criteria.threshold) {
                achievementsToUnlock.push(ach.id)
            }
        }

        if (criteria.type === 'exam_count') {
            if (examAttemptCount >= criteria.threshold) {
                achievementsToUnlock.push(ach.id)
            }
        }

        if (criteria.type === 'exam_score_percent') {
            if (bestExam) {
                const total = bestExam.correctAnswers + bestExam.wrongAnswers
                if (total > 0) {
                    const percent = (bestExam.correctAnswers / total) * 100
                    if (percent >= criteria.threshold) {
                        achievementsToUnlock.push(ach.id)
                    }
                }
            }
        }
    }

    // 4. Unlock New Achievements
    for (const achId of achievementsToUnlock) {
        await prisma.userAchievement.create({
            data: {
                userId,
                achievementId: achId,
                total: 100, // Fixed metric for now
                progress: 100,
                unlocked: true,
                unlockedAt: new Date()
            }
        })

        // Award XP?
        const ach = allAchievements.find(a => a.id === achId)
        if (ach) {
            const currentXp = user.profile.xp
            const reward = ach.xpReward
            const newXp = currentXp + reward
            const newLevel = Math.floor(newXp / 1000) + 1

            await prisma.profile.update({
                where: { userId },
                data: {
                    xp: newXp,
                    level: newLevel
                }
            })
        }
    }
}
