
"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Clock, PlayCircle, Printer, CheckSquare, Trash2, Loader2 } from "lucide-react"
import { deleteExam } from "@/lib/actions"
import { toast } from "sonner"
import { useState } from "react"
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

interface ExamCardProps {
    exam: any
    isCustom?: boolean
}

export function ExamCard({ exam, isCustom }: ExamCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteExam(exam.id)
            if (result.success) {
                toast.success("Simulado excluído com sucesso!")
            } else {
                toast.error(result.error || "Erro ao excluir simulado.")
            }
        } catch (error) {
            toast.error("Erro inesperado.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Card className="bg-slate-900 border-slate-800 flex flex-col hover:border-slate-700 transition-all duration-300 group/card relative">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-white pr-8">{exam.title}</CardTitle>
                    {isCustom && (
                        <div className="flex gap-2 items-center absolute top-6 right-6">
                            <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded border border-yellow-500/20">Custom</span>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-red-500 hover:bg-slate-800 transition-colors" disabled={isDeleting}>
                                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Excluir Simulado?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-slate-400">
                                            Tem certeza que deseja excluir o treino "{exam.title}"? Esta ação não pode ser desfeita e todo o histórico de tentativas será perdido.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700 border-slate-700">Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
                                            Sim, excluir
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
                <CardDescription className="text-slate-400 line-clamp-2">
                    {exam.description || "Simulado completo para o concurso PRF."}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex justify-between items-center text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-yellow-500" />
                        <span>{exam._count?.questions || exam.totalQuestions} Questões</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span>{Math.floor(exam.duration / 60)}h {exam.duration % 60}m</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-2">
                <Link href={isCustom ? `/simulados/${exam.id}?mode=TRAINING` : `/simulados/${exam.id}`} className="w-full">
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold group">
                        <PlayCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        {isCustom ? "Treinar Agora" : "Fazer Online"}
                    </Button>
                </Link>

                {!isCustom && (
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <Link href={`/simulados/${exam.id}/imprimir`} target="_blank" className="w-full">
                            <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
                                <Printer className="w-4 h-4 mr-2" />
                                Imprimir
                            </Button>
                        </Link>
                        <Link href={`/simulados/${exam.id}/gabarito`} target="_blank" className="w-full">
                            <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
                                <CheckSquare className="w-4 h-4 mr-2" />
                                Gabarito
                            </Button>
                        </Link>
                        <Link href={`/simulados/${exam.id}/redacao`} target="_blank" className="col-span-2 w-full">
                            <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
                                <FileText className="w-4 h-4 mr-2" />
                                Folha de Redação
                            </Button>
                        </Link>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
