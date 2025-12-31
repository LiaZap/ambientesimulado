import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, AlertTriangle, ChevronLeft, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DeleteEssayButton } from "@/components/essay/delete-essay-button"

export default async function EssayDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) redirect("/login")

    // Await params correctly for Next.js 15
    const { id } = await params

    const essay = await prisma.essay.findUnique({
        where: { id },
        include: { user: true }
    })

    if (!essay) redirect("/redacao")
    if (essay.userId !== session.user.id && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
        redirect("/redacao")
    }

    const criteria = essay.criteria as Record<string, number> | null

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <Button variant="ghost" asChild className="mb-4 text-slate-400 hover:text-white pl-0">
                    <Link href="/redacao"><ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Redações</Link>
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{essay.theme}</h1>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {new Date(essay.submittedAt).toLocaleDateString()} às {new Date(essay.submittedAt).toLocaleTimeString()}</span>
                            <span>•</span>
                            <span>{essay.user.name}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {essay.status === 'PENDING' && (
                            <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 px-4 py-1.5 text-sm flex items-center gap-2">
                                <Clock className="h-4 w-4 animate-pulse" /> Aguardando Correção...
                            </Badge>
                        )}
                        {essay.status === 'CORRECTED' && (
                            <Badge variant="outline" className="border-green-500/50 text-green-500 px-4 py-1.5 text-sm flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" /> Corrigida
                            </Badge>
                        )}
                        {essay.status === 'FAILED' && (
                            <Badge variant="outline" className="border-red-500/50 text-red-500 px-4 py-1.5 text-sm flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" /> Falha na Correção
                            </Badge>
                        )}
                        <DeleteEssayButton essayId={essay.id} />
                    </div>
                </div>
            </div>

            {/* Score Overview */}
            {essay.status === 'CORRECTED' && essay.score !== null && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Only show Score Card if score > 0 */}
                    {essay.score > 0 && (
                        <Card className="bg-slate-900 border-slate-800 text-slate-100 col-span-1 md:col-span-3 lg:col-span-1">
                            <CardHeader>
                                <CardTitle className="text-center text-slate-400 uppercase text-xs tracking-widest font-bold">Nota Final</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center pt-0 pb-8">
                                <div className="text-6xl font-black text-yellow-500 mb-2">{essay.score.toFixed(1)}</div>
                                <div className="text-slate-500 text-sm font-medium">de 100.0 pontos</div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className={`bg-slate-900 border-slate-800 text-slate-100 col-span-1 md:col-span-3 ${essay.score > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                        <CardHeader>
                            <CardTitle className="text-slate-100">Feedback Geral</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                                {essay.feedback || "Sem feedback disponível."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Detailed Criteria */}
            {essay.status === 'CORRECTED' && criteria && Object.keys(criteria).length > 0 && (
                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                    <CardHeader>
                        <CardTitle>Detalhamento da Nota</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        {Object.entries(criteria).map(([criterion, score]) => (
                            <div key={criterion}>
                                <div className="flex justify-between mb-2 text-sm font-medium">
                                    <span className="capitalize">{criterion.replace(/_/g, ' ')}</span>
                                    {/* Assuming max score is relative or unknown, just showing raw score for now */}
                                    <span className="text-yellow-500">{score} pts</span>
                                </div>
                                {/* If we knew the max score per criteria we could use Progress bar properly. 
                                    For now just a visual bar proportional to some assumed max or just static full width */}
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    {/* Just a visual indicator here since max score is dynamic */}
                                    <div className="h-full bg-yellow-500/50" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Suggestions */}
            {essay.status === 'CORRECTED' && essay.suggestions && essay.suggestions !== "Sem sugestões." && (
                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                    <CardHeader>
                        <CardTitle className="text-yellow-500">Sugestões de Melhoria</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                            {essay.suggestions}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Original Content */}
            <Card className="bg-slate-950 border-slate-800 text-slate-100">
                <CardHeader>
                    <CardTitle className="text-lg text-slate-400">Conteúdo Original</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {essay.imageUrl && (
                        <div>
                            <p className="text-xs text-slate-500 mb-2 font-bold uppercase">Arquivo Enviado</p>
                            <div className="rounded-lg overflow-hidden border border-slate-800">
                                {/* If it starts with data:image, it's renderable. If PDF, we might need a link */}
                                {essay.imageUrl.startsWith('data:image') ? (
                                    <img src={essay.imageUrl} alt="Redação" className="w-full max-h-[500px] object-contain bg-slate-900" />
                                ) : (
                                    <div className="p-8 text-center bg-slate-900">
                                        <p className="mb-4 text-slate-400">O arquivo não pode ser visualizado diretamente.</p>
                                        <a href={essay.imageUrl} download="redacao" className="text-yellow-500 hover:underline">Baixar Arquivo</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-xs text-slate-500 mb-2 font-bold uppercase">Texto</p>
                        <div className="bg-slate-900 p-6 rounded-lg font-serif text-slate-300 leading-relaxed whitespace-pre-wrap border border-slate-800">
                            {essay.content}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
