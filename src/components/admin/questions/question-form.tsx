'use client'

import { useActionState } from 'react'
import { createQuestion } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const SUBJECTS = [
    { value: 'PORTUGUES', label: 'Português' },
    { value: 'DIREITO_CONSTITUCIONAL', label: 'Direito Constitucional' },
    { value: 'DIREITO_ADMINISTRATIVO', label: 'Direito Administrativo' },
    { value: 'DIREITO_PENAL', label: 'Direito Penal' },
    { value: 'LEGISLACAO_TRANSITO', label: 'Legislação de Trânsito' },
    { value: 'FISICA', label: 'Física' },
    { value: 'RACIOCINIO_LOGICO', label: 'Raciocínio Lógico' },
    { value: 'INFORMATICA', label: 'Informática' },
    { value: 'ETICA', label: 'Ética' },
    { value: 'NOCOES_CIDADANIA', label: 'Noções de Cidadania' },
]

export function QuestionForm() {
    const [message, formAction, isPending] = useActionState(createQuestion, undefined)

    return (
        <Card className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                    <span>Nova Questão</span>
                    <Link href="/admin/questoes" className="text-sm text-slate-400 font-normal hover:text-white flex items-center">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Disciplina</Label>
                            <Select name="subject" required>
                                <SelectTrigger className="bg-slate-950 border-slate-800">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {SUBJECTS.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Dificuldade</Label>
                            <Select name="difficulty" defaultValue="MEDIUM" required>
                                <SelectTrigger className="bg-slate-950 border-slate-800">
                                    <SelectValue placeholder="Selecione..." />
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
                        <Label htmlFor="topic">Tópico</Label>
                        <Input
                            id="topic"
                            name="topic"
                            placeholder="Ex: Crase, Atos Administrativos"
                            required
                            className="bg-slate-950 border-slate-800 focus:ring-yellow-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="statement">Enunciado (Questão)</Label>
                        <Textarea
                            id="statement"
                            name="statement"
                            placeholder="Digite o texto da questão..."
                            required
                            className="bg-slate-950 border-slate-800 focus:ring-yellow-500 min-h-[120px]"
                        />
                    </div>


                    <div className="space-y-4 border p-4 rounded-md border-slate-800 bg-slate-950/50">
                        <Label>Tipo de Questão</Label>
                        <RadioGroup defaultValue="MULTIPLE_CHOICE" className="flex gap-4" name="type">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="MULTIPLE_CHOICE" id="mc" />
                                <Label htmlFor="mc">Múltipla Escolha (A-E)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="TRUE_FALSE" id="tf" />
                                <Label htmlFor="tf">Certo / Errado</Label>
                            </div>
                        </RadioGroup>

                        {/* We rely on CSS/JS to toggle visibility or just show all for now? 
                            Better to simply show Options inputs always but optional?
                            Let's keep it simple: Show Options A-E.
                        */}
                    </div>

                    <div className="space-y-4">
                        <Label>Alternativas (Preencha para Múltipla Escolha)</Label>
                        <div className="grid gap-3">
                            {['A', 'B', 'C', 'D', 'E'].map((opt) => (
                                <div key={opt} className="flex items-center gap-2">
                                    <span className="font-bold text-slate-500 w-6 text-center">{opt}</span>
                                    <Input name={`option${opt}`} placeholder={`Opção ${opt}`} className="bg-slate-950 border-slate-800" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Gabarito Correto</Label>
                        <Select name="correctAnswer" required>
                            <SelectTrigger className="bg-slate-950 border-slate-800">
                                <SelectValue placeholder="Selecione a correta..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CERTO" className="text-green-500 font-bold">CERTO</SelectItem>
                                <SelectItem value="ERRADO" className="text-red-500 font-bold">ERRADO</SelectItem>
                                <SelectItem value="A">Alternativa A</SelectItem>
                                <SelectItem value="B">Alternativa B</SelectItem>
                                <SelectItem value="C">Alternativa C</SelectItem>
                                <SelectItem value="D">Alternativa D</SelectItem>
                                <SelectItem value="E">Alternativa E</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="explanation">Comentário / Explicação</Label>
                        <Textarea
                            id="explanation"
                            name="explanation"
                            placeholder="Explique o gabarito..."
                            className="bg-slate-950 border-slate-800 focus:ring-yellow-500 min-h-[100px]"
                        />
                    </div>

                    {message && (
                        <div className={`text-sm font-medium text-center p-2 rounded ${message.includes('sucesso') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {message}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold w-full"
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Salvar Questão
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
