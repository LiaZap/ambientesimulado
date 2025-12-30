'use client'

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { addQuestionToExam, searchQuestions } from "@/lib/actions"
import { getQuestions } from "@/lib/data" // We might need a search action instead

// Minimal Question type for picker
interface Question {
    id: string
    statement: string
    subject: string
    difficulty: string
}

export function QuestionPicker({ examId, currentQuestionIds }: { examId: string, currentQuestionIds: string[] }) {
    const [search, setSearch] = useState("")
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(false)

    // VERY BASIC SEARCH (fetches all/recent and filters client side for MVP)
    // Ideally we would trigger a server action `searchQuestions(query)`
    useEffect(() => {
        const fetchQs = async () => {
            setLoading(true)
            // For MVP: we just fetch the exported getQuestions (which returns 50 latest)
            // Improving this would be creating a dedicated search action.
            // Let's rely on standard fetch or action if available.
            // Since getQuestions is an async function in data.ts (server-side logic), we can call it? 
            // Only if it's marked 'use server' OR if we wrap it. 
            // data.ts functions are usually direct db calls not exposed as actions unless 'use server' is at top of file.
            // Let's fix this by adding a searchQuestions action in actions.ts to be clean.
        }
        // fetchQs()
    }, [])

    // Instead of complex search, let's just make a server action that returns questions
    // I will assume I have added `searchQuestions` to actions.ts in next step.

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                    placeholder="Buscar (ENTER para pesquisar)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                            setLoading(true)
                            const res = await searchQuestions(search)
                            setQuestions(res as any) // Cast if needed for minimal type
                            setLoading(false)
                        }
                    }}
                    className="pl-9 bg-slate-950 border-slate-800"
                />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {questions.map(q => {
                    const isAdded = currentQuestionIds.includes(q.id)
                    return (
                        <div key={q.id} className="p-3 rounded border border-slate-800 bg-slate-950/50 hover:bg-slate-900 transition-colors">
                            <p className="text-xs text-slate-400 line-clamp-2 mb-2">{q.statement}</p>
                            <div className="flex justify-between items-center">
                                <Badge variant="outline" className="text-[10px] h-5 border-slate-700 text-slate-500">{q.subject}</Badge>
                                {isAdded ? (
                                    <span className="text-green-500 flex items-center gap-1 text-xs font-bold">
                                        <Check className="h-3 w-3" /> Adicionada
                                    </span>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-6 text-xs bg-slate-800 hover:bg-slate-700"
                                        onClick={async () => {
                                            await addQuestionToExam(examId, q.id)
                                            // Optimistic update?
                                        }}
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Add
                                    </Button>
                                )}
                            </div>
                        </div>
                    )
                })}
                {questions.length === 0 && !loading && (
                    <p className="text-center text-slate-600 text-sm py-4">
                        {search ? "Nenhuma questão encontrada." : "Pesquise para ver questões."}
                    </p>
                )}
                {loading && (
                    <p className="text-center text-slate-500 text-sm py-4">Buscando...</p>
                )}
            </div>
        </div>
    )
}
