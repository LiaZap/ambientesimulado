'use client'

import { useActionState } from 'react'
import { requestPasswordReset } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Mail, Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [message, formAction, isPending] = useActionState(requestPasswordReset, undefined)

    return (
        <div className="space-y-6">
            <Link href="/login" className="flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Login
            </Link>

            <Card className="w-full bg-slate-900 border-slate-800 text-slate-100">
                <CardHeader>
                    <CardTitle className="text-xl">Recuperar Senha</CardTitle>
                    <CardDescription className="text-slate-400">
                        Insira seu email para receber um link de redefinição.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="seu@email.com"
                                    required
                                    className="bg-slate-950 border-slate-800 focus:ring-yellow-500 pl-10"
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`text-sm font-medium text-center p-2 rounded ${message.includes("enviado") ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                }`}>
                                {message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                                </>
                            ) : (
                                "Enviar Link"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
