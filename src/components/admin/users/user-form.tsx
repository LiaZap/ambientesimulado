'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { createUser, updateUser } from "@/lib/actions"
import { Loader2 } from "lucide-react"

const userSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().optional(),
    role: z.enum(["USER", "PREMIUM", "ADMIN", "SUPER_ADMIN"]),
    credits: z.number().min(0, "Créditos não podem ser negativos"),
})

type UserFormValues = z.infer<typeof userSchema>

interface UserFormProps {
    initialData?: UserFormValues & { id: string }
}

export function UserForm({ initialData }: UserFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            email: initialData.email,
            password: "", // Don't show hash
            role: initialData.role,
            credits: initialData.credits
        } : {
            name: "",
            email: "",
            password: "",
            role: "USER",
            credits: 0,
        },
    })

    async function onSubmit(data: UserFormValues) {
        try {
            setLoading(true)

            // Validate password for new user
            if (!initialData && (!data.password || data.password.length < 6)) {
                form.setError("password", { message: "Senha obrigatória (mínimo 6 caracteres)" })
                setLoading(false)
                return
            }

            const formData = new FormData()
            formData.append("name", data.name)
            formData.append("email", data.email)
            if (data.password) formData.append("password", data.password)
            formData.append("role", data.role)
            formData.append("credits", String(data.credits))

            if (initialData) {
                await updateUser(initialData.id, undefined, formData)
                toast.success("Usuário atualizado com sucesso!")
            } else {
                await createUser(undefined, formData)
                toast.success("Usuário criado com sucesso!")
            }
            router.push("/admin/usuarios")
            router.refresh()
        } catch (error) {
            toast.error("Erro ao salvar usuário.")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-slate-900 p-8 rounded-xl border border-slate-800">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Nome</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="João Silva" {...field} className="bg-slate-950 border-slate-800 text-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Email</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="joao@exemplo.com" {...field} className="bg-slate-950 border-slate-800 text-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Senha {initialData && "(Opcional)"}</FormLabel>
                                <FormControl>
                                    <Input type="password" disabled={loading} placeholder={initialData ? "Deixe em branco para manter" : "******"} {...field} className="bg-slate-950 border-slate-800 text-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Cargo (Role)</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                                            <SelectValue placeholder="Selecione o cargo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                        <SelectItem value="USER">Usuário (Padrão)</SelectItem>
                                        <SelectItem value="PREMIUM">Premium</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="credits"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Créditos</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        disabled={loading}
                                        placeholder="0"
                                        {...field}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        className="bg-slate-950 border-slate-800 text-white"
                                    />
                                </FormControl>
                                <FormDescription className="text-slate-500">
                                    Saldo de créditos para Correções e IA.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button disabled={loading} type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Salvar Alterações' : 'Criar Usuário'}
                </Button>
            </form>
        </Form>
    )
}
