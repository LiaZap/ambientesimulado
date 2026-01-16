import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle2 } from "lucide-react"

const subjects = [
    "Língua Portuguesa",
    "Raciocínio Lógico-Matemático (RLM)",
    "Informática",
    "Física",
    "Ética no Serviço Público",
    "Geopolítica Brasileira",
    "História da PRF",
    "Língua Estrangeira (Inglês/Espanhol)",
    "Legislação de Trânsito",
    "Direito Administrativo",
    "Direito Constitucional",
    "Direito Penal",
    "Direito Processual Penal",
    "Legislação Especial",
    "Direitos Humanos",
]

export function SubjectReferenceCard() {
    return (
        <Card className="bg-slate-900/50 border-slate-800 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-yellow-500" />
                    Ciclo de Estudos - PRF 2025
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {subjects.map((subject, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            <div className="h-1.5 w-1.5 rounded-full bg-yellow-500/50" />
                            {subject}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
