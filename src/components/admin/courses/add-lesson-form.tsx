'use client'

import { useActionState } from 'react'
import { createLesson } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Loader2, Video } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function AddLessonForm({ moduleId }: { moduleId: string }) {
    const [message, formAction, isPending] = useActionState(createLesson, undefined)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-yellow-500">
                    <Plus className="h-3 w-3 mr-1" /> Add Aula
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                <DialogHeader>
                    <DialogTitle>Adicionar Nova Aula</DialogTitle>
                </DialogHeader>
                <form action={formAction} className="space-y-4 py-4">
                    <input type="hidden" name="moduleId" value={moduleId} />

                    <div className="space-y-2">
                        <Label>Título da Aula</Label>
                        <Input name="title" required className="bg-slate-950 border-slate-800" />
                    </div>

                    <div className="space-y-2">
                        <Label>URL do Vídeo (Youtube)</Label>
                        <Input name="videoUrl" placeholder="https://youtube.com/..." required className="bg-slate-950 border-slate-800" />
                    </div>

                    <div className="space-y-2">
                        <Label>Duração (segundos)</Label>
                        <Input name="duration" type="number" placeholder="Ex: 600 (10 min)" className="bg-slate-950 border-slate-800" />
                    </div>

                    <Button type="submit" disabled={isPending} className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold">
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4 mr-2" />}
                        Salvar Aula
                    </Button>
                    {message && <p className="text-center text-sm text-red-500">{message}</p>}
                </form>
            </DialogContent>
        </Dialog>
    )
}
