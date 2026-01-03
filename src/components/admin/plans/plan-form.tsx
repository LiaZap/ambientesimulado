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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { createPlan, updatePlan } from "@/lib/actions"
import { Loader2 } from "lucide-react"

const planSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    description: z.string().optional(),
    price: z.number().min(0.01, "Preço deve ser maior que 0"),
    interval: z.enum(["month", "year"]),
    credits: z.number().min(0, "Créditos não podem ser negativos"),
    maxExamsPerWeek: z.number().min(0),
    kiwifyProductId: z.string().optional(),
    isActive: z.boolean(),
})

type PlanFormValues = z.infer<typeof planSchema>

interface PlanFormProps {
    initialData?: PlanFormValues & { id: string }
}

export function PlanForm({ initialData }: PlanFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<PlanFormValues>({
        resolver: zodResolver(planSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            price: 0,
            interval: "month",
            credits: 0,
            maxExamsPerWeek: 1,
            kiwifyProductId: "",
            isActive: true,
        },
    })

    async function onSubmit(data: PlanFormValues) {
        try {
            setLoading(true)
            if (initialData) {
                await updatePlan(initialData.id, data)
                toast.success("Plano atualizado com sucesso!")
            } else {
                await createPlan(data)
                toast.success("Plano criado com sucesso!")
            }
            router.push("/admin/planos")
            router.refresh()
        } catch (error) {
            toast.error("Erro ao salvar plano.")
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
                                <FormLabel className="text-white">Nome do Plano</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Ex: Mensal Básico" {...field} className="bg-slate-950 border-slate-800 text-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="interval"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Frequência</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                                            <SelectValue placeholder="Selecione a frequência" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                        <SelectItem value="month">Mensal</SelectItem>
                                        <SelectItem value="year">Anual</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Preço (R$)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        disabled={loading}
                                        placeholder="197.00"
                                        {...field}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        className="bg-slate-950 border-slate-800 text-white"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="kiwifyProductId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">ID do Produto Kiwify (Opcional)</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Ex: 123abc456" {...field} className="bg-slate-950 border-slate-800 text-white" />
                                </FormControl>
                                <FormDescription className="text-slate-500">
                                    Usado para vincular automaticamente assinaturas via webhook.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="credits"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Créditos mensais/anuais</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        disabled={loading}
                                        placeholder="50"
                                        {...field}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        className="bg-slate-950 border-slate-800 text-white"
                                    />
                                </FormControl>
                                <FormDescription className="text-slate-500">
                                    Quantidade de créditos dada ao usuário a cada renovação.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="maxExamsPerWeek"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Simulados por Semana</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        disabled={loading}
                                        placeholder="1"
                                        {...field}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        className="bg-slate-950 border-slate-800 text-white"
                                    />
                                </FormControl>
                                <FormDescription className="text-slate-500">
                                    0 para ilimitado.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Descrição</FormLabel>
                            <FormControl>
                                <Textarea disabled={loading} placeholder="Descrição detalhada do plano..." {...field} className="bg-slate-950 border-slate-800 text-white resize-none" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-800 p-4 bg-slate-950">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base text-white">Plano Ativo</FormLabel>
                                <FormDescription>
                                    Planos inativos não aparecem para novos usuários.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button disabled={loading} type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Salvar Alterações' : 'Criar Plano'}
                </Button>
            </form>
        </Form>
    )
}
