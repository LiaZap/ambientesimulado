import { getExam } from "@/lib/data"
import { notFound } from "next/navigation"

interface ExamAnswerKeyPageProps {
    params: Promise<{
        examId: string
    }>
}

export default async function ExamAnswerKeyPage(props: ExamAnswerKeyPageProps) {
    const params = await props.params
    const exam = await getExam(params.examId)

    if (!exam) {
        notFound()
    }

    return (
        <div className="bg-white text-black min-h-screen p-8 print:p-0 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-xl font-bold uppercase">Gabarito Oficial</h1>
                    <p className="text-gray-600">{exam.title}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {exam.questions.map((question, index) => (
                        <div key={question.id} className="flex items-center justify-between p-2 border border-gray-200 rounded text-sm">
                            <span className="font-bold text-gray-500">Q{index + 1}</span>
                            <span className={`font-bold ${question.correctAnswer === 'CERTO' ? 'text-green-600' : 'text-red-600'}`}>
                                {question.correctAnswer}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center print:hidden">
                    <p className="text-sm text-gray-500">Utilize a função de impressão do seu navegador (Ctrl+P) para imprimir este gabarito.</p>
                </div>
            </div>
        </div>
    )
}
