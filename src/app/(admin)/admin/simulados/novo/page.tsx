'use client'

import { createExam } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { AlertCircle } from "lucide-react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="bg-purple-600 hover:bg-purple-700 text-white w-full">
            {pending ? "Criando..." : "Criar Simulado"}
        </Button>
    )
}

export default function NewExamPage() {
    const [state, formAction] = useActionState(createExam, undefined)

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Novo Simulado</h1>
                <p className="text-slate-400">Preencha os dados básicos para criar um simulado.</p>
            </div>

            <form action={formAction} className="space-y-6 bg-slate-900 p-6 rounded-lg border border-slate-800">
                <div className="space-y-2">
                    <Label htmlFor="title">Título do Simulado</Label>
                    <Input id="title" name="title" placeholder="Ex: Simulado PRF - Direito Constitucional" required className="bg-slate-950 border-slate-800" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" name="description" placeholder="Instruções ou resumo..." className="bg-slate-950 border-slate-800 min-h-[100px]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duração (minutos)</Label>
                        <Input id="duration" name="duration" type="number" defaultValue="240" className="bg-slate-950 border-slate-800" />
                    </div>
                </div>

                {state && !state.includes("sucesso") && (
                    <div className="p-3 rounded bg-red-500/10 text-red-500 text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> {state}
                    </div>
                )}

                <SubmitButton />
            </form>
        </div>
    )
}
