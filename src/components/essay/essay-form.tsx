'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { submitEssay } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { PenTool, Send, Loader2, UploadCloud, FileText, CheckCircle2, Coins, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface EssayFormProps {
    initialTheme?: string
    examId?: string
    userCredits: number
}

export function EssayForm({ initialTheme, examId, userCredits }: EssayFormProps) {
    const [isPending, setIsPending] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // Check if user has enough credits
    const hasCredits = userCredits >= 1

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!hasCredits) {
            setMessage("Você não possui créditos suficientes.")
            return
        }

        setIsPending(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)

        try {
            if (examId) {
                formData.append('examId', examId)
            }

            // Artificial delay to ensure animation is visible
            await new Promise(resolve => setTimeout(resolve, 2000))

            const result = await submitEssay(undefined, formData)

            if (typeof result === 'object' && result?.success && result?.essayId) {
                router.push(`/redacao/${result.essayId}`)
            } else if (typeof result === 'object' && result?.error) {
                setMessage(result.error)
                setIsPending(false)
            } else if (typeof result === 'string') {
                setMessage(result)
                setIsPending(false)
            } else {
                setMessage("Erro desconhecido.")
                setIsPending(false)
            }
        } catch (error) {
            setMessage("Erro ao enviar.")
            setIsPending(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name)
        }
    }

    return (
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-2xl overflow-hidden relative h-[700px] flex flex-col justify-center">

            <AnimatePresence mode="wait">
                {isPending ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm p-8 text-center space-y-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse"></div>
                            <Loader2 className="h-24 w-24 text-yellow-500 animate-spin relative z-10" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white tracking-tight">Estamos analisando sua redação...</h3>
                            <p className="text-slate-400 text-lg">Aguarde, nossa IA está corrigindo seu texto.</p>
                        </div>

                        <div className="flex gap-2 items-center text-sm text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-800">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Verificando gramática</span>
                            <span className="mx-2 text-slate-700">|</span>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Analisando coerência</span>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full h-full flex flex-col"
                    >
                        <CardHeader className="border-b border-slate-800 bg-slate-900/50 pb-6 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                    <PenTool className="h-6 w-6 text-yellow-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-white">Nova Redação</CardTitle>
                                    <p className="text-sm font-normal text-slate-400 mt-1">Envie seu texto ou foto para correção instantânea</p>
                                </div>
                            </div>
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium",
                                hasCredits
                                    ? "bg-slate-800 border-slate-700 text-yellow-500"
                                    : "bg-red-500/10 border-red-500/20 text-red-400"
                            )}>
                                <Coins className="h-4 w-4" />
                                <span>{userCredits} Créditos Disponíveis</span>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 p-6 space-y-6 min-h-0">
                            <form onSubmit={onSubmit} className="space-y-6 h-full flex flex-col">
                                <div className="space-y-2">
                                    <Label htmlFor="theme" className="text-slate-300 font-medium">Tema da Redação</Label>
                                    <Input
                                        id="theme"
                                        name="theme"
                                        defaultValue={initialTheme}
                                        placeholder="Ex: A importância da PRF na segurança viária..."
                                        required
                                        className="bg-slate-950 border-slate-800 focus:border-yellow-500 focus:ring-yellow-500/20 h-12 text-lg placeholder:text-slate-600 transition-all w-full"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
                                    <div className="space-y-2 flex flex-col h-full min-h-0">
                                        <Label className="text-slate-300 font-medium">Upload de Arquivo</Label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex-1 border-2 border-dashed border-slate-700 rounded-xl bg-slate-950/50 hover:bg-slate-950 hover:border-yellow-500/50 transition-all cursor-pointer flex flex-col items-center justify-center p-6 group text-center min-h-[200px]"
                                        >
                                            <input
                                                ref={fileInputRef}
                                                id="file"
                                                name="file"
                                                type="file"
                                                accept="image/*,application/pdf"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <div className="h-16 w-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg border border-slate-800 block">
                                                {fileName ? <FileText className="h-8 w-8 text-yellow-500" /> : <UploadCloud className="h-8 w-8 text-slate-400 group-hover:text-yellow-500 transition-colors" />}
                                            </div>

                                            {fileName ? (
                                                <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full text-sm font-bold truncate max-w-[200px] border border-yellow-500/20">
                                                    {fileName}
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-slate-300 font-medium mb-1 group-hover:text-white">Clique para selecionar</p>
                                                    <p className="text-xs text-slate-500">PDF ou Imagem (Foto da folha)</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 flex flex-col h-full min-h-0">
                                        <Label htmlFor="content" className="text-slate-300 font-medium">Digitar Redação</Label>
                                        <div className="flex-1 relative min-h-0">
                                            <Textarea
                                                id="content"
                                                name="content"
                                                placeholder="Ou digite sua redação diretamente aqui..."
                                                className="absolute inset-0 w-full h-full bg-slate-950 border-slate-800 focus:border-yellow-500 focus:ring-yellow-500/20 resize-none p-4 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent text-slate-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {message && !isPending && (
                                    <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in slide-in-from-bottom-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="font-bold">Erro:</span> {message}
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                                    <div className="text-sm text-slate-400 flex items-center gap-1.5">
                                        <span>Custo da correção:</span>
                                        <span className="text-yellow-500 font-bold flex items-center gap-1">
                                            1 Crédito
                                        </span>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button type="button" variant="ghost" asChild className="text-slate-400 hover:text-white hover:bg-slate-800 h-12 px-6">
                                            <Link href="/redacao">Cancelar</Link>
                                        </Button>
                                        <Button
                                            type="submit"
                                            className={cn(
                                                "font-bold h-12 px-8 text-lg shadow-lg transition-all hover:scale-105",
                                                hasCredits
                                                    ? "bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow-yellow-500/20"
                                                    : "bg-slate-800 text-slate-500 cursor-not-allowed hover:bg-slate-800 hover:scale-100"
                                            )}
                                            disabled={isPending || !hasCredits}
                                        >
                                            <Send className="mr-2 h-5 w-5" />
                                            {hasCredits ? 'Enviar para Correção' : 'Créditos Insuficientes'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    )
}
