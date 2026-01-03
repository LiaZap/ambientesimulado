import { PlanForm } from "@/components/admin/plans/plan-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPlanPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/planos" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Criar Novo Plano</h2>
                    <p className="text-slate-400">Configure um novo plano de assinatura.</p>
                </div>
            </div>

            <PlanForm />
        </div>
    )
}
