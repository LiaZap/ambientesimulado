'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createNewQuestion } from "@/lib/actions"
// Note: We'll need to export createQuestion from actions.ts if it's not already or create a user-facing version

export function CreateQuestionDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        statement: "",
        correctAnswer: "CERTO",
        explanation: "",
        subject: "PORTUGUES",
        topic: "Geral",
        difficulty: "MEDIUM"
    })

    const handleSubmit = async () => {
        if (!formData.statement || !formData.explanation) {
            toast.error("Preencha o enunciado e a justificativa.")
            return
        }

        setLoading(true)
        try {
            // Check if createQuestion handles the specific structure or if we need a new action
            // Assuming createQuestion accepts this structure based on typical patterns
            // We might need to adjust based on grep results.
            const result = await createNewQuestion({
                ...formData,
                options: {}, // CEBRASPE style usually
                supportText: ""
            })

            if (result.success) {
                toast.success("Questão criada com sucesso!")
                setOpen(false)
                setFormData({
                    statement: "",
                    correctAnswer: "CERTO",
                    explanation: "",
                    subject: "PORTUGUES",
                    topic: "Geral",
                    difficulty: "MEDIUM"
                })
            } else {
                toast.error("Erro ao criar questão.")
            }
        } catch (error) {
            console.error(error)
            toast.error("Erro inesperado.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Criar Questão
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white text-slate-900 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Adicionar Nova Questão</DialogTitle>
                    <DialogDescription>
                        Colabore com o banco de dados. Sua questão poderá aparecer nos treinos de todos.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Matéria</Label>
                            <Select
                                value={formData.subject}
                                onValueChange={(v) => setFormData({ ...formData, subject: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PORTUGUES">Português</SelectItem>
                                    <SelectItem value="DIREITO_CONSTITUCIONAL">Dir. Constitucional</SelectItem>
                                    <SelectItem value="DIREITO_ADMINISTRATIVO">Dir. Administrativo</SelectItem>
                                    <SelectItem value="DIREITO_PENAL">Dir. Penal</SelectItem>
                                    <SelectItem value="LEGISLACAO_TRANSITO">Leg. Trânsito</SelectItem>
                                    <SelectItem value="INFORMATICA">Informática</SelectItem>
                                    <SelectItem value="RACIOCINIO_LOGICO">Raciocínio Lógico</SelectItem>
                                    <SelectItem value="FISICA">Física</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Dificuldade</Label>
                            <Select
                                value={formData.difficulty}
                                onValueChange={(v) => setFormData({ ...formData, difficulty: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EASY">Fácil</SelectItem>
                                    <SelectItem value="MEDIUM">Média</SelectItem>
                                    <SelectItem value="HARD">Difícil</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Enunciado</Label>
                        <Textarea
                            placeholder="Digite o enunciado da questão..."
                            className="min-h-[100px]"
                            value={formData.statement}
                            onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Gabarito (Certo/Errado)</Label>
                        <Select
                            value={formData.correctAnswer}
                            onValueChange={(v) => setFormData({ ...formData, correctAnswer: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CERTO">Certo</SelectItem>
                                <SelectItem value="ERRADO">Errado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Justificativa / Comentário</Label>
                        <Textarea
                            placeholder="Explique por que está certo ou errado..."
                            className="min-h-[100px]"
                            value={formData.explanation}
                            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={loading} className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold">
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PlusCircle className="w-4 h-4 mr-2" />}
                        Salvar Questão
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
