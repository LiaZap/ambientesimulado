'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

interface ProfileFormProps {
    user: {
        name?: string | null
        email?: string | null
        avatar?: string | null
    }
}

import { updateProfile } from "@/lib/actions"
import { useRouter } from "next/navigation"

export function ProfileForm({ user }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await updateProfile(undefined, formData)

        setIsLoading(false)
        if (result === "Perfil atualizado com sucesso!") {
            router.refresh()
            // Optional: Add toast here
        } else {
            alert(result)
        }
    }

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white">Dados Pessoais</CardTitle>
                <CardDescription className="text-slate-400">
                    Atualize suas informações de perfil.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="avatar" className="text-slate-200">Foto de Perfil</Label>
                        <Input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            className="bg-slate-950 border-slate-800 text-white focus:border-yellow-500 file:bg-slate-800 file:text-white file:border-0 file:rounded-md file:mr-4 file:px-4 file:py-2 hover:file:bg-slate-700"
                        />
                        <p className="text-xs text-slate-500">Máx. 2MB. (JPG, PNG)</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-200">Nome Completo</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                            <Input
                                id="name"
                                name="name"
                                defaultValue={user.name || ''}
                                className="pl-9 bg-slate-950 border-slate-800 text-white focus:border-yellow-500"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-200">E-mail</Label>
                        <Input
                            id="email"
                            name="email"
                            defaultValue={user.email || ''}
                            disabled={true}
                            className="bg-slate-950/50 border-slate-800 text-slate-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-500">O e-mail não pode ser alterado.</p>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="bg-yellow-500 text-slate-950 hover:bg-yellow-600 font-bold w-full md:w-auto"
                            disabled={isLoading}
                        >
                            {isLoading ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
