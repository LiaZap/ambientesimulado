import Link from "next/link"
import { getExams } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Timer, FileText, ArrowRight } from "lucide-react"

export default async function SimuladosPage() {
    const exams = await getExams()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Simulados</h1>
                <p className="text-muted-foreground">Teste seus conhecimentos com simulados oficiais e inéditos.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {exams.map((exam) => (
                    <Card key={exam.id} className="hover:border-primary/50 transition-all">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-xl text-card-foreground mb-1">{exam.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{exam.description}</p>
                                </div>
                                <Badge variant="outline" className="border-primary text-primary">
                                    {exam.year || '2024'}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span>{exam._count?.questions} Questões</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Timer className="h-4 w-4" />
                                    <span>{Math.floor(exam.duration / 60)}h {exam.duration % 60}m</span>
                                </div>
                            </div>

                            <Button asChild className="w-full font-bold transition-colors">
                                <Link href={`/simulados/${exam.id}`}>
                                    Começar Simulado <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                {exams.length === 0 && (
                    <div className="col-span-full text-center py-20 border border-dashed border-border rounded-xl bg-muted/50">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-foreground">Nenhum simulado disponível</h3>
                        <p className="text-muted-foreground mt-2">Em breve novos simulados serão adicionados.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
