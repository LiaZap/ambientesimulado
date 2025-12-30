'use client'

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { deleteCourse, deleteModule, deleteLesson, deleteQuestion, deleteExam } from "@/lib/actions"
import { useRouter } from "next/navigation"

interface DeleteButtonProps {
    id: string
    type: 'course' | 'module' | 'lesson' | 'question' | 'exam'
}

export function DeleteButton({ id, type }: DeleteButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        setIsLoading(true)
        try {
            if (type === 'course') {
                await deleteCourse(id)
                router.push('/admin/cursos')
            } else if (type === 'module') {
                await deleteModule(id)
                router.refresh()
            } else if (type === 'lesson') {
                await deleteLesson(id)
                router.refresh()
            } else if (type === 'question') {
                await deleteQuestion(id) // Needs import
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            alert("Erro ao excluir.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-500 hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-950 border-slate-800 text-slate-100">
                <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o item e todos os dados associados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-900 border-slate-800 text-white hover:bg-slate-800">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, excluir"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
