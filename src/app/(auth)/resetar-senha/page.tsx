'use client'

import { useActionState, Suspense } from 'react'
import { resetPassword } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Lock, Loader2, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'

function ResetPasswordForm({ token }: { token: string }) {
    const [message, formAction, isPending] = useActionState(resetPassword, undefined)
    const router = useRouter()
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (message && message.startsWith("SUCCESS:")) {
            setSuccess(true)
            setTimeout(() => {
                router.push("/login")
            }, 3000)
        }
    }, [message, router])

    if (success) {
        return (
            <div className="text-center space-y-4 py-6">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold text-white">Senha Alterada!</h3>
                <p className="text-slate-400">Você será redirecionado para o login em instantes...</p>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold" onClick={() => router.push("/login")}>
                    Ir para Login Agora
                </Button>
            </div>
        )
    }

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="token" value={token} />

            <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Mínimo 6 caracteres"
                        required
                        minLength={6}
                        className="bg-slate-950 border-slate-800 focus:ring-yellow-500 pl-10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        placeholder="Repita a senha"
                        required
                        minLength={6}
                        className="bg-slate-950 border-slate-800 focus:ring-yellow-500 pl-10"
                    />
                </div>
            </div>

            {message && !message.startsWith("SUCCESS:") && (
                <div className="text-red-500 text-sm font-medium text-center p-2 bg-red-500/10 rounded">
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                    </>
                ) : (
                    "Redefinir Senha"
                )}
            </Button>
        </form>
    )
}

function ResetContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    if (!token) {
        return (
            <div className="text-center py-6 space-y-4">
                <div className="p-4 bg-red-500/10 text-red-500 rounded border border-red-500/20">
                    Token inválido ou ausente.
                </div>
                <Link href="/esqueci-senha">
                    <Button variant="outline" className="w-full border-slate-700 text-slate-300">
                        Solicitar Novo Link
                    </Button>
                </Link>
            </div>
        )
    }

    return <ResetPasswordForm token={token} />
}

export default function ResetPasswordPage() {
    return (
        <div className="space-y-6">
            <Link href="/login" className="flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Login
            </Link>

            <Card className="w-full bg-slate-900 border-slate-800 text-slate-100">
                <CardHeader>
                    <CardTitle className="text-xl">Redefinir Senha</CardTitle>
                    <CardDescription className="text-slate-400">
                        Crie uma nova senha para sua conta.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div className="text-white text-center">Carregando...</div>}>
                        <ResetContent />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}
