import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Trash2, Plus, Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { removeQuestionFromExam, addQuestionToExam } from "@/lib/actions"
import { QuestionPicker } from "@/components/admin/exams/question-picker"

// Need to update data fetching to get Exam with Questions
async function getExamWithQuestions(examId: string) {
    return await prisma.exam.findUnique({
        where: { id: examId },
        include: {
            questions: true
        }
    })
}

// Server Component
export default async function AdminExamDetailPage(props: { params: Promise<{ examId: string }> }) {
    const params = await props.params;
    const { examId } = params;
    const exam = await getExamWithQuestions(examId)

    if (!exam) return <div>Simulado não encontrado</div>

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/simulados">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">{exam.title}</h1>
                    <p className="text-slate-400 text-sm">Gerenciamento de Questões</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Current Questions */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-200">Questões no Simulado ({exam.questions.length})</h2>
                    </div>

                    <div className="space-y-3">
                        {exam.questions.map((q, index) => (
                            <div key={q.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex gap-4">
                                <span className="font-bold text-slate-500">#{index + 1}</span>
                                <div className="flex-1 space-y-2">
                                    <p className="text-sm text-slate-300 line-clamp-2">{q.statement}</p>
                                    <div className="flex gap-2 text-xs">
                                        <Badge variant="outline" className="border-slate-700 text-slate-400">{q.subject}</Badge>
                                        <Badge variant="secondary" className="bg-slate-800">{q.difficulty}</Badge>
                                    </div>
                                </div>
                                <form action={async () => {
                                    'use server'
                                    await removeQuestionFromExam(exam.id, q.id)
                                }}>
                                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        ))}
                        {exam.questions.length === 0 && (
                            <p className="text-slate-500 italic">Nenhuma questão adicionada.</p>
                        )}
                    </div>
                </div>

                {/* Right: Question Picker */}
                <div className="w-full lg:w-[400px]">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sticky top-4">
                        <h2 className="text-lg font-bold text-white mb-4">Adicionar Questões</h2>
                        <QuestionPicker examId={exam.id} currentQuestionIds={exam.questions.map(q => q.id)} />
                    </div>
                </div>
            </div>
        </div>
    )
}
