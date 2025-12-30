import Link from "next/link"
import { getQuestions } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DeleteButton } from "@/components/admin/courses/delete-button"
import { QuestionBulkImport } from "@/components/admin/questions/question-bulk-import"

export default async function AdminQuestionsPage() {
    const questions = await getQuestions()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Banco de Questões</h1>
                    <p className="text-slate-400">Gerencie as questões para simulados.</p>
                </div>
                <div className="flex gap-2">
                    <QuestionBulkImport />
                    <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold">
                        <Link href="/admin/questoes/nova">
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Questão
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Buscar questões..."
                            className="pl-9 bg-slate-950 border-slate-800 focus:ring-yellow-500"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {questions.length === 0 ? (
                            <div className="text-center py-10 text-slate-500">
                                Nenhuma questão encontrada.
                            </div>
                        ) : (
                            questions.map((q) => (
                                <div key={q.id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="border-slate-700 text-slate-400">
                                                {q.subject.replace('_', ' ')}
                                            </Badge>
                                            <Badge variant="secondary" className="bg-slate-800 text-slate-400 text-xs">
                                                {q.difficulty}
                                            </Badge>
                                        </div>
                                        <p className="text-slate-300 text-sm line-clamp-2">{q.statement}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span>{q.institution} ({q.year})</span>
                                            <span>•</span>
                                            <span>
                                                Gabarito:{" "}
                                                <span className={
                                                    q.correctAnswer === "CERTO" || q.correctAnswer === "ERRADO"
                                                        ? (q.correctAnswer === "CERTO" ? "text-green-500 font-bold" : "text-red-500 font-bold")
                                                        : "text-yellow-500 font-bold"
                                                }>
                                                    {q.correctAnswer}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button size="icon" variant="ghost" className="text-slate-500 hover:text-white">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <DeleteButton id={q.id} type="question" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
