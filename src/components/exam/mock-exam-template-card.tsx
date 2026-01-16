"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, FileText, CheckCircle2 } from "lucide-react"

interface MockExamTemplateCardProps {
    number: number
    status?: "pending" | "completed"
    score?: string
}

export function MockExamTemplateCard({ number, status = "pending", score }: MockExamTemplateCardProps) {
    const isCompleted = status === "completed"

    return (
        <Card className={`relative overflow-hidden border-slate-800 transition-all duration-300 ${isCompleted
                ? "bg-slate-900 border-green-900/50 opacity-100"
                : "bg-slate-900/50 opacity-75 hover:opacity-100 hover:border-slate-700"
            }`}>
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <FileText className="h-24 w-24" />
            </div>

            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                        Simulado {number.toString().padStart(2, '0')}
                    </CardTitle>
                    <Badge
                        variant={isCompleted ? "default" : "outline"}
                        className={isCompleted ? "bg-green-600 hover:bg-green-700" : "text-slate-500 border-slate-700"}
                    >
                        {isCompleted ? (
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Concluído
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <Lock className="h-3 w-3" /> Pendente
                            </span>
                        )}
                    </Badge>
                </div>
                <CardDescription className="text-slate-400">
                    Rumo à PRF
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor={`score-${number}`} className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                        Pontuação Líquida
                    </Label>
                    <div className="relative">
                        <Input
                            id={`score-${number}`}
                            placeholder="00.00"
                            className="bg-slate-950 border-slate-800 focus:border-yellow-500 focus:ring-yellow-500/20 text-center font-mono placeholder:text-slate-700"
                            defaultValue={score}
                            readOnly={true} // Locked for now as requested (template only)
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-slate-600">pts</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
