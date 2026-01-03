import { PlanForm } from "@/components/admin/plans/plan-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"

interface EditPlanPageProps {
    params: Promise<{ planId: string }>
}

export default async function EditPlanPage(props: EditPlanPageProps) {
    const params = await props.params;
    const plan = await prisma.plan.findUnique({
        where: { id: params.planId }
    })

    if (!plan) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/planos" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Editar Plano</h2>
                    <p className="text-slate-400">Atualize as configurações do plano {plan.name}.</p>
                </div>
            </div>

            <PlanForm
                initialData={{
                    ...plan,
                    description: plan.description ?? undefined,
                    kiwifyProductId: plan.kiwifyProductId ?? undefined,
                    interval: plan.interval as "month" | "year"
                }}
            />
        </div>
    )
}
