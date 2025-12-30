import { getAllUsers } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function AdminUsersPage() {
    const users = await getAllUsers()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white">Gerenciar Usuários</h1>
                <p className="text-slate-400">Total de {users.length} usuários cadastrados.</p>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Buscar usuários..."
                            className="pl-9 bg-slate-950 border-slate-800 focus:ring-yellow-500"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={user.avatar || undefined} />
                                        <AvatarFallback className="bg-slate-800 text-slate-400 font-bold">
                                            {(user.name || "U").charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-slate-200">{user.name}</p>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="hidden md:block text-right">
                                        <p className="text-sm font-medium text-slate-300">Level {user.profile?.level || 1}</p>
                                        <p className="text-xs text-slate-500">{user._count?.progress || 0} aulas</p>
                                    </div>
                                    <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'default'} className={user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}>
                                        {user.role}
                                    </Badge>
                                    <Button size="icon" variant="ghost" className="text-slate-500">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
