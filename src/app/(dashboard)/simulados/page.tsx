import { getExams } from "@/lib/data"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Target } from "lucide-react"
import { SmartExamBuilder } from "@/components/exam/smart-exam-builder"
import { CreateQuestionDialog } from "@/components/exam/create-question-dialog"
import { auth } from "@/lib/auth"
import { ExamCard } from "@/components/exam/exam-card"

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

            {/* Existing Orientations & Official Exams code... */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="h-6 w-6 text-yellow-500" />
                    Simulados Oficiais
                </h2>
                <CreateQuestionDialog />
            </div>

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

