import Link from "next/link"
import { getEssays } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenTool, Plus, Clock, CheckCircle, AlertTriangle } from "lucide-react"

export default async function EssaysPage() {
    const essays = await getEssays()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Redações</h1>
                    <p className="text-slate-400">Pratique sua escrita e receba correções detalhadas por IA.</p>
                </div>
                <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold">
                    <Link href="/redacao/nova">
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Redação
                    </Link>
                </Button>
            </div>

            {essays.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                    <PenTool className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-300">Nenhuma redação encontrada</h3>
                    <p className="text-slate-500 mt-2 mb-6">Comece agora a praticar para sua prova!</p>
                    <Button asChild variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-slate-950">
                        <Link href="/redacao/nova">Escrever Primeira Redação</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {essays.map((essay) => (
                        <Card key={essay.id} className="bg-slate-900 border-slate-800 text-slate-100 hover:border-slate-700 transition-colors">
                            <CardContent className="p-6 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg mb-1 line-clamp-1 text-slate-200">{essay.theme}</h3>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>{new Date(essay.submittedAt).toLocaleDateString()}</span>
                                        </div>
                                        {essay.score !== null && (
                                            <div className="font-bold text-yellow-500">
                                                Nota: {essay.score.toFixed(1)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    {essay.status === 'PENDING' && (
                                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> Pendente
                                        </Badge>
                                    )}
                                    {essay.status === 'CORRECTED' && (
                                        <Badge variant="outline" className="border-green-500/50 text-green-500 flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3" /> Corrigida
                                        </Badge>
                                    )}
                                    {essay.status === 'FAILED' && (
                                        <Badge variant="outline" className="border-red-500/50 text-red-500 flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3" /> Falha
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
