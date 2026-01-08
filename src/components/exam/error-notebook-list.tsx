"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Question {
    id: string
    statement: string
    supportText?: string | null
    correctAnswer: string
    explanation: string | null
    difficulty: string
    subject: string
    topic: string
    options?: any
}

export function ErrorNotebookList({ questions }: { questions: Question[] }) {
    const [revealed, setRevealed] = useState<Record<string, boolean>>({})

    const toggleReveal = (id: string) => {
        setRevealed(prev => ({ ...prev, [id]: !prev[id] }))
    }

    if (questions.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-slate-800/50 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Parabéns! Zero Erros.</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                    Você não tem questões pendentes de revisão. Continue treinando para manter o alto nível!
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-white">{questions.length}</div>
                        <p className="text-slate-400 text-sm">Questões para Revisar</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-yellow-500">
                            {new Set(questions.map(q => q.subject)).size}
                        </div>
                        <p className="text-slate-400 text-sm">Disciplinas Envolvidas</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                {questions.map((question, index) => {
                    const isRevealed = revealed[question.id]

                    return (
                        <Card key={question.id} className="bg-slate-900 border-slate-800 overflow-hidden group hover:border-slate-700 transition-all">
                            <CardHeader className="bg-slate-950/50 border-b border-slate-800 pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="border-yellow-500/20 text-yellow-500 bg-yellow-500/10">
                                            {question.subject}
                                        </Badge>
                                        <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                                            {question.topic}
                                        </Badge>
                                        <Badge className={cn(
                                            "uppercase text-[10px]",
                                            question.difficulty === 'HARD' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                question.difficulty === 'MEDIUM' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                                                    "bg-green-500/10 text-green-400 border-green-500/20"
                                        )}>
                                            {question.difficulty === 'HARD' ? 'Difícil' : question.difficulty === 'MEDIUM' ? 'Médio' : 'Fácil'}
                                        </Badge>
                                    </div>
                                    <span className="text-slate-500 font-mono text-xs">#{index + 1}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                {/* Support Text if exists */}
                                {question.supportText && (
                                    <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 text-sm text-slate-400 italic">
                                        {question.supportText}
                                    </div>
                                )}

                                {/* Statement */}
                                <div className="text-lg text-slate-200 leading-relaxed font-medium">
                                    {question.statement}
                                </div>

                                {/* Options Preview (if relevant) */}
                                {question.options && Object.keys(question.options as object).length > 0 && (
                                    <div className="space-y-2">
                                        {Object.entries(question.options as Record<string, string>).map(([key, value]) => (
                                            <div key={key} className={cn(
                                                "p-3 rounded border text-sm",
                                                isRevealed && key === question.correctAnswer
                                                    ? "bg-green-900/20 border-green-500/30 text-green-400"
                                                    : "bg-slate-950/30 border-slate-800 text-slate-400"
                                            )}>
                                                <span className="font-bold mr-2">{key})</span> {value}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Actions & Reveal Area */}
                                <div className="pt-4 border-t border-slate-800">
                                    <Button
                                        onClick={() => toggleReveal(question.id)}
                                        variant="ghost"
                                        className={cn(
                                            "w-full flex items-center justify-center gap-2 py-6 text-base font-bold tracking-wide transition-all",
                                            isRevealed
                                                ? "bg-slate-800 hover:bg-slate-700 text-white"
                                                : "bg-yellow-500 hover:bg-yellow-400 text-slate-900 hover:scale-[1.01]"
                                        )}
                                    >
                                        {isRevealed ? (
                                            <>
                                                <EyeOff className="h-5 w-5" /> Ocultar Resposta
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="h-5 w-5" /> Ver Resposta & Comentário
                                            </>
                                        )}
                                    </Button>

                                    {/* Explanation Content */}
                                    {isRevealed && (
                                        <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="bg-green-950/30 border border-green-900/50 rounded-lg p-6">
                                                <div className="flex items-center gap-2 mb-4 text-green-400 font-bold uppercase tracking-wider text-sm">
                                                    <CheckCircle2 className="h-5 w-5" /> Gabarito: {question.correctAnswer}
                                                </div>
                                                <div className="prose prose-invert max-w-none">
                                                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                        {question.explanation || "Sem comentário disponível."}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-2">
                                                {/* Future: Add "Mark as Mastered" button here */}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
