'use client'

import { useState } from "react"
import { toggleEditalProgress } from "@/lib/actions"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, BookOpen, FileText, CheckCircle, Trophy, BarChart3, Download } from "lucide-react"
import { DownloadsDialog } from "@/components/edital/downloads-dialog"

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

    // Global Stats
    const totalTopics = topics.length
    const totalActions = totalTopics * 3
    let completedActions = 0

    topics.forEach(t => {
        const p = t.progress[0]
        if (p?.hasStudiedTheory) completedActions++
        if (p?.hasStudiedPDF) completedActions++
        if (p?.hasReviewed) completedActions++
    })

    const globalPercent = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0

    // Collapsed state
    const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({})

    const toggleSubject = (subject: string) => {
        setOpenSubjects(prev => ({ ...prev, [subject]: !prev[subject] }))
    }

    const handleCheck = async (topicId: string, field: 'hasStudiedTheory' | 'hasStudiedPDF' | 'hasReviewed', value: boolean) => {
        await toggleEditalProgress(topicId, field, value)
    }

    return (
        <div className="space-y-6">
            {/* Global Progress Card */}
            <Card className="bg-card border-border shadow-md">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl text-primary flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                Progresso Global do Edital
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Você completou {completedActions} de {totalActions} passos rumo à aprovação.
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-bold text-primary">{globalPercent}%</span>
                            <p className="text-xs text-muted-foreground">Concluído</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-4 w-full bg-muted/50 rounded-full overflow-hidden border border-border/50">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all duration-1000 ease-out"
                            style={{ width: `${globalPercent}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Materials Card */}
            <Card className="bg-slate-900 border-slate-800 shadow-lg">
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Download className="h-5 w-5 text-yellow-500" />
                            Material de Apoio Oficial
                        </h3>
                        <p className="text-slate-400 mt-2">
                            Acesse o Edital 2021, Conteúdo Verticalizado e todas as provas e gabaritos anteriores.
                        </p>
                    </div>
                    <DownloadsDialog />
                </CardContent>
            </Card>

            <div className="grid gap-4">
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
                        <Card key={subjectKey} className={`bg-card border-border transition-all duration-200 ${isOpen ? 'ring-1 ring-primary/20' : 'hover:border-primary/50'}`}>
                            <CardHeader
                                className="py-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => toggleSubject(subjectKey)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {isOpen ? <ChevronDown className="h-5 w-5 text-primary" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                                        <div>
                                            <CardTitle className="text-lg text-foreground font-semibold flex items-center gap-2">
                                                {SUBJECT_LABELS[subjectKey]}
                                                {percent === 100 && <CheckCircle className="h-4 w-4 text-green-500" />}
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground mt-1">{subjectTopics.length} Tópicos • {percent}% Dominado</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right hidden sm:block">
                                            <span className="text-sm font-medium text-foreground">{percent}%</span>
                                        </div>
                                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            {isOpen && (
                                <CardContent className="border-t border-border bg-card/50 p-0">
                                    <div className="divide-y divide-border">
                                        {subjectTopics.map(topic => {
                                            const p = topic.progress[0] || {}
                                            return (
                                                <div key={topic.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">#{topic.order}</span>
                                                            <Badge variant="outline" className={`text-[10px] h-5 ${topic.priority === 'HIGH' ? 'border-red-500/50 text-red-500 bg-red-500/10' : 'border-border text-muted-foreground'}`}>
                                                                {topic.priority === 'HIGH' ? 'ALTA PRIORIDADE' : 'Normal'}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-foreground font-medium">{topic.title}</p>
                                                    </div>

                                                    <div className="flex items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
                                                        <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group">
                                                            <Checkbox
                                                                checked={!!p.hasStudiedTheory}
                                                                onCheckedChange={(c) => handleCheck(topic.id, 'hasStudiedTheory', c as boolean)}
                                                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-muted-foreground/30"
                                                            />
                                                            <span className="flex items-center gap-1 group-hover:font-medium"><BookOpen className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Teoria</span></span>
                                                        </label>

                                                        <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group">
                                                            <Checkbox
                                                                checked={!!p.hasStudiedPDF}
                                                                onCheckedChange={(c) => handleCheck(topic.id, 'hasStudiedPDF', c as boolean)}
                                                                className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 border-muted-foreground/30"
                                                            />
                                                            <span className="flex items-center gap-1 group-hover:font-medium"><FileText className="h-3.5 w-3.5" /> <span className="hidden sm:inline">PDF</span></span>
                                                        </label>

                                                        <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group">
                                                            <Checkbox
                                                                checked={!!p.hasReviewed}
                                                                onCheckedChange={(c) => handleCheck(topic.id, 'hasReviewed', c as boolean)}
                                                                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 border-muted-foreground/30"
                                                            />
                                                            <span className="flex items-center gap-1 group-hover:font-medium"><CheckCircle className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Revisão</span></span>
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
        </div>
    )
}
