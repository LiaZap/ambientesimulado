'use client'

import { useActionState } from 'react'
import { createModule } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Loader2 } from 'lucide-react'

export function AddModuleForm({ courseId }: { courseId: string }) {
    const [message, formAction, isPending] = useActionState(createModule, undefined)

    return (
        <form action={formAction} className="flex gap-4 items-end">
            <input type="hidden" name="courseId" value={courseId} />
            <div className="flex-1 space-y-2">
                <Input
                    name="title"
                    placeholder="Nome do Novo Módulo"
                    required
                    className="bg-slate-950 border-slate-800"
                />
            </div>
            <Button type="submit" disabled={isPending} className="bg-slate-800 hover:bg-slate-700">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Adicionar
            </Button>
            {message && <span className="text-xs text-red-500">{message}</span>}
        </form>
    )
}
