'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, FolderPlus, Loader2 } from "lucide-react"
import { createModule } from "@/lib/actions"
import { useRouter } from "next/navigation"

interface ModuleFormProps {
    courseId: string
}

export function ModuleForm({ courseId }: ModuleFormProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        formData.append("courseId", courseId)

        await createModule(undefined, formData)
        setIsLoading(false)
        setOpen(false)
        router.refresh()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-yellow-500 text-slate-950 hover:bg-yellow-600 font-bold">
                    <FolderPlus className="mr-2 h-4 w-4" /> Novo Módulo
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border-slate-800 text-slate-100">
                <DialogHeader>
                    <DialogTitle>Novo Módulo</DialogTitle>
                    <DialogDescription>
                        Crie um módulo para organizar as aulas deste curso.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título do Módulo</Label>
                        <Input id="title" name="title" required className="bg-slate-900 border-slate-700" placeholder="Ex: Módulo 1: Conceitos Básicos" />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="bg-yellow-500 text-slate-950 hover:bg-yellow-600 font-bold">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Módulo"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
