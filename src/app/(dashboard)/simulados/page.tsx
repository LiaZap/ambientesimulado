import { getExams } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, FileText, PlayCircle } from "lucide-react"

export const metadata = {
    title: "Simulados | PRF Ambiente Simulado",
    description: "Pratique com simulados oficiais e questões inéditas."
}

export default async function SimuladosPage() {
    const exams = await getExams()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Simulados</h1>
                <p className="text-slate-400">Teste seus conhecimentos com simulados completos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                    <Card key={exam.id} className="bg-slate-900 border-slate-800 hover:border-yellow-500/50 transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">{exam.title}</CardTitle>
                            <CardDescription className="text-slate-400 line-clamp-2">
                                {exam.description || "Simulado completo para o concurso PRF."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
                        <CardFooter>
                            <Link href={`/simulados/${exam.id}`} className="w-full">
                                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold">
                                    <PlayCircle className="w-4 h-4 mr-2" />
                                    Iniciar Simulado
                                </Button>
                            </Link>
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
