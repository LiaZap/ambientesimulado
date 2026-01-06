import { getExam } from "@/lib/data"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EssayForm } from "@/components/essay/essay-form"
import { Printer, PenTool } from "lucide-react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

interface EssayPageProps {
    params: Promise<{
        examId: string
    }>
}

export default async function EssayExamPage(props: EssayPageProps) {
    const params = await props.params
    const exam = await getExam(params.examId)
    const session = await auth()

    // Fetch user current credits
    const user = session?.user?.id ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
    }) : null

    if (!exam) {
        notFound()
    }

    return (
        <div className="bg-slate-950 min-h-screen p-6 animate-in fade-in duration-500 print:bg-white print:p-0">
            {/* Print Header (Visible only on print) */}
            <div className="hidden print:block mb-8 text-center text-black">
                <h1 className="text-xl font-bold uppercase mb-2">Folha de Redação Definitiva</h1>
                <h2 className="text-lg font-bold uppercase">{exam.title}</h2>
                <p className="text-sm mt-2">Simulado PRF - {new Date().getFullYear()}</p>
            </div>

            {/* Navigation (Hidden on print) */}
            <div className="max-w-4xl mx-auto mb-8 print:hidden">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2">Redação do Simulado</h1>
                    <p className="text-slate-400">Escolha entre imprimir a folha oficial ou realizar a redação com correção por IA.</p>
                </div>

                <Tabs defaultValue="ai" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-900 border border-slate-800">
                        <TabsTrigger value="ai" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-950 font-bold">
                            <PenTool className="w-4 h-4 mr-2" />
                            Redação com IA
                        </TabsTrigger>
                        <TabsTrigger value="print" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                            <Printer className="w-4 h-4 mr-2" />
                            Folha de Impressão
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="ai" className="mt-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <EssayForm
                                initialTheme={`Tema da Redação: ${exam.title}`}
                                examId={exam.id}
                                userCredits={user?.credits ?? 0}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="print" className="mt-6">
                        <div className="bg-white text-black p-8 font-serif shadow-xl rounded-lg overflow-hidden relative min-h-[1000px]">
                            {/* Paper Header Preview */}
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
                            <div className="mb-6 text-sm text-justify font-sans bg-gray-50 p-4 border border-gray-200">
                                <h3 className="font-bold mb-2">Instruções:</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Esta folha é destinada à transcrição da versão definitiva da sua redação.</li>
                                    <li>Utilize caneta esferográfica de tinta preta, fabricada em material transparente.</li>
                                    <li>Não será permitida a consulta a nenhum material de apoio.</li>
                                    <li>A redação deve ter entre 20 e 30 linhas.</li>
                                </ul>
                            </div>

                            {/* Lines */}
                            <div className="space-y-0">
                                {Array.from({ length: 30 }).map((_, i) => (
                                    <div key={i} className="flex h-10 border-b border-black/30 items-end">
                                        <span className="text-xs text-gray-400 w-8 text-right pr-2 select-none">{i + 1}</span>
                                        <div className="flex-1"></div>
                                    </div>
                                ))}
                            </div>

                            <div className="absolute top-4 right-4 print:hidden">
                                <button
                                    // onClick removed because this is a server component
                                    className="hidden"
                                >
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-slate-400 text-sm mb-2">Tecle CTRL+P para imprimir esta folha.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Printable Content (Visible ONLY when printing) */}
            <div className="hidden print:block bg-white text-black p-0 font-serif min-h-screen w-full absolute top-0 left-0 z-50">
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
                <div className="mb-6 text-sm text-justify font-sans p-4 border border-black/50">
                    <h3 className="font-bold mb-2">Instruções:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Esta folha é destinada à transcrição da versão definitiva da sua redação.</li>
                        <li>Utilize caneta esferográfica de tinta preta, fabricada em material transparente.</li>
                        <li>Não será permitida a consulta a nenhum material de apoio.</li>
                        <li>A redação deve ter entre 20 e 30 linhas.</li>
                    </ul>
                </div>

                {/* Lines */}
                <div className="space-y-0">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className="flex h-10 border-b border-black/30 items-end">
                            <span className="text-xs text-gray-400 w-8 text-right pr-2 select-none">{i + 1}</span>
                            <div className="flex-1"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
