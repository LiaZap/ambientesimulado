import { getDashboardStats } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Trophy, Target, Zap, Clock } from "lucide-react"
import { StudyCycle } from "@/components/dashboard/study-cycle"

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    if (!stats?.user) {
        return <div>Carregando perfil...</div>
    }

    const { user, completedLessons, examStats } = stats

    // Calculate level progress (mock logic for now: (xp % 1000) / 10)
    const currentXp = user.profile?.xp || 0
    // XP needed for next level: 1000 * level. Current progress is remainder.
    const xpForNextLevel = 1000
    const progressToNextLevel = (currentXp % xpForNextLevel)
    const progressPercentage = (progressToNextLevel / xpForNextLevel) * 100

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Olá, <span className="text-yellow-500">{user.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-slate-400">Pronto para dominar o conteúdo da PRF hoje?</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2 px-3">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span className="font-bold text-white">{user.profile?.level} <span className="text-xs text-slate-500 font-normal">Nível</span></span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-800" />
                    <div className="flex items-center gap-2 px-3">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <span className="font-bold text-white">{user.profile?.streak} <span className="text-xs text-slate-500 font-normal">Dias</span></span>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total XP</CardTitle>
                        <Trophy className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{user.profile?.xp}</div>
                        <Progress value={progressPercentage} className="h-1 mt-3" />
                        <p className="text-xs text-slate-500 mt-2">{xpForNextLevel - progressToNextLevel} XP para o próximo nível</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Aulas Assistidas</CardTitle>
                        <BookOpen className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{completedLessons}</div>
                        <p className="text-xs text-slate-500 mt-1">Mantenha o ritmo!</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Precisão (Simulados)</CardTitle>
                        <Target className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{examStats.accuracy}%</div>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                            <span className="text-green-500">{examStats.correct} C</span>
                            <span className="text-slate-600">|</span>
                            <span className="text-red-500">{examStats.wrong} E</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Tempo de Estudo</CardTitle>
                        <Clock className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{examStats.timeSpent}h</div>
                        <p className="text-xs text-slate-500 mt-1">Em simulados</p>
                    </CardContent>
                </Card>
            </div>

            {/* Study Cycle */}
            <div className="grid grid-cols-1 gap-8">
                <StudyCycle />
            </div>
        </div>
    )
}

