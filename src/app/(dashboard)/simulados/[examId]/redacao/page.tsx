import { getExam } from "@/lib/data"
import { notFound } from "next/navigation"

interface EssayPageProps {
    params: Promise<{
        examId: string
    }>
}

export default async function EssayPrintPage(props: EssayPageProps) {
    const params = await props.params
    const exam = await getExam(params.examId)

    if (!exam) {
        notFound()
    }

    // Since we don't have a specific essay topic in DB yet, we show a generic structure
    // or we could use the description if it contains the theme.

    return (
        <div className="bg-white text-black min-h-screen p-8 print:p-0 font-serif">
            <div className="max-w-4xl mx-auto border border-black p-8 min-h-[1000px] relative">
                {/* Header */}
                <div className="text-center mb-8 border-b-2 border-black pb-4">
                    <h1 className="text-xl font-bold uppercase mb-2">Folha de Redação Definitiva</h1>
                    <h2 className="text-lg font-bold uppercase text-gray-700">{exam.title}</h2>
                    <p className="text-sm mt-2">Simulado PRF - {new Date().getFullYear()}</p>
                </div>

                {/* Candidate Info */}
                <div className="border border-black p-4 mb-6 flex gap-4 text-sm font-sans mb-8">
                    <div className="flex-1">
                        <span className="font-bold block text-xs uppercase mb-1">Nome do Candidato:</span>
                        <div className="border-b border-black border-dashed h-6"></div>
                    </div>
                    <div className="w-32">
                        <span className="font-bold block text-xs uppercase mb-1">Data:</span>
                        <div className="border-b border-black border-dashed h-6"></div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mb-6 text-sm text-justify font-sans bg-gray-50 p-4 border border-gray-200 print:border-transparent print:bg-transparent">
                    <h3 className="font-bold mb-2">Instruções:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Esta folha é destinada à transcrição da versão definitiva da sua redação.</li>
                        <li>Utilize caneta esferográfica de tinta preta, fabricada em material transparente.</li>
                        <li>Não será permitida a consulta a nenhum material de apoio.</li>
                        <li>A redação deve ter entre 20 e 30 linhas.</li>
                    </ul>
                </div>

                {/* Essay Lines (30 lines) */}
                <div className="space-y-0">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className="flex h-10 border-b border-black/30 items-end">
                            <span className="text-xs text-gray-400 w-8 text-right pr-2 select-none">{i + 1}</span>
                            <div className="flex-1"></div>
                        </div>
                    ))}
                </div>

                {/* Print Hint */}
                <div className="print:hidden fixed bottom-8 right-8">
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg font-bold hover:bg-blue-700 transition"
                    >
                        Imprimir Folha
                    </button>
                </div>
            </div>
        </div>
    )
}
