'use client'

import { useActionState } from 'react'
import { authenticate } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

    return (
        <div className="w-full">
            <form action={formAction} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="exemplo@email.com"
                        required
                        className="h-12 bg-slate-900 border-slate-800 focus:ring-yellow-500 focus:border-yellow-500 text-base"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-200">Senha</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        required
                        minLength={6}
                        className="h-12 bg-slate-900 border-slate-800 focus:ring-yellow-500 focus:border-yellow-500 text-base"
                    />
                </div>

                <div className="flex justify-end">
                    <Link href="/esqueci-senha" className="text-sm text-yellow-500 hover:underline">
                        Esqueceu sua senha?
                    </Link>
                </div>

                {errorMessage && (
                    <div className="text-red-500 text-sm font-medium text-center bg-red-950/20 p-3 rounded-md border border-red-900/50">
                        {errorMessage}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full h-12 text-base bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold transition-all hover:scale-[1.02]"
                    disabled={isPending}
                >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar na Plataforma
                </Button>
            </form>
        </div>
    )
}
