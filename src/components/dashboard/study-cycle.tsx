'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const STUDY_CYCLE = [
    { day: 1, label: 'Seg', subject: 'Legislação de Trânsito' },
    { day: 2, label: 'Ter', subject: 'Física' },
    { day: 3, label: 'Qua', subject: 'Direito Penal' },
    { day: 4, label: 'Qui', subject: 'Português' },
    { day: 5, label: 'Sex', subject: 'Informática' },
    { day: 6, label: 'Sáb', subject: 'Direito Constitucional' },
    { day: 0, label: 'Dom', subject: 'Revisão Geral e Simulados' },
]

export function StudyCycle() {
    const today = new Date().getDay()

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-yellow-500" />
                    Ciclo de Estudos Semanal
                </CardTitle>
                <p className="text-sm text-slate-400">Siga o cronograma para maximizar seu desempenho.</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {STUDY_CYCLE.map((item) => {
                        const isToday = item.day === today

                        return (
                            <div
                                key={item.label}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-lg border transition-all duration-300 h-full",
                                    isToday
                                        ? "bg-slate-800/80 border-yellow-500 shadow-md shadow-yellow-500/10 scale-[1.01]"
                                        : "bg-slate-950/50 border-slate-800 text-slate-500 hover:bg-slate-900"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold",
                                        isToday ? "bg-yellow-500 text-slate-950" : "bg-slate-800 text-slate-400"
                                    )}>
                                        {item.label}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={cn("text-base font-semibold", isToday ? "text-white" : "text-slate-300")}>
                                            {item.subject}
                                        </span>
                                        {isToday && (
                                            <span className="text-xs text-yellow-500 font-medium animate-pulse">
                                                Estude agora
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {isToday && <ChevronRight className="h-5 w-5 text-yellow-500" />}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
