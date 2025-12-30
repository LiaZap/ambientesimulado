'use client'

import { useActionState } from 'react'
import { register } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export function RegisterForm() {
    const [state, formAction, isPending] = useActionState(register, undefined)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        // Basic check if state is "success" or similar logic if I changed the action return
        // But action returns string error or redirect in real app.
        // For now, let's assume if it returns nothing it might be redirecting, 
        // or if I change action to return { success: true }
        // Let's stick to string error for now. 
    }, [state])

    return (
        <Card className="w-full bg-slate-900 border-slate-800 text-slate-100">
            <CardHeader>
                <CardTitle className="text-center text-xl">Criar Conta</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Seu nome"
                            required
                            className="bg-slate-950 border-slate-800 focus:ring-yellow-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="exemplo@email.com"
                            required
                            className="bg-slate-950 border-slate-800 focus:ring-yellow-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="******"
                            required
                            minLength={6}
                            className="bg-slate-950 border-slate-800 focus:ring-yellow-500"
                        />
                    </div>

                    {state && (
                        <div className="text-red-500 text-sm font-medium text-center">
                            {state}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold"
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Cadastrar
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
