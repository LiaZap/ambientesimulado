'use client'

import { useActionState } from 'react'
import { authenticate } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

    return (
        <Card className="w-full bg-slate-900 border-slate-800 text-slate-100">
            <CardHeader>
                <CardTitle className="text-center text-xl">Login</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
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
                            required
                            minLength={6}
                            className="bg-slate-950 border-slate-800 focus:ring-yellow-500"
                        />
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 text-sm font-medium text-center">
                            {errorMessage}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold"
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Entrar
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
