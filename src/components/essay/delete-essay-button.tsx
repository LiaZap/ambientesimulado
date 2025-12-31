'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteEssay } from '@/lib/actions'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DeleteEssayButton({ essayId }: { essayId: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        setIsDeleting(true)
        try {
            const result = await deleteEssay(essayId)
            if (result.success) {
                router.push('/redacao')
                router.refresh()
            } else {
                alert(result.error || "Erro ao excluir")
            }
        } catch (error) {
            alert("Erro ao excluir redação")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20">
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                    Excluir
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                        Essa ação não pode ser desfeita. Isso excluirá permanentemente sua redação e os feedbacks associados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
                        Sim, excluir
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
