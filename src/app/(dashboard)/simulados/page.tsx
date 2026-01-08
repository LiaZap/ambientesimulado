import { getExams } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, FileText, PlayCircle, Printer, CheckSquare, Brain, Target } from "lucide-react"
import { SmartExamBuilder } from "@/components/exam/smart-exam-builder"
import { CreateQuestionDialog } from "@/components/exam/create-question-dialog"
import { auth } from "@/lib/auth"

export const metadata = {
    title: "Simulados | PRF Ambiente Simulado",
    description: "Pratique com simulados oficiais e questões inéditas."
}

export default async function SimuladosPage() {
    const session = await auth()
    const allExams = await getExams()

    // Filter exams
    const officialExams = allExams.filter(e => !e.isCustom)
    const myCustomExams = allExams.filter(e => e.isCustom && e.creatorId === session?.user?.id)

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            <SmartExamBuilder />

            {/* Custom Exams Section */}
            {myCustomExams.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Target className="h-6 w-6 text-yellow-500" />
                        Meus Treinos Personalizados
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myCustomExams.map((exam) => (
                            <ExamCard key={exam.id} exam={exam} isCustom />
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="h-6 w-6 text-yellow-500" />
                    Simulados Oficiais
                </h2>
                <CreateQuestionDialog />
            </div>

            {/* Orientations Section (Collapsible or smaller maybe? keeping as is for now) */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8">
                <h2 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                    Orientações
                </h2>
                <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-400">
                    <div>
                        <strong className="text-white block mb-2">1. Modo Online</strong>
                        <p>Simulação real de prova com cronômetro e correção automática.</p>
                    </div>
                    <div>
                        <strong className="text-white block mb-2">2. Modo Impresso</strong>
                        <p>Gere um PDF otimizado para impressão e responda no papel.</p>
                    </div>
                    <div>
                        <strong className="text-white block mb-2">3. Gabarito</strong>
                        <p>Acesse as respostas corretas após finalizar o simulado.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {officialExams.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} />
                ))}

                {officialExams.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-lg">
                        <p>Nenhum simulado oficial disponível no momento.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function ExamCard({ exam, isCustom }: { exam: any, isCustom?: boolean }) {
    return (
        <Card className="bg-slate-900 border-slate-800 flex flex-col hover:border-slate-700 transition-all duration-300">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-white">{exam.title}</CardTitle>
                    {isCustom && (
                        <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded border border-yellow-500/20">Custom</span>
                    )}
                </div>
                <CardDescription className="text-slate-400 line-clamp-2">
                    {exam.description || "Simulado completo para o concurso PRF."}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex justify-between items-center text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-yellow-500" />
                        <span>{exam._count?.questions || exam.totalQuestions} Questões</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span>{Math.floor(exam.duration / 60)}h {exam.duration % 60}m</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-2">
                <Link href={isCustom ? `/simulados/${exam.id}?mode=TRAINING` : `/simulados/${exam.id}`} className="w-full">
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold group">
                        <PlayCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        {isCustom ? "Treinar Agora" : "Fazer Online"}
                    </Button>
                </Link>

                {!isCustom && (
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <Link href={`/simulados/${exam.id}/imprimir`} target="_blank" className="w-full">
                            <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
                                <Printer className="w-4 h-4 mr-2" />
                                Imprimir
                            </Button>
                        </Link>
                        <Link href={`/simulados/${exam.id}/gabarito`} target="_blank" className="w-full">
                            <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
                                <CheckSquare className="w-4 h-4 mr-2" />
                                Gabarito
                            </Button>
                        </Link>
                        <Link href={`/simulados/${exam.id}/redacao`} target="_blank" className="col-span-2 w-full">
                            <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
                                <FileText className="w-4 h-4 mr-2" />
                                Folha de Redação
                            </Button>
                        </Link>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
