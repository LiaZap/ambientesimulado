import { getUserProfile } from "@/lib/data"
import { ProfileForm } from "@/components/profile/profile-form"
import { ChangePasswordForm } from "@/components/profile/change-password-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Star, User as UserIcon } from "lucide-react"

export default async function ProfilePage() {
    const user = await getUserProfile()

    if (!user) {
        return <div className="text-white">Carregando perfil...</div>
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name || "User"} className="h-full w-full rounded-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-slate-400 bg-slate-800 rounded-full">
                            {(user.name || "U").charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="text-center md:text-left space-y-2">
                    <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                        <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-sm font-bold flex items-center gap-2">
                            <Trophy className="h-4 w-4" /> Nível {user.profile?.level || 1}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-sm font-medium">
                            {user.email}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="dados" className="space-y-6">
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="dados" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-950">Dados Pessoais</TabsTrigger>
                    <TabsTrigger value="conquistas" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-950">Conquistas</TabsTrigger>
                    <TabsTrigger value="seguranca" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-950">Segurança</TabsTrigger>
                </TabsList>

                <TabsContent value="dados">
                    <ProfileForm user={{ name: user.name, email: user.email }} />
                </TabsContent>

                <TabsContent value="conquistas">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Minhas Conquistas</CardTitle>
                            <CardDescription className="text-slate-400">
                                Desbloqueie emblemas ao completar aulas e simulados.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {user.achievements && user.achievements.length > 0 ? (
                                    user.achievements.map((ua) => (
                                        <div key={ua.id} className="flex flex-col items-center p-4 bg-slate-950 rounded-lg border border-yellow-500/50 bg-yellow-500/5">
                                            {/* Dynamic Icon */}
                                            {ua.achievement.icon === 'Medal' && <Medal className="h-10 w-10 text-yellow-500 mb-2" />}
                                            {ua.achievement.icon === 'Star' && <Star className="h-10 w-10 text-yellow-500 mb-2" />}
                                            {ua.achievement.icon === 'Trophy' && <Trophy className="h-10 w-10 text-yellow-500 mb-2" />}
                                            {ua.achievement.icon === 'Target' && <div className="h-10 w-10 flex items-center justify-center text-2xl mb-2">🎯</div>}
                                            {ua.achievement.icon === 'Crosshair' && <div className="h-10 w-10 flex items-center justify-center text-2xl mb-2">🎯</div>}
                                            {!['Medal', 'Star', 'Trophy', 'Target', 'Crosshair'].includes(ua.achievement.icon) && (
                                                <Medal className="h-10 w-10 text-yellow-500 mb-2" />
                                            )}

                                            <span className="text-sm font-bold text-white text-center">{ua.achievement.name}</span>
                                            <span className="text-xs text-slate-400 text-center">{ua.achievement.description}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8 text-slate-500">
                                        <Medal className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p>Você ainda não desbloqueou nenhuma conquista.</p>
                                        <p className="text-sm">Complete aulas e simulados para ganhar!</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="seguranca">
                    <ChangePasswordForm />
                </TabsContent>
            </Tabs>
        </div>
    )
}
