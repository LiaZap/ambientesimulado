'use client'

import { useActionState } from 'react'
import { changePassword } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lock, Loader2 } from 'lucide-react'

export function ChangePasswordForm() {
    const [message, formAction, isPending] = useActionState(changePassword, undefined)

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white">Alterar Senha</CardTitle>
                <CardDescription className="text-slate-400">
                    Mantenha sua conta segura atualizando sua senha periodicamente.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Senha Atual</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                            <Input
                                id="currentPassword"
                                type="password"
                                name="currentPassword"
                                placeholder="Digite sua senha atual"
                                required
                                className="bg-slate-950 border-slate-800 focus:ring-yellow-500 pl-10 text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                <Input
                                    id="newPassword"
                                    type="password"
                                    name="newPassword"
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    minLength={6}
                                    className="bg-slate-950 border-slate-800 focus:ring-yellow-500 pl-10 text-white"
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
                                    placeholder="Repita a nova senha"
                                    required
                                    minLength={6}
                                    className="bg-slate-950 border-slate-800 focus:ring-yellow-500 pl-10 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`text-sm font-medium text-center p-2 rounded ${message.startsWith("SUCCESS:") ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                            }`}>
                            {message.replace("SUCCESS:", "")}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Atualizando...
                                </>
                            ) : (
                                "Atualizar Senha"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
