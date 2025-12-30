import { getRanking, getUserProfile } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function RankingPage() {
    const ranking = await getRanking()
    const currentUser = await getUserProfile()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    Ranking Global
                </h1>
                <p className="text-slate-400">Veja quem são os alunos mais dedicados da plataforma.</p>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Top 50 Alunos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {ranking.map((user, index) => {
                            const isCurrentUser = user.id === currentUser?.id
                            const position = index + 1

                            let positionStyle = "text-slate-400 font-bold"
                            let icon = null

                            if (position === 1) {
                                positionStyle = "text-yellow-500 font-extrabold text-xl"
                                icon = <Crown className="h-5 w-5 text-yellow-500" />
                            } else if (position === 2) {
                                positionStyle = "text-slate-300 font-bold text-lg"
                                icon = <Medal className="h-5 w-5 text-slate-300" />
                            } else if (position === 3) {
                                positionStyle = "text-amber-700 font-bold text-lg"
                                icon = <Medal className="h-5 w-5 text-amber-700" />
                            }

                            return (
                                <div
                                    key={user.id}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-lg border transition-all",
                                        isCurrentUser
                                            ? "bg-yellow-500/10 border-yellow-500"
                                            : "bg-slate-950 border-slate-800 hover:border-slate-700"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-8 text-center", positionStyle)}>
                                            {icon || `#${position}`}
                                        </div>

                                        <div className="h-10 w-10 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-xs text-slate-500 font-bold">
                                                    {user.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <span className={cn("font-semibold", isCurrentUser ? "text-yellow-500" : "text-white")}>
                                                {user.name} {isCurrentUser && "(Você)"}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                Level {user.profile?.level || 1}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold">{user.profile?.xp || 0}</span>
                                        <span className="text-xs text-slate-500">XP</span>
                                    </div>
                                </div>
                            )
                        })}

                        {ranking.length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                                Nenhum aluno pontuou ainda. Seja o primeiro!
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
