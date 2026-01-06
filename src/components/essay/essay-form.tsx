'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { submitEssay } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { PenTool, Send, Loader2, UploadCloud, FileText, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface EssayFormProps {
    initialTheme?: string
    examId?: string
}

export function EssayForm({ initialTheme, examId }: EssayFormProps) {
    const [isPending, setIsPending] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        // Message is now shown via the UI state change, but we keep this for error handling fallback
        setMessage("Aguarde...")

        try {
            if (examId) {
                formData.append('examId', examId)
            }

            const result = await submitEssay(undefined, formData)

            if (typeof result === 'object' && result?.success && result?.essayId) {
                // Keep the loading state a bit longer or redirect immediately
                router.push(`/redacao/${result.essayId}`)
            } else if (typeof result === 'object' && result?.error) {
                setMessage(result.error)
                setIsPending(false) // Go back to form on error
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
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col justify-center">

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
                        <CardHeader className="border-b border-slate-800 bg-slate-900/50 pb-6">
                            <CardTitle className="text-xl flex items-center gap-3 text-white">
                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                    <PenTool className="h-6 w-6 text-yellow-500" />
                                </div>
                                <div>
                                    <span className="block font-bold">Nova Redação</span>
                                    <span className="block text-sm font-normal text-slate-400 mt-1">Envie seu texto ou foto para correção instantânea</span>
                                </div>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex-1 p-6 space-y-6">
                            <form action={handleSubmit} className="space-y-6 h-full flex flex-col">
                                <div className="space-y-2">
                                    <Label htmlFor="theme" className="text-slate-300 font-medium">Tema da Redação</Label>
                                    <Input
                                        id="theme"
                                        name="theme"
                                        defaultValue={initialTheme}
                                        placeholder="Ex: A importância da PRF na segurança viária..."
                                        required
                                        className="bg-slate-950 border-slate-800 focus:border-yellow-500 focus:ring-yellow-500/20 h-12 text-lg placeholder:text-slate-600 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                                    <div className="space-y-2 flex flex-col">
                                        <Label className="text-slate-300 font-medium">Upload de Arquivo</Label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex-1 border-2 border-dashed border-slate-700 rounded-xl bg-slate-950/50 hover:bg-slate-950 hover:border-yellow-500/50 transition-all cursor-pointer flex flex-col items-center justify-center p-6 group text-center"
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
                                                <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full text-sm font-bold truncate max-w-full border border-yellow-500/20">
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

                                    <div className="space-y-2 flex flex-col">
                                        <Label htmlFor="content" className="text-slate-300 font-medium">Digitar Redação</Label>
                                        <Textarea
                                            id="content"
                                            name="content"
                                            placeholder="Ou digite sua redação diretamente aqui..."
                                            className="flex-1 bg-slate-950 border-slate-800 focus:border-yellow-500 focus:ring-yellow-500/20 resize-none p-4 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent min-h-[200px]"
                                        />
                                    </div>
                                </div>

                                {message && !isPending && (
                                    <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in slide-in-from-bottom-2">
                                        <span className="font-bold">Erro:</span> {message}
                                    </div>
                                )}

                                <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
                                    <Button type="button" variant="ghost" asChild className="text-slate-400 hover:text-white hover:bg-slate-800 h-12 px-6">
                                        <Link href="/redacao">Cancelar</Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold h-12 px-8 text-lg shadow-lg shadow-yellow-500/20 transition-all hover:scale-105"
                                        disabled={isPending}
                                    >
                                        <Send className="mr-2 h-5 w-5" />
                                        Enviar para Correção
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    )
}
