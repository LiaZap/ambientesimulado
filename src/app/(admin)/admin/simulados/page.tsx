import { getExams } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, FileText, Trash2, Edit } from "lucide-react"
import { DeleteButton } from "@/components/admin/courses/delete-button"

export default async function AdminExamsPage() {
    const exams = await getExams() || []

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Gerenciar Simulados</h1>
                    <p className="text-slate-400">Crie simulados e adicione questões.</p>
                </div>
                <Link href="/admin/simulados/novo">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Novo Simulado
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {exams.map((exam) => (
                    <div key={exam.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-100 mb-1">{exam.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {exam._count?.questions || 0} Questões</span>
                                <span>•</span>
                                <span>{exam.duration} min</span>
                                <span>•</span>
                                <span className={exam.isActive ? "text-green-500" : "text-yellow-500"}>
                                    {exam.isActive ? "Ativo" : "Rascunho"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href={`/admin/simulados/${exam.id}`}>
                                <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                                    <Edit className="mr-2 h-4 w-4" /> Gerenciar Questões
                                </Button>
                            </Link>
                            <DeleteButton id={exam.id} type="exam" />
                        </div>
                    </div>
                ))}

                {exams.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-lg">
                        <p className="text-slate-500">Nenhum simulado criado.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
