'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Video, PlayCircle, Loader2 } from "lucide-react"
import { createLesson } from "@/lib/actions"
import { useRouter } from "next/navigation"

interface LessonFormProps {
    moduleId: string
}

export function LessonForm({ moduleId }: LessonFormProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        formData.append("moduleId", moduleId)

        // Basic validation for .mp4 could happen here, but input type="url" helps

        await createLesson(undefined, formData)
        setIsLoading(false)
        setOpen(false)
        router.refresh()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                    <Plus className="mr-2 h-3 w-3" /> Adicionar Aula
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border-slate-800 text-slate-100">
                <DialogHeader>
                    <DialogTitle>Nova Aula</DialogTitle>
                    <DialogDescription>
                        Adicione uma nova aula ao módulo. O vídeo deve ser um link direto (.mp4).
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título da Aula</Label>
                        <Input id="title" name="title" required className="bg-slate-900 border-slate-700" placeholder="Ex: Introdução ao Direito" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="videoUrl">Link do Vídeo (.mp4)</Label>
                        <Input
                            id="videoUrl"
                            name="videoUrl"
                            type="url"
                            required
                            className="bg-slate-900 border-slate-700"
                            placeholder="https://exemplo.com/video.mp4"
                        />
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Video className="h-3 w-3" /> Link direto para arquivo de vídeo
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duração (segundos)</Label>
                        <Input id="duration" name="duration" type="number" className="bg-slate-900 border-slate-700" placeholder="Ex: 600" />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="bg-yellow-500 text-slate-950 hover:bg-yellow-600 font-bold">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Aula"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
