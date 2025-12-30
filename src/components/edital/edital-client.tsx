'use client'

import { useState } from "react"
import { toggleEditalProgress } from "@/lib/actions"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, BookOpen, FileText, CheckCircle } from "lucide-react"

const SUBJECT_LABELS: Record<string, string> = {
    'PORTUGUES': 'Língua Portuguesa',
    'DIREITO_CONSTITUCIONAL': 'Direito Constitucional',
    'DIREITO_ADMINISTRATIVO': 'Direito Administrativo',
    'DIREITO_PENAL': 'Direito Penal',
    'LEGISLACAO_TRANSITO': 'Legislação de Trânsito',
    'FISICA': 'Física',
    'RACIOCINIO_LOGICO': 'Raciocínio Lógico',
    'INFORMATICA': 'Informática',
    'ETICA': 'Ética',
    'NOCOES_CIDADANIA': 'Noções de Cidadania',
    'REQUISITOS': 'Requisitos Básicos do Concurso'
}

type Topic = {
    id: string
    subject: string
    title: string
    order: number
    priority: string
    theory: boolean // default requirements from admin
    pdf: boolean
    review: boolean
    progress: {
        hasStudiedTheory: boolean
        hasStudiedPDF: boolean
        hasReviewed: boolean
    }[]
}

export function EditalClient({ topics }: { topics: Topic[] }) {
    // Group by Subject
    const grouped = topics.reduce((acc, topic) => {
        if (!acc[topic.subject]) acc[topic.subject] = []
        acc[topic.subject].push(topic)
        return acc
    }, {} as Record<string, Topic[]>)

    // Collapsed state
    const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({})

    const toggleSubject = (subject: string) => {
        setOpenSubjects(prev => ({ ...prev, [subject]: !prev[subject] }))
    }

    const handleCheck = async (topicId: string, field: 'hasStudiedTheory' | 'hasStudiedPDF' | 'hasReviewed', value: boolean) => {
        await toggleEditalProgress(topicId, field, value)
    }

    return (
        <div className="space-y-4">
            {Object.keys(SUBJECT_LABELS).map(subjectKey => {
                const subjectTopics = grouped[subjectKey]
                if (!subjectTopics || subjectTopics.length === 0) return null

                const isOpen = openSubjects[subjectKey]

                // Calculate Progress
                const totalItems = subjectTopics.length * 3 // Theory, PDF, Review
                let completedItems = 0
                subjectTopics.forEach(t => {
                    const p = t.progress[0]
                    if (p?.hasStudiedTheory) completedItems++
                    if (p?.hasStudiedPDF) completedItems++
                    if (p?.hasReviewed) completedItems++
                })
                const percent = Math.round((completedItems / totalItems) * 100)

                return (
                    <Card key={subjectKey} className="bg-slate-900 border-slate-800">
                        <CardHeader
                            className="py-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                            onClick={() => toggleSubject(subjectKey)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {isOpen ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
                                    <div>
                                        <CardTitle className="text-lg text-slate-100">{SUBJECT_LABELS[subjectKey]}</CardTitle>
                                        <p className="text-xs text-slate-500 mt-1">{subjectTopics.length} Tópicos • {percent}% Concluído</p>
                                    </div>
                                </div>
                                <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${percent}%` }} />
                                </div>
                            </div>
                        </CardHeader>
                        {isOpen && (
                            <CardContent className="border-t border-slate-800 bg-slate-950/30 p-0">
                                <div className="divide-y divide-slate-800">
                                    {subjectTopics.map(topic => {
                                        const p = topic.progress[0] || {}
                                        return (
                                            <div key={topic.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-mono text-xs text-slate-500">#{topic.order}</span>
                                                        <Badge variant="outline" className={`text-[10px] h-5 ${topic.priority === 'HIGH' ? 'border-red-500 text-red-500' : 'border-slate-700 text-slate-400'}`}>
                                                            {topic.priority === 'HIGH' ? 'ALTA' : 'Normal'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-slate-200">{topic.title}</p>
                                                </div>

                                                <div className="flex items-center gap-6 text-sm text-slate-400">
                                                    <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                                                        <Checkbox
                                                            checked={!!p.hasStudiedTheory}
                                                            onCheckedChange={(c) => handleCheck(topic.id, 'hasStudiedTheory', c as boolean)}
                                                            className="data-[state=checked]:bg-blue-600 border-slate-600"
                                                        />
                                                        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> Teoria</span>
                                                    </label>

                                                    <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                                                        <Checkbox
                                                            checked={!!p.hasStudiedPDF}
                                                            onCheckedChange={(c) => handleCheck(topic.id, 'hasStudiedPDF', c as boolean)}
                                                            className="data-[state=checked]:bg-purple-600 border-slate-600"
                                                        />
                                                        <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> PDF</span>
                                                    </label>

                                                    <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                                                        <Checkbox
                                                            checked={!!p.hasReviewed}
                                                            onCheckedChange={(c) => handleCheck(topic.id, 'hasReviewed', c as boolean)}
                                                            className="data-[state=checked]:bg-green-600 border-slate-600"
                                                        />
                                                        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Revisão</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                )
            })}
        </div>
    )
}
