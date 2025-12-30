import { getQuestions } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default async function QuestionsPage() {
    const questions = await getQuestions()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white">Banco de Questões</h1>
                <p className="text-slate-400">Explore e estude questões anteriores.</p>
            </div>

            <div className="relative max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                    placeholder="Buscar por tema, banca ou ano..."
                    className="pl-9 bg-slate-900 border-slate-800"
                />
            </div>

            <div className="grid gap-4">
                {questions.map((q) => (
                    <Card key={q.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="flex gap-2">
                                <Badge variant="outline" className="border-slate-700 text-slate-400">
                                    {q.subject.replace('_', ' ')}
                                </Badge>
                                <Badge variant="secondary" className="bg-slate-800 text-slate-500">
                                    {q.difficulty}
                                </Badge>
                            </div>
                            <span className="text-xs text-slate-600 font-mono">{q.institution} • {q.year}</span>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-slate-200 leading-relaxed">
                                {q.statement}
                            </p>

                            {/* Render Options if any (ReadOnly) */}
                            {q.options && typeof q.options === 'object' && (
                                <div className="space-y-2 pl-4 border-l-2 border-slate-800">
                                    {Object.entries(q.options as Record<string, string>).map(([key, value]) => (
                                        <div key={key} className="text-sm text-slate-400">
                                            <span className="font-bold text-yellow-500 mr-2">{key})</span>
                                            {value}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-800/50 flex justify-end">
                                {/* Future: Add "Add to Notebook" or "Show Answer" toggle */}
                                <div className="text-xs text-slate-600">
                                    Gabarito disponível no modo Simulado ou ao clicar em "Responder".
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
