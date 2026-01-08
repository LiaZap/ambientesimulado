'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { BrainCircuit, Loader2, Sparkles, Target } from "lucide-react"
import { toast } from "sonner"
import { createCustomExam } from "@/lib/actions"
import { useRouter } from "next/navigation"

const SUBJECTS = [
    { id: "PORTUGUES", label: "Português" },
    { id: "DIREITO_CONSTITUCIONAL", label: "Dir. Constitucional" },
    { id: "DIREITO_ADMINISTRATIVO", label: "Dir. Administrativo" },
    { id: "DIREITO_PENAL", label: "Dir. Penal" },
    { id: "LEGISLACAO_TRANSITO", label: "Legislação de Trânsito" },
    { id: "FISICA", label: "Física" },
    { id: "RACIOCINIO_LOGICO", label: "Raciocínio Lógico" },
    { id: "INFORMATICA", label: "Informática" },
]

export function SmartExamBuilder() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
    const [count, setCount] = useState(30)

    const toggleSubject = (id: string) => {
        setSelectedSubjects(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        )
    }

    const handleCreate = async () => {
        if (selectedSubjects.length === 0) {
            toast.error("Selecione pelo menos uma matéria.")
            return
        }

        setLoading(true)
        try {
            const result = await createCustomExam({
                subjects: selectedSubjects,
                count,
                title: `Treino Personalizado - ${new Date().toLocaleDateString('pt-BR')}`
            })

            if (result.success && result.examId) {
                toast.success("Treino gerado com sucesso!")
                router.push(`/simulados/${result.examId}?mode=TRAINING`)
            } else {
                toast.error(result.error || "Erro ao criar treino.")
            }
        } catch (error) {
            toast.error("Erro inesperado.")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="bg-slate-900 border-slate-800 text-white mb-8 border-2 border-yellow-500/20 shadow-xl shadow-yellow-500/5">
            <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <BrainCircuit className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Treino Inteligente</CardTitle>
                        <CardDescription className="text-slate-400">
                            Crie um simulado personalizado focado nas suas necessidades.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Subject Selection */}
                <div className="space-y-3">
                    <Label className="text-slate-300">Quais matérias você quer treinar?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {SUBJECTS.map(subject => (
                            <div
                                key={subject.id}
                                onClick={() => toggleSubject(subject.id)}
                                className={`
                                    cursor-pointer flex items-center space-x-2 p-3 rounded-lg border transition-all select-none
                                    ${selectedSubjects.includes(subject.id)
                                        ? "bg-yellow-500/20 border-yellow-500 text-white"
                                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"
                                    }
                                `}
                            >
                                <Checkbox
                                    checked={selectedSubjects.includes(subject.id)}
                                    // Removed onCheckedChange here to prevent double toggle with div click, or handle properly
                                    className="border-slate-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black"
                                />
                                <span className="text-sm font-medium">{subject.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Question Count Slider */}
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label className="text-slate-300">Quantidade de Questões</Label>
                        <span className="font-mono font-bold text-yellow-500 text-lg">{count}</span>
                    </div>
                    <Slider
                        value={[count]}
                        onValueChange={(vals) => setCount(vals[0])}
                        min={5}
                        max={120}
                        step={5}
                        className="py-4 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500 px-1">
                        <span>5</span>
                        <span>30</span>
                        <span>50</span>
                        <span>120</span>
                    </div>
                </div>

            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleCreate}
                    disabled={loading || selectedSubjects.length === 0}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold h-12 text-lg shadow-lg shadow-yellow-500/20"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Gerando...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-5 w-5" /> Gerar Treino Personalizado
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
