'use client'

import { useActionState } from 'react'
import { submitEssay } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { PenTool, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function EssayForm() {
    const [message, formAction, isPending] = useActionState(submitEssay, undefined)

    return (
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-yellow-500" />
                    Nova Redação
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="theme">Tema da Redação</Label>
                        <Input
                            id="theme"
                            name="theme"
                            placeholder="Ex: A importância da PRF na segurança viária..."
                            required
                            className="bg-slate-950 border-slate-800 focus:ring-yellow-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">Upload de Arquivo (Imagem ou PDF)</Label>
                        <Input
                            id="file"
                            name="file"
                            type="file"
                            accept="image/*,application/pdf"
                            className="bg-slate-950 border-slate-800 focus:ring-yellow-500 cursor-pointer text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-slate-900 hover:file:bg-yellow-600"
                        />
                        <p className="text-xs text-slate-500">Envie uma foto da sua redação manuscrita ou um PDF.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Desenvolvimento (Texto ou OCR)</Label>
                        <Textarea
                            id="content"
                            name="content"
                            placeholder="Escreva sua redação aqui ou deixe em branco se enviou arquivo..."
                            className="bg-slate-950 border-slate-800 focus:ring-yellow-500 min-h-[300px]"
                        />
                    </div>

                    {message && (
                        <div className={`text-sm font-medium text-center p-2 rounded ${message.includes('sucesso') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {message}
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" asChild className="text-slate-400 hover:text-white">
                            <Link href="/redacao">Cancelar</Link>
                        </Button>
                        <Button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold"
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Enviar para Correção
                        </Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="text-xs text-slate-500 justify-center text-center">

            </CardFooter>
        </Card>
    )
}
