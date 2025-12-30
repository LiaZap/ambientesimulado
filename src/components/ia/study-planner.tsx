'use client'

import { useState } from "react"
import { Calendar, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function StudyPlanner() {
    const [isLoading, setIsLoading] = useState(false)
    const [planGenerated, setPlanGenerated] = useState(false)

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Mock generation
        setTimeout(() => {
            setIsLoading(false)
            setPlanGenerated(true)
        }, 1500)
    }

    if (planGenerated) {
        return (
            <Card className="bg-slate-900 border-slate-800 animate-in fade-in zoom-in-95 duration-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-500">
                        <CheckCircle2 className="h-6 w-6" />
                        Plano Gerado com Sucesso!
                    </CardTitle>
                    <CardDescription>
                        Seu plano de estudos foi criado e adicionado ao seu calendário.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                        <p className="mb-2 font-bold text-white">Resumo da Semana:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Segunda: Legislação de Trânsito (2h)</li>
                            <li>Terça: Física (2h)</li>
                            <li>Quarta: Direito Penal (2h)</li>
                            <li>Quinta: Português (2h)</li>
                            <li>Sexta: Informática (2h)</li>
                            <li>Sábado: Revisão + Simulado</li>
                            <li>Domingo: Descanso</li>
                        </ul>
                    </div>
                    <Button onClick={() => setPlanGenerated(false)} variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                        Gerar Novo Plano
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Plano de Estudos IA
                </CardTitle>
                <CardDescription className="text-slate-400">
                    Gerado por IA baseado no seu desempenho e tempo disponível
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleGenerate} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="hours" className="text-slate-300">Horas por dia</Label>
                        <Input id="hours" type="number" min="1" max="12" defaultValue="4" className="bg-slate-950 border-slate-800 text-white" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="days" className="text-slate-300">Dias por semana</Label>
                        <Select defaultValue="5">
                            <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                                <SelectItem value="3">3 dias</SelectItem>
                                <SelectItem value="4">4 dias</SelectItem>
                                <SelectItem value="5">5 dias</SelectItem>
                                <SelectItem value="6">6 dias</SelectItem>
                                <SelectItem value="7">Todos os dias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-slate-300">Data da prova (opcional)</Label>
                        <Input id="date" type="date" className="bg-slate-950 border-slate-800 text-white" />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 animate-spin" /> Gerando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4" /> Gerar Plano Semanal
                            </span>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
