import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, CreditCard } from "lucide-react"
import { prisma } from "@/lib/db"


export const dynamic = "force-dynamic"

export default async function AdminPlansPage() {
    const plans = await prisma.plan.findMany({
        orderBy: { price: 'asc' },
        include: {
            _count: { select: { subscriptions: true } }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Planos & Créditos</h2>
                    <p className="text-slate-400">Gerencie os planos de assinatura e pacotes de créditos.</p>
                </div>
                <Link href="/admin/planos/novo">
                    <Button className="bg-red-600 hover:bg-red-700 font-bold text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Plano
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-red-500/50 transition-colors">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                <p className="text-sm text-slate-400">{plan.interval === 'month' ? 'Mensal' : 'Anual'}</p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-300">
                                {plan.isActive ? 'Ativo' : 'Inativo'}
                            </div>
                        </div>

                        <div className="text-2xl font-bold text-yellow-500">
                            R$ {plan.price.toFixed(2)}
                        </div>

                        <div className="space-y-2 text-sm text-slate-400">
                            <div className="flex justify-between">
                                <span>Créditos (Renovação):</span>
                                <span className="text-white font-bold">{plan.credits}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Limite Simulados:</span>
                                <span className="text-white font-bold">{plan.maxExamsPerWeek} / semana</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Assinantes:</span>
                                <span className="text-white font-bold">{plan._count.subscriptions}</span>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-2">
                            <Link href={`/admin/planos/${plan.id}`} className="w-full">
                                <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300">
                                    Editar
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}

                {plans.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        <CreditCard className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>Nenhum plano cadastrado.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
