import { getExams } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, FileText, PlayCircle, Printer, CheckSquare } from "lucide-react"

export const metadata = {
    title: "Simulados | PRF Ambiente Simulado",
    description: "Pratique com simulados oficiais e questões inéditas."
}

export default async function SimuladosPage() {
    const exams = await getExams()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Orientations Section */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-yellow-500" />
                    Orientações para os Simulados
                </h2>
                <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-400">
                    <div>
                        <strong className="text-white block mb-2">1. Modo Online</strong>
                        <p>Simulação real de prova com cronômetro e correção automática. Ideal para testar seu tempo e resistência.</p>
                    </div>
                    <div>
                        <strong className="text-white block mb-2">2. Modo Impresso</strong>
                        <p>Gere um arquivo PDF otimizado para impressão. Responda como no dia da prova e depois transcreva suas respostas.</p>
                    </div>
                    <div>
                        <strong className="text-white block mb-2">3. Gabarito</strong>
                        <p>Acesse as respostas corretas para correção manual. Recomendado apenas após finalizar o simulado.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                    <Card key={exam.id} className="bg-slate-900 border-slate-800 flex flex-col hover:border-slate-700 transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">{exam.title}</CardTitle>
                            <CardDescription className="text-slate-400 line-clamp-2">
                                {exam.description || "Simulado completo para o concurso PRF."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex justify-between items-center text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-yellow-500" />
                                    <span>{exam._count.questions} Questões</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-yellow-500" />
                                    <span>{Math.floor(exam.duration / 60)}h {exam.duration % 60}m</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 pt-2">
                            <Link href={`/simulados/${exam.id}`} className="w-full">
                                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold group">
                                    <PlayCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                    Fazer Online
                                </Button>
                            </Link>

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
                        </CardFooter>
                    </Card>
                ))}

                {exams.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-lg">
                        <p>Nenhum simulado disponível no momento.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
