import { getExam } from "@/lib/data"
import { notFound } from "next/navigation"

interface ExamPrintPageProps {
    params: Promise<{
        examId: string
    }>
}

export default async function ExamPrintPage(props: ExamPrintPageProps) {
    const params = await props.params
    const exam = await getExam(params.examId)

    if (!exam) {
        notFound()
    }

    return (
        <div className="bg-white text-black min-h-screen p-8 print:p-0 font-serif">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 border-b-2 border-black pb-4">
                    <h1 className="text-2xl font-bold uppercase">{exam.title}</h1>
                    <p className="text-sm mt-2">Simulado PRF - {new Date().getFullYear()}</p>
                </div>

                <div className="space-y-8">
                    {exam.questions.map((question, index) => (
                        <div key={question.id} className="break-inside-avoid">
                            <div className="flex gap-4">
                                <span className="font-bold text-lg">{index + 1}.</span>
                                <div className="space-y-2 flex-1">
                                    {question.supportText && (
                                        <div className="p-4 bg-gray-100 border-l-4 border-gray-400 text-sm italic mb-4 print:bg-transparent print:border-gray-800">
                                            {question.supportText}
                                        </div>
                                    )}
                                    <p className="text-justify leading-relaxed">{question.statement}</p>

                                    {/* Options Area - Placeholder for user to mark */}
                                    <div className="mt-4 pt-2 flex gap-8 text-sm font-sans">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border border-black rounded-full"></div>
                                            <span>CERTO</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border border-black rounded-full"></div>
                                            <span>ERRADO</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-black text-center text-xs text-gray-500 print:hidden">
                    <p>Pressione Ctrl+P (ou Cmd+P) para imprimir este simulado.</p>
                </div>
            </div>
        </div>
    )
}
