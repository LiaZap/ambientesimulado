'use client'

import { useActionState } from 'react'
import { createCourse } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export function CourseForm() {
    const [message, formAction, isPending] = useActionState(createCourse, undefined)

    return (
        <Card className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                    <span>Novo Curso</span>
                    <Link href="/admin/cursos" className="text-sm text-slate-400 font-normal hover:text-white flex items-center">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título do Curso</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Ex: Curso Completo de Português"
                            required
                            className="bg-slate-950 border-slate-800 focus:ring-yellow-500"
                        />
                    </div>

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
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Descrição do curso..."
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
                            Criar Curso
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
