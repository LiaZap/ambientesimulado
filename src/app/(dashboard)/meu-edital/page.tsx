import { getEditalData } from "@/lib/data"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EditalClient } from "@/components/edital/edital-client"
import { seedEditalTopics } from "@/lib/actions"
import { Button } from "@/components/ui/button"

export default async function MeuEditalPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const topics = await getEditalData()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Meu Edital Verticalizado</h1>
                    <p className="text-slate-400">Acompanhe seu progresso ponto a ponto.</p>
                </div>
                <form action={async () => {
                    'use server'
                    await seedEditalTopics()
                }}>
                    <Button variant="outline" className="border-slate-700 text-slate-300">
                        Restaurar Tópicos Padrão
                    </Button>
                </form>
            </div>

            <EditalClient topics={topics} />
        </div>
    )
}
